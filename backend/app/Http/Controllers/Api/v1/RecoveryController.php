<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Inventory;
use App\Services\RecoveryService;
use Illuminate\Http\JsonResponse;

class RecoveryController extends Controller
{
    use ApiResponse;

    protected RecoveryService $recoveryService;

    public function __construct(RecoveryService $recoveryService)
    {
        $this->recoveryService = $recoveryService;
    }

    public function summary(): JsonResponse
    {
        return $this->successResponse([
            'cards' => [
                ['title' => 'Sell', 'recovery' => '₹3.9L', 'accent' => true],
                ['title' => 'Transfer', 'recovery' => '₹3.4L', 'accent' => false],
                ['title' => 'Return', 'recovery' => '₹2.4L', 'accent' => false],
                ['title' => 'Recycle', 'recovery' => '₹70K', 'accent' => false],
            ],
            'recommended' => [
                'action' => 'B2B Matched Sale',
                'expected_recovery' => '₹3.9L',
            ],
            'case_study' => [
                'before' => [
                    'company' => 'ABC Plastics',
                    'inventory' => '10,000 units',
                    'value' => '₹8,00,000',
                    'problem' => 'Customer cancelled order',
                    'potential_outcome' => '₹2.5L recovery',
                ],
                'after' => [
                    'risk_detected' => '94% risk',
                    'buyers_found' => '3 potential buyers',
                    'best_match' => '91%',
                    'estimated_recovery' => '₹4.2–₹5L',
                ],
            ],
        ], 'Recovery summary retrieved successfully');
    }

    public function strategiesForProduct(string $sku): JsonResponse
    {
        $inventory = Inventory::where('sku', $sku)->orWhere('id', $sku)->first();
        if (!$inventory) {
            return $this->errorResponse('Product not found', null, 404);
        }

        $data = $this->recoveryService->getRecoveryStrategies($inventory);

        return $this->successResponse($data, 'Recovery strategies retrieved successfully');
    }
}
