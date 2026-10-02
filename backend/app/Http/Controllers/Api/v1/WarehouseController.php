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
        $companyId = $request->user()?->company_id ?: 1;

        $warehouses = Warehouse::where('company_id', $companyId)
            ->withCount('inventories')
            ->orderBy('name')
            ->get();

        return $this->successResponse($warehouses, 'Warehouses retrieved successfully');
    }

    public function show(int $id, Request $request): JsonResponse
    {
        $companyId = $request->user()?->company_id ?: 1;

        $warehouse = Warehouse::where('id', $id)
            ->where('company_id', $companyId)
            ->with('inventories')
            ->first();

        if (!$warehouse) {
            return $this->errorResponse('Warehouse not found', null, 404);
        }

        return $this->successResponse($warehouse, 'Warehouse retrieved successfully');
    }
}
