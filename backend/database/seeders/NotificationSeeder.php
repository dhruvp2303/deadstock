<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $abc = Company::where('name', 'ABC Plastics')->first();
        $user = User::where('email', 'demo@deadstock.ai')->first();
        if (!$abc) return;

        Notification::create([
            'user_id' => $user?->id,
            'company_id' => $abc->id,
            'type' => 'risk_alert',
            'severity' => 'critical',
            'title' => 'High Risk Detected',
            'message' => 'PCB Module has reached 94% DeadStock Risk due to 14 months inactivity.',
            'action_url' => '/inventory/PCB-401',
            'action_label' => 'View Product',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $user?->id,
            'company_id' => $abc->id,
            'type' => 'demand_drop',
            'severity' => 'warning',
            'title' => 'Demand Declining',
            'message' => 'Plastic Connector demand dropped 32% over 90 days. 30 months stock remaining.',
            'action_url' => '/inventory/PC2048',
            'action_label' => 'Analyze',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $user?->id,
            'company_id' => $abc->id,
            'type' => 'buyer_match',
            'severity' => 'success',
            'title' => 'Buyer Found',
            'message' => 'ElectroTech Industries matches your Plastic Connector inventory at 93%.',
            'action_url' => '/matches/PC2048',
            'action_label' => 'View Match',
            'is_read' => false,
        ]);
    }
}
