<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Attendance;
use App\Models\Location;
use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        $today = today();
        
        // Get statistics
        $totalEmployees = User::where('role', 'user')->active()->count();
        $totalLocations = Location::active()->count();
        $totalPositions = Position::active()->count();
        
        // Today's attendance stats
        $todayAttendances = Attendance::whereDate('date', $today)
            ->with(['user', 'location'])
            ->get();
            
        $presentToday = $todayAttendances->where('status', 'present')->count();
        $lateToday = $todayAttendances->where('status', 'late')->count();
        $absentToday = $totalEmployees - $todayAttendances->count();
        
        // Recent attendance records
        $recentAttendances = Attendance::with(['user', 'location'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        // Monthly stats
        $monthlyStats = Attendance::whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->selectRaw('
                COUNT(*) as total_records,
                SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present_count,
                SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END) as late_count,
                SUM(CASE WHEN status = "absent" THEN 1 ELSE 0 END) as absent_count,
                SUM(CASE WHEN is_within_radius = 0 THEN 1 ELSE 0 END) as outside_radius_count
            ')
            ->first();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalEmployees' => $totalEmployees,
                'totalLocations' => $totalLocations,
                'totalPositions' => $totalPositions,
                'presentToday' => $presentToday,
                'lateToday' => $lateToday,
                'absentToday' => $absentToday,
            ],
            'monthlyStats' => $monthlyStats,
            'recentAttendances' => $recentAttendances,
            'todayAttendances' => $todayAttendances,
        ]);
    }
}