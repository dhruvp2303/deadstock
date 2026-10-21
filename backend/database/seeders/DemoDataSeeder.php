<?php

namespace Database\Seeders;

use App\Models\BuyerMatch;
use App\Models\Category;
use App\Models\Company;
use App\Models\Inventory;
use App\Models\InventoryMovement;
use App\Models\MarketplaceListing;
use App\Models\Notification;
use App\Models\Offer;
use App\Models\RecoveryAction;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the comprehensive demo showcase database seeder.
     */
    public function run(): void
    {
        // 1. Ensure Demo Showcase Company & User
        $demoCompany = Company::firstOrCreate(
            ['name' => 'DeadStock Showcase Corp'],
            [
                'industry' => 'Industrial Automation & Discrete Manufacturing',
                'description' => 'Flagship discrete manufacturing & automated assembly enterprise demonstrating AI inventory recovery.',
                'location_city' => 'Mumbai',
                'location_state' => 'Maharashtra',
                'country' => 'India',
                'pincode' => '400072',
                'email' => 'ops@showcasecorp.in',
                'phone' => '+91 22 6123 4567',
                'website' => 'https://showcasecorp.in',
                'is_demo' => true,
            ]
        );
        $demoCompany->update(['is_demo' => true]);

        $demoUser = User::firstOrCreate(
            ['email' => 'demo-explorer@deadstock.internal'],
            [
                'company_id' => $demoCompany->id,
                'name' => 'Demo Explorer',
                'password' => Hash::make('DemoSecurePass2026!'),
                'role' => 'admin',
                'phone' => '+91 98765 00000',
                'is_demo' => true,
            ]
        );
        $demoUser->update(['is_demo' => true, 'company_id' => $demoCompany->id]);

        // 2. Categories
        $categoriesData = [
            ['name' => 'Electronics & Motherboards', 'slug' => 'electronics-motherboards', 'decay' => 0.08, 'desc' => 'PCBs, microcontrollers, SMD circuits, logic boards, and display modules.'],
            ['name' => 'Connectors & Moldings', 'slug' => 'connectors-moldings', 'decay' => 0.05, 'desc' => 'Injection molded connectors, terminal blocks, wiring harness fittings.'],
            ['name' => 'Automotive Rubber & Seals', 'slug' => 'automotive-rubber-seals', 'decay' => 0.06, 'desc' => 'EPDM profiles, extruded weatherstripping, viton O-rings, and oil seals.'],
            ['name' => 'Electrical & Cabling', 'slug' => 'electrical-cabling', 'decay' => 0.04, 'desc' => 'Shielded multicore copper cables, flex conduits, and power busbars.'],
            ['name' => 'Hardware & Fasteners', 'slug' => 'hardware-fasteners', 'decay' => 0.03, 'desc' => 'High-tensile Grade 8.8 & 10.9 hex bolts, anchor studs, and aerospace fasteners.'],
            ['name' => 'Packaging & Logistics', 'slug' => 'packaging-logistics', 'decay' => 0.04, 'desc' => '5-ply corrugated export cartons, pallet liners, and antistatic ESD bags.'],
            ['name' => 'Polymers & Resins', 'slug' => 'polymers-resins', 'decay' => 0.05, 'desc' => 'Virgin injection molding granules, virgin PP homopolymer, and masterbatches.'],
            ['name' => 'Pneumatics & Fluid Controls', 'slug' => 'pneumatics-fluid-controls', 'decay' => 0.04, 'desc' => 'Stainless solenoid valves, hydraulic couplings, and pneumatic actuators.'],
        ];

        $categories = [];
        foreach ($categoriesData as $cat) {
            $categories[$cat['name']] = Category::firstOrCreate(
                ['slug' => $cat['slug']],
                [
                    'name' => $cat['name'],
                    'default_decay_rate' => $cat['decay'],
                    'description' => $cat['desc'],
                ]
            );
        }

        // 3. Multi-Depot Warehouses for Demo Company
        $warehousesData = [
            ['name' => 'Mumbai Central Distribution Hub', 'city' => 'Mumbai', 'state' => 'Maharashtra', 'sqft' => 35000],
            ['name' => 'Pune Industrial Transit Depot', 'city' => 'Pune', 'state' => 'Maharashtra', 'sqft' => 18000],
            ['name' => 'Bengaluru Electronics Logistics Park', 'city' => 'Bengaluru', 'state' => 'Karnataka', 'sqft' => 25000],
            ['name' => 'NCR / Manesar Automotive Hub', 'city' => 'Gurugram', 'state' => 'Haryana', 'sqft' => 30000],
        ];

        $warehouses = [];
        foreach ($warehousesData as $wh) {
            $warehouses[$wh['name']] = Warehouse::firstOrCreate(
                ['company_id' => $demoCompany->id, 'name' => $wh['name']],
                [
                    'user_id' => $demoUser->id,
                    'city' => $wh['city'],
                    'state' => $wh['state'],
                    'country' => 'India',
                    'capacity_sqft' => $wh['sqft'],
                ]
            );
        }

        // 4. External Verified Buyer & Partner Companies
        $externalCompaniesData = [
            [
                'name' => 'ElectroTech Industries',
                'industry' => 'Industrial Automation & Electricals',
                'desc' => 'Leading supplier of automated control panels and electronic enclosure systems.',
                'city' => 'Ahmedabad', 'state' => 'Gujarat', 'pincode' => '380015',
                'email' => 'procurement@electrotech.com', 'phone' => '+91 79 2658 9012',
            ],
            [
                'name' => 'Nova Components',
                'industry' => 'Electronics & Robotics',
                'desc' => 'High-precision components supplier for EV powertrains and autonomous robotics hardware.',
                'city' => 'Bengaluru', 'state' => 'Karnataka', 'pincode' => '560100',
                'email' => 'sourcing@novacomponents.io', 'phone' => '+91 80 4123 7890',
            ],
            [
                'name' => 'Apex Controls & Retrofits',
                'industry' => 'Legacy Industrial Machinery',
                'desc' => 'Industrial replacement parts and smart retrofitting for legacy factory equipment.',
                'city' => 'Pune', 'state' => 'Maharashtra', 'pincode' => '411018',
                'email' => 'supply@apexcontrols.in', 'phone' => '+91 20 2747 5566',
            ],
            [
                'name' => 'Bharat Auto Assemblies',
                'industry' => 'Tier-1 Automotive OEM',
                'desc' => 'Tier-1 component supplier manufacturing wiring harnesses, door modules, and sub-assemblies.',
                'city' => 'Gurugram', 'state' => 'Haryana', 'pincode' => '122051',
                'email' => 'procurement@bharatauto.in', 'phone' => '+91 124 456 7890',
            ],
            [
                'name' => 'Nagpur Pack & Logistics',
                'industry' => 'Packaging & Distribution',
                'desc' => 'Corrugated packaging, bulk containers, and inter-state transit logistics.',
                'city' => 'Nagpur', 'state' => 'Maharashtra', 'pincode' => '440001',
                'email' => 'sales@nagpurpack.in', 'phone' => '+91 712 254 3210',
            ],
            [
                'name' => 'GreenPolymer Circular Recyclers',
                'industry' => 'Polymer Reprocessing & Circular Economy',
                'desc' => 'Certified post-industrial polymer regrind, compounding, and Scope-3 circular reprocessing.',
                'city' => 'Vapi', 'state' => 'Gujarat', 'pincode' => '396195',
                'email' => 'intake@greenpolymer.in', 'phone' => '+91 260 243 1122',
            ],
            [
                'name' => 'Gujarat Industrial Systems',
                'industry' => 'Heavy Engineering & Fabrication',
                'desc' => 'Heavy structural fabrication and industrial housing enclosures.',
                'city' => 'Surat', 'state' => 'Gujarat', 'pincode' => '395007',
                'email' => 'contact@gujaratindustrial.com', 'phone' => '+91 261 289 4433',
            ],
        ];

        $externalCompanies = [];
        foreach ($externalCompaniesData as $ec) {
            $comp = Company::firstOrCreate(
                ['name' => $ec['name']],
                [
                    'industry' => $ec['industry'],
                    'description' => $ec['desc'],
                    'location_city' => $ec['city'],
                    'location_state' => $ec['state'],
                    'country' => 'India',
                    'pincode' => $ec['pincode'],
                    'email' => $ec['email'],
                    'phone' => $ec['phone'],
                    'is_demo' => true,
                ]
            );
            $comp->update(['is_demo' => true]);
            $externalCompanies[$ec['name']] = $comp;
        }

        // 5. Showcase Inventory Dataset for Demo Company
        $inventoryItems = [
            [
                'sku' => 'PCB-401',
                'product_name' => 'PCB Control Module v2 Microcontroller',
                'category_name' => 'Electronics & Motherboards',
                'warehouse_name' => 'Bengaluru Electronics Logistics Park',
                'material' => 'FR4 Multi-layer SMD Glass Epoxy',
                'dimensions' => '85mm x 55mm x 1.6mm',
                'description' => 'Automated logic controller motherboard with pre-soldered 32-bit microcontroller and CAN-bus transceiver.',
                'quantity' => 1400,
                'unit_cost' => 550.00,
                'current_value' => 770000.00,
                'selling_price' => 490.00,
                'condition' => 'Factory Surplus Revision v2',
                'age_months' => 15,
                'monthly_demand' => 40,
                'risk_score' => 94.00,
                'risk_level' => 'CRITICAL',
                'estimated_loss' => 770000.00,
                'estimated_recovery' => 620000.00,
                'recommended_action' => 'Urgent Liquidation',
                'ai_explanation' => 'Firmware architecture deprecation risk is critical. Sales velocity dropped 92% after customer switched to v3 revision. Approximately 35 months of inventory remain.',
                'demand_forecast_history' => [500, 380, 290, 180, 110, 70, 45, 40],
            ],
            [
                'sku' => 'EPDM-77',
                'product_name' => 'Automotive EPDM Extruded Door Seal Profile',
                'category_name' => 'Automotive Rubber & Seals',
                'warehouse_name' => 'NCR / Manesar Automotive Hub',
                'material' => 'Peroxide-Cured EPDM Elastomer',
                'dimensions' => '25m continuous coils',
                'description' => 'Automotive grade weatherstrip extrusion profile with metal carrier backbone for vehicle passenger doors.',
                'quantity' => 3200,
                'unit_cost' => 240.00,
                'current_value' => 768000.00,
                'selling_price' => 210.00,
                'condition' => 'Grade A Factory Surplus',
                'age_months' => 13,
                'monthly_demand' => 90,
                'risk_score' => 91.00,
                'risk_level' => 'CRITICAL',
                'estimated_loss' => 690000.00,
                'estimated_recovery' => 580000.00,
                'recommended_action' => 'Find Buyer',
                'ai_explanation' => 'Shelf-life half-life is 18 months for virgin rubber elasticity. Overstocked by 4.8x normal production requirement following EV platform re-tooling.',
                'demand_forecast_history' => [420, 360, 280, 210, 150, 110, 95, 90],
            ],
            [
                'sku' => 'PC2048',
                'product_name' => 'Plastic Connector 20mm Precision Molded',
                'category_name' => 'Connectors & Moldings',
                'warehouse_name' => 'Mumbai Central Distribution Hub',
                'material' => 'Polycarbonate / High Impact Polymer',
                'dimensions' => '20mm x 15mm x 12mm',
                'description' => 'Precision injection molded 20mm industrial plastic connector for wiring harnesses and control enclosures.',
                'quantity' => 6500,
                'unit_cost' => 42.00,
                'current_value' => 273000.00,
                'selling_price' => 38.00,
                'condition' => 'Factory Surplus / Grade A',
                'age_months' => 11,
                'monthly_demand' => 1100,
                'risk_score' => 87.00,
                'risk_level' => 'HIGH',
                'estimated_loss' => 240000.00,
                'estimated_recovery' => 247000.00,
                'recommended_action' => 'Find Buyer',
                'ai_explanation' => 'Sales have declined 38% over the last 90 days. Stock represents 28 months of holding volume. Direct B2B match recommended to avoid polymer degradation.',
                'demand_forecast_history' => [24, 20, 18, 17, 16, 12, 10, 9],
            ],
            [
                'sku' => 'CAB-902',
                'product_name' => 'Industrial Shielded 4-Core Copper Cable',
                'category_name' => 'Electrical & Cabling',
                'warehouse_name' => 'Pune Industrial Transit Depot',
                'material' => 'Tinned Copper / Flame-Retardant PVC',
                'dimensions' => '100m drums',
                'description' => 'Heavy duty flexible multi-strand copper cable with aluminum foil screening for CNC factory automation.',
                'quantity' => 450,
                'unit_cost' => 1850.00,
                'current_value' => 832500.00,
                'selling_price' => 1650.00,
                'condition' => 'Factory Sealed Drums',
                'age_months' => 10,
                'monthly_demand' => 35,
                'risk_score' => 82.00,
                'risk_level' => 'HIGH',
                'estimated_loss' => 410000.00,
                'estimated_recovery' => 740000.00,
                'recommended_action' => 'Find Buyer',
                'ai_explanation' => 'Slow-moving inventory following metro infrastructure project completion. High capital lockup in copper raw value.',
                'demand_forecast_history' => [30, 26, 22, 18, 15, 12, 10, 8],
            ],
            [
                'sku' => 'PKG-118',
                'product_name' => 'Heavy Duty Packaging Box 5-Ply Export Grade',
                'category_name' => 'Packaging & Logistics',
                'warehouse_name' => 'Mumbai Central Distribution Hub',
                'material' => 'Corrugated Virgin Kraft Board 275 GSM',
                'dimensions' => '450mm x 350mm x 300mm',
                'description' => 'High-burst strength corrugated export cartons with water-resistant coating and 65kg stacking resistance.',
                'quantity' => 14000,
                'unit_cost' => 22.50,
                'current_value' => 315000.00,
                'selling_price' => 18.00,
                'condition' => 'New Bundled (100/pallet)',
                'age_months' => 9,
                'monthly_demand' => 1800,
                'risk_score' => 78.00,
                'risk_level' => 'HIGH',
                'estimated_loss' => 120000.00,
                'estimated_recovery' => 252000.00,
                'recommended_action' => 'Discount',
                'ai_explanation' => 'Occupies 28 high-bay pallet positions in Mumbai Central Hub. Incurring ₹14,000/month warehouse square-footage penalty.',
                'demand_forecast_history' => [40, 32, 28, 24, 20, 18, 15, 14],
            ],
            [
                'sku' => 'HYD-550',
                'product_name' => 'High-Pressure Hydraulic Flange Couplings 3/4"',
                'category_name' => 'Pneumatics & Fluid Controls',
                'warehouse_name' => 'Pune Industrial Transit Depot',
                'material' => 'Forged Carbon Steel EN8 / Zinc Nickel Plated',
                'dimensions' => 'DN20 Flanged 3/4" BSPP',
                'description' => 'Heavy machinery quick-connect high pressure hydraulic flanges rated for 350 bar operating pressure.',
                'quantity' => 1850,
                'unit_cost' => 320.00,
                'current_value' => 592000.00,
                'selling_price' => 290.00,
                'condition' => 'Anti-Corrosion Wax Dipped',
                'age_months' => 8,
                'monthly_demand' => 220,
                'risk_score' => 73.00,
                'risk_level' => 'HIGH',
                'estimated_loss' => 210000.00,
                'estimated_recovery' => 480000.00,
                'recommended_action' => 'Marketplace Listing',
                'ai_explanation' => 'Capital lockup in slow-turnover industrial machinery couplings. Ready for immediate B2B catalog listing.',
                'demand_forecast_history' => [28, 25, 23, 20, 18, 16, 14, 12],
            ],
            [
                'sku' => 'RES-990',
                'product_name' => 'Virgin Polypropylene Granules PP H030SG',
                'category_name' => 'Polymers & Resins',
                'warehouse_name' => 'Mumbai Central Distribution Hub',
                'material' => 'MFI 3.0 g/10min Injection Grade PP',
                'dimensions' => '25kg Moisture-Proof Sealed Bags',
                'description' => 'Virgin homopolymer polypropylene pellets suitable for thin-wall injection molding and food-contact containers.',
                'quantity' => 380,
                'unit_cost' => 2450.00,
                'current_value' => 931000.00,
                'selling_price' => 2200.00,
                'condition' => 'Original Manufacturer Sealed Bags',
                'age_months' => 6,
                'monthly_demand' => 120,
                'risk_score' => 52.00,
                'risk_level' => 'MEDIUM',
                'estimated_loss' => 180000.00,
                'estimated_recovery' => 780000.00,
                'recommended_action' => 'Find Buyer',
                'ai_explanation' => 'Crude oil & monomer price fluctuations could soften polymer spot prices by 8-12% in Q4. Early offload stabilizes margins.',
                'demand_forecast_history' => [45, 42, 38, 35, 30, 28, 26, 24],
            ],
            [
                'sku' => 'SBM8-22',
                'product_name' => 'Steel Bolt M8 High Tensile Hex Grade 8.8',
                'category_name' => 'Hardware & Fasteners',
                'warehouse_name' => 'Mumbai Central Distribution Hub',
                'material' => 'Grade 8.8 Galvanized Alloy Steel',
                'dimensions' => 'M8 x 40mm Fully Threaded',
                'description' => 'High tensile zinc plated hex head bolts for structural machinery and conveyor mounting.',
                'quantity' => 15000,
                'unit_cost' => 18.50,
                'current_value' => 277500.00,
                'selling_price' => 16.00,
                'condition' => 'Factory Sealed (500/box)',
                'age_months' => 5,
                'monthly_demand' => 4200,
                'risk_score' => 46.00,
                'risk_level' => 'MEDIUM',
                'estimated_loss' => 60000.00,
                'estimated_recovery' => 240000.00,
                'recommended_action' => 'Warehouse Rebalancing',
                'ai_explanation' => 'Demand remains steady in Pune plant while surplus sits in Mumbai hub. Recommended inter-facility transfer to avoid re-ordering.',
                'demand_forecast_history' => [35, 36, 34, 33, 35, 34, 33, 34],
            ],
            [
                'sku' => 'VLV-304',
                'product_name' => 'Stainless Steel Solenoid Valve 1/2" 24V DC',
                'category_name' => 'Pneumatics & Fluid Controls',
                'warehouse_name' => 'Bengaluru Electronics Logistics Park',
                'material' => 'SS316 Body / FKM High-Temp Seals',
                'dimensions' => '1/2" NPT Female / IP65 Coil',
                'description' => 'Two-way normally closed direct-acting stainless steel solenoid valve for compressed air and industrial water.',
                'quantity' => 600,
                'unit_cost' => 1120.00,
                'current_value' => 672000.00,
                'selling_price' => 1250.00,
                'condition' => 'Brand New in Individual Boxes',
                'age_months' => 2,
                'monthly_demand' => 280,
                'risk_score' => 22.00,
                'risk_level' => 'LOW',
                'estimated_loss' => 20000.00,
                'estimated_recovery' => 650000.00,
                'recommended_action' => 'Monitor',
                'ai_explanation' => 'High turnover velocity with 2.1 months buffer stock. Healthy working capital velocity.',
                'demand_forecast_history' => [50, 52, 48, 51, 53, 50, 49, 52],
            ],
            [
                'sku' => 'LED-IND',
                'product_name' => 'Panel Mount LED Indicator 22mm IP67 240V',
                'category_name' => 'Electronics & Motherboards',
                'warehouse_name' => 'NCR / Manesar Automotive Hub',
                'material' => 'Chrome Plated Brass / Polycarbonate Diffuser',
                'dimensions' => '22mm Cutout / Dual Amber & Green',
                'description' => 'Heavy industrial control panel status indicator lamps with screw clamp terminals and built-in surge suppression.',
                'quantity' => 2500,
                'unit_cost' => 65.00,
                'current_value' => 162500.00,
                'selling_price' => 72.00,
                'condition' => 'Factory Bulk Trays',
                'age_months' => 3,
                'monthly_demand' => 950,
                'risk_score' => 28.00,
                'risk_level' => 'LOW',
                'estimated_loss' => 15000.00,
                'estimated_recovery' => 155000.00,
                'recommended_action' => 'Monitor',
                'ai_explanation' => 'Standard industrial control panel component with recurring bi-weekly dispatch.',
                'demand_forecast_history' => [40, 41, 39, 42, 40, 41, 40, 42],
            ],
        ];

        $savedInventory = [];
        foreach ($inventoryItems as $item) {
            $catId = $categories[$item['category_name']]->id ?? null;
            $whId = $warehouses[$item['warehouse_name']]->id ?? null;

            $inv = Inventory::updateOrCreate(
                ['company_id' => $demoCompany->id, 'sku' => $item['sku']],
                [
                    'user_id' => $demoUser->id,
                    'category_id' => $catId,
                    'warehouse_id' => $whId,
                    'product_name' => $item['product_name'],
                    'category' => $item['category_name'],
                    'material' => $item['material'],
                    'dimensions' => $item['dimensions'],
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                    'current_value' => $item['current_value'],
                    'selling_price' => $item['selling_price'],
                    'condition' => $item['condition'],
                    'warehouse_location' => $item['warehouse_name'],
                    'age_months' => $item['age_months'],
                    'last_sold_date' => now()->subMonths(min(4, $item['age_months'])),
                    'last_movement_date' => now()->subDays(25),
                    'monthly_demand' => $item['monthly_demand'],
                    'risk_score' => $item['risk_score'],
                    'risk_level' => $item['risk_level'],
                    'estimated_loss' => $item['estimated_loss'],
                    'estimated_recovery' => $item['estimated_recovery'],
                    'recommended_action' => $item['recommended_action'],
                    'ai_explanation' => $item['ai_explanation'],
                    'demand_forecast_history' => is_array($item['demand_forecast_history']) 
                        ? implode(' ', $item['demand_forecast_history']) 
                        : $item['demand_forecast_history'],
                    'status' => 'active',
                ]
            );

            $savedInventory[$item['sku']] = $inv;

            // Log Initial Inventory Movement if none exists
            if (InventoryMovement::where('inventory_id', $inv->id)->count() === 0) {
                InventoryMovement::create([
                    'inventory_id' => $inv->id,
                    'movement_type' => 'added',
                    'quantity' => $item['quantity'],
                    'source_location' => 'Central Receiving / Factory Line',
                    'destination_location' => $item['warehouse_name'],
                    'reference' => 'LOT-REC-' . $item['sku'] . '-2025',
                    'notes' => 'Surplus stock recorded and risk-indexed into DeadStock recovery database.',
                ]);
            }
        }

        // 6. Realistic AI Buyer Matches
        $matchesData = [
            [
                'sku' => 'PCB-401',
                'buyer' => 'Nova Components',
                'overall' => 93.00,
                'product' => 96.00, 'quantity' => 90.00, 'industry' => 95.00, 'location' => 88.00, 'price' => 92.00,
                'units' => 1000,
                'val' => 490000.00,
                'tags' => ['Firmware Spec', 'Microcontroller SMD', 'Immediate PO', 'Escrow Ready'],
                'notes' => 'Nova Sourcing: Seeking logic controllers for automated AGV warehouse robot fleet expansion in Whitefield.',
            ],
            [
                'sku' => 'PC2048',
                'buyer' => 'ElectroTech Industries',
                'overall' => 95.00,
                'product' => 98.00, 'quantity' => 92.00, 'industry' => 96.00, 'location' => 91.00, 'price' => 94.00,
                'units' => 5000,
                'val' => 190000.00,
                'tags' => ['Material Match', 'Spec Tolerance', 'Express Dispatch', 'Direct Fit'],
                'notes' => 'ElectroTech Procurement: Approved engineering substitution for terminal block housings.',
            ],
            [
                'sku' => 'EPDM-77',
                'buyer' => 'Bharat Auto Assemblies',
                'overall' => 96.00,
                'product' => 97.00, 'quantity' => 95.00, 'industry' => 98.00, 'location' => 92.00, 'price' => 94.00,
                'units' => 2500,
                'val' => 525000.00,
                'tags' => ['OEM Grade', 'Peroxide Cured', 'Tier-1 Approved', 'Bulk Transit'],
                'notes' => 'Bharat Auto: Urgent procurement needed for commercial bus door sealing production surge in Manesar.',
            ],
            [
                'sku' => 'CAB-902',
                'buyer' => 'Apex Controls & Retrofits',
                'overall' => 88.00,
                'product' => 90.00, 'quantity' => 84.00, 'industry' => 91.00, 'location' => 86.00, 'price' => 87.00,
                'units' => 300,
                'val' => 495000.00,
                'tags' => ['Tinned Copper', 'Flame Retardant', 'Retrofit Ready', 'Heavy Conductor'],
                'notes' => 'Apex Controls: Standard shielded 4-core cable needed for sugar refinery CNC motor retrofits in Pune.',
            ],
            [
                'sku' => 'PKG-118',
                'buyer' => 'Nagpur Pack & Logistics',
                'overall' => 91.00,
                'product' => 94.00, 'quantity' => 90.00, 'industry' => 92.00, 'location' => 89.00, 'price' => 91.00,
                'units' => 10000,
                'val' => 180000.00,
                'tags' => ['Virgin Kraft', '5-Ply Export', 'High Bursting Factor', 'Direct Palletize'],
                'notes' => 'Nagpur Pack: Immediate demand to fulfill FMCG export consignment packing.',
            ],
            [
                'sku' => 'RES-990',
                'buyer' => 'GreenPolymer Circular Recyclers',
                'overall' => 86.00,
                'product' => 89.00, 'quantity' => 85.00, 'industry' => 88.00, 'location' => 82.00, 'price' => 84.00,
                'units' => 300,
                'val' => 660000.00,
                'tags' => ['Virgin Homopolymer', 'Original Bags', 'Zero Contamination', 'Circular Compound'],
                'notes' => 'GreenPolymer: Premium raw material intake for compounding and Scope-3 polymer repurposing.',
            ],
        ];

        foreach ($matchesData as $m) {
            $inv = $savedInventory[$m['sku']] ?? null;
            $buyer = $externalCompanies[$m['buyer']] ?? null;
            if ($inv && $buyer) {
                BuyerMatch::updateOrCreate(
                    [
                        'inventory_id' => $inv->id,
                        'buyer_company_id' => $buyer->id,
                    ],
                    [
                        'overall_match_score' => $m['overall'],
                        'product_compatibility' => $m['product'],
                        'quantity_compatibility' => $m['quantity'],
                        'industry_compatibility' => $m['industry'],
                        'location_compatibility' => $m['location'],
                        'price_compatibility' => $m['price'],
                        'required_units' => $m['units'],
                        'potential_deal_value' => $m['val'],
                        'compatibility_tags' => $m['tags'],
                        'notes' => $m['notes'],
                        'status' => 'suggested',
                    ]
                );
            }
        }

        // 7. Interactive Inbound & Counter Offers
        $offersData = [
            [
                'sku' => 'PC2048',
                'sender' => 'ElectroTech Industries',
                'qty' => 3000,
                'unit_price' => 36.00,
                'total' => 108000.00,
                'status' => 'pending',
                'notes' => 'ElectroTech Procurement: We are ready to issue an advance escrow release of ₹1,08,000 for 3,000 units. Please confirm dispatch timeline from Mumbai.',
            ],
            [
                'sku' => 'PCB-401',
                'sender' => 'Nova Components',
                'qty' => 800,
                'unit_price' => 470.00,
                'total' => 376000.00,
                'status' => 'pending',
                'notes' => 'Nova Robotics: Urgent requirement for AGV chassis line in Whitefield Bengaluru. Can pick up directly via our logistics partner.',
            ],
            [
                'sku' => 'EPDM-77',
                'sender' => 'Bharat Auto Assemblies',
                'qty' => 2000,
                'unit_price' => 200.00,
                'total' => 400000.00,
                'status' => 'countered',
                'notes' => 'Counter proposal submitted to Bharat Auto proposing ₹205/coil with manufacturer warranty certificates attached.',
            ],
            [
                'sku' => 'CAB-902',
                'sender' => 'Apex Controls & Retrofits',
                'qty' => 100,
                'unit_price' => 1650.00,
                'total' => 165000.00,
                'status' => 'accepted',
                'notes' => 'Deal agreed and escrow funds locked. Dispatched via V-Trans Logistics on Oct 14.',
            ],
        ];

        foreach ($offersData as $off) {
            $inv = $savedInventory[$off['sku']] ?? null;
            $sender = $externalCompanies[$off['sender']] ?? null;
            if ($inv && $sender) {
                Offer::updateOrCreate(
                    [
                        'inventory_id' => $inv->id,
                        'sender_company_id' => $sender->id,
                        'receiver_company_id' => $demoCompany->id,
                    ],
                    [
                        'user_id' => $demoUser->id,
                        'offered_quantity' => $off['qty'],
                        'offered_unit_price' => $off['unit_price'],
                        'total_deal_value' => $off['total'],
                        'status' => $off['status'],
                        'notes' => $off['notes'],
                    ]
                );
            }
        }

        // 8. Public B2B Surplus Marketplace Catalog Listings
        $marketplaceData = [
            [
                'company' => 'ElectroTech Industries',
                'title' => 'Industrial Connector 20mm High Temp (Glass Filled PBT)',
                'category' => 'Connectors & Moldings',
                'description' => 'Unused surplus lot of 5,000 high-temperature industrial wire harness connectors. Rated 125°C continuous.',
                'units' => 5000,
                'price' => 28.00,
                'condition' => 'Factory Sealed',
                'location' => 'Ahmedabad, Gujarat',
                'match' => 91.00,
            ],
            [
                'company' => 'Gujarat Industrial Systems',
                'title' => 'ABS Molded Industrial Enclosure Boxes IP65',
                'category' => 'Connectors & Moldings',
                'description' => 'Heavy-duty black injection molded ABS enclosures with neoprene sealing gaskets. Ideal for outdoor control nodes.',
                'units' => 2800,
                'price' => 45.00,
                'condition' => 'Grade A Surplus',
                'location' => 'Surat, Gujarat',
                'match' => 88.00,
            ],
            [
                'company' => 'Nagpur Pack & Logistics',
                'title' => 'Double-Wall Heavy Duty Corrugated Export Cartons',
                'category' => 'Packaging & Logistics',
                'description' => '7-ply heavy export cartons suitable for sea transit and palletized industrial machinery components.',
                'units' => 18400,
                'price' => 14.50,
                'condition' => 'New Bundled (50/bale)',
                'location' => 'Nagpur, Maharashtra',
                'match' => 84.00,
            ],
            [
                'company' => 'Apex Controls & Retrofits',
                'title' => 'Siemens-Compatible DIN-Rail Relays 24V DC 8-Pin',
                'category' => 'Electronics & Motherboards',
                'description' => 'Surplus industrial switching relays with test buttons and LED indicators. Direct retrofit for control cabinets.',
                'units' => 850,
                'price' => 185.00,
                'condition' => 'Brand New Sealed',
                'location' => 'Pune, Maharashtra',
                'match' => 89.00,
            ],
            [
                'company' => 'Bharat Auto Assemblies',
                'title' => 'High Tensile Structural Flange Hex Bolts M12 x 50mm',
                'category' => 'Hardware & Fasteners',
                'description' => 'Grade 10.9 Geomet coated automotive flange bolts with extreme corrosion resistance (1000h salt spray).',
                'units' => 12500,
                'price' => 26.00,
                'condition' => 'Factory Sealed (250/box)',
                'location' => 'Gurugram, Haryana',
                'match' => 92.00,
            ],
            [
                'company' => 'GreenPolymer Circular Recyclers',
                'title' => 'Reprocessed Polypropylene Black Compound Pellets',
                'category' => 'Polymers & Resins',
                'description' => 'High impact modified recycled PP compounding pellets for automotive undertray and non-critical casings.',
                'units' => 8000,
                'price' => 78.00,
                'condition' => 'Certified Circular Regrind',
                'location' => 'Vapi, Gujarat',
                'match' => 82.00,
            ],
        ];

        foreach ($marketplaceData as $mkt) {
            $comp = $externalCompanies[$mkt['company']] ?? null;
            if ($comp) {
                MarketplaceListing::updateOrCreate(
                    [
                        'company_id' => $comp->id,
                        'title' => $mkt['title'],
                    ],
                    [
                        'user_id' => $demoUser->id,
                        'category' => $mkt['category'],
                        'description' => $mkt['description'],
                        'units_available' => $mkt['units'],
                        'price_per_unit' => $mkt['price'],
                        'unit_label' => 'unit',
                        'condition' => $mkt['condition'],
                        'location' => $mkt['location'],
                        'match_score' => $mkt['match'],
                        'status' => 'active',
                    ]
                );
            }
        }

        // 9. Completed Transactions & Movement Ledger Records
        $transactionsData = [
            [
                'ref' => 'TXN-REC-2026-081',
                'buyer' => 'ElectroTech Industries',
                'sku' => 'PC2048',
                'type' => 'b2b_match',
                'qty' => 1500,
                'unit_price' => 38.00,
                'amount' => 57000.00,
                'recovery' => 57000.00,
                'notes' => 'Phase-1 matched liquidation batch completed via DeadStock Escrow. GST Invoice #DS-2026-0941 generated.',
                'date' => now()->subDays(3),
            ],
            [
                'ref' => 'TXN-REC-2026-074',
                'buyer' => 'Apex Controls & Retrofits',
                'sku' => 'CAB-902',
                'type' => 'b2b_match',
                'qty' => 100,
                'unit_price' => 1650.00,
                'amount' => 165000.00,
                'recovery' => 165000.00,
                'notes' => 'Shielded cable batch offloaded for sugar refinery modernization project. Escrow released.',
                'date' => now()->subDays(6),
            ],
            [
                'ref' => 'TXN-REC-2026-068',
                'buyer' => 'GreenPolymer Circular Recyclers',
                'sku' => 'PC2048',
                'type' => 'recycle',
                'qty' => 800,
                'unit_price' => 25.00,
                'amount' => 20000.00,
                'recovery' => 20000.00,
                'notes' => 'Diverted runner sprues and off-spec connectors to GreenPolymer circular reprocessing. Zero-landfill certificate issued.',
                'date' => now()->subDays(12),
            ],
            [
                'ref' => 'TXN-REC-2026-055',
                'buyer' => 'Nova Components',
                'sku' => 'PCB-401',
                'type' => 'b2b_match',
                'qty' => 200,
                'unit_price' => 490.00,
                'amount' => 98000.00,
                'recovery' => 98000.00,
                'notes' => 'Pilot evaluation lot of v2 motherboards delivered to Nova Bengaluru R&D facility.',
                'date' => now()->subDays(18),
            ],
        ];

        foreach ($transactionsData as $txn) {
            $inv = $savedInventory[$txn['sku']] ?? null;
            $buyer = $externalCompanies[$txn['buyer']] ?? null;
            if ($inv && $buyer) {
                Transaction::updateOrCreate(
                    ['reference_no' => $txn['ref']],
                    [
                        'user_id' => $demoUser->id,
                        'company_id' => $demoCompany->id,
                        'buyer_company_id' => $buyer->id,
                        'inventory_id' => $inv->id,
                        'transaction_type' => $txn['type'],
                        'quantity' => $txn['qty'],
                        'unit_price' => $txn['unit_price'],
                        'total_amount' => $txn['amount'],
                        'recovery_value' => $txn['recovery'],
                        'status' => 'completed',
                        'notes' => $txn['notes'],
                        'completed_at' => $txn['date'],
                    ]
                );

                // Ensure movement record in ledger
                if (InventoryMovement::where('reference', $txn['ref'])->count() === 0) {
                    InventoryMovement::create([
                        'inventory_id' => $inv->id,
                        'movement_type' => $txn['type'] === 'recycle' ? 'recycled' : 'sold',
                        'quantity' => $txn['qty'],
                        'source_location' => $inv->warehouse_location,
                        'destination_location' => $buyer->name . ' (' . $buyer->location_city . ')',
                        'reference' => $txn['ref'],
                        'notes' => $txn['notes'],
                        'created_at' => $txn['date'],
                    ]);
                }
            }
        }

        // 10. Multi-Channel Recovery Actions for Circular Sustainability
        $recoveryActionsData = [
            [
                'sku' => 'PCB-401',
                'action_type' => 'sell',
                'channel_name' => 'B2B Dark Pool Matched Sale',
                'orig_val' => 110000.00,
                'est_rec' => 98000.00,
                'rec_val' => 98000.00,
                'pct' => 89.00,
                'units' => 200,
                'waste_kg' => 85.00,
                'notes' => 'Diverted to Nova Components robotic chassis assembly. Avoided electronic e-waste.',
                'executed_at' => now()->subDays(18),
            ],
            [
                'sku' => 'PC2048',
                'action_type' => 'sell',
                'channel_name' => 'Direct B2B Matched Sale',
                'orig_val' => 63000.00,
                'est_rec' => 57000.00,
                'rec_val' => 57000.00,
                'pct' => 90.50,
                'units' => 1500,
                'waste_kg' => 150.00,
                'notes' => 'Matched with ElectroTech Industries for electrical enclosure production.',
                'executed_at' => now()->subDays(3),
            ],
            [
                'sku' => 'CAB-902',
                'action_type' => 'sell',
                'channel_name' => 'Direct B2B Matched Sale',
                'orig_val' => 185000.00,
                'est_rec' => 165000.00,
                'rec_val' => 165000.00,
                'pct' => 89.20,
                'units' => 100,
                'waste_kg' => 2400.00,
                'notes' => 'Direct recovery sale of copper shielded cable drums to Apex Controls Pune.',
                'executed_at' => now()->subDays(6),
            ],
            [
                'sku' => 'SBM8-22',
                'action_type' => 'transfer',
                'channel_name' => 'Inter-Depot Warehouse Rebalance',
                'orig_val' => 92500.00,
                'est_rec' => 92500.00,
                'rec_val' => 92500.00,
                'pct' => 100.00,
                'units' => 5000,
                'waste_kg' => 380.00,
                'notes' => 'Rebalanced from Mumbai Central to Pune Depot to fulfill internal tooling schedule.',
                'executed_at' => now()->subDays(10),
            ],
            [
                'sku' => 'PC2048',
                'action_type' => 'recycle',
                'channel_name' => 'Certified Circular Polymer Regrind',
                'orig_val' => 33600.00,
                'est_rec' => 20000.00,
                'rec_val' => 20000.00,
                'pct' => 59.50,
                'units' => 800,
                'waste_kg' => 80.00,
                'notes' => 'Processed through GreenPolymer closed-loop regrind. Certified carbon credit generated.',
                'executed_at' => now()->subDays(12),
            ],
            [
                'sku' => 'PKG-118',
                'action_type' => 'return',
                'channel_name' => 'Supplier Restock & RMA Return',
                'orig_val' => 67500.00,
                'est_rec' => 54000.00,
                'rec_val' => 54000.00,
                'pct' => 80.00,
                'units' => 3000,
                'waste_kg' => 1200.00,
                'notes' => 'Supplier buyback credit issued under master quarterly purchasing credit.',
                'executed_at' => now()->subDays(25),
            ],
        ];

        foreach ($recoveryActionsData as $ra) {
            $inv = $savedInventory[$ra['sku']] ?? null;
            if ($inv) {
                RecoveryAction::updateOrCreate(
                    [
                        'company_id' => $demoCompany->id,
                        'inventory_id' => $inv->id,
                        'channel_name' => $ra['channel_name'],
                    ],
                    [
                        'user_id' => $demoUser->id,
                        'action_type' => $ra['action_type'],
                        'original_value' => $ra['orig_val'],
                        'estimated_recovery' => $ra['est_rec'],
                        'recovered_value' => $ra['rec_val'],
                        'recovery_percentage' => $ra['pct'],
                        'units_diverted' => $ra['units'],
                        'waste_avoided_kg' => $ra['waste_kg'],
                        'status' => 'completed',
                        'notes' => $ra['notes'],
                        'executed_at' => $ra['executed_at'],
                    ]
                );
            }
        }

        // 11. Actionable High-Priority Notifications
        $notificationsData = [
            [
                'title' => 'Critical DeadStock Risk Alert',
                'type' => 'risk_alert',
                'severity' => 'critical',
                'message' => 'PCB Control Module v2 (SKU: PCB-401) has reached 94% Risk due to 15 months holding time and 92% demand decline.',
                'url' => '/inventory/PCB-401',
                'label' => 'Review SKU',
                'read' => false,
            ],
            [
                'title' => 'New Inbound B2B Offer Received',
                'type' => 'offer_received',
                'severity' => 'success',
                'message' => 'ElectroTech Industries submitted an inbound offer of ₹1,08,000 for 3,000 units of Plastic Connector 20mm.',
                'url' => '/offers',
                'label' => 'Negotiate Offer',
                'read' => false,
            ],
            [
                'title' => 'High-Score Buyer Match Found (96%)',
                'type' => 'buyer_match',
                'severity' => 'info',
                'message' => 'Bharat Auto Assemblies matches your EPDM Door Seal (SKU: EPDM-77) with 96% compatibility for Manesar facility.',
                'url' => '/matches',
                'label' => 'View Match',
                'read' => false,
            ],
            [
                'title' => 'Warehouse Rebalance Recommended',
                'type' => 'rebalance_alert',
                'severity' => 'warning',
                'message' => 'Surplus Hex Bolts in Mumbai Central Depot can be transferred to Pune Depot to fulfill upcoming maintenance schedule.',
                'url' => '/inventory',
                'label' => 'View Inventory',
                'read' => true,
            ],
            [
                'title' => 'Scope-3 Waste Diversion Certificate Ready',
                'type' => 'sustainability_milestone',
                'severity' => 'success',
                'message' => '4.29 Metric Tons of industrial surplus diverted from landfills this month. ESG audit report ready for export.',
                'url' => '/sustainability',
                'label' => 'View Metrics',
                'read' => true,
            ],
        ];

        foreach ($notificationsData as $notif) {
            Notification::firstOrCreate(
                [
                    'company_id' => $demoCompany->id,
                    'title' => $notif['title'],
                ],
                [
                    'user_id' => $demoUser->id,
                    'type' => $notif['type'],
                    'severity' => $notif['severity'],
                    'message' => $notif['message'],
                    'action_url' => $notif['url'],
                    'action_label' => $notif['label'],
                    'is_read' => $notif['read'],
                ]
            );
        }
    }
}
