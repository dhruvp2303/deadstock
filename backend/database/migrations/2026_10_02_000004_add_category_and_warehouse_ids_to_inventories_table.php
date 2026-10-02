<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('category')->constrained('categories')->nullOnDelete();
            $table->foreignId('warehouse_id')->nullable()->after('warehouse_location')->constrained('warehouses')->nullOnDelete();
            $table->softDeletes()->after('status');

            $table->index(['company_id', 'category_id']);
            $table->index(['company_id', 'warehouse_id']);
            $table->index(['company_id', 'risk_score']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropForeign(['warehouse_id']);
            $table->dropColumn(['category_id', 'warehouse_id', 'deleted_at']);
        });
    }
};
