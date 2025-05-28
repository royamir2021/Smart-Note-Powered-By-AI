<?php

namespace App\Services;

use App\Models\Folder;
use App\Models\Note;

class FolderService
{
    /**
     * Get all folders (with notes) for a given student and course.
     */
    public function getFoldersForStudentCourse(int $studentId, int $courseId)
    {
        $folders = Folder::with(['notes' => function ($query) use ($studentId, $courseId) {
            $query->where('student_id', $studentId)
                ->where('course_id', $courseId);
        }])
            ->where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->get();

        return $folders;
    }

    /**
     * Create a new folder with the given name.
     */
    public function createFolder(array $data)
    {
        return Folder::create($data);
    }


    /**
     * Rename an existing folder.
     */
    public function renameFolder(int $id, string $name)
    {
        $folder = Folder::findOrFail($id);
        $folder->name = $name;
        $folder->save();
        return $folder;
    }

    /**
     * Delete a folder only if it's empty.
     */
    public function deleteFolder(Folder $folder)
    {
        if ($folder->notes()->count() > 0) {
            return false; // Not empty
        }
        $folder->delete();
        return true;
    }

    /**
     * Move a note to a folder (or remove from folder if folder_id is null).
     */
    public function moveNoteToFolder(int $noteId, ?int $folderId)
    {
        $note = Note::findOrFail($noteId);
        $note->folder_id = $folderId;
        $note->save();
        return $note;
    }
}
