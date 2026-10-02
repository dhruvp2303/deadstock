<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExecuteRecoveryRequest;
use App\Http\Traits\ApiResponse;
use App\Models\Inventory;
use App\Models\Transaction;
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
        $companyId = $request->user()?->company_id ?: 1;

        $transactions = Transaction::where('company_id', $companyId)
            ->orWhere('buyer_company_id', $companyId)
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
        $inventory = null;
        if ($request->has('inventory_id')) {
            $inventory = Inventory::find($request->inventory_id);
        } elseif ($request->has('sku')) {
            $inventory = Inventory::where('sku', $request->sku)->first();
        }

        if (!$inventory) {
            return $this->errorResponse('Inventory item not found.', null, 404);
        }

        try {
            $result = $this->recoveryService->executeRecovery(
                $inventory,
                $request->action_type,
                (int) $request->quantity,
                (float) $request->deal_amount,
                $request->buyer_company_id ? (int) $request->buyer_company_id : null,
                $request->channel_notes,
                $request->user()?->id
            );

            return $this->successResponse($result['data'], $result['message'], 201);
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to execute transaction: ' . $e->getMessage(), null, 500);
        }
    }
}
