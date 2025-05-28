<?php

namespace App\Http\Controllers\Api\V1;

//use App\Helpers\JsonToHtml;
use App\Helpers\JsonToText;
use App\Http\Controllers\Controller;
use App\Models\ExamResult;
use App\Models\Note;
use App\Models\Quiz;
use App\Services\QuizService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;


class QuizController extends Controller
{

    protected $quizService;

    public function __construct(QuizService $quizService)
    {
        $this->quizService = $quizService;
    }

    /**
     * @OA\Post(
     *     path="/api/v1/quiz/generate",
     *     summary="Generate multiple choice questions using AI",
     *     description="Generates up to 4 multiple choice questions (MCQs) for the specified note using AI (OpenAI GPT). Requires authentication.",
     *     tags={"Quizzes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"note_id"},
     *             @OA\Property(
     *                 property="note_id",
     *                 type="integer",
     *                 description="The ID of the note to generate quiz questions for"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Quiz generated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Quiz generated successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="question", type="string", example="What is the capital of France?"),
     *                     @OA\Property(
     *                         property="options",
     *                         type="array",
     *                         @OA\Items(type="string", example="Paris")
     *                     ),
     *                     @OA\Property(property="correct_index", type="integer", example=2)
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error or AI response error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Note not found"
     *     )
     * )
     */

    public function generate(Request $request)
    {
        $request->validate([
            'note_id' => 'required|integer|exists:notes,id',
        ]);

        $note = Note::findOrFail($request->note_id);

        try {
            $questions = $this->quizService->generateQuizFromNote($note);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Quiz generated successfully',
            'data' => $questions,
        ], 201);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/quiz/by-note",
     *     summary="Get quizzes by note ID",
     *     description="Fetches all quiz questions related to a specific note. Requires authentication.",
     *     tags={"Quizzes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"note_id"},
     *             @OA\Property(
     *                 property="note_id",
     *                 type="integer",
     *                 description="ID of the note to fetch quizzes for"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Quizzes fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Quizzes fetched successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="note_id", type="integer", example=12),
     *                     @OA\Property(property="question", type="string", example="What is photosynthesis?"),
     *                     @OA\Property(
     *                         property="options",
     *                         type="array",
     *                         @OA\Items(type="string", example="A chemical process"),
     *                     ),
     *                     @OA\Property(property="correct_index", type="integer", example=2)
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Note not found"
     *     )
     * )
     */

    public function getQuizByNote(Request $request)
    {
        $request->validate([
            'note_id' => 'required|exists:notes,id',
        ]);

        $quizzes = $this->quizService->getQuizzesByNoteId($request->note_id);

        return response()->json([
            'message' => 'Quizzes fetched successfully',
            'data' => $quizzes,
        ]);
    }


    /**
     * @OA\Put(
     *     path="/api/v1/quiz/submit-exam",
     *     summary="Submit or update a quiz result",
     *     description="Submits or updates the quiz result (score) for a given note. Returns previous and current score.",
     *     tags={"Quizzes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"note_id", "score"},
     *             @OA\Property(
     *                 property="note_id",
     *                 type="integer",
     *                 description="Note ID"
     *             ),
     *             @OA\Property(
     *                 property="score",
     *                 type="integer",
     *                 minimum=0,
     *                 maximum=100,
     *                 description="Score (0 to 100)"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Exam result saved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Exam result saved successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=10),
     *                 @OA\Property(property="note_id", type="integer", example=23),
     *                 @OA\Property(property="score", type="integer", example=85),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time"),
     *             ),
     *             @OA\Property(property="previous_score", type="integer", nullable=true, example=70),
     *             @OA\Property(property="current_score", type="integer", example=85)
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Note not found"
     *     )
     * )
     */


    public function submitExam(Request $request)
    {
        $validated = $request->validate([
            'note_id' => 'required|exists:notes,id',
            'score' => 'required|integer|min:0|max:100',
        ]);

        $data = $this->quizService->submitExamResult($validated['note_id'], $validated['score']);

        return response()->json([
            'message' => 'Exam result saved successfully',
            'data' => $data['result'],
            'previous_score' => $data['previous_score'],
            'current_score' => $data['current_score'],
        ]);
}
}
