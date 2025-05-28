<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\FilterNotesByStudentCourseRequest;
use App\Http\Requests\GetOrCreateNoteRequest;
use App\Http\Requests\NoteFilterRequest;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Http\Resources\NoteResource;
use App\Models\Note;
use App\Services\NoteService;


class NoteController extends Controller
{

    protected $noteService;

    public function __construct(NoteService $noteService)
    {
        $this->noteService = $noteService;
    }
    /**
     * @OA\Get(
     *     path="/api/v1/notes",
     *     summary="Get list of notes filtered by student, course, unit, and lesson",
     *     tags={"Notes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="student_id",
     *         in="query",
     *         required=true,
     *         description="Student ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="course_id",
     *         in="query",
     *         required=true,
     *         description="Course ID",
     *         @OA\Schema(type="integer", example=2)
     *     ),
     *     @OA\Parameter(
     *         name="unit_number",
     *         in="query",
     *         required=true,
     *         description="Unit number",
     *         @OA\Schema(type="integer", example=3)
     *     ),
     *     @OA\Parameter(
     *         name="lesson_title",
     *         in="query",
     *         required=true,
     *         description="Lesson title",
     *         @OA\Schema(type="string", example="Intro to JWT")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of notes",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="List of notes"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="student_id", type="integer", example=1),
     *                     @OA\Property(property="course_id", type="integer", example=2),
     *                     @OA\Property(property="unit_number", type="integer", example=3),
     *                     @OA\Property(property="lesson_title", type="string", example="Intro to JWT"),
     *                     @OA\Property(property="title", type="string", example="My Note"),
     *                     @OA\Property(property="content", type="string", example="Sample content here")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No notes found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No notes found"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */


    public function index(NoteFilterRequest $request)
    {
        $notes = $this->noteService->filterNotes($request->validated());

        return response()->json([
            'message' => $notes->isEmpty() ? 'No notes found' : 'List of notes',
            'data' => NoteResource::collection($notes),
        ], $notes->isEmpty() ? 404 : 200);
    }



    /**
     * @OA\Post(
     *     path="/api/v1/notes",
     *     summary="Create a new note",
     *     tags={"Notes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="My Note"),
     *             @OA\Property(property="content", type="array", @OA\Items(type="object"), example={"type": "doc", "content": {}}),
     *             @OA\Property(property="student_id", type="integer", example=1),
     *             @OA\Property(property="course_id", type="integer", example=2),
     *             @OA\Property(property="unit_number", type="integer", example=3),
     *             @OA\Property(property="lesson_title", type="string", example="Intro to JWT")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Note created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Note created successfully"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="student_id", type="integer", example=1),
     *                 @OA\Property(property="course_id", type="integer", example=2),
     *                 @OA\Property(property="unit_number", type="integer", example=3),
     *                 @OA\Property(property="lesson_title", type="string", example="Intro to JWT"),
     *                 @OA\Property(property="title", type="string", example="My Note"),
     *                 @OA\Property(property="content", type="object", example={"type": "doc", "content": {}})
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function store(StoreNoteRequest $request)
    {
        $note = $this->noteService->createNote($request->validated());

        return response()->json([
            'message' => 'Note created successfully',
            'data' => new NoteResource($note),
        ], 201);
    }
    /**
     * @OA\Get(
     *     path="/api/v1/notes/show/{note}",
     *     summary="Get a note by its ID",
     *     tags={"Notes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="note",
     *         in="path",
     *         required=true,
     *         description="Note ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Note fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Note fetched successfully"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="student_id", type="integer", example=1),
     *                 @OA\Property(property="course_id", type="integer", example=2),
     *                 @OA\Property(property="unit_number", type="integer", example=3),
     *                 @OA\Property(property="lesson_title", type="string", example="Intro to JWT"),
     *                 @OA\Property(property="title", type="string", example="My Note"),
     *                 @OA\Property(property="content", type="object", example={"type": "doc", "content": {}})
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Note not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Note not found")
     *         )
     *     )
     * )
     */
    public function show(Note $note)
    {
        return response()->json([
            'message' => 'Note fetched successfully',
            'data' => $note,
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/notes/{note}",
     *     summary="Update a note by its ID",
     *     tags={"Notes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="note",
     *         in="path",
     *         required=true,
     *         description="Note ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Updated Note Title"),
     *             @OA\Property(property="content", example="{}")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Note updated successfully"
     *     )
     * )
     */



    public function update(UpdateNoteRequest $request, Note $note)
    {
        $note->update($request->validated());

        return response()->json([
            'message' => 'Note updated successfully',
            'data' => new NoteResource($note),
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/notes/{note}",
     *     summary="Delete a note by its ID",
     *     tags={"Notes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="note",
     *         in="path",
     *         required=true,
     *         description="Note ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Note deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Note deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Note not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Note not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthorized")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Failed to delete note",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Failed to delete note")
     *         )
     *     )
     * )
     */
    public function destroy(Note $note)
    {
        $result = $this->noteService->deleteNote($note);

        if ($result) {
            return response()->json(['message' => 'Note deleted successfully'], 200);
        }
        return response()->json(['message' => 'Failed to delete note'], 500);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/notes/get-or-create",
     *     summary="Get or create a note based on student, course, unit, and lesson",
     *     tags={"Notes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"student_id","course_id"},
     *             @OA\Property(property="title", type="string", example="Sample Note"),
     *             @OA\Property(
     *                 property="content",
     *                 example={
     *                     "type"="doc",
     *                     "content"={
     *                         {"type"="paragraph"}
     *                     }
     *                 }
     *             ),
     *             @OA\Property(property="student_id", type="integer", example=1),
     *             @OA\Property(property="course_id", type="integer", example=2),
     *             @OA\Property(property="unit_number", type="integer", example=3),
     *             @OA\Property(property="lesson_title", type="string", example="Intro to JWT")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reused empty note and updated timestamp & title.",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Reused empty note and updated timestamp & title."),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="student_id", type="integer", example=1),
     *                 @OA\Property(property="course_id", type="integer", example=2),
     *                 @OA\Property(property="unit_number", type="integer", example=3),
     *                 @OA\Property(property="lesson_title", type="string", example="Intro to JWT"),
     *                 @OA\Property(property="title", type="string", example="Sample Note"),
     *                 @OA\Property(
     *                     property="content",
     *                     example={
     *                         "type"="doc",
     *                         "content"={
     *                             {"type"="paragraph"}
     *                         }
     *                     }
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Created new note.",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Previous note had content. Created new note."),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=2),
     *                 @OA\Property(property="student_id", type="integer", example=1),
     *                 @OA\Property(property="course_id", type="integer", example=2),
     *                 @OA\Property(property="unit_number", type="integer", example=3),
     *                 @OA\Property(property="lesson_title", type="string", example="Intro to JWT"),
     *                 @OA\Property(property="title", type="string", example="Sample Note"),
     *                 @OA\Property(
     *                     property="content",
     *                     example={
     *                         "type"="doc",
     *                         "content"={
     *                             {"type"="paragraph"}
     *                         }
     *                     }
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */

    public function getOrCreate(GetOrCreateNoteRequest $request)
    {
        \Log::alert('request: ' . json_encode($request->all()));
        $result = $this->noteService->getOrCreateNote($request->validated());

        return response()->json([
            'message' => $result['message'],
            'data' => $result['note'],
        ], $result['status']);
    }



    /**
     * @OA\Post(
     *     path="/api/v1/notes/filter-by-student-course",
     *     summary="Get notes by student and course",
     *     tags={"Notes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"student_id","course_id"},
     *             @OA\Property(property="student_id", type="integer", example=1),
     *             @OA\Property(property="course_id", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Filtered notes",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Filtered notes"),
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="student_id", type="integer", example=1),
     *                     @OA\Property(property="course_id", type="integer", example=2),
     *                     @OA\Property(property="unit_number", type="integer", example=3),
     *                     @OA\Property(property="lesson_title", type="string", example="Intro to JWT"),
     *                     @OA\Property(property="title", type="string", example="My Note"),
     *                     @OA\Property(
     *                         property="content",
     *                         example={
     *                             "type"="doc",
     *                             "content"={
     *                                 {"type"="paragraph"}
     *                             }
     *                         }
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function getNotesByStudentCourse(FilterNotesByStudentCourseRequest $request)
    {
        $notes = $this->noteService->getNotesByStudentCourse(
            $request->student_id,
            $request->course_id
        );

        return response()->json([
            'message' => 'Filtered notes',
            'data' => $notes,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/notes/{note}/export-pdf",
     *     summary="Export note as PDF",
     *     description="Exports the specified note as a PDF file and returns the PDF file for download.",
     *     operationId="exportNotePdf",
     *     tags={"Notes"},
     *     @OA\Parameter(
     *         name="note",
     *         in="path",
     *         description="ID of the note to export",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="PDF file",
     *         @OA\MediaType(
     *             mediaType="application/pdf",
     *             @OA\Schema(
     *                 type="string",
     *                 format="binary"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Note not found"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Failed to generate PDF"
     *     )
     * )
     */
    public function exportPdf(Note $note)
    {
        try {
            $pdfPath = $this->noteService->exportPdf($note);
            return response()->file($pdfPath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="note-' . $note->id . '.pdf"',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate PDF',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * @OA\Get(
     *     path="/api/v1/notes/{note}/export-word",
     *     summary="Export note as Word",
     *     description="Exports the specified note as a Word (.doc) file and returns the file for download.",
     *     operationId="exportNoteWord",
     *     tags={"Notes"},
     *     @OA\Parameter(
     *         name="note",
     *         in="path",
     *         description="ID of the note to export",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Word file",
     *         @OA\MediaType(
     *             mediaType="application/msword",
     *             @OA\Schema(
     *                 type="string",
     *                 format="binary"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Note not found"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Failed to generate Word file"
     *     )
     * )
     */




    /**
     * @OA\Get(
     *     path="/api/v1/notes/{note}/export-word",
     *     summary="Export note as Word",
     *     description="Exports the specified note as a Word (.doc) file and returns the file for download.",
     *     operationId="exportNoteWord",
     *     tags={"Notes"},
     *     @OA\Parameter(
     *         name="note",
     *         in="path",
     *         description="ID of the note to export",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Word file",
     *         @OA\MediaType(
     *             mediaType="application/msword",
     *             @OA\Schema(
     *                 type="string",
     *                 format="binary"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Note not found"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Failed to generate Word file"
     *     )
     * )
     */
    public function exportWord(Note $note)
    {
        try {
            $path = $this->noteService->exportWord($note);
            $filename = 'note_' . $note->id . '.doc';
            return response()->download($path, $filename)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate Word file',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}


