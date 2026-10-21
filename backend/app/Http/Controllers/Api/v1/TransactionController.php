<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExecuteRecoveryRequest;
use App\Http\Traits\ApiResponse;
use App\Models\Inventory;
use App\Models\Transaction;
use App\Models\User;
use App\Services\RecoveryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    use ApiResponse;

    protected RecoveryService $recoveryService;

    public function __construct(RecoveryService $recoveryService)
    {
        $this->recoveryService = $recoveryService;
    }

    public function index(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $transactions = Transaction::where(function ($q) use ($user) {
                $q->where('company_id', $user->company_id)
                  ->orWhere('buyer_company_id', $user->company_id);
            })
            ->with(['sellerCompany', 'buyerCompany', 'inventory.categoryModel', 'inventory.warehouseModel'])
            ->orderByDesc('completed_at')
            ->get();

        return $this->successResponse($transactions, 'Transactions retrieved successfully');
    }

    /**
     * Execute a recovery deal transaction in real-time.
     */
    public function executeRecovery(ExecuteRecoveryRequest $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $inventory = null;
        if ($request->filled('inventory_id')) {
            $inventory = Inventory::find($request->inventory_id);
        }
        if (!$inventory && $request->filled('sku')) {
            $inventory = Inventory::where('sku', $request->sku)->first();
        }

        if (!$inventory) {
            return $this->errorResponse('No active inventory item found for the specified identifier or SKU.', null, 404);
        }

        if ($inventory->company_id !== $user->company_id) {
            return $this->errorResponse('Unauthorized to execute recovery on another company\'s inventory.', null, 403);
        }

        try {
            $result = $this->recoveryService->executeRecovery(
                $inventory,
                $request->action_type,
                (int) $request->quantity,
                (float) $request->deal_amount,
                $request->buyer_company_id ? (int) $request->buyer_company_id : null,
                $request->channel_notes,
                $user?->id
            );

            return $this->successResponse($result['data'], $result['message'], 201);
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to execute transaction: ' . $e->getMessage(), null, 500);
        }
    }
}
