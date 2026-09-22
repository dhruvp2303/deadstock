<?php

namespace App\Services;

use App\Models\Inventory;
use App\Models\InventoryMovement;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

class InventoryService
{
    protected RiskAnalysisService $riskService;
    protected BuyerMatchingService $buyerService;

    public function __construct(RiskAnalysisService $riskService, BuyerMatchingService $buyerService)
    {
        $this->riskService = $riskService;
        $this->buyerService = $buyerService;
    }

    /**
     * Import inventory items from an uploaded CSV file or array of rows.
     */
    public function importRows(array $rows, int $companyId, ?int $userId = null): array
    {
        $importedCount = 0;
        $criticalRiskCount = 0;
        $totalValue = 0;
        $items = [];

        foreach ($rows as $row) {
            $sku = trim($row['sku'] ?? $row['SKU'] ?? ('SKU-' . strtoupper(substr(uniqid(), -6))));
            $productName = trim($row['product_name'] ?? $row['Product'] ?? $row['product'] ?? 'Industrial Component');
            $category = trim($row['category'] ?? $row['Category'] ?? 'General Industrial');
            $quantity = (int) ($row['quantity'] ?? $row['qty'] ?? $row['Qty'] ?? 100);
            $unitCost = (float) ($row['unit_cost'] ?? $row['cost'] ?? $row['price'] ?? 50);
            $monthlyDemand = (int) ($row['monthly_demand'] ?? $row['demand'] ?? 20);
            $ageMonths = (int) ($row['age_months'] ?? $row['age'] ?? 6);
            $material = $row['material'] ?? $row['Material'] ?? null;
            $dimensions = $row['dimensions'] ?? $row['Dimensions'] ?? null;
            $warehouse = $row['warehouse'] ?? $row['location'] ?? 'Central Depot';

            $currentVal = round($quantity * $unitCost, 2);

            $inv = Inventory::updateOrCreate(
                ['sku' => $sku, 'company_id' => $companyId],
                [
                    'product_name' => $productName,
                    'category' => $category,
                    'quantity' => $quantity,
                    'unit_cost' => $unitCost,
                    'current_value' => $currentVal,
                    'monthly_demand' => $monthlyDemand,
                    'age_months' => $ageMonths,
                    'material' => $material,
                    'dimensions' => $dimensions,
                    'warehouse_location' => $warehouse,
                    'status' => 'active',
                ]
            );

            // Compute risk
            $risk = $this->riskService->analyze($inv);
            $inv->risk_score = $risk['risk_score'];
            $inv->risk_level = $risk['risk_level'];
            $inv->estimated_loss = $risk['estimated_loss'];
            $inv->estimated_recovery = $risk['estimated_recovery'];
            $inv->recommended_action = $risk['recommended_action'];
            $inv->ai_explanation = $risk['ai_explanation'];
            $inv->save();

            // Auto-compute buyer matches
            $this->buyerService->findMatchesForInventory($inv);

            // Movement audit
            InventoryMovement::create([
                'inventory_id' => $inv->id,
                'movement_type' => 'added',
                'quantity' => $quantity,
                'source_location' => 'CSV Bulk Import',
                'destination_location' => $warehouse,
                'reference' => 'IMPORT-' . date('Ymd'),
                'notes' => 'Bulk imported via DeadStock CSV engine.',
                'created_by' => $userId,
            ]);

            if (in_array($inv->risk_level, ['HIGH', 'CRITICAL'])) {
                $criticalRiskCount++;
            }

            $totalValue += $currentVal;
            $importedCount++;
            $items[] = $inv;
        }

        return [
            'success' => true,
            'message' => "Successfully imported and analyzed {$importedCount} inventory SKUs.",
            'summary' => [
                'imported_count' => $importedCount,
                'at_risk_count' => $criticalRiskCount,
                'total_value' => $totalValue,
                'total_value_formatted' => '₹' . ($totalValue >= 100000 ? round($totalValue / 100000, 1) . 'L' : number_format($totalValue)),
            ],
            'data' => $items,
        ];
    }
}
