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
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_id')->constrained('inventories')->cascadeOnDelete();
            $table->foreignId('sender_company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('receiver_company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('buyer_match_id')->nullable()->constrained('buyer_matches')->nullOnDelete();
            $table->integer('offered_quantity');
            $table->decimal('offered_unit_price', 12, 2)->default(0);
            $table->decimal('total_deal_value', 14, 2)->default(0);
            $table->string('status')->default('pending'); // pending, accepted, declined, countered
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
