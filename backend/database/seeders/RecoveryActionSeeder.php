<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Inventory;
use App\Models\RecoveryAction;
use Illuminate\Database\Seeder;

class RecoveryActionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $abc = Company::where('name', 'ABC Plastics')->first();
        if (!$abc) return;

        $p1 = Inventory::where('sku', 'PC2048')->first();
        if ($p1) {
            RecoveryAction::create([
                'inventory_id' => $p1->id,
                'company_id' => $abc->id,
                'action_type' => 'sell',
                'channel_name' => 'B2B Matched Sale',
                'original_value' => 180000.00,
                'estimated_recovery' => 390000.00,
                'recovered_value' => 390000.00,
                'recovery_percentage' => 88.00,
                'units_diverted' => 4500,
                'waste_avoided_kg' => 450.00,
                'status' => 'completed',
                'notes' => 'Matched with ElectroTech Industries for active production line.',
                'executed_at' => now()->subDays(2),
            ]);

            RecoveryAction::create([
                'inventory_id' => $p1->id,
                'company_id' => $abc->id,
                'action_type' => 'transfer',
                'channel_name' => 'Inter-facility Transfer',
                'original_value' => 180000.00,
                'estimated_recovery' => 340000.00,
                'recovered_value' => 340000.00,
                'recovery_percentage' => 76.00,
                'units_diverted' => 3000,
                'waste_avoided_kg' => 300.00,
                'status' => 'completed',
                'executed_at' => now()->subDays(10),
            ]);

            RecoveryAction::create([
                'inventory_id' => $p1->id,
                'company_id' => $abc->id,
                'action_type' => 'return',
                'channel_name' => 'Supplier Restock Return',
                'original_value' => 180000.00,
                'estimated_recovery' => 240000.00,
                'recovered_value' => 240000.00,
                'recovery_percentage' => 60.00,
                'units_diverted' => 2000,
                'waste_avoided_kg' => 200.00,
                'status' => 'completed',
                'executed_at' => now()->subDays(20),
            ]);

            RecoveryAction::create([
                'inventory_id' => $p1->id,
                'company_id' => $abc->id,
                'action_type' => 'recycle',
                'channel_name' => 'Certified Circular Polymer Regrind',
                'original_value' => 180000.00,
                'estimated_recovery' => 70000.00,
                'recovered_value' => 70000.00,
                'recovery_percentage' => 35.00,
                'units_diverted' => 1000,
                'waste_avoided_kg' => 120.00,
                'status' => 'completed',
                'executed_at' => now()->subMonth(),
            ]);
        }
    }
}
