<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadImageRequest;
use App\Models\Note;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;


class ImageUploadController extends Controller
{
    protected $imageUploadService;

    public function __construct(ImageUploadService $imageUploadService)
    {
        $this->imageUploadService = $imageUploadService;
    }

    /**
     * @OA\Post(
     *     path="/api/v1/upload-image",
     *     summary="Upload an image for a note",
     *     description="Uploads an image (jpeg, png, jpg, gif, svg, max 2MB) for a specific note and student. Returns the image URL on success.",
     *     tags={"Notes"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"image", "note_id", "student_id"},
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary",
     *                     description="Image file (jpeg, png, jpg, gif, svg, max 2MB)"
     *                 ),
     *                 @OA\Property(
     *                     property="note_id",
     *                     type="integer",
     *                     description="ID of the note"
     *                 ),
     *                 @OA\Property(
     *                     property="student_id",
     *                     type="integer",
     *                     description="ID of the student"
     *                 ),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Image uploaded successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="url", type="string", example="http://localhost:8000/storage/uploads/student_1/note_1/note_1_20240101_120000.jpg")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error"
     *     )
     * )
     */

    public function upload(UploadImageRequest $request)
    {
        $noteId = $request->input('note_id');
        $studentId = $request->input('student_id');
        $file = $request->file('image');

        $url = $this->imageUploadService->upload($file, $noteId, $studentId);

        return response()->json([
            'url' => $url,
        ]);
    }





//    public function uploadChemStructure(Request $request)
//    {
//        $request->validate([
//            'note_id' => 'required|numeric',
//            'student_id' => 'required|numeric',
//            'data' => 'required|string',
//            'type' => 'required|in:svg,mol',
//        ]);
//
//        $noteId = $request->input('note_id');
//        $studentId = $request->input('student_id');
//        $type = $request->input('type');
//        $ext = $type === 'svg' ? 'svg' : 'mol';
//
//        $timestamp = now()->format('Ymd_His');
//        $fileName = "note_{$noteId}_{$timestamp}.{$ext}";
//
//        $path = "uploads/student_{$studentId}/note_{$noteId}/" . $fileName;
//
//        \Storage::disk('public')->put($path, $request->input('data'));
//
//        return response()->json([
//            'url' => url('storage/' . $path)
//        ]);
//    }

}
