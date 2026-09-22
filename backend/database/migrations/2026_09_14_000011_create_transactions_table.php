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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('reference_no')->unique(); // e.g. TXN-2026-0042
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete(); // seller
            $table->foreignId('buyer_company_id')->nullable()->constrained('companies')->nullOnDelete(); // buyer
            $table->foreignId('inventory_id')->constrained('inventories')->cascadeOnDelete();
            $table->string('transaction_type'); // b2b_sale, transfer, supplier_return, marketplace_order, recycle, discount_sale
            $table->integer('quantity');
            $table->decimal('unit_price', 12, 2)->default(0);
            $table->decimal('total_amount', 14, 2)->default(0);
            $table->decimal('recovery_value', 14, 2)->default(0);
            $table->string('status')->default('completed'); // pending, completed, cancelled
            $table->text('notes')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
