<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\MarketplaceListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MarketplaceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MarketplaceListing::with('company')->where('status', 'active');

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
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formatted,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'units_available' => 'required|integer|min:1',
            'price_per_unit' => 'required|numeric|min:0.01',
            'location' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

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

        return response()->json([
            'success' => true,
            'message' => 'Marketplace listing published successfully',
            'data' => $listing,
        ], 201);
    }
}
