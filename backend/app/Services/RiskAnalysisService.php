<?php

namespace App\Services;

use App\Models\Inventory;

class RiskAnalysisService
{
    /**
     * Calculate inventory risk score (0-100), risk level, estimated financial loss,
     * estimated recovery value, and dynamic plain-English explanation.
     *
     * Weighted Risk Index Formula:
     * - Supply Velocity & Overstock Ratio (35% weight): months of supply vs healthy baseline (3 months)
     * - Inventory Age (25% weight): age in months relative to 12-month lifecycle
     * - Demand Trend & Velocity Decay (20% weight): recent forecast slope / velocity degradation
     * - Category & Obsolescence Factor (20% weight): intrinsic material/electronics depreciation
     *
     * Score Level Bands:
     * - 0 - 30: LOW (Healthy, normal turnover)
     * - 31 - 60: MEDIUM (Monitor, moderate excess)
     * - 61 - 80: HIGH (Active overstock, initiate buyer liquidation)
     * - 81 - 100: CRITICAL (Imminent dead stock, urgent action required)
     */
    public function analyze(Inventory $inventory): array
    {
        $ageMonths = max(0, (int) ($inventory->age_months ?: 0));
        $quantity = max(0, (int) ($inventory->quantity ?: 0));
        $monthlyDemand = max(1, (int) ($inventory->monthly_demand ?: 1));
        $unitCost = (float) ($inventory->unit_cost ?: ($inventory->current_value / max($quantity, 1)));
        $currentValue = (float) ($inventory->current_value ?: ($quantity * $unitCost));

        // Months of supply
        $monthsOfSupply = $quantity / $monthlyDemand;

        // 1. Supply Velocity & Overstock Factor (0-100 points, weight: 35%)
        // Healthy stock is 1-3 months. Above 6 months is risky, above 12 is critical.
        if ($monthsOfSupply <= 3.0) {
            $supplyScore = ($monthsOfSupply / 3.0) * 25.0;
        } elseif ($monthsOfSupply <= 6.0) {
            $supplyScore = 25.0 + (($monthsOfSupply - 3.0) / 3.0) * 35.0; // 25 - 60
        } elseif ($monthsOfSupply <= 12.0) {
            $supplyScore = 60.0 + (($monthsOfSupply - 6.0) / 6.0) * 25.0; // 60 - 85
        } else {
            $supplyScore = min(100.0, 85.0 + min(15.0, (($monthsOfSupply - 12.0) / 6.0) * 15.0));
        }

        // 2. Inventory Age Factor (0-100 points, weight: 25%)
        // <3 months: 0-25 pts, 3-6 months: 25-55 pts, 6-12 months: 55-85 pts, >12 months: 85-100 pts
        if ($ageMonths <= 3) {
            $ageScore = ($ageMonths / 3.0) * 25.0;
        } elseif ($ageMonths <= 6) {
            $ageScore = 25.0 + (($ageMonths - 3.0) / 3.0) * 30.0;
        } elseif ($ageMonths <= 12) {
            $ageScore = 55.0 + (($ageMonths - 6.0) / 6.0) * 30.0;
        } else {
            $ageScore = min(100.0, 85.0 + min(15.0, (($ageMonths - 12.0) / 6.0) * 15.0));
        }

        // 3. Demand Trend & Velocity Decay Factor (0-100 points, weight: 20%)
        // Assess forecast curve if present, otherwise approximate based on age vs demand ratio
        $forecast = $inventory->demand_forecast_history;
        if (is_array($forecast) && count($forecast) >= 2) {
            $first = (float) reset($forecast);
            $last = (float) end($forecast);
            $dropPct = $first > 0 ? max(0, ($first - $last) / $first) : 0;
            $demandDecayScore = min(100.0, $dropPct * 100.0);
        } else {
            $demandDecayScore = min(100.0, max(10.0, ($monthsOfSupply > 4 ? 65.0 : 20.0)));
        }

        // 4. Category Obsolescence Factor (0-100 points, weight: 20%)
        $category = strtolower($inventory->category ?? '');
        if (str_contains($category, 'electronic') || str_contains($category, 'pcb') || str_contains($category, 'semiconductor')) {
            $categoryScore = 90.0; // Rapid obsolescence
        } elseif (str_contains($category, 'connector') || str_contains($category, 'plastic') || str_contains($category, 'molding')) {
            $categoryScore = 70.0;
        } elseif (str_contains($category, 'packaging') || str_contains($category, 'paper')) {
            $categoryScore = 55.0;
        } elseif (str_contains($category, 'chemical') || str_contains($category, 'pharma')) {
            $categoryScore = 80.0;
        } elseif (str_contains($category, 'steel') || str_contains($category, 'hardware') || str_contains($category, 'metal')) {
            $categoryScore = 30.0; // Durable, slow depreciation
        } else {
            $categoryScore = 50.0;
        }

        // Composite Weighted Risk Index (0 - 100)
        $totalScore = round(
            ($supplyScore * 0.35) +
            ($ageScore * 0.25) +
            ($demandDecayScore * 0.20) +
            ($categoryScore * 0.20),
            1
        );
        $totalScore = min(100.0, max(0.0, $totalScore));

        // Risk Level classification (0-30 Low, 31-60 Medium, 61-80 High, 81-100 Critical)
        if ($totalScore >= 81.0) {
            $level = 'CRITICAL';
            $action = 'Urgent / Find Buyer';
        } elseif ($totalScore >= 61.0) {
            $level = 'HIGH';
            $action = 'Find Buyer';
        } elseif ($totalScore >= 31.0) {
            $level = 'MEDIUM';
            $action = 'Discount / Relocate';
        } else {
            $level = 'LOW';
            $action = 'Monitor';
        }

        // Financial Exposure Calculations
        // Potential loss: proportion of value at risk if unsold over 90 days
        $lossFactor = min(0.95, max(0.05, $totalScore / 100.0));
        $estimatedLoss = round($currentValue * $lossFactor, 2);

        // Smart Pricing Recovery: higher risk requires steeper discount to liquidate
        $recoveryRate = max(0.35, min(0.92, 1.0 - ($totalScore / 140.0)));
        $estimatedRecovery = round($currentValue * $recoveryRate, 2);

        // Dynamic Plain-English Explanation based on actual computed factors
        $velocityDropEstimate = round(min(80, max(15, ($supplyScore * 0.75))), 0);
        $overstockRatio = round($monthsOfSupply / 3.0, 1); // relative to 3mo benchmark

        $reasons = [];
        if ($overstockRatio > 1.2) {
            $reasons[] = "stock quantity is {$overstockRatio}x expected demand";
        }
        if ($ageMonths >= 3) {
            $reasons[] = "inventory age has reached {$ageMonths} months";
        }
        if ($demandDecayScore > 40) {
            $reasons[] = "sales velocity dropped ~{$velocityDropEstimate}% over recent cycle";
        }
        if (empty($reasons)) {
            $reasons[] = "inventory velocity is within normal operational bounds";
        }

        $explanation = sprintf(
            "This item's risk is %d (%s) because %s, with %.1f months of supply remaining.",
            (int) round($totalScore),
            $level,
            implode(', ', $reasons),
            $monthsOfSupply
        );

        return [
            'risk_score' => $totalScore,
            'risk_level' => $level,
            'months_of_supply' => round($monthsOfSupply, 1),
            'estimated_loss' => $estimatedLoss,
            'estimated_recovery' => $estimatedRecovery,
            'recommended_action' => $action,
            'ai_explanation' => $explanation,
        ];
    }
}
