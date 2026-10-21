<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CounterOfferRequest;
use App\Http\Requests\SendOfferRequest;
use App\Http\Traits\ApiResponse;
use App\Models\BuyerMatch;
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
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $offers = Offer::where(function ($q) use ($user) {
            $q->where('sender_company_id', $user->company_id)
              ->orWhere('receiver_company_id', $user->company_id);
        })
        ->with(['inventory.categoryModel', 'inventory.warehouseModel', 'senderCompany', 'receiverCompany'])
        ->orderByDesc('created_at')
        ->limit(100)
        ->get();

        return $this->successResponse($offers, 'Offers retrieved successfully');
    }

    public function sendOffer(SendOfferRequest $request): JsonResponse
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
            return $this->errorResponse('No active inventory found for the specified identifier or SKU.', null, 404);
        }

        $senderCompanyId = $user->company_id;

        $receiverCompanyId = $request->receiver_company_id;
        if (!$receiverCompanyId) {
            if ($inventory->company_id !== $senderCompanyId) {
                $receiverCompanyId = $inventory->company_id;
            } else {
                $match = BuyerMatch::where('inventory_id', $inventory->id)->first();
                $receiverCompanyId = $match?->buyer_company_id;
            }
        }

        if (!$receiverCompanyId) {
            return $this->errorResponse('Receiver company must be specified for this negotiation offer.', null, 422);
        }

        $qty = (int) $request->offered_quantity;
        $unitPrice = (float) $request->offered_unit_price;
        $totalVal = round($qty * $unitPrice, 2);

        $offer = Offer::create([
            'user_id' => $user->id,
            'inventory_id' => $inventory->id,
            'sender_company_id' => $senderCompanyId,
            'receiver_company_id' => $receiverCompanyId,
            'buyer_match_id' => $request->buyer_match_id,
            'offered_quantity' => $qty,
            'offered_unit_price' => $unitPrice,
            'total_deal_value' => $totalVal,
            'status' => 'pending',
            'notes' => $request->notes ?: "Offer sent for {$qty} units of {$inventory->product_name}.",
        ]);

        Notification::create([
            'user_id' => $user->id,
            'company_id' => $senderCompanyId,
            'type' => 'buyer_interest',
            'severity' => 'info',
            'title' => 'Offer Dispatched',
            'message' => "Offer for {$qty} units sent. Total deal value: ₹" . number_format($totalVal) . ".",
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
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $offer = Offer::where('id', $id)
            ->where(function ($q) use ($user) {
                $q->where('receiver_company_id', $user->company_id)
                  ->orWhere('sender_company_id', $user->company_id);
            })
            ->with(['inventory', 'receiverCompany', 'senderCompany'])
            ->first();

        if (!$offer) {
            return $this->errorResponse('Offer not found or unauthorized access', null, 404);
        }

        if ($offer->status === 'accepted') {
            return $this->errorResponse('Offer has already been accepted and completed.', null, 400);
        }

        return DB::transaction(function () use ($offer, $user) {
            $offer->status = 'accepted';
            $offer->save();

            $buyerCompanyId = ($offer->inventory->company_id === $offer->sender_company_id)
                ? $offer->receiver_company_id
                : $offer->sender_company_id;

            // Execute atomic recovery transaction
            $result = $this->recoveryService->executeRecovery(
                $offer->inventory,
                'sell',
                $offer->offered_quantity,
                (float) $offer->total_deal_value,
                $buyerCompanyId,
                "Accepted B2B Offer #{$offer->id}",
                $user->id
            );

            return $this->successResponse([
                'offer' => $offer->fresh(['receiverCompany', 'senderCompany', 'inventory']),
                'recovery' => $result,
            ], 'Offer accepted and transaction completed successfully');
        });
    }

    public function counterOffer(int $id, CounterOfferRequest $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $offer = Offer::where('id', $id)
            ->where(function ($q) use ($user) {
                $q->where('receiver_company_id', $user->company_id)
                  ->orWhere('sender_company_id', $user->company_id);
            })
            ->with(['inventory', 'receiverCompany', 'senderCompany'])
            ->first();

        if (!$offer) {
            return $this->errorResponse('Offer not found or unauthorized access', null, 404);
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
            'user_id' => $user->id,
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
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $offer = Offer::where('id', $id)
            ->where(function ($q) use ($user) {
                $q->where('receiver_company_id', $user->company_id)
                  ->orWhere('sender_company_id', $user->company_id);
            })
            ->first();

        if (!$offer) {
            return $this->errorResponse('Offer not found or unauthorized access', null, 404);
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
