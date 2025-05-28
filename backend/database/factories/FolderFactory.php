<?php

namespace Database\Factories;

use App\Models\Folder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Folder>
 */
class FolderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Folder::class;
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'student_id' => null,
            'course_id' => null,
        ];
    }
}
