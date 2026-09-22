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
        $response = $this->getJson('/api/v1/dashboard/summary');

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
        $response = $this->getJson('/api/v1/inventory');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertNotEmpty($response->json('data'));

        // Test item details with recovery strategies
        $itemResponse = $this->getJson('/api/v1/inventory/PC2048');
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
        $response = $this->getJson('/api/v1/matches');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $firstMatch = $response->json('data.0');
        $this->assertNotNull($firstMatch);
        $this->assertArrayHasKey('breakdown', $firstMatch);
        $this->assertArrayHasKey('match', $firstMatch);
    }

    public function test_marketplace_listings_and_creation(): void
    {
        $response = $this->getJson('/api/v1/marketplace/listings');
        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $createResponse = $this->postJson('/api/v1/marketplace/listings', [
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
        $response = $this->postJson('/api/v1/ai/ask', [
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
}
