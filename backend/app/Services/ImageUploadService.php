<?php
// app/Services/ImageUploadService.php

namespace App\Services;

use Illuminate\Http\UploadedFile;

class ImageUploadService
{
    public function upload( UploadedFile $file,int $noteId,int $studentId): string {

        $extension = $file->getClientOriginalExtension();
        $timestamp = now()->format('Ymd_His');
        $fileName = "note_{$noteId}_{$timestamp}." . $extension;

        $path = $file->storeAs(
            "uploads/student_{$studentId}/note_{$noteId}",
            $fileName,
            'public'
        );

        return url('storage/' . $path);
    }
}
