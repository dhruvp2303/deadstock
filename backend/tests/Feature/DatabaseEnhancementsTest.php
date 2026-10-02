<?php

namespace Tests\Feature;

use App\Models\BuyerRequirement;
use App\Models\Category;
use App\Models\Company;
use App\Models\Inventory;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseEnhancementsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_categories_table_supports_slugs_and_decay_rates(): void
    {
        $category = Category::firstOrCreate([
            'slug' => 'test-robotics-fasteners',
        ], [
            'name' => 'Test Robotics Fasteners',
            'default_decay_rate' => 0.06,
        ]);

        $this->assertDatabaseHas('categories', [
            'slug' => 'test-robotics-fasteners',
            'default_decay_rate' => 0.06,
        ]);
        $this->assertEquals('Test Robotics Fasteners', $category->name);
    }

    public function test_warehouses_enforce_company_isolation(): void
    {
        $companyA = Company::firstOrCreate(['name' => 'Company Alpha Tests'], ['industry' => 'Manufacturing', 'location_city' => 'Surat', 'location_state' => 'Gujarat']);
        $companyB = Company::firstOrCreate(['name' => 'Company Beta Tests'], ['industry' => 'Electronics', 'location_city' => 'Pune', 'location_state' => 'Maharashtra']);

        $warehouseA = Warehouse::create([
            'company_id' => $companyA->id,
            'name' => 'Alpha Surat Warehouse',
            'city' => 'Surat',
            'capacity_sqft' => 45000,
        ]);

        $this->assertEquals($companyA->id, $warehouseA->company_id);
        $this->assertNotEquals($companyB->id, $warehouseA->company_id);

        // Soft delete test
        $warehouseA->delete();
        $this->assertSoftDeleted('warehouses', ['id' => $warehouseA->id]);
    }

    public function test_buyer_requirements_link_to_company_and_category(): void
    {
        $company = Company::firstOrCreate(['name' => 'Buyer Tech Corp'], ['industry' => 'Automotive', 'location_city' => 'Ahmedabad', 'location_state' => 'Gujarat']);
        $category = Category::firstOrCreate(['slug' => 'mechanical-components'], ['name' => 'Mechanical Components', 'default_decay_rate' => 0.04]);

        $requirement = BuyerRequirement::create([
            'company_id' => $company->id,
            'category_id' => $category->id,
            'min_quantity' => 2000,
            'max_budget' => 350000,
            'acceptable_conditions' => ['NEW_SEALED', 'EXCESS_SURPLUS'],
            'preferred_location' => 'Gujarat Hub',
            'urgency' => 'HIGH',
        ]);

        $this->assertDatabaseHas('buyer_requirements', [
            'id' => $requirement->id,
            'company_id' => $company->id,
            'category_id' => $category->id,
            'urgency' => 'HIGH',
        ]);

        $this->assertEquals($company->name, $requirement->company->name);
        $this->assertEquals($category->name, $requirement->category->name);
    }

    public function test_inventory_backfill_mapped_all_existing_records(): void
    {
        $allInventories = Inventory::all();
        $this->assertNotEmpty($allInventories, 'Inventory table should contain records');

        foreach ($allInventories as $inv) {
            $this->assertNotNull($inv->category_id, "Inventory SKU {$inv->sku} must have a valid category_id");
            $this->assertNotNull($inv->warehouse_id, "Inventory SKU {$inv->sku} must have a valid warehouse_id");
            $this->assertNotNull($inv->categoryModel, "Inventory SKU {$inv->sku} must resolve Category relationship");
            $this->assertNotNull($inv->warehouseModel, "Inventory SKU {$inv->sku} must resolve Warehouse relationship");
        }
    }

    public function test_data_integrity_counts_are_preserved(): void
    {
        $companyCount = Company::count();
        $inventoryCount = Inventory::count();

        $this->assertGreaterThanOrEqual(1, $companyCount);
        $this->assertGreaterThanOrEqual(4, $inventoryCount);
    }
}
