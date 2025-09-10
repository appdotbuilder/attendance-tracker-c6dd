<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display the attendance page for users.
     */
    public function index()
    {
        $user = Auth::user();
        $todayAttendance = $user->todayAttendance();
        $locations = Location::active()->get();

        return Inertia::render('attendance/index', [
            'todayAttendance' => $todayAttendance,
            'locations' => $locations,
            'canClockIn' => !$todayAttendance || !$todayAttendance->clock_in,
            'canClockOut' => $todayAttendance && $todayAttendance->clock_in && !$todayAttendance->clock_out,
        ]);
    }

    /**
     * Clock in the user.
     */
    public function store(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'notes' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();
        $today = today();
        
        // Check if user already has attendance for today
        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if ($attendance && $attendance->clock_in) {
            return back()->with('error', 'You have already clocked in today.');
        }

        // Find the closest location and check if within radius
        $closestLocation = $this->findClosestLocation($request->latitude, $request->longitude);
        $isWithinRadius = $closestLocation ? 
            $closestLocation->isWithinRadius($request->latitude, $request->longitude) : false;

        // Create or update attendance record
        $attendanceData = [
            'user_id' => $user->id,
            'location_id' => $closestLocation?->id,
            'date' => $today,
            'clock_in' => now(),
            'clock_in_latitude' => $request->latitude,
            'clock_in_longitude' => $request->longitude,
            'is_within_radius' => $isWithinRadius,
            'notes' => $request->notes,
            'status' => $this->determineStatus($user),
        ];

        if ($attendance) {
            $attendance->update($attendanceData);
        } else {
            $attendance = Attendance::create($attendanceData);
        }

        $message = $isWithinRadius ? 
            'Successfully clocked in!' : 
            'Clocked in successfully, but you are outside the designated area.';

        return redirect()->route('attendance.index')->with('success', $message);
    }

    /**
     * Clock out the user.
     */
    public function update(Request $request, Attendance $attendance)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'notes' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();
        
        if ($attendance->user_id !== $user->id) {
            return back()->with('error', 'Unauthorized action.');
        }

        if ($attendance->clock_out) {
            return back()->with('error', 'You have already clocked out today.');
        }

        $closestLocation = $this->findClosestLocation($request->latitude, $request->longitude);
        $isWithinRadius = $closestLocation ? 
            $closestLocation->isWithinRadius($request->latitude, $request->longitude) : false;

        $attendance->update([
            'clock_out' => now(),
            'clock_out_latitude' => $request->latitude,
            'clock_out_longitude' => $request->longitude,
            'is_within_radius' => $attendance->is_within_radius && $isWithinRadius,
            'notes' => $request->notes ? $attendance->notes . "\n" . $request->notes : $attendance->notes,
        ]);

        $message = $isWithinRadius ? 
            'Successfully clocked out!' : 
            'Clocked out successfully, but you are outside the designated area.';

        return redirect()->route('attendance.index')->with('success', $message);
    }

    /**
     * Display user's attendance history.
     */
    public function show()
    {
        $user = Auth::user();
        $attendances = $user->attendances()
            ->with(['location'])
            ->orderBy('date', 'desc')
            ->paginate(20);

        return Inertia::render('attendance/history', [
            'attendances' => $attendances,
        ]);
    }

    /**
     * Find the closest location to the given coordinates.
     */
    protected function findClosestLocation(float $lat, float $lon): ?Location
    {
        $locations = Location::active()->get();
        
        if ($locations->isEmpty()) {
            return null;
        }

        return $locations->sortBy(function ($location) use ($lat, $lon) {
            return $location->distanceTo($lat, $lon);
        })->first();
    }

    /**
     * Determine attendance status based on time and work hours.
     */
    protected function determineStatus($user): string
    {
        if (!$user->workHours) {
            return 'present';
        }

        $currentTime = now()->format('H:i:s');
        $startTime = $user->workHours->start_time;
        
        // If clocking in more than 15 minutes late, mark as late
        $lateThreshold = date('H:i:s', strtotime($startTime . ' +15 minutes'));
        
        return $currentTime > $lateThreshold ? 'late' : 'present';
    }
}