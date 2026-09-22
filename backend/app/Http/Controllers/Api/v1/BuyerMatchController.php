<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\BuyerMatch;
use App\Models\Inventory;
use App\Services\BuyerMatchingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BuyerMatchController extends Controller
{
    protected BuyerMatchingService $buyerService;

    public function __construct(BuyerMatchingService $buyerService)
    {
        $this->buyerService = $buyerService;
    }

    public function index(Request $request): JsonResponse
    {
        $matches = BuyerMatch::with(['inventory', 'buyerCompany'])
            ->orderByDesc('overall_match_score')
            ->get();

        $formatted = $matches->map(function ($m) {
            return [
                'id' => $m->id,
                'name' => $m->buyerCompany?->name ?: 'Industrial Partner',
                'location' => $m->buyerCompany?->location_city ?: 'India',
                'match' => round($m->overall_match_score, 0) . '%',
                'match_score' => $m->overall_match_score,
                'units' => number_format($m->required_units) . ' units',
                'required_units' => $m->required_units,
                'value' => '₹' . ($m->potential_deal_value >= 100000 ? round($m->potential_deal_value / 100000, 1) . 'L' : number_format($m->potential_deal_value)),
                'potential_deal_value' => $m->potential_deal_value,
                'note' => $m->notes,
                'tags' => $m->compatibility_tags ?: ['Material', 'Dimensions', 'Category'],
                'breakdown' => [
                    'product_compatibility' => $m->product_compatibility . '%',
                    'quantity_compatibility' => $m->quantity_compatibility . '%',
                    'industry' => $m->industry_compatibility . '%',
                    'location' => $m->location_compatibility . '%',
                    'price' => $m->price_compatibility . '%',
                    'overall' => round($m->overall_match_score, 0) . '%',
                ],
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formatted,
        ]);
    }

    public function matchesForInventory(string $identifier): JsonResponse
    {
        $inventory = Inventory::where('id', $identifier)
            ->orWhere('sku', $identifier)
            ->first();

        if (!$inventory) {
            return response()->json([
                'success' => false,
                'message' => 'Inventory not found',
            ], 404);
        }

        $matches = $this->buyerService->findMatchesForInventory($inventory);

        return response()->json([
            'success' => true,
            'inventory' => $inventory->only(['id', 'sku', 'product_name', 'quantity', 'current_value']),
            'data' => $matches,
        ]);
    }
}
