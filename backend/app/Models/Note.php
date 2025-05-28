<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
     use HasFactory;

    protected $table = 'notes';

    protected $fillable = ['student_id', 'course_id', 'unit_number', 'lesson_title', 'title', 'content'];
    protected $casts = [
        'unit_number' => 'integer',
        'lesson_title' => 'string',
        'title' => 'string',
        'content' => 'array',
    ];
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function flashcards()
{
    return $this->hasMany(Flashcard::class);
}
    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }

}
