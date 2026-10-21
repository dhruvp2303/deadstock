<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Inventory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PaymentAndSupportTest extends TestCase
{
    use RefreshDatabase;

    public function test_payment_order_creation(): void
    {
        $company = Company::create(['name' => 'Pay Test Co', 'industry' => 'Industrial']);
        $user = User::create([
            'name' => 'Pay User',
            'email' => 'pay@testco.com',
            'password' => Hash::make('password123'),
            'company_id' => $company->id,
            'role' => 'admin',
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/payments/create-order', [
            'type' => 'listing_fee',
            'amount' => 299,
            'currency' => 'INR',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.amount', 299)
            ->assertJsonPath('data.type', 'listing_fee');
    }

    public function test_payment_verification(): void
    {
        $company = Company::create(['name' => 'Pay Verify Co', 'industry' => 'Industrial']);
        $user = User::create([
            'name' => 'Pay Verify User',
            'email' => 'payverify@testco.com',
            'password' => Hash::make('password123'),
            'company_id' => $company->id,
            'role' => 'admin',
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/payments/verify', [
            'order_id' => 'order_ds_test123',
            'payment_id' => 'pay_test123',
            'type' => 'listing_fee',
            'amount' => 299,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'settled');
    }

    public function test_password_forgot_and_reset_flow(): void
    {
        $company = Company::create(['name' => 'Acme Corp', 'industry' => 'Industrial Equipment']);
        $user = User::create([
            'name' => 'John Doe',
            'email' => 'john@acmecorp.com',
            'password' => Hash::make('OldPassword123!'),
            'company_id' => $company->id,
            'role' => 'admin',
        ]);

        $forgotResponse = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'john@acmecorp.com',
        ]);

        $forgotResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        $token = $forgotResponse->json('data.reset_token');
        $this->assertNotEmpty($token);

        $resetResponse = $this->postJson('/api/v1/auth/reset-password', [
            'email' => 'john@acmecorp.com',
            'token' => $token,
            'password' => 'NewSecurePassword123!',
            'password_confirmation' => 'NewSecurePassword123!',
        ]);

        $resetResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        // Verify login works with new password
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'john@acmecorp.com',
            'password' => 'NewSecurePassword123!',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_support_ticket_submission(): void
    {
        $response = $this->postJson('/api/v1/support/ticket', [
            'name' => 'Jane Smith',
            'email' => 'jane@enterprisecorp.com',
            'subject' => 'Listing rebate clarification',
            'category' => 'billing_refund',
            'message' => 'Inquiring about how the ₹299 listing commitment fee rebate credit is applied upon deal completion.',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'received');
    }

    public function test_grievance_info_endpoint(): void
    {
        $response = $this->getJson('/api/v1/support/grievance-info');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.company_name', 'DeadStock Technologies Private Limited');
    }
}
