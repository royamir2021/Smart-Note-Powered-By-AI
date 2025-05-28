<?php

namespace App\Services;

use App\Models\Note;
use Illuminate\Support\Facades\Storage;
use Spatie\Browsershot\Browsershot;
use Illuminate\Support\Facades\Cache;

class NoteService
{
    public function filterNotes(array $data)
    {
        return Note::where('student_id', $data['student_id'])
            ->where('course_id', $data['course_id'])
            ->where('unit_number', $data['unit_number'])
            ->where('lesson_title', $data['lesson_title'])
            ->get();
    }

    public function createNote(array $data)
    {
        return Note::create($data);
        $key = "notes_by_student_{$data['student_id']}_course_{$data['course_id']}";
        Cache::forget($key);

        return $note;
    }

    public function deleteNote(Note $note): bool
    {
        $studentId = $note->student_id;
        $courseId  = $note->course_id;
        $noteId    = $note->id;

        Storage::disk('public')->deleteDirectory("uploads/student_{$studentId}/note_{$noteId}");

        $deleted = $note->delete();

        // invalidate cache
        Cache::forget("notes_by_student_{$studentId}_course_{$courseId}");

        return $deleted;
    }

    public function getOrCreateNote(array $data)
    {
        $criteria = [
            'student_id' => $data['student_id'],
            'course_id' => $data['course_id'],
            'unit_number' => $data['unit_number'] ?? null,
            'lesson_title' => $data['lesson_title'] ?? null,
        ];

        $existing = Note::where($criteria)->orderByDesc('id')->first();

        if ($existing) {
            $content = $existing->content;

            if (!is_array($content)) {
                $content = [];
            }

            $isEmptyContent = false;

            if (
                isset($content['type'], $content['content']) &&
                $content['type'] === 'doc' &&
                is_array($content['content']) &&
                count($content['content']) === 1 &&
                isset($content['content'][0]['type']) &&
                $content['content'][0]['type'] === 'paragraph' &&
                (
                    !isset($content['content'][0]['content']) ||
                    empty($content['content'][0]['content'])
                )
            ) {
                $isEmptyContent = true;
            }

            if ($isEmptyContent) {
                if (isset($data['title'])) {
                    $existing->title = $data['title'];
                }
                $existing->touch();

                return [
                    'note' => $existing,
                    'message' => 'Reused empty note and updated timestamp & title.',
                    'status' => 200,
                ];
            } else {
                $new = Note::create(array_merge($criteria, $data));
                Cache::forget("notes_by_student_{$data['student_id']}_course_{$data['course_id']}");
                return [
                    'note' => $new,
                    'message' => 'Previous note had content. Created new note.',
                    'status' => 201,
                ];
            }
        }

        $note = Note::create(array_merge($criteria, $data));
        return [
            'note' => $note,
            'message' => 'No previous note. Created new note.',
            'status' => 201,
        ];
    }
    public function getNotesByStudentCourse($studentId, $courseId)
    {
        $cacheKey = "notes_by_student_{$studentId}_course_{$courseId}";

        return Cache::remember($cacheKey, 300, function() use($studentId, $courseId) {
            return Note::where('student_id', $studentId)
                ->where('course_id', $courseId)
                ->get();
        });
    }


    public function exportPdf(Note $note): string
    {
        $html = view('exports.note-pdf', ['note' => $note])->render();
        $pdfPath = storage_path("app/public/notes/note_{$note->id}.pdf");
        \Spatie\Browsershot\Browsershot::html($html)
            ->format('A4')
            ->showBackground()
            ->margins(20, 15, 20, 15)
            ->save($pdfPath);
        return $pdfPath;
    }


    public function exportWord(Note $note): string
    {

        $html = \App\Helpers\JsonToHtml::render($note->content);

        $docContent = <<<EOD
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;">
$html
</body>
</html>
EOD;

        $filename = 'note_' . $note->id . '.doc';
        $path = storage_path("app/public/notes/$filename");

        file_put_contents($path, $docContent);

        return $path;
    }
}
