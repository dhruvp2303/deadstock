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
        Schema::create('marketplace_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('inventory_id')->nullable()->constrained('inventories')->nullOnDelete();
            $table->string('title');
            $table->string('category')->index();
            $table->text('description')->nullable();
            $table->integer('units_available')->default(0);
            $table->decimal('price_per_unit', 12, 2)->default(0);
            $table->string('unit_label')->default('unit'); // unit, piece, kg, box
            $table->string('condition')->default('Surplus / Unused');
            $table->string('location')->nullable();
            $table->decimal('match_score', 5, 2)->default(85);
            $table->string('status')->default('active'); // active, pending, sold, expired
            $table->json('images')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketplace_listings');
    }
};
