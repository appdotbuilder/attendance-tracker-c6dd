<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLocationRequest;
use App\Http\Requests\UpdateLocationRequest;
use App\Models\Location;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Display a listing of the locations.
     */
    public function index()
    {
        $locations = Location::withCount('attendances')
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/locations/index', [
            'locations' => $locations,
        ]);
    }

    /**
     * Show the form for creating a new location.
     */
    public function create()
    {
        return Inertia::render('admin/locations/create');
    }

    /**
     * Store a newly created location in storage.
     */
    public function store(StoreLocationRequest $request)
    {
        $location = Location::create($request->validated());

        return redirect()->route('admin.locations.show', $location)
            ->with('success', 'Location created successfully.');
    }

    /**
     * Display the specified location.
     */
    public function show(Location $location)
    {
        $location->load(['attendances' => function ($query) {
            $query->with('user')->orderBy('date', 'desc')->limit(20);
        }]);

        // Get location statistics
        $locationStats = $location->attendances()
            ->selectRaw('
                COUNT(*) as total_attendances,
                COUNT(DISTINCT user_id) as unique_users,
                SUM(CASE WHEN is_within_radius = 1 THEN 1 ELSE 0 END) as within_radius_count,
                SUM(CASE WHEN is_within_radius = 0 THEN 1 ELSE 0 END) as outside_radius_count
            ')
            ->first();

        return Inertia::render('admin/locations/show', [
            'location' => $location,
            'locationStats' => $locationStats,
        ]);
    }

    /**
     * Show the form for editing the specified location.
     */
    public function edit(Location $location)
    {
        return Inertia::render('admin/locations/edit', [
            'location' => $location,
        ]);
    }

    /**
     * Update the specified location in storage.
     */
    public function update(UpdateLocationRequest $request, Location $location)
    {
        $location->update($request->validated());

        return redirect()->route('admin.locations.show', $location)
            ->with('success', 'Location updated successfully.');
    }

    /**
     * Remove the specified location from storage.
     */
    public function destroy(Location $location)
    {
        if ($location->attendances()->count() > 0) {
            return back()->with('error', 'Cannot delete location with attendance records.');
        }

        $location->delete();

        return redirect()->route('admin.locations.index')
            ->with('success', 'Location deleted successfully.');
    }
}