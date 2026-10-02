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
        $categories = Category::where('is_active', true)
            ->withCount('inventories')
            ->orderBy('name')
            ->get();

        return $this->successResponse($categories, 'Categories retrieved successfully');
    }

    public function show(int|string $identifier): JsonResponse
    {
        $category = Category::where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->with('inventories')
            ->first();

        if (!$category) {
            return $this->errorResponse('Category not found', null, 404);
        }

        return $this->successResponse($category, 'Category retrieved successfully');
    }
}
