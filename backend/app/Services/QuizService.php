<?php
namespace App\Services;

use App\Models\ExamResult;
use App\Models\Note;
use App\Models\Quiz;
use App\Helpers\JsonToText;
use Illuminate\Support\Facades\Http;

class QuizService
{
    /**
     * Generates multiple choice questions (MCQs) from a note using OpenAI GPT API,
     * saves them in the database, and returns the question array.
     *
     * @param Note $note
     * @return array
     * @throws \Exception
     */
    public function generateQuizFromNote(Note $note): array
    {
        // Extract plain text from note's content (assumes Tiptap JSON or similar)
        $content = JsonToText::extractText($note->content);

        // Validate note content
        if (!$content || strlen($content) < 10) {
            throw new \Exception('Note content is too short or empty');
        }

        // Compose prompt for OpenAI to generate MCQs
        $prompt = <<<EOD
Generate 4 multiple choice questions (MCQs) based on the following note content.

Each question must include:
- A "question" field (string),
- An "options" field as a list of 4 strings (A, B, C, D),
- A "correct_index" field as an integer between 0 and 3.

⚠️ IMPORTANT:
- "correct_index" must point to the correct answer in "options".
- Return ONLY JSON, no explanation.

Example:
[
  {
    "question": "What is the capital of France?",
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correct_index": 2
  }
]

Note content:
"""{$content}"""
EOD;

        // Call OpenAI API to get questions
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.openai.api_key'),
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'system', 'content' => 'You are an assistant that generates multiple choice questions for students.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => 0.7,
        ]);

        $json = $response->json();
        $raw = $json['choices'][0]['message']['content'] ?? '[]';

        // Extract JSON array from response string
        $start = strpos($raw, '[');
        $end = strrpos($raw, ']');
        if ($start === false || $end === false) {
            throw new \Exception('Invalid AI response format');
        }
        $jsonString = substr($raw, $start, $end - $start + 1);
        $questions = json_decode($jsonString, true);

        if (!is_array($questions)) {
            throw new \Exception('Failed to decode questions');
        }

        // ---- NEW: Ensure there are never more than 20 questions per note ----

        // Get current quizzes for this note (oldest first)
        $currentQuizzes = Quiz::where('note_id', $note->id)
            ->orderBy('created_at')
            ->get();

        $totalAfterInsert = $currentQuizzes->count() + count($questions);

        if ($totalAfterInsert > 20) {
            // Number of oldest questions to delete
            $toDelete = $totalAfterInsert - 20;
            $idsToDelete = $currentQuizzes->take($toDelete)->pluck('id');
            Quiz::whereIn('id', $idsToDelete)->delete();
        }

        // Insert new questions
        foreach ($questions as $q) {
            if (!isset($q['question'], $q['options'], $q['correct_index'])) continue;

            Quiz::create([
                'note_id' => $note->id,
                'question' => $q['question'],
                'options' => $q['options'],
                'correct_index' => $q['correct_index'],
            ]);
        }

        return $questions;
    }

    /**
     * Get all quizzes for a given note.
     *
     * @param int $noteId
     * @return \Illuminate\Support\Collection
     */
    public function getQuizzesByNoteId(int $noteId)
    {
        return Quiz::where('note_id', $noteId)
            ->select('id', 'note_id', 'question', 'options', 'correct_index')
            ->get();
    }

    /**
     * Submits or updates an exam result for the given note.
     * Returns the previous score and the new (current) score.
     *
     * @param int $noteId
     * @param int $score
     * @return array
     */
    public function submitExamResult(int $noteId, int $score): array
    {
        // 1. Get previous score (if any)
        $previousScore = ExamResult::where('note_id', $noteId)->value('score');

        // 2. Save or update the result
        $result = ExamResult::updateOrCreate(
            ['note_id' => $noteId],
            ['score' => $score]
        );

        // 3. Return result data including previous and current score
        return [
            'result' => $result,
            'previous_score' => $previousScore,
            'current_score' => $result->score,
        ];
    }

}
