<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for big database enterprise scale and performance.
     */
    public function up(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            $table->index(['company_id', 'status'], 'idx_inv_company_status');
            $table->index(['company_id', 'risk_score'], 'idx_inv_company_risk');
            $table->index(['sku', 'company_id'], 'idx_inv_sku_company');
        });

        Schema::table('marketplace_listings', function (Blueprint $table) {
            $table->index(['company_id', 'status'], 'idx_mkt_company_status');
            $table->index(['status', 'created_at'], 'idx_mkt_status_created');
        });

        Schema::table('offers', function (Blueprint $table) {
            $table->index(['seller_company_id', 'status'], 'idx_offers_seller_status');
            $table->index(['buyer_company_id', 'status'], 'idx_offers_buyer_status');
        });

        Schema::table('buyer_matches', function (Blueprint $table) {
            $table->index(['buyer_company_id', 'match_score'], 'idx_bm_buyer_score');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->index(['company_id', 'is_read', 'created_at'], 'idx_notif_company_read_created');
        });

        Schema::table('inventory_movements', function (Blueprint $table) {
            $table->index(['company_id', 'created_at'], 'idx_movements_company_created');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->index(['company_id', 'created_at'], 'idx_tx_company_created');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index(['company_id', 'role'], 'idx_users_company_role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            $table->dropIndex('idx_inv_company_status');
            $table->dropIndex('idx_inv_company_risk');
            $table->dropIndex('idx_inv_sku_company');
        });

        Schema::table('marketplace_listings', function (Blueprint $table) {
            $table->dropIndex('idx_mkt_company_status');
            $table->dropIndex('idx_mkt_status_created');
        });

        Schema::table('offers', function (Blueprint $table) {
            $table->dropIndex('idx_offers_seller_status');
            $table->dropIndex('idx_offers_buyer_status');
        });

        Schema::table('buyer_matches', function (Blueprint $table) {
            $table->dropIndex('idx_bm_buyer_score');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex('idx_notif_company_read_created');
        });

        Schema::table('inventory_movements', function (Blueprint $table) {
            $table->dropIndex('idx_movements_company_created');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('idx_tx_company_created');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_company_role');
        });
    }
};
