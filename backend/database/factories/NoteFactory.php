<?php

namespace Database\Factories;

use App\Models\Note;
use App\Models\Student;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

class NoteFactory extends Factory
{
    protected $model = Note::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(4),
            'content' => json_encode([
                'type' => 'doc',
                'content' => [
                    [
                        'type' => 'paragraph',
                        'content' => [
                            ['type' => 'text', 'text' => $this->faker->paragraph],
                        ],
                    ],
                ],
            ]),
            'unit_number' => $this->faker->numberBetween(1, 10),
            'lesson_title' => $this->faker->sentence(3),
            'student_id' => null,
            'course_id' => null,
            'folder_id' => null,
        ];
    }

//    public function withFolder()
//    {
//        return $this->state(function () {
//            return [
//                'folder_id' => \App\Models\Folder::factory(),
//            ];
//        });
//    }
}
