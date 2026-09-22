<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\BuyerMatch;
use App\Models\Inventory;
use App\Models\Notification;
use App\Models\Offer;
use App\Services\RecoveryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OfferController extends Controller
{
    protected RecoveryService $recoveryService;

    public function __construct(RecoveryService $recoveryService)
    {
        $this->recoveryService = $recoveryService;
    }

    public function index(Request $request): JsonResponse
    {
        $companyId = $request->user()?->company_id ?: 1;

        $offers = Offer::where('sender_company_id', $companyId)
            ->orWhere('receiver_company_id', $companyId)
            ->with(['inventory', 'senderCompany', 'receiverCompany'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $offers,
        ]);
    }

    public function sendOffer(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'sku' => 'required_without:inventory_id|string',
            'inventory_id' => 'required_without:sku|integer',
            'receiver_company_id' => 'required|integer|exists:companies,id',
            'buyer_match_id' => 'nullable|integer',
            'offered_quantity' => 'required|integer|min:1',
            'offered_unit_price' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string|max:1000',
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
                'message' => 'Inventory item not found',
            ], 404);
        }

        $senderCompanyId = $request->user()?->company_id ?: $inventory->company_id;
        $qty = (int) $request->offered_quantity;
        $unitPrice = (float) $request->offered_unit_price;
        $totalVal = round($qty * $unitPrice, 2);

        $offer = Offer::create([
            'inventory_id' => $inventory->id,
            'sender_company_id' => $senderCompanyId,
            'receiver_company_id' => $request->receiver_company_id,
            'buyer_match_id' => $request->buyer_match_id,
            'offered_quantity' => $qty,
            'offered_unit_price' => $unitPrice,
            'total_deal_value' => $totalVal,
            'status' => 'pending',
            'notes' => $request->notes ?: "Offer sent for {$qty} units of {$inventory->product_name}.",
        ]);

        // Send notification to sender
        Notification::create([
            'user_id' => $request->user()?->id,
            'company_id' => $senderCompanyId,
            'type' => 'buyer_interest',
            'severity' => 'info',
            'title' => 'Offer Dispatched',
            'message' => "Offer for {$qty} units sent to buyer. Total deal value: ₹" . number_format($totalVal) . ".",
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Offer dispatched successfully',
            'data' => $offer->load(['receiverCompany', 'inventory']),
        ], 201);
    }

    public function acceptOffer(int $id, Request $request): JsonResponse
    {
        $offer = Offer::with(['inventory', 'receiverCompany', 'senderCompany'])->find($id);
        if (!$offer) {
            return response()->json(['success' => false, 'message' => 'Offer not found'], 404);
        }

        if ($offer->status === 'accepted') {
            return response()->json(['success' => false, 'message' => 'Offer has already been accepted and completed.'], 400);
        }

        $offer->status = 'accepted';
        $offer->save();

        // Execute recovery transaction
        $result = $this->recoveryService->executeRecovery(
            $offer->inventory,
            'sell',
            $offer->offered_quantity,
            (float) $offer->total_deal_value,
            $offer->receiver_company_id,
            "Accepted B2B Offer #{$offer->id}",
            $request->user()?->id
        );

        return response()->json($result);
    }

    public function counterOffer(int $id, Request $request): JsonResponse
    {
        $offer = Offer::with(['inventory', 'receiverCompany', 'senderCompany'])->find($id);
        if (!$offer) {
            return response()->json(['success' => false, 'message' => 'Offer not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'counter_unit_price' => 'required|numeric|min:0.01',
            'counter_quantity' => 'nullable|integer|min:1',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $counterPrice = (float) $request->counter_unit_price;
        $counterQty = (int) ($request->counter_quantity ?: $offer->offered_quantity);
        $newTotal = round($counterQty * $counterPrice, 2);

        $offer->status = 'countered';
        $offer->offered_unit_price = $counterPrice;
        $offer->offered_quantity = $counterQty;
        $offer->total_deal_value = $newTotal;
        $offer->notes = $request->notes ? "Countered: {$request->notes}" : "Counter-offer sent at ₹{$counterPrice}/unit.";
        $offer->save();

        Notification::create([
            'user_id' => $request->user()?->id,
            'company_id' => $offer->sender_company_id,
            'type' => 'buyer_interest',
            'severity' => 'warning',
            'title' => 'Counter-Offer Received',
            'message' => "Counter-offer of ₹{$counterPrice}/unit for {$counterQty} units submitted.",
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Counter-offer dispatched successfully.',
            'data' => $offer->load(['receiverCompany', 'senderCompany', 'inventory']),
        ]);
    }

    public function rejectOffer(int $id, Request $request): JsonResponse
    {
        $offer = Offer::find($id);
        if (!$offer) {
            return response()->json(['success' => false, 'message' => 'Offer not found'], 404);
        }

        $offer->status = 'rejected';
        $offer->notes = $request->notes ?: 'Offer declined by counterparty.';
        $offer->save();

        return response()->json([
            'success' => true,
            'message' => 'Offer declined.',
            'data' => $offer,
        ]);
    }
}
