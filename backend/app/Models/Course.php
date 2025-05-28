<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    protected $table = 'courses';
    protected $fillable = ['title'];
    protected $casts = [
        'title' => 'string',
    ];
    public function students()
    {
        return $this->belongsToMany(Student::class, 'course_student');
    }
    public function notes()
    {
        return $this->hasMany(Note::class);
    }
    public function folders()
    {
        return $this->hasMany(Folder::class);
    }

}
