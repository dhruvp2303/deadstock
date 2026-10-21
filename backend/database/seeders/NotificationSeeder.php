<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Notification;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $abc = Company::where('name', 'ABC Plastics')->first();
        if (!$abc) return;

        Notification::firstOrCreate(
            [
                'company_id' => $abc->id,
                'title' => 'High Risk Detected',
            ],
            [
                'user_id' => null,
                'type' => 'risk_alert',
                'severity' => 'critical',
                'message' => 'PCB Module has reached 94% DeadStock Risk due to 14 months inactivity.',
                'action_url' => '/inventory/PCB-401',
                'action_label' => 'View Product',
                'is_read' => false,
            ]
        );

        Notification::firstOrCreate(
            [
                'company_id' => $abc->id,
                'title' => 'Demand Declining',
            ],
            [
                'user_id' => null,
                'type' => 'demand_drop',
                'severity' => 'warning',
                'message' => 'Plastic Connector demand dropped 32% over 90 days. 30 months stock remaining.',
                'action_url' => '/inventory/PC2048',
                'action_label' => 'Analyze',
                'is_read' => false,
            ]
        );

        Notification::firstOrCreate(
            [
                'company_id' => $abc->id,
                'title' => 'Buyer Found',
            ],
            [
                'user_id' => null,
                'type' => 'buyer_match',
                'severity' => 'success',
                'message' => 'ElectroTech Industries matches your Plastic Connector inventory at 93%.',
                'action_url' => '/matches/PC2048',
                'action_label' => 'View Match',
                'is_read' => false,
            ]
        );
    }
}
