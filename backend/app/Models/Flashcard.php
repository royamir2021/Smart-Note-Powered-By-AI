<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flashcard extends Model
{
    use HasFactory;
    protected $table = 'flashcards';
    protected $fillable=[
        'question',
        'answer',
        'note_id',
    ];
    public function note()
    {
        return $this->belongsTo(Note::class);
    }


}
