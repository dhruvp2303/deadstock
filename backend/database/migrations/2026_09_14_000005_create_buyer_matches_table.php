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
        Schema::create('buyer_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_id')->constrained('inventories')->cascadeOnDelete();
            $table->foreignId('buyer_company_id')->constrained('companies')->cascadeOnDelete();
            $table->decimal('overall_match_score', 5, 2)->default(0); // 0.00 to 100.00
            $table->decimal('product_compatibility', 5, 2)->default(0);
            $table->decimal('quantity_compatibility', 5, 2)->default(0);
            $table->decimal('industry_compatibility', 5, 2)->default(0);
            $table->decimal('location_compatibility', 5, 2)->default(0);
            $table->decimal('price_compatibility', 5, 2)->default(0);
            $table->integer('required_units')->default(0);
            $table->decimal('potential_deal_value', 14, 2)->default(0);
            $table->json('compatibility_tags')->nullable(); // e.g. ["Material", "Dimensions", "Category"]
            $table->text('notes')->nullable();
            $table->string('status')->default('suggested'); // suggested, contacted, negotiated, closed, dismissed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buyer_matches');
    }
};
