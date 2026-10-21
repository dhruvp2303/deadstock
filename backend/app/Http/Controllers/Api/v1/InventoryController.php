<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImportInventoryRequest;
use App\Http\Requests\StoreInventoryRequest;
use App\Http\Requests\UpdateInventoryRequest;
use App\Http\Traits\ApiResponse;
use App\Models\Category;
use App\Models\Company;
use App\Models\Inventory;
use App\Models\InventoryMovement;
use App\Models\Warehouse;
use App\Services\BuyerMatchingService;
use App\Services\InventoryService;
use App\Services\RecoveryService;
use App\Services\RiskAnalysisService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InventoryController extends Controller
{
    use ApiResponse;

    protected RiskAnalysisService $riskService;
    protected RecoveryService $recoveryService;
    protected BuyerMatchingService $buyerService;
    protected InventoryService $inventoryService;

    public function __construct(
        RiskAnalysisService $riskService,
        RecoveryService $recoveryService,
        BuyerMatchingService $buyerService,
        InventoryService $inventoryService
    ) {
        $this->riskService = $riskService;
        $this->recoveryService = $recoveryService;
        $this->buyerService = $buyerService;
        $this->inventoryService = $inventoryService;
    }

    public function index(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $query = Inventory::where('company_id', $user->company_id)->with(['company', 'categoryModel', 'warehouseModel']);

        if ($request->has('category') && !empty($request->category)) {
            $cat = $request->category;
            $query->where(function ($q) use ($cat) {
                $q->where('category', $cat)
                  ->orWhereHas('categoryModel', function ($cq) use ($cat) {
                      $cq->where('name', $cat)->orWhere('slug', $cat);
                  });
            });
        }

        if ($request->has('category_id') && !empty($request->category_id)) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('warehouse_id') && !empty($request->warehouse_id)) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        if ($request->has('risk_level') && !empty($request->risk_level)) {
            $query->where('risk_level', $request->risk_level);
        }

        if ($request->has('search') && !empty($request->search)) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('product_name', 'like', "%{$s}%")
                  ->orWhere('sku', 'like', "%{$s}%")
                  ->orWhere('category', 'like', "%{$s}%");
            });
        }

        $inventories = $query->orderByDesc('risk_score')->get();

        // Format for table
        $formatted = $inventories->map(function ($item) {
            $tone = match ($item->risk_level) {
                'CRITICAL' => 'red',
                'HIGH' => 'amber',
                'MEDIUM' => 'yellow',
                default => 'green',
            };

            // Parse forecast history cleanly without fallback dummy fixtures
            $rawForecast = $item->demand_forecast_history;
            $forecastArray = [];
            if (is_array($rawForecast)) {
                $forecastArray = array_map('floatval', $rawForecast);
            } elseif (is_string($rawForecast) && trim($rawForecast) !== '') {
                $forecastArray = array_map('floatval', preg_split('/\s+/', trim($rawForecast)));
            }

            return [
                'id' => $item->id,
                'product' => $item->product_name,
                'sku' => $item->sku,
                'qty' => number_format($item->quantity),
                'quantity' => $item->quantity,
                'value' => '₹' . ($item->current_value >= 100000 ? round($item->current_value / 100000, 1) . 'L' : number_format($item->current_value)),
                'current_value' => $item->current_value,
                'unit_cost' => $item->unit_cost,
                'age' => $item->age_months . ' mo',
                'age_months' => $item->age_months,
                'demand' => number_format($item->monthly_demand),
                'monthly_demand' => $item->monthly_demand,
                'risk' => round($item->risk_score, 0) . '%',
                'risk_score' => $item->risk_score,
                'risk_level' => $item->risk_level,
                'action' => $item->recommended_action ?: 'Find Buyer',
                'tone' => $tone,
                'category_id' => $item->category_id,
                'category' => $item->category ?: $item->categoryModel?->name,
                'warehouse_id' => $item->warehouse_id,
                'warehouse' => $item->warehouse_location ?: $item->warehouseModel?->name,
                'material' => $item->material,
                'dimensions' => $item->dimensions,
                'ai_explanation' => $item->ai_explanation,
                'forecast' => $forecastArray,
                'status' => $item->status,
                'category_details' => $item->categoryModel,
                'warehouse_details' => $item->warehouseModel,
            ];
        });

        return $this->successResponse($formatted, 'Inventory items retrieved successfully');
    }

    public function show(string $identifier): JsonResponse
    {
        $user = auth('sanctum')->user() ?? request()->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $inventory = Inventory::where('company_id', $user->company_id)
            ->where(function ($q) use ($identifier) {
                $q->where('id', $identifier)->orWhere('sku', $identifier);
            })
            ->with(['company', 'categoryModel', 'warehouseModel', 'movements.creator', 'buyerMatches.buyerCompany', 'recoveryActions', 'marketplaceListings'])
            ->first();

        if (!$inventory) {
            return $this->errorResponse('Inventory item not found or unauthorized access', null, 404);
        }

        $recoveryData = $this->recoveryService->getRecoveryStrategies($inventory);
        $matches = $this->buyerService->findMatchesForInventory($inventory);

        return $this->successResponse([
            'inventory' => $inventory,
            'recovery' => $recoveryData,
            'matches' => $matches,
        ], 'Inventory item details retrieved successfully');
    }

    public function store(StoreInventoryRequest $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Authenticated company session required to register inventory', null, 401);
        }

        $companyId = $user->company_id;
        $qty = (int) $request->quantity;
        $cost = (float) $request->unit_cost;
        $val = round($qty * $cost, 2);

        $inventory = new Inventory($request->validated());
        $inventory->company_id = $companyId;
        $inventory->user_id = $user->id;
        $inventory->current_value = $val;

        // Sync relational and legacy category fields
        if ($request->filled('category_id')) {
            $cat = Category::find($request->category_id);
            if ($cat && empty($inventory->category)) {
                $inventory->category = $cat->name;
            }
        } elseif ($request->filled('category')) {
            $cat = Category::where('name', $request->category)
                ->orWhere('slug', Str::slug($request->category))
                ->first();
            if ($cat) {
                $inventory->category_id = $cat->id;
            }
        }

        // Sync relational and legacy warehouse fields
        if ($request->filled('warehouse_id')) {
            $wh = Warehouse::where('company_id', $companyId)->find($request->warehouse_id);
            if ($wh && empty($inventory->warehouse_location)) {
                $inventory->warehouse_location = $wh->name;
            }
        } elseif ($request->filled('warehouse_location')) {
            $wh = Warehouse::where('company_id', $companyId)
                ->where('name', $request->warehouse_location)
                ->first();
            if ($wh) {
                $inventory->warehouse_id = $wh->id;
            }
        }

        // Auto-run risk analysis
        $riskResult = $this->riskService->analyze($inventory);
        $inventory->risk_score = $riskResult['risk_score'];
        $inventory->risk_level = $riskResult['risk_level'];
        $inventory->estimated_loss = $riskResult['estimated_loss'];
        $inventory->estimated_recovery = $riskResult['estimated_recovery'];
        $inventory->recommended_action = $riskResult['recommended_action'];
        $inventory->ai_explanation = $riskResult['ai_explanation'];
        $inventory->save();

        // Auto-compute buyer matches
        $this->buyerService->findMatchesForInventory($inventory);

        return $this->successResponse(
            $inventory->load(['buyerMatches', 'categoryModel', 'warehouseModel']),
            'Inventory item created and analyzed successfully',
            201
        );
    }

    public function update(int|string $identifier, UpdateInventoryRequest $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $inventory = Inventory::where('company_id', $user->company_id)
            ->where(function ($q) use ($identifier) {
                $q->where('id', $identifier)->orWhere('sku', $identifier);
            })
            ->first();

        if (!$inventory) {
            return $this->errorResponse('Inventory item not found or unauthorized access', null, 404);
        }

        $prevQty = $inventory->quantity;
        $companyId = $inventory->company_id;
        $inventory->fill($request->validated());
        $inventory->current_value = round($inventory->quantity * $inventory->unit_cost, 2);

        // Sync relational and legacy category fields
        if ($request->filled('category_id')) {
            $cat = Category::find($request->category_id);
            if ($cat && empty($request->category)) {
                $inventory->category = $cat->name;
            }
        } elseif ($request->filled('category')) {
            $cat = Category::where('name', $request->category)
                ->orWhere('slug', Str::slug($request->category))
                ->first();
            if ($cat) {
                $inventory->category_id = $cat->id;
            }
        }

        // Sync relational and legacy warehouse fields
        if ($request->filled('warehouse_id')) {
            $wh = Warehouse::where('company_id', $companyId)->find($request->warehouse_id);
            if ($wh && empty($request->warehouse_location)) {
                $inventory->warehouse_location = $wh->name;
            }
        } elseif ($request->filled('warehouse_location')) {
            $wh = Warehouse::where('company_id', $companyId)
                ->where('name', $request->warehouse_location)
                ->first();
            if ($wh) {
                $inventory->warehouse_id = $wh->id;
            }
        }

        // Re-analyze risk
        $riskResult = $this->riskService->analyze($inventory);
        $inventory->risk_score = $riskResult['risk_score'];
        $inventory->risk_level = $riskResult['risk_level'];
        $inventory->estimated_loss = $riskResult['estimated_loss'];
        $inventory->estimated_recovery = $riskResult['estimated_recovery'];
        $inventory->recommended_action = $riskResult['recommended_action'];
        $inventory->ai_explanation = $riskResult['ai_explanation'];
        $inventory->save();

        if ($request->has('quantity') && $request->quantity != $prevQty) {
            InventoryMovement::create([
                'inventory_id' => $inventory->id,
                'movement_type' => 'adjusted',
                'quantity' => abs($inventory->quantity - $prevQty),
                'source_location' => $inventory->warehouse_location ?: 'Warehouse',
                'destination_location' => 'Manual Adjustment',
                'reference' => 'ADJ-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4)),
                'notes' => "Quantity manually adjusted from {$prevQty} to {$inventory->quantity}.",
                'created_by' => $request->user()?->id,
            ]);
        }

        return $this->successResponse(
            $inventory->load(['categoryModel', 'warehouseModel']),
            'Inventory updated and re-analyzed successfully'
        );
    }

    public function destroy(int|string $identifier, Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $inventory = Inventory::where('company_id', $user->company_id)
            ->where(function ($q) use ($identifier) {
                $q->where('id', $identifier)->orWhere('sku', $identifier);
            })
            ->first();

        if (!$inventory) {
            return $this->errorResponse('Inventory item not found or unauthorized access', null, 404);
        }

        $inventory->status = 'archived';
        $inventory->save();

        InventoryMovement::create([
            'inventory_id' => $inventory->id,
            'movement_type' => 'adjusted',
            'quantity' => $inventory->quantity,
            'source_location' => $inventory->warehouse_location ?: 'Warehouse',
            'destination_location' => 'Archive Storage',
            'reference' => 'ARCH-' . date('Ymd'),
            'notes' => 'Inventory archived by operator.',
            'created_by' => $user->id,
        ]);

        return $this->successResponse(
            ['id' => $inventory->id, 'sku' => $inventory->sku, 'status' => 'archived'],
            "SKU {$inventory->sku} archived successfully."
        );
    }

    public function restore(int|string $identifier): JsonResponse
    {
        $user = auth('sanctum')->user() ?? request()->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $inventory = Inventory::where('company_id', $user->company_id)
            ->where(function ($q) use ($identifier) {
                $q->where('id', $identifier)->orWhere('sku', $identifier);
            })
            ->first();

        if (!$inventory) {
            return $this->errorResponse('Inventory item not found or unauthorized access', null, 404);
        }

        $inventory->status = 'active';
        $inventory->save();

        return $this->successResponse(
            $inventory->load(['categoryModel', 'warehouseModel']),
            "SKU {$inventory->sku} restored to active inventory."
        );
    }

    public function import(ImportInventoryRequest $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Authenticated company session required for import', null, 401);
        }

        $result = $this->inventoryService->importRows($request->rows, $user->company_id, $user->id);

        return response()->json($result, 201);
    }
}
