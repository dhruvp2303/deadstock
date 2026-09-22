<?php

namespace Database\Seeders;

use App\Models\BuyerMatch;
use App\Models\Company;
use App\Models\Inventory;
use Illuminate\Database\Seeder;

class BuyerMatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $connector = Inventory::where('sku', 'PC2048')->first();
        if (!$connector) return;

        $electro = Company::where('name', 'ElectroTech Industries')->first();
        $nova = Company::where('name', 'Nova Components')->first();
        $apex = Company::where('name', 'Apex Controls')->first();

        if ($electro) {
            BuyerMatch::create([
                'inventory_id' => $connector->id,
                'buyer_company_id' => $electro->id,
                'overall_match_score' => 93.00,
                'product_compatibility' => 95.00,
                'quantity_compatibility' => 88.00,
                'industry_compatibility' => 94.00,
                'location_compatibility' => 90.00,
                'price_compatibility' => 86.00,
                'required_units' => 3000,
                'potential_deal_value' => 240000.00,
                'compatibility_tags' => ['Material', 'Dimensions', 'Category'],
                'notes' => 'Strong material and size compatibility for upcoming enclosure production runs.',
                'status' => 'suggested',
            ]);
        }

        if ($nova) {
            BuyerMatch::create([
                'inventory_id' => $connector->id,
                'buyer_company_id' => $nova->id,
                'overall_match_score' => 87.00,
                'product_compatibility' => 90.00,
                'quantity_compatibility' => 82.00,
                'industry_compatibility' => 89.00,
                'location_compatibility' => 85.00,
                'price_compatibility' => 88.00,
                'required_units' => 2500,
                'potential_deal_value' => 190000.00,
                'compatibility_tags' => ['Dimensions', 'Category'],
                'notes' => 'High demand from industrial automation customers seeking legacy connector sizes.',
                'status' => 'suggested',
            ]);
        }

        if ($apex) {
            BuyerMatch::create([
                'inventory_id' => $connector->id,
                'buyer_company_id' => $apex->id,
                'overall_match_score' => 79.00,
                'product_compatibility' => 84.00,
                'quantity_compatibility' => 75.00,
                'industry_compatibility' => 81.00,
                'location_compatibility' => 78.00,
                'price_compatibility' => 76.00,
                'required_units' => 1800,
                'potential_deal_value' => 150000.00,
                'compatibility_tags' => ['Category', 'Material'],
                'notes' => 'Good fit for legacy replacement orders and aftermarket maintenance kits.',
                'status' => 'suggested',
            ]);
        }
    }
}
