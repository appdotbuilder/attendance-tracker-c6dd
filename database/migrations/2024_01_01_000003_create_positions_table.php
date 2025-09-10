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
        Schema::create('positions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Position name');
            $table->text('description')->nullable()->comment('Position description');
            $table->decimal('salary', 12, 2)->nullable()->comment('Base salary');
            $table->boolean('is_active')->default(true)->comment('Position status');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('name');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('positions');
    }
};