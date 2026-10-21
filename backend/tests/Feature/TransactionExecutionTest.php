<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Inventory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionExecutionTest extends TestCase
{
    use RefreshDatabase;

    protected Company $sellerCompany;
    protected Company $buyerCompany;
    protected Company $novaBuyerCompany;
    protected Inventory $inventory;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->sellerCompany = Company::create([
            'name' => 'Test Seller Corp',
            'industry' => 'Industrial Parts',
        ]);

        $this->buyerCompany = Company::create([
            'name' => 'ElectroTech Industries',
            'industry' => 'Industrial Automation',
        ]);

        $this->novaBuyerCompany = Company::create([
            'name' => 'Nova Components',
            'industry' => 'Electronics',
        ]);

        $this->user = User::create([
            'company_id' => $this->sellerCompany->id,
            'name' => 'Test Admin',
            'email' => 'admin@testseller.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $this->inventory = Inventory::create([
            'company_id' => $this->sellerCompany->id,
            'sku' => 'PC2048',
            'product_name' => 'Polycarbonate Optical Grade Sheet',
            'category' => 'Polymers',
            'quantity' => 4500,
            'unit_cost' => 40.00,
            'current_value' => 180000.00,
            'monthly_demand' => 50,
            'age_months' => 9,
            'risk_level' => 'HIGH',
            'risk_score' => 85.00,
        ]);
    }

    public function test_execute_recovery_transaction_decrements_stock_and_creates_records(): void
    {
        $response = $this->actingAs($this->user)->postJson('/api/v1/transactions/execute-recovery', [
            'sku' => 'PC2048',
            'action_type' => 'sell',
            'quantity' => 3000,
            'deal_amount' => 240000.00,
            'buyer_company_id' => $this->buyerCompany->id,
            'channel_notes' => 'Direct B2B Matched Sale to ElectroTech',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.updated_inventory.remaining_quantity', 1500)
            ->assertJsonPath('data.transaction.total_amount', "240000.00");

        $this->inventory->refresh();
        $this->assertEquals(1500, $this->inventory->quantity);
        $this->assertEquals(60000.00, (float) $this->inventory->current_value);

        // Verify transaction logged in DB
        $this->assertDatabaseHas('transactions', [
            'inventory_id' => $this->inventory->id,
            'quantity' => 3000,
            'total_amount' => 240000.00,
            'transaction_type' => 'sell',
        ]);

        // Verify movement logged in DB
        $this->assertDatabaseHas('inventory_movements', [
            'inventory_id' => $this->inventory->id,
            'movement_type' => 'sold',
            'quantity' => 3000,
        ]);
    }

    public function test_cannot_recover_more_than_available_quantity(): void
    {
        $response = $this->actingAs($this->user)->postJson('/api/v1/transactions/execute-recovery', [
            'sku' => 'PC2048',
            'action_type' => 'sell',
            'quantity' => 10000, // exceeds 4500
            'deal_amount' => 500000.00,
        ]);

        $response->assertStatus(400)
            ->assertJsonPath('success', false);
    }

    public function test_bulk_inventory_import(): void
    {
        $response = $this->actingAs($this->user)->postJson('/api/v1/inventory/import', [
            'company_id' => $this->sellerCompany->id,
            'rows' => [
                [
                    'sku' => 'TEST-BULK-01',
                    'product_name' => 'High Voltage Insulator',
                    'category' => 'Electrical',
                    'quantity' => 500,
                    'unit_cost' => 120.00,
                    'monthly_demand' => 15,
                    'age_months' => 12,
                ],
                [
                    'sku' => 'TEST-BULK-02',
                    'product_name' => 'Aluminum Extrusion Bar',
                    'category' => 'Raw Materials',
                    'quantity' => 1200,
                    'unit_cost' => 80.00,
                    'monthly_demand' => 200,
                    'age_months' => 4,
                ]
            ]
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('summary.imported_count', 2);

        $this->assertDatabaseHas('inventories', [
            'sku' => 'TEST-BULK-01',
            'quantity' => 500,
        ]);
    }

    public function test_send_and_accept_offer(): void
    {
        $sendResponse = $this->actingAs($this->user)->postJson('/api/v1/offers/send', [
            'sku' => 'PC2048',
            'receiver_company_id' => $this->novaBuyerCompany->id,
            'offered_quantity' => 1000,
            'offered_unit_price' => 38.00,
            'notes' => 'Special surplus batch offer',
        ]);

        $sendResponse->assertStatus(201)
            ->assertJsonPath('success', true);

        $offerId = $sendResponse->json('data.id');

        $acceptResponse = $this->actingAs($this->user)->postJson("/api/v1/offers/{$offerId}/accept");
        $acceptResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->inventory->refresh();
        $this->assertEquals(3500, $this->inventory->quantity);
    }
}
