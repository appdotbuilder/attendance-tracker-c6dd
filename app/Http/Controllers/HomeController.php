<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        if (!Auth::check()) {
            return Inertia::render('welcome');
        }

        $user = Auth::user();
        
        // Redirect admin users to admin dashboard
        if ($user->is_admin) {
            return redirect()->route('admin.dashboard');
        }

        // For regular users, show user dashboard
        $todayAttendance = $user->todayAttendance();
        
        // Get recent attendance history
        $recentAttendances = $user->attendances()
            ->with('location')
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        // Get this month's statistics
        $monthlyStats = $user->attendances()
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->selectRaw('
                COUNT(*) as total_days,
                SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present_days,
                SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END) as late_days
            ')
            ->first();

        // Calculate average work minutes manually (database-agnostic)
        $avgWorkMinutes = 0;
        $workDayCount = 0;
        $attendancesWithTimes = $user->attendances()
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->whereNotNull('clock_in')
            ->whereNotNull('clock_out')
            ->get();

        /** @var \App\Models\Attendance $attendance */
        foreach ($attendancesWithTimes as $attendance) {
            if ($attendance->clock_in && $attendance->clock_out) {
                $clockIn = new \Carbon\Carbon($attendance->clock_in);
                $clockOut = new \Carbon\Carbon($attendance->clock_out);
                $avgWorkMinutes += $clockOut->diffInMinutes($clockIn);
                $workDayCount++;
            }
        }

        if ($workDayCount > 0) {
            $avgWorkMinutes = round($avgWorkMinutes / $workDayCount);
        }

        // Convert to array and add avg_work_minutes
        $monthlyStatsArray = $monthlyStats ? $monthlyStats->toArray() : [];
        $monthlyStatsArray['avg_work_minutes'] = $avgWorkMinutes;
        $monthlyStats = (object) $monthlyStatsArray;

        return Inertia::render('user-dashboard', [
            'user' => $user->load(['position', 'workHours']),
            'todayAttendance' => $todayAttendance,
            'recentAttendances' => $recentAttendances,
            'monthlyStats' => $monthlyStats,
        ]);
    }
}