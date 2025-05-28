<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\FlashcardController;
use App\Http\Controllers\Api\V1\NoteController;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\QuizController;
use App\Http\Controllers\Api\V1\ImageUploadController;
use App\Http\Controllers\Api\V1\FolderController;
use App\Http\Controllers\Api\V1\ImportController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::prefix('v1')->group(function () {

    Route::middleware('throttle:100,1')->post('/auth/iframe-token', [AuthController::class, 'generateIframeToken']);
    Route::middleware('jwt.auth')->post('/upload-image', [ImageUploadController::class, 'upload']);
    Route::middleware('jwt.auth')->post('/import/word', [ImportController::class, 'convertToHtml']);
//    Route::middleware('jwt.auth')->post('/import/pdf', [ImportController::class, 'importPDF']);
//    Route::middleware('jwt.auth')->post('/upload-chem', [ImageUploadController::class, 'uploadChemStructure']);

    // Protected routes — available only to authenticated iframe users


    Route::prefix('folders')->middleware('jwt.auth')->group(function () {
        Route::get('/', [FolderController::class, 'index']);
        Route::post('/', [FolderController::class, 'store']);
        Route::put('/{folder}/rename', [FolderController::class, 'rename']);
        Route::delete('/{folder}', [FolderController::class, 'destroy']);
        Route::post('/move-note', [FolderController::class, 'moveNote']);
    });
    Route::middleware('jwt.auth')->prefix('notes')->group(function () {

        // Create or fetch a note for the current lesson context
        Route::post('/get-or-create', [NoteController::class, 'getOrCreate']);

        // List all notes for the current student/course/unit/lesson (based on token payload)
        Route::get('', [NoteController::class, 'index']);

        //  Create a new note (uses token context)
        Route::post('', [NoteController::class, 'store']);

        // Update title or content of a note
        Route::put('/{note}', [NoteController::class, 'update']);

        //  Soft-delete a note
        Route::delete('/{note}', [NoteController::class, 'destroy']);
        Route::get('/show/{note}',[NoteController::class,'show']);

        Route::post('/by-student-course-unit', [NoteController::class, 'getNotesByStudentCourseUnit']);
        Route::post('/by-student-course', [NoteController::class, 'getNotesByStudentCourse']);
        Route::post('/with-flashcards', [NoteController::class,'getNotesWithFlashcards']);
        Route::get('/{note}/export-pdf', [NoteController::class, 'exportPdf']);
        Route::get('/{note}/export-word', [NoteController::class, 'exportWord']);


        // (Optional) View all notes of a specific student (if ever needed)

    });

    Route::middleware('jwt.auth')->prefix('flashcards')->group(function () {
        Route::post('/generate-flashcard',[FlashcardController::class,'generate']);
        Route::post('/by-note', [FlashcardController::class, 'getByNoteId']);
    });

    Route::middleware('jwt.auth')->prefix('quiz')->group(function (){
        Route::post('/generate-quiz', [QuizController::class, 'generate']);
        Route::post('/get-quiz-by-note', [QuizController::class, 'getQuizByNote']);
        Route::put('/submit-exam', [QuizController::class, 'submitExam']);
    });


});
