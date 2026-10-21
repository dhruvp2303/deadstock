<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Company;
use App\Models\Inventory;
use App\Models\Offer;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiValidationAndTransactionTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Company $company;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        $this->company = Company::firstOrCreate(['name' => 'Primary Test Co'], ['industry' => 'Industrial']);
        $this->user = User::firstOrCreate(['email' => 'test-admin@test.com'], [
            'name' => 'Test Admin',
            'company_id' => $this->company->id,
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);
    }

    public function test_categories_endpoint_returns_success_envelope(): void
    {
        $response = $this->getJson('/api/v1/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => ['id', 'name', 'slug', 'default_decay_rate', 'is_active'],
                ],
            ])
            ->assertJson(['success' => true]);
    }

    public function test_warehouses_endpoint_returns_success_envelope(): void
    {
        Warehouse::firstOrCreate([
            'company_id' => $this->company->id,
            'name' => 'Test Warehouse',
        ], [
            'user_id' => $this->user->id,
            'city' => 'Mumbai',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')->getJson('/api/v1/warehouses');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => ['id', 'company_id', 'name', 'city'],
                ],
            ])
            ->assertJson(['success' => true]);
    }

    public function test_store_inventory_with_valid_data_and_relational_ids(): void
    {
        $category = Category::first();
        $warehouse = Warehouse::where('company_id', $this->company->id)->first() ?? Warehouse::create([
            'company_id' => $this->company->id,
            'user_id' => $this->user->id,
            'name' => 'Auto Hub',
            'city' => 'Mumbai',
        ]);

        $payload = [
            'company_id' => $this->company->id,
            'sku' => 'TEST-SKU-9901',
            'product_name' => 'High Grade Industrial Valve',
            'category_id' => $category->id,
            'warehouse_id' => $warehouse->id,
            'quantity' => 150,
            'unit_cost' => 450.00,
            'monthly_demand' => 5,
            'age_months' => 8,
            'material' => 'Stainless Steel 316',
            'dimensions' => '12x8x6 in',
        ];

        $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/v1/inventory', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'sku' => 'TEST-SKU-9901',
                    'quantity' => 150,
                    'category_id' => $category->id,
                    'warehouse_id' => $warehouse->id,
                ],
            ]);

        $this->assertDatabaseHas('inventories', [
            'sku' => 'TEST-SKU-9901',
            'category_id' => $category->id,
            'warehouse_id' => $warehouse->id,
            'category' => $category->name,
        ]);
    }

    public function test_store_inventory_rejects_foreign_company_warehouse(): void
    {
        $companyA = Company::first();
        $companyB = Company::create([
            'name' => 'Competitor Corp',
            'industry' => 'Automotive',
            'location_city' => 'Pune',
            'location_state' => 'MH',
        ]);

        $foreignWarehouse = Warehouse::create([
            'company_id' => $companyB->id,
            'name' => 'Foreign Warehouse B',
            'city' => 'Pune',
            'state' => 'MH',
        ]);

        $payload = [
            'company_id' => $companyA->id,
            'sku' => 'TEST-INVALID-WH',
            'product_name' => 'Invalid Warehouse Item',
            'category' => 'Industrial Equipment',
            'warehouse_id' => $foreignWarehouse->id,
            'quantity' => 10,
            'unit_cost' => 100.00,
        ];

        $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/v1/inventory', $payload);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['warehouse_id']);
    }

    public function test_update_inventory_recalculates_risk_and_logs_movement(): void
    {
        $inventory = Inventory::first();
        $originalQty = $inventory->quantity;
        $user = User::where('company_id', $inventory->company_id)->first() ?? User::factory()->create(['company_id' => $inventory->company_id]);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/v1/inventory/{$inventory->id}", [
            'quantity' => $originalQty + 50,
            'unit_cost' => $inventory->unit_cost,
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('inventory_movements', [
            'inventory_id' => $inventory->id,
            'movement_type' => 'adjusted',
            'quantity' => 50,
        ]);
    }

    public function test_send_and_counter_and_accept_offer_atomically(): void
    {
        $inventory = Inventory::first();
        $sellerCompany = $inventory->company;
        $buyerCompany = Company::where('id', '!=', $sellerCompany->id)->first() ?? Company::create(['name' => 'Buyer Co', 'industry' => 'Auto']);
        $sellerUser = User::where('company_id', $sellerCompany->id)->first() ?? User::factory()->create(['company_id' => $sellerCompany->id]);
        $buyerUser = User::where('company_id', $buyerCompany->id)->first() ?? User::factory()->create(['company_id' => $buyerCompany->id]);

        // 1. Send Offer
        $sendResponse = $this->actingAs($sellerUser, 'sanctum')->postJson('/api/v1/offers/send', [
            'inventory_id' => $inventory->id,
            'receiver_company_id' => $buyerCompany->id,
            'offered_quantity' => 20,
            'offered_unit_price' => 200.00,
            'notes' => 'Bulk purchase inquiry',
        ]);

        $sendResponse->assertStatus(201)
            ->assertJson(['success' => true]);

        $offerId = $sendResponse->json('data.id');

        // 2. Counter Offer
        $counterResponse = $this->actingAs($buyerUser, 'sanctum')->postJson("/api/v1/offers/{$offerId}/counter", [
            'counter_unit_price' => 190.00,
            'counter_quantity' => 20,
            'notes' => 'Targeting 190/unit',
        ]);

        $counterResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'status' => 'countered',
                    'offered_unit_price' => 190.00,
                    'total_deal_value' => 3800.00,
                ],
            ]);

        // 3. Accept Offer Atomically
        $initialStock = $inventory->fresh()->quantity;
        $acceptResponse = $this->actingAs($sellerUser, 'sanctum')->postJson("/api/v1/offers/{$offerId}/accept");

        $acceptResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'offer' => [
                        'id' => $offerId,
                        'status' => 'accepted',
                    ],
                ],
            ]);

        // Verify side effects: inventory decremented, transaction created, movement logged
        $updatedInventory = $inventory->fresh();
        $this->assertEquals($initialStock - 20, $updatedInventory->quantity);

        $this->assertDatabaseHas('transactions', [
            'inventory_id' => $inventory->id,
            'buyer_company_id' => $buyerCompany->id,
            'quantity' => 20,
            'status' => 'completed',
        ]);

        $this->assertDatabaseHas('inventory_movements', [
            'inventory_id' => $inventory->id,
            'movement_type' => 'sold',
            'quantity' => 20,
        ]);
    }

    public function test_execute_recovery_transaction_validates_stock_availability(): void
    {
        $inventory = Inventory::first();
        $user = User::where('company_id', $inventory->company_id)->first() ?? User::factory()->create(['company_id' => $inventory->company_id]);

        // Attempting to recover more than available stock should return 400
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/transactions/execute-recovery', [
            'inventory_id' => $inventory->id,
            'action_type' => 'sell',
            'quantity' => $inventory->quantity + 99999,
            'deal_amount' => 50000.00,
        ]);

        $response->assertStatus(400)
            ->assertJson(['success' => false]);
    }

    public function test_auth_registration_and_login_flow(): void
    {
        $registerPayload = [
            'name' => 'Arun Verma',
            'email' => 'arun.verma@example.com',
            'password' => 'SecurePass123!',
            'company_name' => 'Verma Industrial Logistics',
            'industry' => 'Logistics',
        ];

        $registerRes = $this->postJson('/api/v1/auth/register', $registerPayload);
        $registerRes->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['user', 'token', 'token_type'],
            ]);

        $loginRes = $this->postJson('/api/v1/auth/login', [
            'email' => 'arun.verma@example.com',
            'password' => 'SecurePass123!',
        ]);

        $loginRes->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['user', 'token'],
            ]);
    }
}
