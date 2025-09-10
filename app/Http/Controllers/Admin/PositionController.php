<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePositionRequest;
use App\Http\Requests\UpdatePositionRequest;
use App\Models\Position;
use Inertia\Inertia;

class PositionController extends Controller
{
    /**
     * Display a listing of the positions.
     */
    public function index()
    {
        $positions = Position::withCount('users')
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/positions/index', [
            'positions' => $positions,
        ]);
    }

    /**
     * Show the form for creating a new position.
     */
    public function create()
    {
        return Inertia::render('admin/positions/create');
    }

    /**
     * Store a newly created position in storage.
     */
    public function store(StorePositionRequest $request)
    {
        $position = Position::create($request->validated());

        return redirect()->route('admin.positions.show', $position)
            ->with('success', 'Position created successfully.');
    }

    /**
     * Display the specified position.
     */
    public function show(Position $position)
    {
        $position->load(['users' => function ($query) {
            $query->active()->orderBy('name');
        }]);

        return Inertia::render('admin/positions/show', [
            'position' => $position,
        ]);
    }

    /**
     * Show the form for editing the specified position.
     */
    public function edit(Position $position)
    {
        return Inertia::render('admin/positions/edit', [
            'position' => $position,
        ]);
    }

    /**
     * Update the specified position in storage.
     */
    public function update(UpdatePositionRequest $request, Position $position)
    {
        $position->update($request->validated());

        return redirect()->route('admin.positions.show', $position)
            ->with('success', 'Position updated successfully.');
    }

    /**
     * Remove the specified position from storage.
     */
    public function destroy(Position $position)
    {
        if ($position->users()->count() > 0) {
            return back()->with('error', 'Cannot delete position with assigned users.');
        }

        $position->delete();

        return redirect()->route('admin.positions.index')
            ->with('success', 'Position deleted successfully.');
    }
}