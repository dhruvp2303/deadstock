<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Warehouse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $warehouses = Warehouse::where('company_id', $user->company_id)
            ->withCount('inventories')
            ->orderBy('name')
            ->get();

        return $this->successResponse($warehouses, 'Warehouses retrieved successfully');
    }

    public function show(int $id, Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $warehouse = Warehouse::where('id', $id)
            ->where('company_id', $user->company_id)
            ->with('inventories')
            ->first();

        if (!$warehouse) {
            return $this->errorResponse('Warehouse not found', null, 404);
        }

        return $this->successResponse($warehouse, 'Warehouse retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'capacity_sqft' => 'nullable|integer|min:1',
            'contact_phone' => 'nullable|string|max:50',
        ]);

        $warehouse = Warehouse::create([
            'company_id' => $user->company_id,
            'user_id' => $user->id,
            'name' => $validated['name'],
            'city' => $validated['city'] ?? null,
            'state' => $validated['state'] ?? null,
            'country' => $validated['country'] ?? 'India',
            'capacity_sqft' => $validated['capacity_sqft'] ?? 25000,
            'contact_phone' => $validated['contact_phone'] ?? null,
        ]);

        return $this->successResponse($warehouse, 'Warehouse created successfully', 201);
    }
}
