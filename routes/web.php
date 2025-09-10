<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\PositionController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\WorkHoursController;
use App\Http\Controllers\Admin\AttendanceController as AdminAttendanceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - handles both guest and authenticated users
Route::get('/', [HomeController::class, 'index'])->name('home');

// User routes (authenticated)
Route::middleware(['auth', 'verified'])->group(function () {
    // Legacy dashboard route (redirect to home)
    Route::get('dashboard', function () {
        return redirect()->route('home');
    })->name('dashboard');

    // Attendance routes for regular users
    Route::controller(AttendanceController::class)->group(function () {
        Route::get('/attendance', 'index')->name('attendance.index');
        Route::post('/attendance', 'store')->name('attendance.store');
        Route::put('/attendance/{attendance}', 'update')->name('attendance.update');
        Route::get('/attendance/history', 'show')->name('attendance.history');
    });

    // User profile routes
    Route::get('/profile', function () {
        $user = auth()->user()->load(['position', 'workHours']);
        return Inertia::render('profile', ['user' => $user]);
    })->name('profile');

    Route::get('/id-card', function () {
        $user = auth()->user()->load(['position', 'workHours']);
        return Inertia::render('id-card', ['user' => $user]);
    })->name('id-card');
});

// Admin routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Admin dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Master data management
    Route::resource('users', AdminUserController::class);
    Route::resource('positions', PositionController::class);
    Route::resource('locations', LocationController::class);
    Route::resource('work-hours', WorkHoursController::class);
    
    // Attendance management
    Route::get('/attendances', [AdminAttendanceController::class, 'index'])->name('attendances.index');
    Route::get('/attendances/{attendance}', [AdminAttendanceController::class, 'show'])->name('attendances.show');
    Route::delete('/attendances/{attendance}', [AdminAttendanceController::class, 'destroy'])->name('attendances.destroy');
    
    // Reports
    Route::get('/reports', function () {
        return Inertia::render('admin/reports/index');
    })->name('reports.index');
    
    // Settings
    Route::get('/settings', function () {
        return Inertia::render('admin/settings/index');
    })->name('settings');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';