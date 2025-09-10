<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Location>
 */
class LocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company() . ' Office',
            'address' => fake()->address(),
            'latitude' => fake()->latitude(-90, 90),
            'longitude' => fake()->longitude(-180, 180),
            'radius' => fake()->randomElement([50, 100, 150, 200, 300]),
            'is_active' => fake()->boolean(85),
        ];
    }

    /**
     * Indicate that the location is a main office.
     */
    public function mainOffice(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Main Office',
            'radius' => 100,
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the location is a branch office.
     */
    public function branch(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Branch Office - ' . fake()->city(),
            'radius' => 150,
        ]);
    }
}