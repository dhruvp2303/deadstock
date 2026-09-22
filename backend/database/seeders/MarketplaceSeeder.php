<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\MarketplaceListing;
use Illuminate\Database\Seeder;

class MarketplaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $electro = Company::where('name', 'ElectroTech Industries')->first();
        $gujarat = Company::where('name', 'Gujarat Industrial Systems')->first();
        $nagpur = Company::where('name', 'Nagpur Pack & Logistics')->first();

        if ($electro) {
            MarketplaceListing::create([
                'company_id' => $electro->id,
                'title' => 'Industrial Connector 20mm High Temp',
                'category' => 'Connectors & Components',
                'description' => 'Unused lot of 5,000 high-temperature industrial wire harness connectors.',
                'units_available' => 5000,
                'price_per_unit' => 28.00,
                'unit_label' => 'unit',
                'condition' => 'Factory Sealed',
                'location' => 'Ahmedabad, Gujarat',
                'match_score' => 91.00,
                'status' => 'active',
            ]);
        }

        if ($gujarat) {
            MarketplaceListing::create([
                'company_id' => $gujarat->id,
                'title' => 'ABS Housing Molded Shells',
                'category' => 'Enclosures & Plastics',
                'description' => 'Injection molded black ABS enclosure boxes ready for PCB installation.',
                'units_available' => 2800,
                'price_per_unit' => 45.00,
                'unit_label' => 'unit',
                'condition' => 'Grade A Surplus',
                'location' => 'Surat, Gujarat',
                'match_score' => 84.00,
                'status' => 'active',
            ]);
        }

        if ($nagpur) {
            MarketplaceListing::create([
                'company_id' => $nagpur->id,
                'title' => 'Packaging Carton Heavy Duty',
                'category' => 'Packaging & Logistics',
                'description' => 'Double-wall corrugated shipping boxes suitable for export consignments.',
                'units_available' => 18400,
                'price_per_unit' => 12.00,
                'unit_label' => 'unit',
                'condition' => 'New Bundled',
                'location' => 'Nagpur, Maharashtra',
                'match_score' => 76.00,
                'status' => 'active',
            ]);
        }
    }
}
