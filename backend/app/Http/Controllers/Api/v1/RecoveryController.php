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

    public function summary(\Illuminate\Http\Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $atRiskInventories = Inventory::where('company_id', $user->company_id)
            ->whereIn('risk_level', ['HIGH', 'CRITICAL'])
            ->get();

        $totalAtRiskValue = $atRiskInventories->sum(function ($item) {
            return $item->current_value ?: ($item->quantity * $item->unit_cost);
        });

        $sellRecovery = round($totalAtRiskValue * 0.65, 2);
        $transferRecovery = round($totalAtRiskValue * 0.50, 2);
        $returnRecovery = round($totalAtRiskValue * 0.40, 2);
        $recycleRecovery = round($totalAtRiskValue * 0.15, 2);

        $formatINR = function (float $amount): string {
            if ($amount <= 0) return '₹0';
            if ($amount >= 10000000) return '₹' . round($amount / 10000000, 1) . 'Cr';
            if ($amount >= 100000) return '₹' . round($amount / 100000, 1) . 'L';
            if ($amount >= 1000) return '₹' . round($amount / 1000, 0) . 'K';
            return '₹' . number_format($amount, 0);
        };

        $cards = [
            ['title' => 'Sell', 'recovery' => $formatINR($sellRecovery), 'accent' => true],
            ['title' => 'Transfer', 'recovery' => $formatINR($transferRecovery), 'accent' => false],
            ['title' => 'Return', 'recovery' => $formatINR($returnRecovery), 'accent' => false],
            ['title' => 'Recycle', 'recovery' => $formatINR($recycleRecovery), 'accent' => false],
        ];

        return $this->successResponse([
            'cards' => $cards,
            'at_risk_count' => $atRiskInventories->count(),
            'total_at_risk_value' => $totalAtRiskValue,
            'recommended' => [
                'action' => $atRiskInventories->count() > 0 ? 'B2B Matched Sale' : 'None Required',
                'expected_recovery' => $formatINR($sellRecovery),
            ],
        ], 'Recovery summary retrieved successfully');
    }

    public function strategiesForProduct(string $sku, \Illuminate\Http\Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $inventory = Inventory::where('company_id', $user->company_id)
            ->where(function ($q) use ($sku) {
                $q->where('sku', $sku)->orWhere('id', $sku);
            })->first();

        if (!$inventory) {
            return $this->errorResponse('Product not found', null, 404);
        }

        $data = $this->recoveryService->getRecoveryStrategies($inventory);

        return $this->successResponse($data, 'Recovery strategies retrieved successfully');
    }
}
