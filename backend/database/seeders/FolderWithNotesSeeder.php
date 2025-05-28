<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Course;
use App\Models\Folder;
use App\Models\Note;

class FolderWithNotesSeeder extends Seeder
{
    public function run(): void
    {

        $students = Student::factory(5)->create();

        foreach ($students as $student) {

            $courses = Course::factory(3)->create();

            foreach ($courses as $course) {

                $folder = Folder::factory()->create([
                    'name' => '🗂 ' . $course->title . ' - ' . $student->name,
                    'student_id' => $student->id,
                    'course_id' => $course->id,
                ]);


                Note::factory()->create([
                    'student_id' => $student->id,
                    'course_id' => $course->id,
                    'folder_id' => $folder->id,
                    'title' => 'Note for ' . $course->title,
                ]);
            }
        }
    }
}
