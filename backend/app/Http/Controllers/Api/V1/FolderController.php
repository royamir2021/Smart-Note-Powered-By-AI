<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\FolderService;
use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\Note;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    protected $folderService;

    public function __construct(FolderService $folderService)
    {
        $this->folderService = $folderService;
    }

    /**
     * @OA\Get(
     *     path="/api/v1/folders",
     *     summary="Get folders for a student and course",
     *     description="Returns a list of folders (with their notes) for a specific student and course.",
     *     tags={"Folders"},
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
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of folders with notes",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Biology"),
     *                     @OA\Property(
     *                         property="notes",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=13),
     *                             @OA\Property(property="title", type="string", example="Photosynthesis")
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error (e.g., missing or invalid student_id or course_id)"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized (JWT or bearer token missing/invalid)"
     *     )
     * )
     */

    public function index(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|integer|exists:students,id',
            'course_id' => 'required|integer|exists:courses,id',
        ]);

        $folders = $this->folderService->getFoldersForStudentCourse(
            $validated['student_id'], $validated['course_id']
        );

        return response()->json([
            'data' => $folders,
        ]);
    }
    /**
     * @OA\Post(
     *     path="/api/v1/folders",
     *     summary="Create a new folder",
     *     tags={"Folders"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "student_id", "course_id"},
     *             @OA\Property(property="name", type="string", example="New Folder"),
     *             @OA\Property(property="student_id", type="integer", example=1),
     *             @OA\Property(property="course_id", type="integer", example=101)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Folder created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Folder created successfully"),
     *             @OA\Property(property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=2),
     *                 @OA\Property(property="name", type="string", example="New Folder"),
     *                 @OA\Property(property="student_id", type="integer", example=1),
     *                 @OA\Property(property="course_id", type="integer", example=101)
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
        ]);

        $folder = $this->folderService->createFolder($validated);

        return response()->json([
            'message' => 'Folder created successfully',
            'data' => $folder,
        ], 201);
    }


    /**
     * @OA\Put(
     *     path="/api/v1/folders/{folder}/rename",
     *     summary="Rename a folder",
     *     tags={"Folders"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="folder",
     *         in="path",
     *         required=true,
     *         description="Folder ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Updated Folder Name")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Folder renamed successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Folder renamed successfully"),
     *             @OA\Property(property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Updated Folder Name")
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
    public function rename(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $folder = $this->folderService->renameFolder($id, $request->name);

        return response()->json([
            'message' => 'Folder renamed successfully',
            'data' => $folder
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/folders/{folder}",
     *     summary="Delete a folder",
     *     tags={"Folders"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="folder",
     *         in="path",
     *         required=true,
     *         description="Folder ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Folder deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Folder deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Folder is not empty and cannot be deleted",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Folder is not empty and cannot be deleted")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function destroy(Folder $folder)
    {
        $success = $this->folderService->deleteFolder($folder);

        if (!$success) {
            return response()->json([
                'message' => 'Folder is not empty and cannot be deleted',
            ], 400);
        }

        return response()->json([
            'message' => 'Folder deleted successfully',
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/folders/move-note",
     *     summary="Move a note to a folder",
     *     tags={"Folders"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"note_id"},
     *             @OA\Property(property="note_id", type="integer", example=13),
     *             @OA\Property(property="folder_id", type="integer", example=1, nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Note moved to folder successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Note moved to folder successfully"),
     *             @OA\Property(property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=13),
     *                 @OA\Property(property="folder_id", type="integer", example=1)
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
    public function moveNote(Request $request)
    {
        $request->validate([
            'note_id' => 'required|integer|exists:notes,id',
            'folder_id' => 'nullable|integer|exists:folders,id',
        ]);

        $note = $this->folderService->moveNoteToFolder($request->note_id, $request->folder_id);

        return response()->json([
            'message' => 'Note moved to folder successfully',
            'data' => $note,
        ]);
    }
}
