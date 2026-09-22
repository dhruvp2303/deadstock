<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function summary(Request $request): JsonResponse
    {
        $companyId = $request->user()?->company_id;
        $summary = $this->analyticsService->getDashboardSummary($companyId);

        return response()->json([
            'success' => true,
            'message' => 'Dashboard summary retrieved successfully',
            'data' => $summary,
        ]);
    }
}
