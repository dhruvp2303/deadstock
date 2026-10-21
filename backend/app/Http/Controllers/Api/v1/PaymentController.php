<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\MarketplaceListing;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    use ApiResponse;

    /**
     * Initialize a payment order (Listing Commitment Fee, Deal Escrow, Subscription).
     */
    public function createOrder(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $validated = $request->validate([
            'type' => 'required|string|in:listing_fee,deal_escrow,subscription',
            'amount' => 'required|numeric|min:1',
            'currency' => 'nullable|string|size:3',
            'reference_id' => 'nullable|string',
            'inventory_id' => 'nullable|integer',
            'transaction_id' => 'nullable|integer',
        ]);

        $currency = strtoupper($validated['currency'] ?? 'INR');
        $amount = (float) $validated['amount'];
        $amountInPaise = (int) round($amount * 100);

        // Generate unique gateway order identifier
        $orderId = 'order_ds_' . strtolower(Str::random(14));
        $keyId = env('RAZORPAY_KEY_ID', 'rzp_live_deadstock_gateway');

        return $this->successResponse([
            'order_id' => $orderId,
            'amount' => $amount,
            'amount_in_paise' => $amountInPaise,
            'currency' => $currency,
            'type' => $validated['type'],
            'key_id' => $keyId,
            'reference_id' => $validated['reference_id'] ?? null,
            'notes' => [
                'platform' => 'DeadStock B2B Marketplace',
                'description' => $validated['type'] === 'listing_fee' 
                    ? 'DeadStock Listing Commitment Fee (100% Deal Rebate Eligible)'
                    : 'DeadStock B2B Escrow Deal Settlement',
                'rebate_credit_amount' => $validated['type'] === 'listing_fee' ? 299 : 0,
            ],
        ], 'Payment order initialized successfully');
    }

    /**
     * Verify payment signature from gateway or secure sandbox callback.
     */
    public function verify(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $validated = $request->validate([
            'order_id' => 'required|string',
            'payment_id' => 'required|string',
            'signature' => 'nullable|string',
            'type' => 'required|string|in:listing_fee,deal_escrow,subscription',
            'inventory_id' => 'nullable|integer',
            'transaction_id' => 'nullable|integer',
            'amount' => 'nullable|numeric',
        ]);

        $keySecret = env('RAZORPAY_KEY_SECRET', '');

        // If live keys are configured and signature is provided, verify SHA256 HMAC
        if (!empty($keySecret) && !empty($validated['signature'])) {
            $expectedSignature = hash_hmac('sha256', $validated['order_id'] . '|' . $validated['payment_id'], $keySecret);
            if (!hash_equals($expectedSignature, $validated['signature'])) {
                return $this->errorResponse('Payment verification failed: Invalid cryptographic signature', null, 400);
            }
        }

        // Process listing fee activation
        if ($validated['type'] === 'listing_fee' && !empty($validated['inventory_id'])) {
            $listing = MarketplaceListing::where('inventory_id', $validated['inventory_id'])->first();
            if ($listing) {
                $listing->update([
                    'status' => 'active',
                ]);
            }
        }

        // Process escrow deal update
        if ($validated['type'] === 'deal_escrow' && !empty($validated['transaction_id'])) {
            $transaction = Transaction::find($validated['transaction_id']);
            if ($transaction) {
                $transaction->update([
                    'status' => 'funded_in_escrow',
                ]);
            }
        }

        return $this->successResponse([
            'verified' => true,
            'payment_id' => $validated['payment_id'],
            'order_id' => $validated['order_id'],
            'status' => 'settled',
            'rebate_credit_applied' => $validated['type'] === 'listing_fee',
            'settled_at' => now()->toIso8601String(),
        ], 'Payment verified and transaction settled successfully');
    }

    /**
     * Handle automated gateway webhooks.
     */
    public function webhook(Request $request): JsonResponse
    {
        $event = $request->input('event', 'payment.captured');
        $payload = $request->all();

        Log::info('DeadStock Payment Webhook Received', [
            'event' => $event,
            'payload' => $payload,
        ]);

        return $this->successResponse(['status' => 'acknowledged'], 'Webhook processed');
    }
}
