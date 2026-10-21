<?php

namespace App\Services;

use App\Models\Inventory;
use App\Models\InventoryMovement;
use App\Models\Notification;
use App\Models\RecoveryAction;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class RecoveryService
{
    protected RiskAnalysisService $riskService;

    public function __construct(RiskAnalysisService $riskService)
    {
        $this->riskService = $riskService;
    }

    /**
     * Compute multi-channel recovery estimates for an inventory item.
     */
    public function getRecoveryStrategies(Inventory $inventory): array
    {
        $currentValue = $inventory->current_value ?: ($inventory->quantity * $inventory->unit_cost);

        $sellRecovery = round($currentValue * 2.16, 2);
        $transferRecovery = round($currentValue * 1.88, 2);
        $returnRecovery = round($currentValue * 1.33, 2);
        $recycleRecovery = round($currentValue * 0.38, 2);
        $discountRecovery = round($currentValue * 0.85, 2);

        $strategies = [
            [
                'type' => 'sell',
                'title' => 'Sell',
                'recovery_amount' => $sellRecovery,
                'recovery_formatted' => $this->formatINR($sellRecovery),
                'recommended' => true,
                'channel_name' => 'B2B Matched Sale',
                'description' => 'Direct liquidation to verified high-match B2B manufacturing buyer.',
                'timeline' => '7-14 days',
            ],
            [
                'type' => 'transfer',
                'title' => 'Transfer',
                'recovery_amount' => $transferRecovery,
                'recovery_formatted' => $this->formatINR($transferRecovery),
                'recommended' => false,
                'channel_name' => 'Inter-facility Relocation',
                'description' => 'Transfer surplus to regional branch warehouse with active production demand.',
                'timeline' => '3-5 days',
            ],
            [
                'type' => 'return',
                'title' => 'Return',
                'recovery_amount' => $returnRecovery,
                'recovery_formatted' => $this->formatINR($returnRecovery),
                'recommended' => false,
                'channel_name' => 'Supplier Restock',
                'description' => 'Negotiate supplier return under annual vendor agreements with standard restocking fee.',
                'timeline' => '14-21 days',
            ],
            [
                'type' => 'discount',
                'title' => 'Discount',
                'recovery_amount' => $discountRecovery,
                'recovery_formatted' => $this->formatINR($discountRecovery),
                'recommended' => false,
                'channel_name' => 'Flash Surplus Discount',
                'description' => 'Publish on surplus marketplace at 15% discount for rapid clearance.',
                'timeline' => '2-4 days',
            ],
            [
                'type' => 'recycle',
                'title' => 'Recycle',
                'recovery_amount' => $recycleRecovery,
                'recovery_formatted' => $this->formatINR($recycleRecovery),
                'recommended' => false,
                'channel_name' => 'Certified Circular Regrind',
                'description' => 'Salvage raw materials through accredited circular recycling partners.',
                'timeline' => '1-3 days',
            ],
        ];

        return [
            'product_sku' => $inventory->sku,
            'product_name' => $inventory->product_name,
            'quantity' => $inventory->quantity,
            'current_value' => $currentValue,
            'recommended_strategy' => 'B2B Matched Sale',
            'expected_recovery' => $sellRecovery,
            'expected_recovery_formatted' => $this->formatINR($sellRecovery),
            'strategies' => $strategies,
        ];
    }

    /**
     * Execute a real transactional recovery action, decrementing inventory and updating financials.
     */
    public function executeRecovery(
        Inventory $inventory,
        string $actionType,
        int $quantity,
        float $dealAmount,
        ?int $buyerCompanyId = null,
        ?string $channelNotes = null,
        ?int $userId = null
    ): array {
        return DB::transaction(function () use (
            $inventory,
            $actionType,
            $quantity,
            $dealAmount,
            $buyerCompanyId,
            $channelNotes,
            $userId
        ) {
            if ($quantity <= 0) {
                throw new \InvalidArgumentException('Quantity must be greater than zero.');
            }

            if ($quantity > $inventory->quantity) {
                throw new \InvalidArgumentException("Cannot recover {$quantity} units. Only {$inventory->quantity} units available in stock.");
            }

            $originalQty = $inventory->quantity;
            $unitPrice = $quantity > 0 ? round($dealAmount / $quantity, 2) : $inventory->unit_cost;

            // 1. Decrement inventory quantity and update valuation
            $inventory->quantity -= $quantity;
            $inventory->current_value = round($inventory->quantity * $inventory->unit_cost, 2);

            if ($inventory->quantity <= 0) {
                $inventory->status = 'recovered';
                $inventory->risk_score = 0;
                $inventory->risk_level = 'LOW';
                $inventory->recommended_action = 'Completed';
            } else {
                // Re-evaluate risk for remaining stock
                $risk = $this->riskService->analyze($inventory);
                $inventory->risk_score = $risk['risk_score'];
                $inventory->risk_level = $risk['risk_level'];
                $inventory->estimated_loss = $risk['estimated_loss'];
                $inventory->estimated_recovery = $risk['estimated_recovery'];
                $inventory->recommended_action = $risk['recommended_action'];
            }
            $inventory->save();

            // 2. Log Inventory Movement
            $movementType = match ($actionType) {
                'sell', 'b2b_sale' => 'sold',
                'transfer' => 'transferred',
                'return' => 'returned',
                'recycle' => 'recycled',
                default => 'adjusted',
            };

            $movement = InventoryMovement::create([
                'inventory_id' => $inventory->id,
                'movement_type' => $movementType,
                'quantity' => $quantity,
                'source_location' => $inventory->warehouse_location ?: 'Main Warehouse',
                'destination_location' => $actionType === 'transfer' ? 'Branch Warehouse' : 'External Counterparty',
                'reference' => 'TXN-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4)),
                'notes' => $channelNotes ?: "Executed {$actionType} for {$quantity} units.",
                'created_by' => $userId,
            ]);

            // 3. Create Transaction Record
            $refNo = 'TXN-' . date('Y') . '-' . strtoupper(substr(uniqid(), -6));
            $transaction = Transaction::create([
                'reference_no' => $refNo,
                'user_id' => $userId,
                'company_id' => $inventory->company_id,
                'buyer_company_id' => $buyerCompanyId,
                'inventory_id' => $inventory->id,
                'transaction_type' => $actionType,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_amount' => $dealAmount,
                'recovery_value' => $dealAmount,
                'status' => 'completed',
                'notes' => $channelNotes,
                'completed_at' => now(),
            ]);

            // 4. Record Recovery Action
            $wasteAvoided = round($quantity * 0.1, 2); // 100g average industrial diversion per unit
            $recoveryAction = RecoveryAction::create([
                'user_id' => $userId,
                'inventory_id' => $inventory->id,
                'company_id' => $inventory->company_id,
                'action_type' => $actionType,
                'channel_name' => $channelNotes ?: ucfirst($actionType) . ' Liquidation',
                'original_value' => round($quantity * $inventory->unit_cost, 2),
                'estimated_recovery' => $dealAmount,
                'recovered_value' => $dealAmount,
                'recovery_percentage' => round(($dealAmount / max(1, $quantity * $inventory->unit_cost)) * 100, 1),
                'units_diverted' => $quantity,
                'waste_avoided_kg' => $wasteAvoided,
                'status' => 'completed',
                'notes' => "Recovered ₹" . number_format($dealAmount) . " via {$actionType}.",
                'executed_at' => now(),
            ]);

            // 5. Dispatch Real-time Notification
            Notification::create([
                'user_id' => $userId,
                'company_id' => $inventory->company_id,
                'type' => 'recovery_completed',
                'severity' => 'success',
                'title' => 'Deal Completed & Capital Recovered',
                'message' => "Successfully recovered ₹" . number_format($dealAmount) . " by executing {$actionType} for {$quantity} units of {$inventory->product_name}.",
                'action_url' => '/inventory/' . $inventory->sku,
                'action_label' => 'View Inventory',
                'is_read' => false,
                'data' => [
                    'transaction_ref' => $refNo,
                    'recovered_amount' => $dealAmount,
                    'remaining_quantity' => $inventory->quantity,
                ],
            ]);

            return [
                'success' => true,
                'message' => "Successfully executed {$actionType}. ₹" . number_format($dealAmount) . " recovered into company capital.",
                'data' => [
                    'transaction' => $transaction->load(['buyerCompany', 'sellerCompany']),
                    'movement' => $movement,
                    'recovery_action' => $recoveryAction,
                    'updated_inventory' => [
                        'id' => $inventory->id,
                        'sku' => $inventory->sku,
                        'product_name' => $inventory->product_name,
                        'previous_quantity' => $originalQty,
                        'remaining_quantity' => $inventory->quantity,
                        'current_value' => $inventory->current_value,
                        'risk_score' => $inventory->risk_score,
                        'risk_level' => $inventory->risk_level,
                        'status' => $inventory->status,
                    ],
                ],
            ];
        });
    }

    private function formatINR(float $amount): string
    {
        if ($amount >= 10000000) {
            return '₹' . round($amount / 10000000, 1) . 'Cr';
        } elseif ($amount >= 100000) {
            return '₹' . round($amount / 100000, 1) . 'L';
        } elseif ($amount >= 1000) {
            return '₹' . round($amount / 1000, 0) . 'K';
        }
        return '₹' . number_format($amount, 0);
    }
}
