<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\WordImportService;

/**
 * @OA\Post(
 *     path="/api/v1/import/convert-to-html",
 *     summary="Convert a Word file to HTML (with images) and store assets by note/student",
 *     description="Uploads a .doc/.docx file and note_id, converts it to HTML using LibreOffice, saves all images and HTML under structured folders, and returns the HTML.",
 *     tags={"Import"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="multipart/form-data",
 *             @OA\Schema(
 *                 required={"file", "note_id"},
 *                 @OA\Property(
 *                     property="file",
 *                     type="string",
 *                     format="binary",
 *                     description="Word (.doc/.docx) file to convert"
 *                 ),
 *                 @OA\Property(
 *                     property="note_id",
 *                     type="integer",
 *                     description="The ID of the note"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Conversion successful",
 *         @OA\JsonContent(
 *             @OA\Property(property="html", type="string", description="HTML content of the converted Word file")
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Conversion failed"
 *     )
 * )
 */
class ImportController extends Controller
{
    protected $wordImportService;

    /**
     * Inject the WordImportService.
     */
    public function __construct(WordImportService $wordImportService)
    {
        $this->wordImportService = $wordImportService;
    }

    /**
     * Handles uploading a Word file and converting it to HTML,
     * saving all assets in folders named by student and note.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function convertToHtml(Request $request)
    {
        // Validate file and note_id
        \Log::info('ImportWord Request', [
            'all' => $request->all(),
            'file_exists' => $request->hasFile('file'),
            'note_id' => $request->input('note_id'),
            'file' => $request->file('file'),
        ]);
        $request->validate([
            'file' => 'required|file|mimes:doc,docx',
            'note_id' => 'required|integer|exists:notes,id',
        ]);

        try {
            // Pass the file and note_id to the service

            $html = $this->wordImportService->convertToHtml(
                $request->file('file'),
                (int) $request->input('note_id')
            );

            // Return the converted HTML content
            return response()->json(['html' => $html]);

        } catch (\Exception $e) {
            // Return a 500 error with the exception message
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
