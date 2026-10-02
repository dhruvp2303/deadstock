<?php

use App\Http\Controllers\Api\v1\AIServiceController;
use App\Http\Controllers\Api\v1\AnalyticsController;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\BuyerMatchController;
use App\Http\Controllers\Api\v1\CategoryController;
use App\Http\Controllers\Api\v1\ContactController;
use App\Http\Controllers\Api\v1\DashboardController;
use App\Http\Controllers\Api\v1\InventoryController;
use App\Http\Controllers\Api\v1\MarketplaceController;
use App\Http\Controllers\Api\v1\NotificationController;
use App\Http\Controllers\Api\v1\OfferController;
use App\Http\Controllers\Api\v1\RecoveryController;
use App\Http\Controllers\Api\v1\SustainabilityController;
use App\Http\Controllers\Api\v1\TransactionController;
use App\Http\Controllers\Api\v1\WarehouseController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Master Data (Categories & Warehouses)
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{identifier}', [CategoryController::class, 'show']);
    Route::get('/warehouses', [WarehouseController::class, 'index']);
    Route::get('/warehouses/{id}', [WarehouseController::class, 'show']);

    // Inventory Endpoints
    Route::get('/inventory/hero-demo', [InventoryController::class, 'heroDemo']);
    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::get('/inventory/{identifier}', [InventoryController::class, 'show']);
    Route::post('/inventory', [InventoryController::class, 'store']);
    Route::put('/inventory/{identifier}', [InventoryController::class, 'update']);
    Route::delete('/inventory/{identifier}', [InventoryController::class, 'destroy']);
    Route::post('/inventory/{identifier}/restore', [InventoryController::class, 'restore']);
    Route::post('/inventory/import', [InventoryController::class, 'import']);

    // Matches
    Route::get('/matches', [BuyerMatchController::class, 'index']);
    Route::get('/matches/{identifier}', [BuyerMatchController::class, 'matchesForInventory']);

    // Marketplace Listings
    Route::get('/marketplace/listings', [MarketplaceController::class, 'index']);
    Route::post('/marketplace/listings', [MarketplaceController::class, 'store']);

    // Recovery Strategies & Summary
    Route::get('/recovery/summary', [RecoveryController::class, 'summary']);
    Route::get('/recovery/product/{sku}', [RecoveryController::class, 'strategiesForProduct']);

    // Transactions & Recovery Deals
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions/execute-recovery', [TransactionController::class, 'executeRecovery']);

    // Offers & B2B Negotiations
    Route::get('/offers', [OfferController::class, 'index']);
    Route::post('/offers/send', [OfferController::class, 'sendOffer']);
    Route::post('/offers/{id}/accept', [OfferController::class, 'acceptOffer']);
    Route::post('/offers/{id}/counter', [OfferController::class, 'counterOffer']);
    Route::post('/offers/{id}/reject', [OfferController::class, 'rejectOffer']);

    // Dashboards, Analytics & Sustainability
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('/analytics/overview', [AnalyticsController::class, 'overview']);
    Route::get('/sustainability/metrics', [SustainabilityController::class, 'metrics']);

    // AI Assistant & Notifications
    Route::post('/ai/ask', [AIServiceController::class, 'ask']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // Contact & Inquiries
    Route::post('/contact/demo-request', [ContactController::class, 'requestDemo']);

    // Authenticated Endpoints
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
    });
});
