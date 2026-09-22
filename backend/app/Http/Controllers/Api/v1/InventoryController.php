<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Services\BuyerMatchingService;
use App\Services\InventoryService;
use App\Services\RecoveryService;
use App\Services\RiskAnalysisService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
    protected RiskAnalysisService $riskService;
    protected RecoveryService $recoveryService;
    protected BuyerMatchingService $buyerService;
    protected InventoryService $inventoryService;

    public function __construct(
        RiskAnalysisService $riskService,
        RecoveryService $recoveryService,
        BuyerMatchingService $buyerService,
        InventoryService $inventoryService
    ) {
        $this->riskService = $riskService;
        $this->recoveryService = $recoveryService;
        $this->buyerService = $buyerService;
        $this->inventoryService = $inventoryService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = Inventory::with('company');

        if ($request->has('category') && !empty($request->category)) {
            $query->where('category', $request->category);
        }

        if ($request->has('risk_level') && !empty($request->risk_level)) {
            $query->where('risk_level', $request->risk_level);
        }

        if ($request->has('search') && !empty($request->search)) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('product_name', 'like', "%{$s}%")
                  ->orWhere('sku', 'like', "%{$s}%")
                  ->orWhere('category', 'like', "%{$s}%");
            });
        }

        $inventories = $query->orderByDesc('risk_score')->get();

        // Format for table
        $formatted = $inventories->map(function ($item) {
            $tone = match ($item->risk_level) {
                'CRITICAL' => 'red',
                'HIGH' => 'amber',
                'MEDIUM' => 'yellow',
                default => 'green',
            };

            return [
                'id' => $item->id,
                'product' => $item->product_name,
                'sku' => $item->sku,
                'qty' => number_format($item->quantity),
                'quantity' => $item->quantity,
                'value' => '₹' . ($item->current_value >= 100000 ? round($item->current_value / 100000, 1) . 'L' : number_format($item->current_value)),
                'current_value' => $item->current_value,
                'unit_cost' => $item->unit_cost,
                'age' => $item->age_months . ' mo',
                'age_months' => $item->age_months,
                'demand' => number_format($item->monthly_demand),
                'monthly_demand' => $item->monthly_demand,
                'risk' => round($item->risk_score, 0) . '%',
                'risk_score' => $item->risk_score,
                'risk_level' => $item->risk_level,
                'action' => $item->recommended_action ?: 'Find Buyer',
                'tone' => $tone,
                'category' => $item->category,
                'material' => $item->material,
                'dimensions' => $item->dimensions,
                'warehouse' => $item->warehouse_location,
                'ai_explanation' => $item->ai_explanation,
                'forecast' => $item->demand_forecast_history ?: [24, 20, 18, 17, 16, 12, 10, 9],
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formatted,
        ]);
    }

    public function show(string $identifier): JsonResponse
    {
        $inventory = Inventory::where('id', $identifier)
            ->orWhere('sku', $identifier)
            ->with(['company', 'movements.creator', 'buyerMatches.buyerCompany', 'recoveryActions', 'marketplaceListings'])
            ->first();

        if (!$inventory) {
            return response()->json([
                'success' => false,
                'message' => 'Inventory item not found',
            ], 404);
        }

        $recoveryData = $this->recoveryService->getRecoveryStrategies($inventory);
        $matches = $this->buyerService->findMatchesForInventory($inventory);

        return response()->json([
            'success' => true,
            'data' => [
                'inventory' => $inventory,
                'recovery' => $recoveryData,
                'matches' => $matches,
            ],
        ]);
    }

    public function heroDemo(): JsonResponse
    {
        $demo = Inventory::where('sku', 'PC2048')
            ->with(['buyerMatches.buyerCompany'])
            ->first();

        if (!$demo) {
            $demo = Inventory::first();
        }

        return response()->json([
            'success' => true,
            'data' => $demo,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'sku' => 'required|string|max:100',
            'product_name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'unit_cost' => 'required|numeric|min:0',
            'monthly_demand' => 'nullable|integer|min:0',
            'age_months' => 'nullable|integer|min:0',
            'material' => 'nullable|string|max:255',
            'dimensions' => 'nullable|string|max:255',
            'warehouse_location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $companyId = $request->user()?->company_id ?: 1;
        $qty = (int) $request->quantity;
        $cost = (float) $request->unit_cost;
        $val = $qty * $cost;

        $inventory = new Inventory($request->all());
        $inventory->company_id = $companyId;
        $inventory->current_value = $val;

        // Auto-run risk analysis
        $riskResult = $this->riskService->analyze($inventory);
        $inventory->risk_score = $riskResult['risk_score'];
        $inventory->risk_level = $riskResult['risk_level'];
        $inventory->estimated_loss = $riskResult['estimated_loss'];
        $inventory->estimated_recovery = $riskResult['estimated_recovery'];
        $inventory->recommended_action = $riskResult['recommended_action'];
        $inventory->ai_explanation = $riskResult['ai_explanation'];
        $inventory->save();

        // Auto-compute buyer matches
        $this->buyerService->findMatchesForInventory($inventory);

        return response()->json([
            'success' => true,
            'message' => 'Inventory item created and analyzed successfully',
            'data' => $inventory->load('buyerMatches'),
        ], 201);
    }

    /**
     * Update an existing inventory item and re-calculate risk and matches.
     */
    public function update(int|string $identifier, Request $request): JsonResponse
    {
        $inventory = Inventory::where('id', $identifier)->orWhere('sku', $identifier)->first();
        if (!$inventory) {
            return response()->json(['success' => false, 'message' => 'Inventory item not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'product_name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'quantity' => 'sometimes|required|integer|min:0',
            'unit_cost' => 'sometimes|required|numeric|min:0',
            'monthly_demand' => 'nullable|integer|min:0',
            'age_months' => 'nullable|integer|min:0',
            'material' => 'nullable|string|max:255',
            'dimensions' => 'nullable|string|max:255',
            'warehouse_location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $prevQty = $inventory->quantity;
        $inventory->fill($request->all());
        $inventory->current_value = round($inventory->quantity * $inventory->unit_cost, 2);

        // Re-analyze risk
        $riskResult = $this->riskService->analyze($inventory);
        $inventory->risk_score = $riskResult['risk_score'];
        $inventory->risk_level = $riskResult['risk_level'];
        $inventory->estimated_loss = $riskResult['estimated_loss'];
        $inventory->estimated_recovery = $riskResult['estimated_recovery'];
        $inventory->recommended_action = $riskResult['recommended_action'];
        $inventory->ai_explanation = $riskResult['ai_explanation'];
        $inventory->save();

        if ($request->has('quantity') && $request->quantity != $prevQty) {
            \App\Models\InventoryMovement::create([
                'inventory_id' => $inventory->id,
                'movement_type' => 'adjusted',
                'quantity' => abs($inventory->quantity - $prevQty),
                'source_location' => $inventory->warehouse_location ?: 'Warehouse',
                'destination_location' => 'Manual Adjustment',
                'reference' => 'ADJ-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4)),
                'notes' => "Quantity manually adjusted from {$prevQty} to {$inventory->quantity}.",
                'created_by' => $request->user()?->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Inventory updated and re-analyzed successfully',
            'data' => $inventory,
        ]);
    }

    /**
     * Archive an inventory item (soft-archive) to keep historical analytics intact.
     */
    public function destroy(int|string $identifier, Request $request): JsonResponse
    {
        $inventory = Inventory::where('id', $identifier)->orWhere('sku', $identifier)->first();
        if (!$inventory) {
            return response()->json(['success' => false, 'message' => 'Inventory item not found'], 404);
        }

        $inventory->status = 'archived';
        $inventory->save();

        \App\Models\InventoryMovement::create([
            'inventory_id' => $inventory->id,
            'movement_type' => 'adjusted',
            'quantity' => $inventory->quantity,
            'source_location' => $inventory->warehouse_location ?: 'Warehouse',
            'destination_location' => 'Archive Storage',
            'reference' => 'ARCH-' . date('Ymd'),
            'notes' => 'Inventory archived by operator.',
            'created_by' => $request->user()?->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => "SKU {$inventory->sku} archived successfully.",
        ]);
    }

    /**
     * Restore an archived inventory item.
     */
    public function restore(int|string $identifier): JsonResponse
    {
        $inventory = Inventory::where('id', $identifier)->orWhere('sku', $identifier)->first();
        if (!$inventory) {
            return response()->json(['success' => false, 'message' => 'Inventory item not found'], 404);
        }

        $inventory->status = 'active';
        $inventory->save();

        return response()->json([
            'success' => true,
            'message' => "SKU {$inventory->sku} restored to active inventory.",
            'data' => $inventory,
        ]);
    }

    /**
     * Import multiple inventory rows from CSV / JSON payload.
     */
    public function import(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'rows' => 'required|array|min:1',
            'rows.*.sku' => 'nullable|string',
            'rows.*.product_name' => 'nullable|string',
            'rows.*.category' => 'nullable|string',
            'rows.*.quantity' => 'nullable|numeric',
            'rows.*.unit_cost' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid import data payload',
                'errors' => $validator->errors(),
            ], 422);
        }

        $companyId = $request->user()?->company_id ?: 1;
        $result = $this->inventoryService->importRows($request->rows, $companyId, $request->user()?->id);

        return response()->json($result, 201);
    }
}
