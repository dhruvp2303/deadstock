<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Company;
use App\Models\Inventory;
use App\Models\InventoryMovement;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $abc = Company::where('name', 'ABC Plastics')->first();
        if (!$abc) return;

        $getCat = function($name) {
            return Category::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'default_decay_rate' => 0.05, 'description' => $name]
            )->id;
        };

        $getWh = function($name, $companyId) {
            return Warehouse::firstOrCreate(
                ['company_id' => $companyId, 'name' => $name],
                ['city' => 'Hyderabad', 'state' => 'Telangana', 'country' => 'India', 'capacity_sqft' => 35000]
            )->id;
        };

        $p1 = Inventory::create([
            'company_id' => $abc->id,
            'category_id' => $getCat('Connectors & Moldings'),
            'warehouse_id' => $getWh('Hyderabad Warehouse A-14', $abc->id),
            'sku' => 'PC2048',
            'product_name' => 'Plastic Connector 20mm',
            'category' => 'Connectors & Moldings',
            'material' => 'Polycarbonate / High Impact Polymer',
            'dimensions' => '20mm x 15mm x 12mm',
            'description' => 'Precision injection molded 20mm industrial plastic connector for wiring harnesses and control enclosures.',
            'quantity' => 4500,
            'unit_cost' => 40.00,
            'current_value' => 180000.00,
            'selling_price' => 38.00,
            'condition' => 'Factory Surplus / Grade A',
            'warehouse_location' => 'Hyderabad Warehouse A-14',
            'age_months' => 11,
            'last_sold_date' => now()->subMonths(3),
            'last_movement_date' => now()->subDays(45),
            'monthly_demand' => 1100,
            'risk_score' => 87.00,
            'risk_level' => 'HIGH',
            'estimated_loss' => 180000.00,
            'estimated_recovery' => 390000.00,
            'recommended_action' => 'Find Buyer',
            'ai_explanation' => 'Sales have declined 32% over the last 90 days while inventory remains 3.2x higher than expected demand. At the current sales velocity, approximately 30 months of stock remains.',
            'demand_forecast_history' => [24, 20, 18, 17, 16, 12, 10, 9],
            'status' => 'active',
        ]);

        InventoryMovement::create([
            'inventory_id' => $p1->id,
            'movement_type' => 'added',
            'quantity' => 4500,
            'source_location' => 'Production Line B',
            'destination_location' => 'Hyderabad Warehouse A-14',
            'reference' => 'BATCH-PC-2025-08',
            'notes' => 'Customer cancelled batch order due to design change.',
        ]);

        $p2 = Inventory::create([
            'company_id' => $abc->id,
            'category_id' => $getCat('Hardware & Fasteners'),
            'warehouse_id' => $getWh('Hyderabad Warehouse B-03', $abc->id),
            'sku' => 'SBM8-22',
            'product_name' => 'Steel Bolt M8 High Tensile',
            'category' => 'Hardware & Fasteners',
            'material' => 'Grade 8.8 Galvanized Steel',
            'dimensions' => 'M8 x 40mm',
            'description' => 'Industrial hex head high-tensile fasteners for machinery mounting.',
            'quantity' => 8200,
            'unit_cost' => 39.02,
            'current_value' => 320000.00,
            'selling_price' => 36.50,
            'condition' => 'Brand New Sealed',
            'warehouse_location' => 'Hyderabad Warehouse B-03',
            'age_months' => 5,
            'last_sold_date' => now()->subDays(12),
            'last_movement_date' => now()->subDays(12),
            'monthly_demand' => 3400,
            'risk_score' => 42.00,
            'risk_level' => 'MEDIUM',
            'estimated_loss' => 96000.00,
            'estimated_recovery' => 280000.00,
            'recommended_action' => 'Monitor',
            'ai_explanation' => 'Demand remains moderate with steady consumption. Turnover rate is acceptable for regular production cycles.',
            'demand_forecast_history' => [35, 36, 34, 33, 35, 34, 33, 34],
            'status' => 'active',
        ]);

        $p3 = Inventory::create([
            'company_id' => $abc->id,
            'category_id' => $getCat('Electronics & Controls'),
            'warehouse_id' => $getWh('Hyderabad Warehouse ESD-02', $abc->id),
            'sku' => 'PCB-401',
            'product_name' => 'PCB Control Module v2',
            'category' => 'Electronics & Controls',
            'material' => 'FR4 Multi-layer SMD',
            'dimensions' => '85mm x 55mm',
            'description' => 'Automated logic controller motherboard with pre-soldered microcontroller subassembly.',
            'quantity' => 1200,
            'unit_cost' => 533.33,
            'current_value' => 640000.00,
            'selling_price' => 480.00,
            'condition' => 'Surplus Untested Revision',
            'warehouse_location' => 'Hyderabad Warehouse ESD-02',
            'age_months' => 14,
            'last_sold_date' => now()->subMonths(5),
            'last_movement_date' => now()->subMonths(5),
            'monthly_demand' => 480,
            'risk_score' => 94.00,
            'risk_level' => 'CRITICAL',
            'estimated_loss' => 640000.00,
            'estimated_recovery' => 520000.00,
            'recommended_action' => 'Urgent',
            'ai_explanation' => 'Firmware architecture deprecation risk is critical. Product is entering end-of-life status. Immediate liquidation recommended.',
            'demand_forecast_history' => [28, 22, 19, 14, 11, 7, 5, 3],
            'status' => 'active',
        ]);

        $p4 = Inventory::create([
            'company_id' => $abc->id,
            'category_id' => $getCat('Packaging & Logistics'),
            'warehouse_id' => $getWh('Hyderabad Yard Pallet Racks', $abc->id),
            'sku' => 'PKG-118',
            'product_name' => 'Heavy Duty Packaging Box 5-Ply',
            'category' => 'Packaging & Logistics',
            'material' => 'Corrugated Kraft Board 250GSM',
            'dimensions' => '400mm x 300mm x 250mm',
            'description' => 'High-burst strength corrugated export cartons with water-resistant coating.',
            'quantity' => 12000,
            'unit_cost' => 17.50,
            'current_value' => 210000.00,
            'selling_price' => 15.00,
            'condition' => 'New Bundled (100/pallet)',
            'warehouse_location' => 'Hyderabad Yard Pallet Racks',
            'age_months' => 8,
            'last_sold_date' => now()->subMonths(2),
            'last_movement_date' => now()->subMonths(2),
            'monthly_demand' => 5200,
            'risk_score' => 71.00,
            'risk_level' => 'HIGH',
            'estimated_loss' => 90000.00,
            'estimated_recovery' => 175000.00,
            'recommended_action' => 'Discount',
            'ai_explanation' => 'Seasonal holiday packaging backlog occupying high-footprint pallet positions.',
            'demand_forecast_history' => [40, 32, 28, 24, 20, 18, 15, 14],
            'status' => 'active',
        ]);

        Inventory::create([
            'company_id' => $abc->id,
            'category_id' => $getCat('Electrical & Cabling'),
            'warehouse_id' => $getWh('Hyderabad Warehouse C-09', $abc->id),
            'sku' => 'CAB-902',
            'product_name' => 'Industrial Shielded Cable 4-Core',
            'category' => 'Electrical & Cabling',
            'material' => 'Copper / PVC Insulated',
            'dimensions' => '50m roll',
            'description' => 'Heavy duty flexible multi-strand copper cable for factory automation.',
            'quantity' => 3500,
            'unit_cost' => 140.00,
            'current_value' => 490000.00,
            'selling_price' => 125.00,
            'condition' => 'Factory Spools',
            'warehouse_location' => 'Hyderabad Warehouse C-09',
            'age_months' => 9,
            'last_sold_date' => now()->subMonths(1),
            'monthly_demand' => 600,
            'risk_score' => 81.00,
            'risk_level' => 'HIGH',
            'estimated_loss' => 320000.00,
            'estimated_recovery' => 410000.00,
            'recommended_action' => 'Find Buyer',
            'ai_explanation' => 'Slow moving stock due to regional project completion.',
            'demand_forecast_history' => [30, 26, 22, 18, 15, 12, 10, 8],
            'status' => 'active',
        ]);
    }
}
