<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Transaction;
use App\Services\RecoveryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
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
            ->with(['sellerCompany', 'buyerCompany', 'inventory'])
            ->orderByDesc('completed_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions,
        ]);
    }

    /**
     * Execute a recovery deal transaction in real-time.
     */
    public function executeRecovery(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'sku' => 'required_without:inventory_id|string',
            'inventory_id' => 'required_without:sku|integer',
            'action_type' => 'required|string|in:sell,transfer,return,recycle,discount,b2b_sale',
            'quantity' => 'required|integer|min:1',
            'deal_amount' => 'required|numeric|min:0',
            'buyer_company_id' => 'nullable|integer|exists:companies,id',
            'channel_notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $inventory = null;
        if ($request->has('inventory_id')) {
            $inventory = Inventory::find($request->inventory_id);
        } elseif ($request->has('sku')) {
            $inventory = Inventory::where('sku', $request->sku)->first();
        }

        if (!$inventory) {
            return response()->json([
                'success' => false,
                'message' => 'Inventory item not found.',
            ], 404);
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

            return response()->json($result, 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to execute transaction: ' . $e->getMessage(),
            ], 500);
        }
    }
}
