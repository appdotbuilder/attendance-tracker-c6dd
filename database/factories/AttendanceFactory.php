<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $date = fake()->dateTimeBetween('-30 days', 'now');
        $clockIn = $date->setTime(
            fake()->numberBetween(8, 10),
            fake()->numberBetween(0, 59),
            0
        );
        
        $clockOut = null;
        if (fake()->boolean(80)) {
            $clockOut = (clone $clockIn)->modify('+' . fake()->numberBetween(7, 9) . ' hours');
        }

        return [
            'user_id' => User::factory(),
            'location_id' => Location::factory(),
            'date' => $date->format('Y-m-d'),
            'clock_in' => $clockIn,
            'clock_out' => $clockOut,
            'clock_in_latitude' => fake()->latitude(-90, 90),
            'clock_in_longitude' => fake()->longitude(-180, 180),
            'clock_out_latitude' => $clockOut ? fake()->latitude(-90, 90) : null,
            'clock_out_longitude' => $clockOut ? fake()->longitude(-180, 180) : null,
            'is_within_radius' => fake()->boolean(85),
            'notes' => fake()->optional()->sentence(),
            'status' => fake()->randomElement(['present', 'late', 'absent', 'sick', 'leave']),
        ];
    }

    /**
     * Indicate that the attendance is for today.
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'date' => today()->format('Y-m-d'),
        ]);
    }

    /**
     * Indicate that the attendance is late.
     */
    public function late(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'late',
            'clock_in' => today()->setTime(10, random_int(30, 59)),
        ]);
    }

    /**
     * Indicate that the user is still clocked in.
     */
    public function clockedIn(): static
    {
        return $this->state(fn (array $attributes) => [
            'clock_out' => null,
            'clock_out_latitude' => null,
            'clock_out_longitude' => null,
        ]);
    }
}