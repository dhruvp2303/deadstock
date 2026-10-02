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
        $companyId = $request->user()?->company_id;
        $summary = $this->analyticsService->getDashboardSummary($companyId);

        return $this->successResponse([
            'metrics' => [
                ['value' => '₹10Cr+', 'label' => 'Potential inventory value analyzed', 'accent' => true],
                ['value' => '92%', 'label' => 'Average buyer-match confidence', 'accent' => false],
                ['value' => '35%', 'label' => 'Potential inventory recovery improvement', 'accent' => false],
                ['value' => '24/7', 'label' => 'Inventory monitoring', 'accent' => false],
            ],
            'summary' => $summary,
            'charts' => [
                'inventory_value_over_time' => [22, 34, 28, 46, 39, 58, 50, 66],
                'dead_stock_trend' => [45, 42, 38, 35, 30, 28, 24, 21],
                'recovery_value' => [12, 18, 25, 32, 40, 52, 60, 68],
                'category_risk' => [35, 28, 20, 12, 5],
                'warehouse_performance' => [88, 92, 79, 85, 94],
                'buyer_conversion' => [65, 72, 78, 84, 91],
            ],
        ], 'Analytics overview retrieved successfully');
    }
}
