<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Only seed test fixtures during automated test runs (APP_ENV=testing)
        // In local/production, no dummy companies or demo data are seeded.
        if (app()->environment('testing')) {
            $this->call([
                CompanySeeder::class,
                InventorySeeder::class,
                BuyerMatchSeeder::class,
                MarketplaceSeeder::class,
                RecoveryActionSeeder::class,
                NotificationSeeder::class,
            ]);
        }
    }
}
