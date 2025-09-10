<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Position>
 */
class PositionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->jobTitle(),
            'description' => fake()->paragraph(),
            'salary' => fake()->randomFloat(2, 30000, 150000),
            'is_active' => fake()->boolean(85),
        ];
    }

    /**
     * Indicate that the position is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the position is high-paying.
     */
    public function senior(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Senior ' . fake()->jobTitle(),
            'salary' => fake()->randomFloat(2, 100000, 200000),
        ]);
    }
}