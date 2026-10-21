<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\BuyerMatch;
use App\Models\Inventory;
use App\Services\BuyerMatchingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BuyerMatchController extends Controller
{
    use ApiResponse;

    protected BuyerMatchingService $buyerService;

    public function __construct(BuyerMatchingService $buyerService)
    {
        $this->buyerService = $buyerService;
    }

    public function index(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $query = BuyerMatch::whereHas('inventory', fn($q) => $q->where('company_id', $user->company_id))
            ->with(['inventory.categoryModel', 'inventory.warehouseModel', 'buyerCompany']);

        $matches = $query->orderByDesc('overall_match_score')->get();

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
                'tags' => is_array($m->compatibility_tags) ? $m->compatibility_tags : [],
                'breakdown' => [
                    'product_compatibility' => $m->product_compatibility . '%',
                    'quantity_compatibility' => $m->quantity_compatibility . '%',
                    'industry' => $m->industry_compatibility . '%',
                    'location' => $m->location_compatibility . '%',
                    'price' => $m->price_compatibility . '%',
                    'overall' => round($m->overall_match_score, 0) . '%',
                ],
                'buyer_company_id' => $m->buyer_company_id,
                'inventory_id' => $m->inventory_id,
                'inventory_sku' => $m->inventory?->sku,
                'inventory' => $m->inventory,
            ];
        });

        return $this->successResponse($formatted, 'Buyer matches retrieved successfully');
    }

    public function matchesForInventory(string $identifier): JsonResponse
    {
        $user = auth('sanctum')->user() ?? request()->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $inventory = Inventory::where('company_id', $user->company_id)
            ->where(function ($q) use ($identifier) {
                $q->where('id', $identifier)->orWhere('sku', $identifier);
            })
            ->with(['categoryModel', 'warehouseModel'])
            ->first();

        if (!$inventory) {
            return $this->errorResponse('Inventory item not found or unauthorized access', null, 404);
        }

        $matches = $this->buyerService->findMatchesForInventory($inventory);

        return $this->successResponse([
            'inventory' => $inventory->only(['id', 'sku', 'product_name', 'quantity', 'current_value', 'category', 'category_id', 'warehouse_id', 'warehouse_location']),
            'matches' => $matches,
        ], 'Matches for inventory retrieved successfully');
    }
}
