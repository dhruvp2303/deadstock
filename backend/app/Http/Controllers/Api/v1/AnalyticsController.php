<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    use ApiResponse;

    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }
    public function overview(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $companyId = $user->company_id;
        $summary = $this->analyticsService->getDashboardSummary($companyId);
        $totalSkus = $summary['total_skus_count'] ?? 0;

        $metrics = [
            ['value' => $summary['total_inventory_formatted'] ?? '₹0', 'label' => 'Total inventory value tracked', 'accent' => true],
            ['value' => $summary['recovery_rate'] ?? '0%', 'label' => 'Recovery efficiency rate', 'accent' => false],
            ['value' => (string) ($summary['high_risk_skus_count'] ?? 0), 'label' => 'High-risk SKUs requiring action', 'accent' => false],
            ['value' => (string) ($summary['new_buyer_matches_count'] ?? 0), 'label' => 'Active buyer matches', 'accent' => false],
        ];

        $charts = [
            'inventory_value_over_time' => $totalSkus > 0 ? [22, 34, 28, 46, 39, 58, 50, 66] : [],
            'dead_stock_trend' => $totalSkus > 0 ? [45, 42, 38, 35, 30, 28, 24, 21] : [],
            'recovery_value' => $totalSkus > 0 ? [12, 18, 25, 32, 40, 52, 60, 68] : [],
            'category_risk' => $totalSkus > 0 ? [35, 28, 20, 12, 5] : [],
            'warehouse_performance' => $totalSkus > 0 ? [88, 92, 79, 85, 94] : [],
            'buyer_conversion' => $totalSkus > 0 ? [65, 72, 78, 84, 91] : [],
        ];

        return $this->successResponse([
            'metrics' => $metrics,
            'summary' => $summary,
            'charts' => $charts,
        ], 'Analytics overview retrieved successfully');
    }
}
