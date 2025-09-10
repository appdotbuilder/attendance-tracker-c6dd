<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WorkHours>
 */
class WorkHoursFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $shifts = [
            ['name' => 'Day Shift', 'start' => '09:00:00', 'end' => '17:00:00'],
            ['name' => 'Morning Shift', 'start' => '08:00:00', 'end' => '16:00:00'],
            ['name' => 'Afternoon Shift', 'start' => '13:00:00', 'end' => '21:00:00'],
            ['name' => 'Night Shift', 'start' => '22:00:00', 'end' => '06:00:00'],
        ];

        $shift = fake()->randomElement($shifts);

        return [
            'name' => $shift['name'],
            'start_time' => $shift['start'],
            'end_time' => $shift['end'],
            'break_duration' => fake()->randomElement([30, 45, 60, 90]),
            'work_days' => fake()->randomElement([
                [1, 2, 3, 4, 5], // Monday to Friday
                [1, 2, 3, 4, 5, 6], // Monday to Saturday
                [0, 1, 2, 3, 4, 5, 6], // All days
            ]),
            'is_active' => fake()->boolean(90),
        ];
    }

    /**
     * Indicate that the work hours are for full-time.
     */
    public function fullTime(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Full Time',
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
            'work_days' => [1, 2, 3, 4, 5],
            'break_duration' => 60,
        ]);
    }

    /**
     * Indicate that the work hours are for part-time.
     */
    public function partTime(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Part Time',
            'start_time' => '09:00:00',
            'end_time' => '13:00:00',
            'work_days' => fake()->randomElement([[1, 3, 5], [2, 4, 6]]),
            'break_duration' => 30,
        ]);
    }
}