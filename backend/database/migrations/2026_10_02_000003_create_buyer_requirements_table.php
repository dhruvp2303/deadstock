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
        Schema::create('buyer_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('target_keyword')->nullable();
            $table->json('target_skus')->nullable();
            $table->integer('min_quantity')->default(100);
            $table->decimal('max_budget', 14, 2)->default(500000);
            $table->json('acceptable_conditions')->nullable();
            $table->string('preferred_location')->nullable();
            $table->string('urgency')->default('MEDIUM'); // LOW, MEDIUM, HIGH, IMMEDIATE
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->index(['company_id', 'is_active']);
            $table->index(['category_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buyer_requirements');
    }
};
