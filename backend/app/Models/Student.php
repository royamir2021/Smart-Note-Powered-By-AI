<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;
    protected $table = 'students';
    protected $fillable = ['name', 'email', 'password', 'phone'];
    protected $casts = [
        'name' => 'string',
        'email' => 'string',
        'password' => 'string',
        'phone' => 'string',
    ];
    public function notes()
    {
        return $this->hasMany(Note::class);
    }
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_student');
    }
    public function getAuthPassword()
    {
        return $this->password;
    }
}
