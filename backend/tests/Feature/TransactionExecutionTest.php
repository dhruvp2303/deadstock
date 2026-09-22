<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Inventory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionExecutionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_execute_recovery_transaction_decrements_stock_and_creates_records(): void
    {
        $inventory = Inventory::where('sku', 'PC2048')->firstOrFail();
        $initialQty = $inventory->quantity; // 4500
        $buyer = Company::where('name', 'ElectroTech Industries')->firstOrFail();

        $response = $this->postJson('/api/v1/transactions/execute-recovery', [
            'sku' => 'PC2048',
            'action_type' => 'sell',
            'quantity' => 3000,
            'deal_amount' => 240000.00,
            'buyer_company_id' => $buyer->id,
            'channel_notes' => 'Direct B2B Matched Sale to ElectroTech',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.updated_inventory.remaining_quantity', 1500)
            ->assertJsonPath('data.transaction.total_amount', "240000.00");

        $inventory->refresh();
        $this->assertEquals(1500, $inventory->quantity);
        $this->assertEquals(60000.00, (float) $inventory->current_value);

        // Verify transaction logged in DB
        $this->assertDatabaseHas('transactions', [
            'inventory_id' => $inventory->id,
            'quantity' => 3000,
            'total_amount' => 240000.00,
            'transaction_type' => 'sell',
        ]);

        // Verify movement logged in DB
        $this->assertDatabaseHas('inventory_movements', [
            'inventory_id' => $inventory->id,
            'movement_type' => 'sold',
            'quantity' => 3000,
        ]);
    }

    public function test_cannot_recover_more_than_available_quantity(): void
    {
        $response = $this->postJson('/api/v1/transactions/execute-recovery', [
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
        $response = $this->postJson('/api/v1/inventory/import', [
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
        $inventory = Inventory::where('sku', 'PC2048')->firstOrFail();
        $buyer = Company::where('name', 'Nova Components')->firstOrFail();

        $sendResponse = $this->postJson('/api/v1/offers/send', [
            'sku' => 'PC2048',
            'receiver_company_id' => $buyer->id,
            'offered_quantity' => 1000,
            'offered_unit_price' => 38.00,
            'notes' => 'Special surplus batch offer',
        ]);

        $sendResponse->assertStatus(201)
            ->assertJsonPath('success', true);

        $offerId = $sendResponse->json('data.id');

        $acceptResponse = $this->postJson("/api/v1/offers/{$offerId}/accept");
        $acceptResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        $inventory->refresh();
        $this->assertEquals(3500, $inventory->quantity);
    }
}
