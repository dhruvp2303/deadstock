<?php

use App\Models\Category;
use App\Models\Company;
use App\Models\Inventory;
use App\Models\Warehouse;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Standard baseline categories
        $defaultCategories = [
            ['name' => 'Mechanical Components', 'decay' => 0.04, 'desc' => 'Precision engineering, fasteners, connectors and mechanical sub-assemblies'],
            ['name' => 'Electronics & PCB', 'decay' => 0.08, 'desc' => 'Microcontrollers, PCB modules, semiconductors and electronic hardware'],
            ['name' => 'Packaging & Cartons', 'decay' => 0.03, 'desc' => 'Corrugated packaging, bulk industrial cartons and wrapping materials'],
            ['name' => 'Industrial Hardware', 'decay' => 0.02, 'desc' => 'High tensile bolts, structural fixings and standard industrial hardware'],
            ['name' => 'Polymers & Resins', 'decay' => 0.05, 'desc' => 'Industrial polymers, injection molding plastics and raw resins'],
        ];

        foreach ($defaultCategories as $cat) {
            Category::firstOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'default_decay_rate' => $cat['decay'],
                    'description' => $cat['desc'],
                ]
            );
        }

        // Backfill existing inventory records
        $inventories = Inventory::all();
        foreach ($inventories as $inv) {
            // 1. Map Category
            if (!empty($inv->category)) {
                $trimmedCategory = trim($inv->category);
                $category = Category::firstOrCreate(
                    ['slug' => Str::slug($trimmedCategory)],
                    [
                        'name' => $trimmedCategory,
                        'default_decay_rate' => 0.05,
                        'description' => "Standard category for {$trimmedCategory}",
                    ]
                );
                $inv->category_id = $category->id;
            }

            // 2. Map Company-Scoped Warehouse
            $warehouseName = !empty($inv->warehouse_location) ? trim($inv->warehouse_location) : 'Main Depot';
            $city = 'Industrial Depot';
            if (stripos($warehouseName, 'Ahmedabad') !== false) {
                $city = 'Ahmedabad';
            } elseif (stripos($warehouseName, 'Surat') !== false) {
                $city = 'Surat';
            } elseif (stripos($warehouseName, 'Nagpur') !== false) {
                $city = 'Nagpur';
            } elseif (stripos($warehouseName, 'Pune') !== false) {
                $city = 'Pune';
            } elseif (stripos($warehouseName, 'Bengaluru') !== false) {
                $city = 'Bengaluru';
            }

            $warehouse = Warehouse::firstOrCreate(
                [
                    'company_id' => $inv->company_id,
                    'name' => $warehouseName,
                ],
                [
                    'city' => $city,
                    'state' => 'Gujarat',
                    'country' => 'India',
                    'capacity_sqft' => 30000,
                ]
            );
            $inv->warehouse_id = $warehouse->id;
            $inv->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('inventories')->update([
            'category_id' => null,
            'warehouse_id' => null,
        ]);
    }
};
