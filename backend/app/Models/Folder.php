<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    use HasFactory;
    protected $table='folders';
    protected $fillable = [
        'name',
        'student_id',
        'course_id',
    ];

    protected $casts = [
        'name' => 'string',
    ];
    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }


}
