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
use App\Http\Controllers\Api\v1\PaymentController;
use App\Http\Controllers\Api\v1\RecoveryController;
use App\Http\Controllers\Api\v1\SustainabilityController;
use App\Http\Controllers\Api\v1\TransactionController;
use App\Http\Controllers\Api\v1\WarehouseController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // -------------------------------------------------------------
    // Public Endpoints (Authentication, Contact & Public Reference)
    // -------------------------------------------------------------
    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:20,1');
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:20,1');
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:10,1');
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:10,1');
    Route::post('/auth/demo-session', [AuthController::class, 'demoSession'])->middleware('throttle:30,1');

    // Public Master Reference Categories (Without inventory data leakage)
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{identifier}', [CategoryController::class, 'show']);

    // Public Contact, Support & Grievance Redressal
    Route::post('/contact/demo-request', [ContactController::class, 'requestDemo'])->middleware('throttle:15,1');
    Route::post('/support/ticket', [ContactController::class, 'submitTicket'])->middleware('throttle:15,1');
    Route::get('/support/grievance-info', [ContactController::class, 'grievanceInfo']);

    // Public Payment Gateway Webhooks
    Route::post('/payments/webhook', [PaymentController::class, 'webhook']);

    // -------------------------------------------------------------
    // Strictly Scoped Authenticated Tenant Endpoints (auth:sanctum)
    // -------------------------------------------------------------
    Route::middleware('auth:sanctum')->group(function () {
        // Authenticated Session & Profile
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Warehouses (Multi-depot strictly tenant scoped)
        Route::get('/warehouses', [WarehouseController::class, 'index']);
        Route::get('/warehouses/{id}', [WarehouseController::class, 'show']);
        Route::post('/warehouses', [WarehouseController::class, 'store']);

        // Inventory Management (Strictly scoped to auth user/tenant)
        Route::get('/inventory', [InventoryController::class, 'index']);
        Route::get('/inventory/{identifier}', [InventoryController::class, 'show']);
        Route::post('/inventory', [InventoryController::class, 'store']);
        Route::put('/inventory/{identifier}', [InventoryController::class, 'update']);
        Route::delete('/inventory/{identifier}', [InventoryController::class, 'destroy']);
        Route::post('/inventory/{identifier}/restore', [InventoryController::class, 'restore']);
        Route::post('/inventory/import', [InventoryController::class, 'import']);

        // Buyer Matches
        Route::get('/matches', [BuyerMatchController::class, 'index']);
        Route::get('/matches/{identifier}', [BuyerMatchController::class, 'matchesForInventory']);

        // Marketplace (Isolated between live demo sandbox and real production enterprises)
        Route::get('/marketplace/listings', [MarketplaceController::class, 'index']);
        Route::post('/marketplace/listings', [MarketplaceController::class, 'store']);

        // Recovery Strategies
        Route::get('/recovery/summary', [RecoveryController::class, 'summary']);
        Route::get('/recovery/product/{sku}', [RecoveryController::class, 'strategiesForProduct']);

        // Transactions & Recovery Deals
        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::post('/transactions/execute-recovery', [TransactionController::class, 'executeRecovery']);

        // Inbound & Outbound Offers
        Route::get('/offers', [OfferController::class, 'index']);
        Route::post('/offers/send', [OfferController::class, 'sendOffer']);
        Route::post('/offers/{id}/accept', [OfferController::class, 'acceptOffer']);
        Route::post('/offers/{id}/counter', [OfferController::class, 'counterOffer']);
        Route::post('/offers/{id}/reject', [OfferController::class, 'rejectOffer']);

        // Operations Dashboard, Analytics & Circular Sustainability
        Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
        Route::get('/analytics/overview', [AnalyticsController::class, 'overview']);
        Route::get('/sustainability/metrics', [SustainabilityController::class, 'metrics']);

        // Conversational AI Assistant & Notifications
        Route::post('/ai/ask', [AIServiceController::class, 'ask']);
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

        // Payments
        Route::post('/payments/create-order', [PaymentController::class, 'createOrder'])->middleware('throttle:30,1');
        Route::post('/payments/verify', [PaymentController::class, 'verify'])->middleware('throttle:30,1');
    });
});
