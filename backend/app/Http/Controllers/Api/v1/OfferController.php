<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CounterOfferRequest;
use App\Http\Requests\SendOfferRequest;
use App\Http\Traits\ApiResponse;
use App\Models\Inventory;
use App\Models\Notification;
use App\Models\Offer;
use App\Services\RecoveryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OfferController extends Controller
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

        $offers = Offer::where('sender_company_id', $companyId)
            ->orWhere('receiver_company_id', $companyId)
            ->with(['inventory.categoryModel', 'inventory.warehouseModel', 'senderCompany', 'receiverCompany'])
            ->orderByDesc('created_at')
            ->get();

        return $this->successResponse($offers, 'Offers retrieved successfully');
    }

    public function sendOffer(SendOfferRequest $request): JsonResponse
    {
        $inventory = null;
        if ($request->has('inventory_id')) {
            $inventory = Inventory::find($request->inventory_id);
        } elseif ($request->has('sku')) {
            $inventory = Inventory::where('sku', $request->sku)->first();
        }

        if (!$inventory) {
            return $this->errorResponse('Inventory item not found', null, 404);
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

        return $this->successResponse(
            $offer->load(['receiverCompany', 'senderCompany', 'inventory']),
            'Offer dispatched successfully',
            201
        );
    }

    public function acceptOffer(int $id, Request $request): JsonResponse
    {
        $offer = Offer::with(['inventory', 'receiverCompany', 'senderCompany'])->find($id);
        if (!$offer) {
            return $this->errorResponse('Offer not found', null, 404);
        }

        if ($offer->status === 'accepted') {
            return $this->errorResponse('Offer has already been accepted and completed.', null, 400);
        }

        return DB::transaction(function () use ($offer, $request) {
            $offer->status = 'accepted';
            $offer->save();

            // Execute atomic recovery transaction
            $result = $this->recoveryService->executeRecovery(
                $offer->inventory,
                'sell',
                $offer->offered_quantity,
                (float) $offer->total_deal_value,
                $offer->receiver_company_id,
                "Accepted B2B Offer #{$offer->id}",
                $request->user()?->id
            );

            return $this->successResponse([
                'offer' => $offer->fresh(['receiverCompany', 'senderCompany', 'inventory']),
                'recovery' => $result,
            ], 'Offer accepted and transaction completed successfully');
        });
    }

    public function counterOffer(int $id, CounterOfferRequest $request): JsonResponse
    {
        $offer = Offer::with(['inventory', 'receiverCompany', 'senderCompany'])->find($id);
        if (!$offer) {
            return $this->errorResponse('Offer not found', null, 404);
        }

        if (in_array($offer->status, ['accepted', 'rejected'])) {
            return $this->errorResponse("Cannot counter an offer that is already {$offer->status}.", null, 400);
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

        return $this->successResponse(
            $offer->load(['receiverCompany', 'senderCompany', 'inventory']),
            'Counter-offer dispatched successfully.'
        );
    }

    public function rejectOffer(int $id, Request $request): JsonResponse
    {
        $offer = Offer::find($id);
        if (!$offer) {
            return $this->errorResponse('Offer not found', null, 404);
        }

        $offer->status = 'rejected';
        $offer->notes = $request->notes ?: 'Offer declined by counterparty.';
        $offer->save();

        return $this->successResponse(
            $offer->load(['receiverCompany', 'senderCompany', 'inventory']),
            'Offer declined.'
        );
    }
}
