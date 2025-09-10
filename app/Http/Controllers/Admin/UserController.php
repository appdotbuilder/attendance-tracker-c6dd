<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Models\Position;
use App\Models\WorkHours;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::with(['position', 'workHours'])
            ->where('role', 'user')
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $positions = Position::active()->orderBy('name')->get();
        $workHours = WorkHours::active()->orderBy('name')->get();

        return Inertia::render('admin/users/create', [
            'positions' => $positions,
            'workHours' => $workHours,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create($request->validated());

        return redirect()->route('admin.users.show', $user)
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $user->load(['position', 'workHours', 'attendances' => function ($query) {
            $query->with('location')->orderBy('date', 'desc')->limit(10);
        }]);

        // Get attendance statistics (database-agnostic)
        $attendanceStats = $user->attendances()
            ->selectRaw('
                COUNT(*) as total_days,
                SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present_days,
                SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END) as late_days,
                SUM(CASE WHEN status = "absent" THEN 1 ELSE 0 END) as absent_days
            ')
            ->first();

        // Calculate average work minutes manually
        $avgWorkMinutes = 0;
        $workDayCount = 0;
        $attendancesWithTimes = $user->attendances()
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
        $attendanceStatsArray = $attendanceStats ? $attendanceStats->toArray() : [];
        $attendanceStatsArray['avg_work_minutes'] = $avgWorkMinutes;
        $attendanceStats = (object) $attendanceStatsArray;

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'attendanceStats' => $attendanceStats,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $positions = Position::active()->orderBy('name')->get();
        $workHours = WorkHours::active()->orderBy('name')->get();

        return Inertia::render('admin/users/edit', [
            'user' => $user,
            'positions' => $positions,
            'workHours' => $workHours,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->validated());

        return redirect()->route('admin.users.show', $user)
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        // Soft delete by deactivating instead of hard delete
        $user->update(['is_active' => false]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User deactivated successfully.');
    }
}