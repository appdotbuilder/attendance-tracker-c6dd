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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('location_id')->nullable()->constrained()->onDelete('set null');
            $table->date('date')->comment('Attendance date');
            $table->timestamp('clock_in')->nullable()->comment('Clock in time');
            $table->timestamp('clock_out')->nullable()->comment('Clock out time');
            $table->decimal('clock_in_latitude', 10, 7)->nullable()->comment('Clock in GPS latitude');
            $table->decimal('clock_in_longitude', 10, 7)->nullable()->comment('Clock in GPS longitude');
            $table->decimal('clock_out_latitude', 10, 7)->nullable()->comment('Clock out GPS latitude');
            $table->decimal('clock_out_longitude', 10, 7)->nullable()->comment('Clock out GPS longitude');
            $table->boolean('is_within_radius')->default(true)->comment('Whether attendance is within valid location');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->enum('status', ['present', 'late', 'absent', 'sick', 'leave'])->default('present');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('date');
            $table->index(['user_id', 'date']);
            $table->index('status');
            $table->index('is_within_radius');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};