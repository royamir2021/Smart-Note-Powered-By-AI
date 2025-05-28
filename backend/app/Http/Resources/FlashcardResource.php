<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FlashcardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
//        if (request()->query('only') === 'title') {
//            return [
//                'id' => $this->id,
//                'note_title' => optional($this->note)->title,
//            ];
//        }
        return [
            'id' => $this->id,
            'question' => $this->question,
            'answer' => $this->answer,
            'note_id' => $this->note_id,
            'note_title' => optional($this->note)->title,
        ];
    }
}
