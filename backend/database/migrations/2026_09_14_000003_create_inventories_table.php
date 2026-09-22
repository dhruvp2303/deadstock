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
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('sku')->index();
            $table->string('product_name');
            $table->string('category')->index();
            $table->string('material')->nullable();
            $table->string('dimensions')->nullable();
            $table->text('description')->nullable();
            $table->integer('quantity')->default(0);
            $table->decimal('unit_cost', 12, 2)->default(0);
            $table->decimal('current_value', 14, 2)->default(0);
            $table->decimal('selling_price', 12, 2)->nullable();
            $table->string('condition')->default('New / Surplus');
            $table->string('warehouse_location')->nullable();
            $table->integer('age_months')->default(0);
            $table->date('last_sold_date')->nullable();
            $table->date('last_movement_date')->nullable();
            $table->integer('monthly_demand')->default(0);
            $table->decimal('risk_score', 5, 2)->default(0); // 0.00 to 100.00
            $table->enum('risk_level', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])->default('LOW');
            $table->decimal('estimated_loss', 14, 2)->default(0);
            $table->decimal('estimated_recovery', 14, 2)->default(0);
            $table->string('recommended_action')->nullable();
            $table->text('ai_explanation')->nullable();
            $table->json('demand_forecast_history')->nullable();
            $table->string('status')->default('active'); // active, listed, recovered, archived
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
