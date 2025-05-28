<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Flashcard;
use App\Models\Note;
use App\Services\FlashcardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Helpers\JsonToText;
//use App\Helpers\JsonToHtml;


class FlashcardController extends Controller
{
    protected $flashcardService;

    public function __construct(FlashcardService $flashcardService)
    {
        $this->flashcardService = $flashcardService;
    }
    /**
     * @OA\Post(
     *     path="/api/v1/flashcards/generate",
     *     summary="Generate flashcards for a note using AI",
     *     description="Generates up to 5 educational flashcards for the specified note using OpenAI. Requires authentication.",
     *     tags={"Flashcards"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"note_id"},
     *             @OA\Property(
     *                 property="note_id",
     *                 type="integer",
     *                 description="The ID of the note to generate flashcards for"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Flashcards created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Flashcards created successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="question", type="string", example="What is photosynthesis?"),
     *                     @OA\Property(property="answer", type="string", example="It is the process by which plants make food using sunlight.")
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

    // Generate flashcards using OpenAI
    public function generate(Request $request)
    {
        $request->validate([
            'note_id' => 'required|integer|exists:notes,id',
        ]);

        $note = Note::findOrFail($request->note_id);

        try {
            $flashcards = $this->flashcardService->generateFlashcardsFromNote($note);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Flashcards created successfully',
            'data' => $flashcards,
        ], 201);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/flashcards/by-note",
     *     summary="Get all flashcards for a note",
     *     description="Fetches all flashcards related to a specific note. Requires authentication.",
     *     tags={"Flashcards"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"note_id"},
     *             @OA\Property(
     *                 property="note_id",
     *                 type="integer",
     *                 description="ID of the note to fetch flashcards for"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Flashcards fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Flashcards fetched successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="note_id", type="integer", example=23),
     *                     @OA\Property(property="question", type="string", example="What is photosynthesis?"),
     *                     @OA\Property(property="answer", type="string", example="It is the process by which plants make food using sunlight."),
     *                     @OA\Property(property="created_at", type="string", format="date-time"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time")
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
     *     )
     * )
     */

    // Get all flashcards for a note
    public function getByNoteId(Request $request)
    {
        $validated = $request->validate([
            'note_id' => 'required|integer',
        ]);

        $flashcards = $this->flashcardService->getFlashcardsByNoteId($validated['note_id']);

        return response()->json([
            'message' => 'Flashcards fetched successfully',
            'data' => $flashcards,
        ]);
    }
}
