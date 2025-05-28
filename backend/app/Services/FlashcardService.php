<?php
namespace App\Services;

use App\Models\Flashcard;
use App\Models\Note;
use App\Helpers\JsonToText;
use Illuminate\Support\Facades\Http;

class FlashcardService
{
    /**
     * Generates flashcards for a given note using OpenAI, stores them in DB, and returns them.
     * If the total flashcards for the note exceeds 20, deletes the oldest ones to keep the total at 20.
     *
     * @param Note $note
     * @param int $count Number of flashcards to generate (default: 5)
     * @return array
     * @throws \Exception
     */
    public function generateFlashcardsFromNote(Note $note, int $count = 5): array
    {
        $content = JsonToText::extractText($note->content);

        if (!$content || strlen($content) < 10) {
            throw new \Exception('Note content is too short or empty');
        }

        // Generate prompt for AI
        $prompt = <<<EOD
Generate {$count} educational flashcards from the note content below. Return the result as pure JSON only, like this:
[
  {"question": "What is X?", "answer": "It is Y."},
  {"question": "When did Z happen?", "answer": "In 1900."}
]

Note content:
\"\"\"{$content}\"\"\"
EOD;

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.openai.api_key'),
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant that generates flashcards for students.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => 0.7,
        ]);

        $json = $response->json();
        $rawText = $json['choices'][0]['message']['content'] ?? '[]';

        // Extract JSON from response
        $start = strpos($rawText, '[');
        $end = strrpos($rawText, ']');
        if ($start === false || $end === false) {
            throw new \Exception('No JSON detected in response');
        }
        $jsonString = substr($rawText, $start, $end - $start + 1);
        $flashcards = json_decode($jsonString, true);

        if (!is_array($flashcards)) {
            throw new \Exception('Invalid JSON format from AI');
        }


        $currentCount = Flashcard::where('note_id', $note->id)->count();


        if ($currentCount + count($flashcards) <= 20) {
            foreach ($flashcards as $fc) {
                if (!isset($fc['question'], $fc['answer'])) continue;
                Flashcard::create([
                    'note_id' => $note->id,
                    'question' => $fc['question'],
                    'answer' => $fc['answer'],
                ]);
            }
            return $flashcards;
        }


        $toAdd = max(0, 20 - $currentCount);
        if ($toAdd > 0) {
            $toDelete = count($flashcards) - $toAdd;
            if ($toDelete > 0) {
                $idsToDelete = Flashcard::where('note_id', $note->id)
                    ->orderBy('created_at')
                    ->limit($toDelete)
                    ->pluck('id');
                Flashcard::whereIn('id', $idsToDelete)->delete();
            }
            // Add as many new as possible
            $added = 0;
            foreach ($flashcards as $fc) {
                if ($added >= $toAdd) break;
                if (!isset($fc['question'], $fc['answer'])) continue;
                Flashcard::create([
                    'note_id' => $note->id,
                    'question' => $fc['question'],
                    'answer' => $fc['answer'],
                ]);
                $added++;
            }
            return array_slice($flashcards, 0, $toAdd);
        }



        $toDelete = count($flashcards);
        $idsToDelete = Flashcard::where('note_id', $note->id)
            ->orderBy('created_at')
            ->limit($toDelete)
            ->pluck('id');
        Flashcard::whereIn('id', $idsToDelete)->delete();

        foreach ($flashcards as $fc) {
            if (!isset($fc['question'], $fc['answer'])) continue;
            Flashcard::create([
                'note_id' => $note->id,
                'question' => $fc['question'],
                'answer' => $fc['answer'],
            ]);
        }
        return $flashcards;
    }


    /**
     * Get all flashcards for a specific note.
     *
     * @param int $noteId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFlashcardsByNoteId(int $noteId)
    {
        return Flashcard::where('note_id', $noteId)->get();
    }
}
