<?php

namespace App\Services;

use App\Models\AIInteraction;
use App\Models\BuyerMatch;
use App\Models\Inventory;
use App\Models\RecoveryAction;
use App\Models\Transaction;
use App\Models\Warehouse;
use Illuminate\Support\Facades\Http;

class AIService
{
    /**
     * Ask DeadStock AI for smart inventory recommendations, risk alerts, and buyer strategies.
     */
    public function ask(string $query, ?int $userId = null, ?int $companyId = null): array
    {
        // Check if external Python ML microservice is configured
        $pythonMlUrl = config('services.ai.python_ml_url');
        if (!empty($pythonMlUrl)) {
            try {
                $response = Http::timeout(5)->post($pythonMlUrl . '/api/v1/predict', [
                    'query' => $query,
                    'user_id' => $userId,
                    'company_id' => $companyId,
                ]);
                if ($response->successful()) {
                    return $response->json();
                }
            } catch (\Exception $e) {
                // Fallback to internal intelligent engine
            }
        }

        $lowerQuery = strtolower($query);

        $invQuery = Inventory::where('status', '!=', 'archived');
        if ($companyId) {
            $invQuery->where('company_id', $companyId);
        } else {
            $invQuery->whereRaw('1 = 0');
        }

        $allInventory = $invQuery->get();
        $totalCount = $allInventory->count();

        // Fresh / Empty tenant state
        if ($totalCount === 0) {
            $intent = 'workspace_empty_state';
            $responseText = 'Your workspace currently has no active inventory records. To generate risk evaluations, B2B buyer matches, and liquidation strategies, please add your first SKU or upload an ERP inventory CSV.';
            $structuredPayload = [
                'status' => 'empty',
                'action' => 'import_inventory',
                'message' => 'Upload inventory to start AI diagnostics.',
            ];

            if ($userId && $companyId) {
                AIInteraction::create([
                    'user_id' => $userId,
                    'company_id' => $companyId,
                    'query' => $query,
                    'response_text' => $responseText,
                    'intent_detected' => $intent,
                    'structured_payload' => $structuredPayload,
                    'confidence_score' => 100.0,
                ]);
            }

            return [
                'success' => true,
                'query' => $query,
                'response' => $responseText,
                'intent' => $intent,
                'data' => $structuredPayload,
                'confidence' => '100%',
            ];
        }

        $highRiskItems = $allInventory->filter(fn ($i) => in_array($i->risk_level, ['HIGH', 'CRITICAL']))->sortByDesc('risk_score')->values();
        $priorityItem = $highRiskItems->first() ?: $allInventory->sortByDesc('risk_score')->first();

        // Categorical risk breakdown
        $categoryBreakdown = $allInventory->groupBy('category')->map(function ($group) {
            return [
                'count' => $group->count(),
                'value' => (float) $group->sum('current_value'),
                'avg_risk' => round($group->avg('risk_score'), 1),
            ];
        })->sortByDesc('avg_risk');

        $topRiskCategory = $categoryBreakdown->keys()->first() ?: 'General';

        // Intent resolution based on authentic user inventory
        if (str_contains($lowerQuery, 'sell first') || str_contains($lowerQuery, 'which stock') || str_contains($lowerQuery, 'prioritize')) {
            $intent = 'stock_prioritization';
            $topItem = $priorityItem;
            $currentValFormatted = $topItem->current_value >= 100000
                ? round($topItem->current_value / 100000, 1) . 'L'
                : number_format($topItem->current_value);

            $responseText = sprintf(
                "You should prioritize selling '%s' (SKU: %s). It has a risk score of %d%% (%s) with %s units currently tying up ₹%s in working capital.",
                $topItem->product_name,
                $topItem->sku,
                (int)$topItem->risk_score,
                $topItem->risk_level,
                number_format($topItem->quantity),
                $currentValFormatted
            );
            $structuredPayload = [
                'recommended_sku' => $topItem->sku,
                'product_name' => $topItem->product_name,
                'risk_level' => $topItem->risk_level,
                'risk_score' => $topItem->risk_score,
                'current_value' => $topItem->current_value,
                'action' => 'Find B2B Buyer / Publish to Marketplace',
            ];
        } elseif (str_contains($lowerQuery, 'why') && (str_contains($lowerQuery, 'high risk') || str_contains($lowerQuery, 'risk'))) {
            $intent = 'risk_explanation';
            $topItem = $priorityItem;
            $reasons = [];
            if (($topItem->age_months ?? 0) > 6) {
                $reasons[] = "Storage age is {$topItem->age_months} months (exceeds standard threshold).";
            }
            if ($topItem->monthly_demand && $topItem->monthly_demand < ($topItem->quantity / 3)) {
                $reasons[] = "Current stock ({$topItem->quantity} units) exceeds 3 months of projected monthly demand ({$topItem->monthly_demand} units).";
            }
            if (empty($reasons)) {
                $reasons[] = "Dormancy and lack of sales velocity over the monitored holding period.";
            }

            $responseText = sprintf(
                "SKU %s (%s) is flagged at %d%% (%s) risk because: %s Recommended action: %s.",
                $topItem->sku,
                $topItem->product_name,
                (int)$topItem->risk_score,
                $topItem->risk_level,
                implode(' ', $reasons),
                $topItem->recommended_action ?: 'B2B Liquidation'
            );
            $structuredPayload = [
                'sku' => $topItem->sku,
                'reasons' => $reasons,
                'recommended_action' => $topItem->recommended_action ?: 'B2B Liquidation',
            ];
        } elseif (str_contains($lowerQuery, 'who') || str_contains($lowerQuery, 'buy') || str_contains($lowerQuery, 'match')) {
            $intent = 'buyer_discovery';
            $matches = BuyerMatch::with('buyerCompany')
                ->whereHas('inventory', fn ($q) => $q->where('company_id', $companyId))
                ->orderByDesc('overall_match_score')
                ->limit(3)
                ->get();

            if ($matches->count() > 0) {
                $buyerList = [];
                $descriptions = [];
                foreach ($matches as $idx => $match) {
                    $bName = $match->buyerCompany?->name ?: 'Verified B2B Enterprise';
                    $score = round($match->overall_match_score);
                    $loc = ($match->buyerCompany?->city ?: 'HQ') . ', ' . ($match->buyerCompany?->state ?: 'India');
                    $buyerList[] = [
                        'name' => $bName,
                        'match' => "{$score}%",
                        'location' => $loc,
                        'demand' => "{$match->suggested_quantity} units",
                    ];
                    $descriptions[] = ($idx + 1) . ". {$bName} ({$score}% match in {$loc})";
                }
                $responseText = "DeadStock matched your surplus with verified buyers: " . implode(', ', $descriptions) . ".";
                $structuredPayload = [
                    'top_buyers' => $buyerList,
                    'action' => 'Dispatch direct B2B offer',
                ];
            } else {
                $responseText = "No active buyer matches have been generated yet for your current inventory catalog. You can publish your items to the B2B Marketplace or execute a recovery action to broadcast availability.";
                $structuredPayload = [
                    'top_buyers' => [],
                    'action' => 'Publish to Marketplace',
                ];
            }
        } elseif (str_contains($lowerQuery, 'price') || str_contains($lowerQuery, 'list') || str_contains($lowerQuery, 'smart pricing')) {
            $intent = 'smart_pricing_recommendation';
            $topItem = $priorityItem;
            $origCost = $topItem->unit_cost ?: 100;
            $recommendedPrice = round($origCost * 0.85, 2);
            $fastLiquidationPrice = round($origCost * 0.70, 2);

            $responseText = sprintf(
                "For %s (Unit Cost: ₹%s, Age: %d mo), Smart Pricing recommends: Recommended Listing Price: ₹%s/unit (15%% discount, ~85%% recovery), or Fast Clearance Price: ₹%s/unit (30%% discount for 48-hour liquidation).",
                $topItem->product_name,
                number_format($origCost, 2),
                (int)($topItem->age_months ?: 0),
                number_format($recommendedPrice, 2),
                number_format($fastLiquidationPrice, 2)
            );
            $structuredPayload = [
                'sku' => $topItem->sku,
                'unit_cost' => $origCost,
                'recommended_price' => $recommendedPrice,
                'fast_clearance_price' => $fastLiquidationPrice,
                'expected_recovery_rate' => '85%',
            ];
        } elseif (str_contains($lowerQuery, 'recovered') || str_contains($lowerQuery, 'how much')) {
            $intent = 'recovery_analytics';
            $recoveredTotal = (float) Transaction::where('company_id', $companyId)
                ->where('status', 'completed')
                ->sum('recovery_value');
            $completedCount = Transaction::where('company_id', $companyId)
                ->where('status', 'completed')
                ->count();
            $divertedUnits = (int) RecoveryAction::where('company_id', $companyId)
                ->sum('units_diverted');

            if ($completedCount > 0) {
                $formattedVal = $recoveredTotal >= 100000
                    ? '₹' . round($recoveredTotal / 100000, 1) . 'L'
                    : '₹' . number_format($recoveredTotal);
                $responseText = sprintf(
                    "DeadStock has recovered %s in working capital for your organization across %d completed transactions. %s surplus units were diverted from obsolescence.",
                    $formattedVal,
                    $completedCount,
                    number_format($divertedUnits)
                );
            } else {
                $responseText = "No completed recovery transactions recorded yet. As soon as you execute B2B liquidation deals or marketplace orders, your recovered capital and diverted units will be tracked here.";
            }

            $structuredPayload = [
                'total_recovered_amount' => $recoveredTotal,
                'completed_deals' => $completedCount,
                'units_rescued' => $divertedUnits,
            ];
        } elseif (str_contains($lowerQuery, 'warehouse') || str_contains($lowerQuery, 'slow') || str_contains($lowerQuery, 'depot')) {
            $intent = 'warehouse_diagnostics';
            $warehouses = Warehouse::where('company_id', $companyId)
                ->withCount('inventories')
                ->get();

            if ($warehouses->count() > 0) {
                $whNames = $warehouses->pluck('name')->implode(', ');
                $responseText = "Your monitored facility network comprises: {$whNames}. Review inventory by facility to balance regional holding stock.";
                $structuredPayload = [
                    'warehouses' => $warehouses->map(fn($w) => ['name' => $w->name, 'sku_count' => $w->inventories_count]),
                    'recommended_action' => 'Balance stock across depots',
                ];
            } else {
                $responseText = "No specific warehouse facilities are registered. Standard stock is tracked under your primary tenant location.";
                $structuredPayload = [
                    'warehouses' => [],
                    'recommended_action' => 'Add warehouse in settings',
                ];
            }
        } elseif (str_contains($lowerQuery, 'category')) {
            $intent = 'category_risk_analysis';
            $topCatData = $categoryBreakdown->first();
            $responseText = sprintf(
                "Based on live warehouse analysis, '%s' has the highest dead-stock risk with an average risk score of %.1f%% across %d SKUs.",
                $topRiskCategory,
                $topCatData['avg_risk'] ?? 0,
                $topCatData['count'] ?? 0
            );
            $structuredPayload = [
                'top_category' => $topRiskCategory,
                'category_breakdown' => $categoryBreakdown->take(4),
                'recommended_action' => 'Initiate category-wide surplus liquidation',
            ];
        } else {
            $intent = 'general_recovery_advice';
            $priorityName = $priorityItem->product_name;
            $estRecovery = $priorityItem->estimated_recovery ?: ($priorityItem->current_value * 0.7);
            $recoveryFormatted = $estRecovery >= 100000
                ? round($estRecovery / 100000, 1) . 'L'
                : number_format($estRecovery);

            $responseText = sprintf(
                "DeadStock recommends prioritizing liquidation of '%s' (SKU: %s) via B2B matched sale or marketplace listing to recover up to ₹%s in working capital.",
                $priorityName,
                $priorityItem->sku,
                $recoveryFormatted
            );
            $structuredPayload = [
                'recommendation' => 'Find B2B buyer',
                'sku' => $priorityItem->sku,
                'estimated_recovery' => $estRecovery,
                'timeline' => 'Next 7-14 days',
            ];
        }

        // Record interaction in DB
        if ($userId && $companyId) {
            AIInteraction::create([
                'user_id' => $userId,
                'company_id' => $companyId,
                'query' => $query,
                'response_text' => $responseText,
                'intent_detected' => $intent,
                'structured_payload' => $structuredPayload,
                'confidence_score' => 95.0,
            ]);
        }

        return [
            'success' => true,
            'query' => $query,
            'response' => $responseText,
            'intent' => $intent,
            'data' => $structuredPayload,
            'confidence' => '95%',
        ];
    }
}
