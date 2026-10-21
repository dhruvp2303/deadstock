<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add is_demo flag to companies table
        if (!Schema::hasColumn('companies', 'is_demo')) {
            Schema::table('companies', function (Blueprint $table) {
                $table->boolean('is_demo')->default(false)->index();
            });
        }

        // 2. Add is_demo flag to users table
        if (!Schema::hasColumn('users', 'is_demo')) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('is_demo')->default(false)->index();
            });
        }

        // 3. Add user_id to inventories table
        if (!Schema::hasColumn('inventories', 'user_id')) {
            Schema::table('inventories', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('company_id')->constrained('users')->cascadeOnDelete()->index();
            });
        }

        // 4. Add user_id to warehouses table
        if (!Schema::hasColumn('warehouses', 'user_id')) {
            Schema::table('warehouses', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('company_id')->constrained('users')->cascadeOnDelete()->index();
            });
        }

        // 5. Add user_id to marketplace_listings table
        if (!Schema::hasColumn('marketplace_listings', 'user_id')) {
            Schema::table('marketplace_listings', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('company_id')->constrained('users')->cascadeOnDelete()->index();
            });
        }

        // 6. Add user_id to recovery_actions table
        if (!Schema::hasColumn('recovery_actions', 'user_id')) {
            Schema::table('recovery_actions', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('company_id')->constrained('users')->cascadeOnDelete()->index();
            });
        }

        // 7. Add user_id to offers table
        if (!Schema::hasColumn('offers', 'user_id')) {
            Schema::table('offers', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('sender_company_id')->constrained('users')->cascadeOnDelete()->index();
            });
        }

        // 8. Add user_id to transactions table
        if (!Schema::hasColumn('transactions', 'user_id')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('company_id')->constrained('users')->cascadeOnDelete()->index();
            });
        }

        // Backfill user_id on existing records
        $defaultUserId = DB::table('users')->value('id');

        if ($defaultUserId) {
            // Backfill inventories
            $inventories = DB::table('inventories')->whereNull('user_id')->get(['id', 'company_id']);
            foreach ($inventories as $inv) {
                $uid = DB::table('users')->where('company_id', $inv->company_id)->value('id') ?? $defaultUserId;
                DB::table('inventories')->where('id', $inv->id)->update(['user_id' => $uid]);
            }

            // Backfill warehouses
            $warehouses = DB::table('warehouses')->whereNull('user_id')->get(['id', 'company_id']);
            foreach ($warehouses as $wh) {
                $uid = DB::table('users')->where('company_id', $wh->company_id)->value('id') ?? $defaultUserId;
                DB::table('warehouses')->where('id', $wh->id)->update(['user_id' => $uid]);
            }

            // Backfill marketplace_listings
            $listings = DB::table('marketplace_listings')->whereNull('user_id')->get(['id', 'company_id']);
            foreach ($listings as $lst) {
                $uid = DB::table('users')->where('company_id', $lst->company_id)->value('id') ?? $defaultUserId;
                DB::table('marketplace_listings')->where('id', $lst->id)->update(['user_id' => $uid]);
            }

            // Backfill recovery_actions
            $actions = DB::table('recovery_actions')->whereNull('user_id')->get(['id', 'company_id']);
            foreach ($actions as $act) {
                $uid = DB::table('users')->where('company_id', $act->company_id)->value('id') ?? $defaultUserId;
                DB::table('recovery_actions')->where('id', $act->id)->update(['user_id' => $uid]);
            }

            // Backfill offers
            $offers = DB::table('offers')->whereNull('user_id')->get(['id', 'sender_company_id']);
            foreach ($offers as $off) {
                $uid = DB::table('users')->where('company_id', $off->sender_company_id)->value('id') ?? $defaultUserId;
                DB::table('offers')->where('id', $off->id)->update(['user_id' => $uid]);
            }

            // Backfill transactions
            $transactions = DB::table('transactions')->whereNull('user_id')->get(['id', 'company_id']);
            foreach ($transactions as $txn) {
                $uid = DB::table('users')->where('company_id', $txn->company_id)->value('id') ?? $defaultUserId;
                DB::table('transactions')->where('id', $txn->id)->update(['user_id' => $uid]);
            }
        }

        // Tag demo account entities with is_demo = true
        DB::table('companies')
            ->where('name', 'DeadStock Showcase Corp')
            ->orWhere('name', 'ElectroTech Industries')
            ->orWhere('name', 'Nova Components')
            ->orWhere('name', 'Apex Controls & Retrofits')
            ->orWhere('name', 'Bharat Auto Assemblies')
            ->orWhere('name', 'Nagpur Pack & Logistics')
            ->orWhere('name', 'GreenPolymer Circular Recyclers')
            ->orWhere('name', 'Gujarat Industrial Systems')
            ->update(['is_demo' => true]);

        DB::table('users')
            ->where('email', 'demo-explorer@deadstock.internal')
            ->update(['is_demo' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('is_demo');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_demo');
        });
        Schema::table('inventories', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
        Schema::table('warehouses', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
        Schema::table('marketplace_listings', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
        Schema::table('recovery_actions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
        Schema::table('offers', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
