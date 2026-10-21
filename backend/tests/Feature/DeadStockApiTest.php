<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Inventory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeadStockApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_auth_registration_and_login(): void
    {
        $regResponse = $this->postJson('/api/v1/auth/register', [
            'name' => 'Test Founder',
            'email' => 'founder@newcorp.com',
            'password' => 'password123',
            'company_name' => 'New Corp Industries',
            'industry' => 'Automotive Parts',
        ]);

        $regResponse->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => ['user', 'token'],
            ]);

        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'founder@newcorp.com',
            'password' => 'password123',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_dashboard_summary_returns_aggregated_metrics(): void
    {
        $company = Company::firstOrCreate(['name' => 'Metrics Test Co'], ['industry' => 'Industrial']);
        $user = User::create([
            'name' => 'Metrics User',
            'email' => 'metrics-' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
            'company_id' => $company->id,
            'role' => 'admin',
        ]);
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/dashboard/summary');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'total_inventory_formatted',
                    'at_risk_formatted',
                    'dead_stock_formatted',
                    'recovered_formatted',
                    'risk_distribution',
                ],
            ]);
    }

    public function test_inventory_list_and_risk_analysis(): void
    {
        $company = Company::firstOrCreate(['name' => 'Test Corp'], ['industry' => 'Manufacturing']);
        $warehouse = \App\Models\Warehouse::firstOrCreate(
            ['company_id' => $company->id, 'name' => 'Main Test Hub'],
            ['city' => 'Mumbai', 'state' => 'MH', 'country' => 'India']
        );
        $user = User::create([
            'name' => 'Test Operator',
            'email' => 'operator-' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
            'company_id' => $company->id,
            'role' => 'admin',
        ]);

        $item = Inventory::create([
            'company_id' => $company->id,
            'sku' => 'PC2048',
            'product_name' => 'Plastic Connector 20mm',
            'category' => 'Mechanical Components',
            'warehouse_id' => $warehouse->id,
            'quantity' => 1000,
            'unit_cost' => 50,
            'current_value' => 50000,
            'status' => 'active',
            'risk_score' => 85,
            'risk_level' => 'CRITICAL',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/inventory');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertNotEmpty($response->json('data'));

        // Test item details with recovery strategies
        $itemResponse = $this->actingAs($user, 'sanctum')->getJson('/api/v1/inventory/' . $item->sku);
        $itemResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'inventory',
                    'recovery' => ['strategies'],
                    'matches',
                ],
            ]);
    }

    public function test_buyer_matching_returns_compatibility_breakdown(): void
    {
        $company = Company::firstOrCreate(['name' => 'Test Corp'], ['industry' => 'Manufacturing']);
        $user = User::create([
            'name' => 'Test Operator 2',
            'email' => 'operator2-' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
            'company_id' => $company->id,
            'role' => 'admin',
        ]);
        $buyerCompany = Company::create(['name' => 'Buyer Enterprise', 'industry' => 'Automotive']);

        $item = Inventory::create([
            'company_id' => $company->id,
            'sku' => 'MATCH-SKU-1',
            'product_name' => 'Microcontroller Board',
            'category' => 'Electronics & PCB',
            'quantity' => 500,
            'unit_cost' => 120,
            'current_value' => 60000,
            'status' => 'active',
            'risk_score' => 70,
            'risk_level' => 'HIGH',
        ]);

        \App\Models\BuyerMatch::create([
            'inventory_id' => $item->id,
            'buyer_company_id' => $buyerCompany->id,
            'overall_match_score' => 92,
            'required_units' => 500,
            'potential_deal_value' => 60000,
            'product_compatibility' => 95,
            'quantity_compatibility' => 90,
            'industry_compatibility' => 92,
            'location_compatibility' => 88,
            'price_compatibility' => 90,
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/matches');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $firstMatch = $response->json('data.0');
        $this->assertNotNull($firstMatch);
        $this->assertArrayHasKey('breakdown', $firstMatch);
        $this->assertArrayHasKey('match', $firstMatch);
    }

    public function test_marketplace_listings_and_creation(): void
    {
        $company = Company::firstOrCreate(['name' => 'Seller Enterprise'], ['industry' => 'Manufacturing']);
        $user = User::create([
            'name' => 'Seller User',
            'email' => 'seller-' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
            'company_id' => $company->id,
            'role' => 'admin',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/marketplace/listings');
        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $createResponse = $this->actingAs($user, 'sanctum')->postJson('/api/v1/marketplace/listings', [
            'title' => 'Surplus Industrial Relay Module',
            'category' => 'Electronics',
            'units_available' => 1500,
            'price_per_unit' => 65.00,
            'location' => 'Pune, Maharashtra',
        ]);

        $createResponse->assertStatus(201)
            ->assertJsonPath('success', true);
    }

    public function test_ai_service_ask_returns_structured_recommendation(): void
    {
        $company = Company::firstOrCreate(['name' => 'AI Test Co'], ['industry' => 'Industrial']);
        $user = User::create([
            'name' => 'AI Test User',
            'email' => 'ai-' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
            'company_id' => $company->id,
            'role' => 'admin',
        ]);
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/ai/ask', [
            'query' => 'Which inventory should I focus on this month?',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'query',
                'response',
                'intent',
                'data',
            ]);
    }

    public function test_contact_demo_request(): void
    {
        $response = $this->postJson('/api/v1/contact/demo-request', [
            'name' => 'Rajesh Sharma',
            'company' => 'Tata AutoComp',
            'work_email' => 'rajesh.s@tatacomp.com',
            'industry' => 'Automotive',
            'inventory_size' => '₹5Cr+',
            'message' => 'Interested in inventory risk reduction for idle assembly components.',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);
    }

    public function test_user_profile_update_and_password_change(): void
    {
        $regResponse = $this->postJson('/api/v1/auth/register', [
            'name' => 'Profile Test User',
            'email' => 'profile@testcorp.com',
            'password' => 'password123',
            'company_name' => 'Profile Test Corp',
            'industry' => 'Electronics',
            'phone' => '+91 99999 88888',
        ]);

        $regResponse->assertStatus(201);
        $token = $regResponse->json('data.token');

        // Test GET /auth/me
        $meResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/me');
        $meResponse->assertStatus(200)
            ->assertJsonPath('data.email', 'profile@testcorp.com');

        // Test PUT /auth/profile
        $updateResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson('/api/v1/auth/profile', [
                'name' => 'Updated Profile User',
                'phone' => '+91 77777 66666',
                'profile_image' => 'indigo',
                'company_name' => 'Updated Corp Name',
            ]);

        $updateResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Updated Profile User')
            ->assertJsonPath('data.phone', '+91 77777 66666')
            ->assertJsonPath('data.profile_image', 'indigo')
            ->assertJsonPath('data.company.name', 'Updated Corp Name');

        // Test POST /auth/change-password
        $pwResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/auth/change-password', [
                'current_password' => 'password123',
                'password' => 'newpassword456',
                'password_confirmation' => 'newpassword456',
            ]);

        $pwResponse->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}
