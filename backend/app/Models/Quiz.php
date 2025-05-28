<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;
    protected $fillable = ['note_id', 'question', 'options', 'correct_index'];

    protected $casts = [
        'options' => 'array',
    ];
    public function note()
    {
        return $this->belongsTo(Note::class);
    }

}
