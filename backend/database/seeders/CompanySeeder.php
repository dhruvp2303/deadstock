<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $abc = Company::create([
            'name' => 'ABC Plastics',
            'industry' => 'Industrial Plastics & Polymers',
            'description' => 'Manufacturer of precision injection molded industrial plastic components and connectors.',
            'location_city' => 'Hyderabad',
            'location_state' => 'Telangana',
            'country' => 'India',
            'pincode' => '500032',
            'email' => 'ops@abcplastics.in',
            'phone' => '+91 40 2345 6789',
            'website' => 'https://abcplastics.in',
        ]);

        User::create([
            'company_id' => $abc->id,
            'name' => 'Aditya Sharma',
            'email' => 'demo@deadstock.ai',
            'password' => Hash::make('password123'),
            'role' => 'Inventory Director',
            'phone' => '+91 98765 43210',
        ]);

        $electro = Company::create([
            'name' => 'ElectroTech Industries',
            'industry' => 'Industrial Automation & Electricals',
            'description' => 'Leading supplier of automated control panels and electronic enclosure systems.',
            'location_city' => 'Ahmedabad',
            'location_state' => 'Gujarat',
            'country' => 'India',
            'pincode' => '380015',
            'email' => 'procurement@electrotech.com',
            'phone' => '+91 79 2658 9012',
            'website' => 'https://electrotech.com',
        ]);

        User::create([
            'company_id' => $electro->id,
            'name' => 'Rajesh Patel',
            'email' => 'rajesh@electrotech.com',
            'password' => Hash::make('password123'),
            'role' => 'Procurement Head',
            'phone' => '+91 98250 12345',
        ]);

        Company::create([
            'name' => 'Nova Components',
            'industry' => 'Electronics & Robotics',
            'description' => 'High-precision components supplier for EV and robotics hardware.',
            'location_city' => 'Bengaluru',
            'location_state' => 'Karnataka',
            'country' => 'India',
            'pincode' => '560100',
            'email' => 'sourcing@novacomponents.io',
            'phone' => '+91 80 4123 7890',
            'website' => 'https://novacomponents.io',
        ]);

        Company::create([
            'name' => 'Apex Controls',
            'industry' => 'Legacy Industrial Machinery',
            'description' => 'Industrial replacement parts and retrofitting for legacy factory equipment.',
            'location_city' => 'Pune',
            'location_state' => 'Maharashtra',
            'country' => 'India',
            'pincode' => '411018',
            'email' => 'supply@apexcontrols.in',
            'phone' => '+91 20 2747 5566',
            'website' => 'https://apexcontrols.in',
        ]);

        Company::create([
            'name' => 'Gujarat Industrial Systems',
            'industry' => 'Heavy Engineering',
            'description' => 'Fabrication and industrial housing assemblies.',
            'location_city' => 'Surat',
            'location_state' => 'Gujarat',
            'country' => 'India',
            'pincode' => '395007',
            'email' => 'contact@gujaratindustrial.com',
        ]);

        Company::create([
            'name' => 'Nagpur Pack & Logistics',
            'industry' => 'Packaging & Distribution',
            'description' => 'Corrugated packaging and transit protective solutions.',
            'location_city' => 'Nagpur',
            'location_state' => 'Maharashtra',
            'country' => 'India',
            'pincode' => '440001',
            'email' => 'sales@nagpurpack.in',
        ]);
    }
}
