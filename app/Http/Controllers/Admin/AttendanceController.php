<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of all attendances.
     */
    public function index(Request $request)
    {
        $query = Attendance::with(['user', 'location'])
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc');

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }
        
        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by location compliance
        if ($request->filled('radius_compliance')) {
            if ($request->radius_compliance === 'within') {
                $query->where('is_within_radius', true);
            } elseif ($request->radius_compliance === 'outside') {
                $query->where('is_within_radius', false);
            }
        }

        $attendances = $query->paginate(20)->withQueryString();

        // Get filter options
        $users = \App\Models\User::where('role', 'user')->active()->orderBy('name')->get(['id', 'name']);
        $statuses = ['present', 'late', 'absent', 'sick', 'leave'];

        return Inertia::render('admin/attendances/index', [
            'attendances' => $attendances,
            'filters' => $request->only(['date_from', 'date_to', 'user_id', 'status', 'radius_compliance']),
            'users' => $users,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Display the specified attendance.
     */
    public function show(Attendance $attendance)
    {
        $attendance->load(['user.position', 'user.workHours', 'location']);

        return Inertia::render('admin/attendances/show', [
            'attendance' => $attendance,
        ]);
    }

    /**
     * Remove the specified attendance from storage.
     */
    public function destroy(Attendance $attendance)
    {
        $attendance->delete();

        return redirect()->route('admin.attendances.index')
            ->with('success', 'Attendance record deleted successfully.');
    }
}