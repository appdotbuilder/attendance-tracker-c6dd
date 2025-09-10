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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Location name');
            $table->text('address')->comment('Full address');
            $table->decimal('latitude', 10, 7)->comment('GPS latitude coordinate');
            $table->decimal('longitude', 10, 7)->comment('GPS longitude coordinate');
            $table->integer('radius')->default(100)->comment('Valid attendance radius in meters');
            $table->boolean('is_active')->default(true)->comment('Location status');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('name');
            $table->index(['latitude', 'longitude']);
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};