<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        $companyId = $user?->company_id;

        $query = Category::query();
        if ($companyId) {
            $query->withCount(['inventories' => function ($q) use ($companyId) {
                $q->where('company_id', $companyId);
            }]);
        } else {
            $query->withCount(['inventories' => function ($q) {
                $q->whereRaw('1 = 0');
            }]);
        }

        $categories = $query->orderBy('name')->get();

        return $this->successResponse($categories, 'Categories retrieved successfully');
    }

    public function show(int|string $identifier, Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        $companyId = $user?->company_id;

        $category = Category::where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->first();

        if (!$category) {
            return $this->errorResponse('Category not found', null, 404);
        }

        if ($companyId) {
            $category->load(['inventories' => function ($q) use ($companyId) {
                $q->where('company_id', $companyId);
            }]);
        } else {
            $category->setRelation('inventories', collect());
        }

        return $this->successResponse($category, 'Category retrieved successfully');
    }
}
