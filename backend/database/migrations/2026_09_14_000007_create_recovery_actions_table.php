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
        Schema::create('recovery_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_id')->constrained('inventories')->cascadeOnDelete();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('action_type'); // sell, transfer, return, recycle, discount
            $table->string('channel_name')->nullable(); // e.g. "B2B Matched Sale", "Inter-warehouse transfer"
            $table->decimal('original_value', 14, 2)->default(0);
            $table->decimal('estimated_recovery', 14, 2)->default(0);
            $table->decimal('recovered_value', 14, 2)->default(0);
            $table->decimal('recovery_percentage', 5, 2)->default(0);
            $table->integer('units_diverted')->default(0);
            $table->decimal('waste_avoided_kg', 10, 2)->default(0);
            $table->string('status')->default('completed'); // planned, in_progress, completed, cancelled
            $table->text('notes')->nullable();
            $table->timestamp('executed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recovery_actions');
    }
};
