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
        Schema::create('work_hours', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Work schedule name');
            $table->time('start_time')->comment('Work start time');
            $table->time('end_time')->comment('Work end time');
            $table->integer('break_duration')->default(60)->comment('Break duration in minutes');
            $table->json('work_days')->comment('Working days (0=Sunday, 1=Monday, etc.)');
            $table->boolean('is_active')->default(true)->comment('Schedule status');
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
        Schema::dropIfExists('work_hours');
    }
};