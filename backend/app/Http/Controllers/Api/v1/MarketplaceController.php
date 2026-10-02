<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarketplaceListingRequest;
use App\Http\Traits\ApiResponse;
use App\Models\MarketplaceListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MarketplaceController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = MarketplaceListing::with(['company', 'inventory.categoryModel', 'inventory.warehouseModel'])
            ->where('status', 'active');

        if ($request->has('search') && !empty($request->search)) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                  ->orWhere('category', 'like', "%{$s}%")
                  ->orWhere('location', 'like', "%{$s}%");
            });
        }

        if ($request->has('category') && !empty($request->category)) {
            $query->where('category', $request->category);
        }

        $listings = $query->orderByDesc('match_score')->get();

        $formatted = $listings->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'category' => $item->category,
                'units' => number_format($item->units_available) . ' ' . ($item->unit_label ?: 'units'),
                'units_available' => $item->units_available,
                'price' => '₹' . number_format($item->price_per_unit, 0) . '/' . ($item->unit_label ?: 'unit'),
                'price_per_unit' => $item->price_per_unit,
                'match' => round($item->match_score, 0) . '%',
                'match_score' => $item->match_score,
                'location' => $item->location ?: 'India',
                'action' => 'View Opportunity',
                'condition' => $item->condition,
                'seller_company' => $item->company?->name,
                'inventory_id' => $item->inventory_id,
            ];
        });

        return $this->successResponse($formatted, 'Marketplace listings retrieved successfully');
    }

    public function store(StoreMarketplaceListingRequest $request): JsonResponse
    {
        $companyId = $request->user()?->company_id ?: 1;

        $listing = MarketplaceListing::create([
            'company_id' => $companyId,
            'inventory_id' => $request->inventory_id,
            'title' => $request->title,
            'category' => $request->category,
            'description' => $request->description,
            'units_available' => $request->units_available,
            'price_per_unit' => $request->price_per_unit,
            'unit_label' => $request->unit_label ?: 'unit',
            'condition' => $request->condition ?: 'Surplus / Unused',
            'location' => $request->location,
            'match_score' => 88.0,
            'status' => 'active',
        ]);

        return $this->successResponse(
            $listing->load('company'),
            'Marketplace listing published successfully',
            201
        );
    }
}
