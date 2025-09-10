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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('position_id')->nullable()->after('email')->constrained()->onDelete('set null');
            $table->foreignId('work_hours_id')->nullable()->after('position_id')->constrained()->onDelete('set null');
            $table->string('employee_id')->unique()->nullable()->after('work_hours_id')->comment('Unique employee identifier');
            $table->string('phone')->nullable()->after('employee_id')->comment('Employee phone number');
            $table->text('address')->nullable()->after('phone')->comment('Employee address');
            $table->date('hire_date')->nullable()->after('address')->comment('Date of hire');
            $table->enum('role', ['admin', 'user'])->default('user')->after('hire_date')->comment('User role');
            $table->boolean('is_active')->default(true)->after('role')->comment('User status');
            $table->string('avatar')->nullable()->after('is_active')->comment('Profile picture path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['position_id']);
            $table->dropForeign(['work_hours_id']);
            $table->dropColumn([
                'position_id',
                'work_hours_id', 
                'employee_id',
                'phone',
                'address',
                'hire_date',
                'role',
                'is_active',
                'avatar'
            ]);
        });
    }
};