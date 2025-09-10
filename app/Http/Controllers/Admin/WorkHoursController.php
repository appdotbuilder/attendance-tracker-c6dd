<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWorkHoursRequest;
use App\Http\Requests\UpdateWorkHoursRequest;
use App\Models\WorkHours;
use Inertia\Inertia;

class WorkHoursController extends Controller
{
    /**
     * Display a listing of the work hours.
     */
    public function index()
    {
        $workHours = WorkHours::withCount('users')
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/work-hours/index', [
            'workHours' => $workHours,
        ]);
    }

    /**
     * Show the form for creating a new work hours.
     */
    public function create()
    {
        return Inertia::render('admin/work-hours/create');
    }

    /**
     * Store a newly created work hours in storage.
     */
    public function store(StoreWorkHoursRequest $request)
    {
        $workHours = WorkHours::create($request->validated());

        return redirect()->route('admin.work-hours.show', $workHours)
            ->with('success', 'Work hours created successfully.');
    }

    /**
     * Display the specified work hours.
     */
    public function show(WorkHours $workHours)
    {
        $workHours->load(['users' => function ($query) {
            $query->active()->orderBy('name');
        }]);

        return Inertia::render('admin/work-hours/show', [
            'workHours' => $workHours,
        ]);
    }

    /**
     * Show the form for editing the specified work hours.
     */
    public function edit(WorkHours $workHours)
    {
        return Inertia::render('admin/work-hours/edit', [
            'workHours' => $workHours,
        ]);
    }

    /**
     * Update the specified work hours in storage.
     */
    public function update(UpdateWorkHoursRequest $request, WorkHours $workHours)
    {
        $workHours->update($request->validated());

        return redirect()->route('admin.work-hours.show', $workHours)
            ->with('success', 'Work hours updated successfully.');
    }

    /**
     * Remove the specified work hours from storage.
     */
    public function destroy(WorkHours $workHours)
    {
        if ($workHours->users()->count() > 0) {
            return back()->with('error', 'Cannot delete work hours with assigned users.');
        }

        $workHours->delete();

        return redirect()->route('admin.work-hours.index')
            ->with('success', 'Work hours deleted successfully.');
    }
}