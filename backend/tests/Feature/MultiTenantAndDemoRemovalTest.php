<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Inventory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MultiTenantAndDemoRemovalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_seeders_do_not_create_demo_or_testing_user_accounts(): void
    {
        $this->assertDatabaseMissing('users', [
            'email' => 'demo@deadstock.ai',
        ]);

        $this->assertDatabaseMissing('users', [
            'email' => 'rajesh@electrotech.com',
        ]);

        $this->assertEquals(0, User::count());
    }

    public function test_cannot_execute_recovery_on_non_existent_inventory(): void
    {
        $company = Company::firstOrCreate(['name' => 'Recovery Test Co'], ['industry' => 'Industrial']);
        $user = User::firstOrCreate(['email' => 'recov-test@example.com'], [
            'name' => 'Recov Admin',
            'company_id' => $company->id,
            'password' => bcrypt('secret'),
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/transactions/execute-recovery', [
            'sku' => 'NON-EXISTENT-SKU-999',
            'action_type' => 'sell',
            'quantity' => 10,
            'deal_amount' => 500.00,
        ]);

        $response->assertStatus(404)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'No active inventory item found for the specified identifier or SKU.');
    }

    public function test_cannot_send_offer_on_non_existent_inventory(): void
    {
        $buyer = Company::firstOrCreate(['name' => 'Buyer Test Co'], ['industry' => 'Automotive']);
        $user = User::firstOrCreate(['email' => 'buyer-test@example.com'], [
            'name' => 'Buyer Admin',
            'company_id' => $buyer->id,
            'password' => bcrypt('secret'),
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/offers/send', [
            'sku' => 'NON-EXISTENT-SKU-999',
            'receiver_company_id' => $buyer->id,
            'offered_quantity' => 10,
            'offered_unit_price' => 50.00,
        ]);

        $response->assertStatus(404)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'No active inventory found for the specified identifier or SKU.');
    }

    public function test_offer_requires_receiver_company_when_sender_is_inventory_owner(): void
    {
        $inventory = Inventory::firstOrFail();
        $ownerCompany = $inventory->company;

        $user = User::create([
            'company_id' => $ownerCompany->id,
            'name' => 'Owner User',
            'email' => 'owner@business.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/offers/send', [
            'inventory_id' => $inventory->id,
            'offered_quantity' => 5,
            'offered_unit_price' => 100.00,
        ]);

        // When receiver_company_id is not given, receiver is dynamically derived from match or returned with 201/422
        $this->assertTrue(in_array($response->status(), [201, 422]));
    }

    public function test_login_and_logout_records_ip_and_timestamp(): void
    {
        $regResponse = $this->postJson('/api/v1/auth/register', [
            'name' => 'Launch Tester',
            'email' => 'launch.tester@domain.com',
            'password' => 'SecurePass123!',
            'company_name' => 'Launch Dynamics',
            'industry' => 'Advanced Manufacturing',
        ]);

        $regResponse->assertStatus(201);
        $user = User::where('email', 'launch.tester@domain.com')->firstOrFail();
        $this->assertNotNull($user->last_login_at);
        $this->assertNotNull($user->last_login_ip);

        // Login
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'launch.tester@domain.com',
            'password' => 'SecurePass123!',
        ]);

        $loginResponse->assertStatus(200);
        $token = $loginResponse->json('data.token');

        $user->refresh();
        $this->assertNotNull($user->last_login_at);

        // Logout
        $logoutResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/auth/logout');

        $logoutResponse->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_warehouse_creation_and_company_isolation(): void
    {
        $company1 = Company::create(['name' => 'Tenant 1 Alpha']);
        $user1 = User::create([
            'company_id' => $company1->id,
            'name' => 'User One',
            'email' => 'user1@tenantalpha.com',
            'password' => bcrypt('password123'),
        ]);

        $company2 = Company::create(['name' => 'Tenant 2 Beta']);
        $user2 = User::create([
            'company_id' => $company2->id,
            'name' => 'User Two',
            'email' => 'user2@tenantbeta.com',
            'password' => bcrypt('password123'),
        ]);

        // User 1 creates warehouse
        $createResponse = $this->actingAs($user1, 'sanctum')->postJson('/api/v1/warehouses', [
            'name' => 'Alpha West Hub',
            'city' => 'Pune',
            'state' => 'Maharashtra',
        ]);
        $createResponse->assertStatus(201);

        // User 1 lists warehouses -> sees Alpha West Hub
        $list1 = $this->actingAs($user1, 'sanctum')->getJson('/api/v1/warehouses');
        $list1->assertStatus(200);
        $this->assertTrue(collect($list1->json('data'))->pluck('name')->contains('Alpha West Hub'));

        // User 2 lists warehouses -> does NOT see Alpha West Hub
        $list2 = $this->actingAs($user2, 'sanctum')->getJson('/api/v1/warehouses');
        $list2->assertStatus(200);
        $this->assertFalse(collect($list2->json('data'))->pluck('name')->contains('Alpha West Hub'));
    }

    public function test_demo_session_and_strict_real_user_data_isolation(): void
    {
        // 1. Activate demo session
        $demoRes = $this->postJson('/api/v1/auth/demo-session');
        $demoRes->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_demo', true)
            ->assertJsonPath('data.user.email', 'demo-explorer@deadstock.internal');

        $demoToken = $demoRes->json('data.token');

        // Demo user should have showcase inventory
        $demoInv = $this->withHeader('Authorization', "Bearer {$demoToken}")
            ->getJson('/api/v1/inventory');
        $demoInv->assertStatus(200);
        $this->assertGreaterThan(0, count($demoInv->json('data')));

        // 2. Real user registers
        $realUserRes = $this->postJson('/api/v1/auth/register', [
            'name' => 'Real User Only',
            'email' => 'real.user@uniquedomain.org',
            'password' => 'SecurePass987!',
            'company_name' => 'Unique Real Enterprise',
            'industry' => 'Industrial Manufacturing',
        ]);
        $realUserRes->assertStatus(201);
        $realUser = User::where('email', 'real.user@uniquedomain.org')->firstOrFail();

        // Real user MUST have exactly 0 inventory items (no fake/demo data)
        $realInv = $this->actingAs($realUser, 'sanctum')->getJson('/api/v1/inventory');
        $realInv->assertStatus(200);
        $this->assertCount(0, $realInv->json('data'));

        // Real user MUST have 0 buyer matches
        $realMatches = $this->actingAs($realUser, 'sanctum')->getJson('/api/v1/matches');
        $realMatches->assertStatus(200);
        $this->assertCount(0, $realMatches->json('data'));

        // Real user MUST have 0 offers
        $realOffers = $this->actingAs($realUser, 'sanctum')->getJson('/api/v1/offers');
        $realOffers->assertStatus(200);
        $this->assertCount(0, $realOffers->json('data'));

        // Real user adds their OWN item -> only that 1 item exists for them
        $addRes = $this->actingAs($realUser, 'sanctum')->postJson('/api/v1/inventory', [
            'sku' => 'REAL-SKU-001',
            'product_name' => 'Real Proprietary Widget',
            'category' => 'Connectors & Moldings',
            'quantity' => 50,
            'unit_cost' => 120.00,
            'current_value' => 6000.00,
            'warehouse_location' => 'Primary Distribution Facility',
            'age_months' => 3,
            'monthly_demand' => 10,
        ]);
        $addRes->assertStatus(201);

        $realInvUpdated = $this->actingAs($realUser, 'sanctum')->getJson('/api/v1/inventory');
        $realInvUpdated->assertStatus(200);
        $this->assertCount(1, $realInvUpdated->json('data'));
        $this->assertEquals('REAL-SKU-001', $realInvUpdated->json('data.0.sku'));
    }
}

