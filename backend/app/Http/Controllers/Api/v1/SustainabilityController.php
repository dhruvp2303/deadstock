<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Services\SustainabilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SustainabilityController extends Controller
{
    use ApiResponse;

    protected SustainabilityService $sustainabilityService;

    public function __construct(SustainabilityService $sustainabilityService)
    {
        $this->sustainabilityService = $sustainabilityService;
    }

    public function metrics(Request $request): JsonResponse
    {
        $companyId = $request->user()?->company_id;
        $data = $this->sustainabilityService->getMetrics($companyId);

        return $this->successResponse($data, 'Sustainability metrics retrieved successfully');
    }
}
