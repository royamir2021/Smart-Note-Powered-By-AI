<?php

namespace App\Services;

use App\Models\Note;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

class WordImportService
{
    /**
     * Converts a Word file to HTML and moves all related assets
     * to structured public folders by student_id and note_id.
     *
     * @param UploadedFile $file   The uploaded Word (.doc/.docx) file
     * @param int $noteId          Note ID (used for storage structure)
     * @return string              Converted HTML content (image URLs fixed)
     * @throws \Exception          On conversion error or file not found
     */
    public function convertToHtml(UploadedFile $file, int $noteId): string
    {
        // Get the related note and its student ID
        $note = Note::findOrFail($noteId);
        $studentId = $note->student_id;

        // Generate a unique filename
        $uniqueId = uniqid();
        $filename = $uniqueId . '.' . $file->getClientOriginalExtension();

        // Set up upload paths
        $uploadDir = "uploads/student_{$studentId}/note_{$noteId}";
        $tempPath = storage_path("app/{$uploadDir}/{$filename}");

        // Ensure upload directory exists
        File::ensureDirectoryExists(storage_path("app/{$uploadDir}"));

        // Move uploaded Word file to the temp location
        $file->move(storage_path("app/{$uploadDir}"), $filename);

        // Directory where LibreOffice will output the HTML
        $outputDir = storage_path("app/{$uploadDir}/html/");
        File::ensureDirectoryExists($outputDir);

        // LibreOffice executable path (Windows)
        $libreoffice = 'C:\Program Files\LibreOffice\program\soffice.exe';

        // Run LibreOffice CLI command to convert DOCX to HTML
        $command = "\"$libreoffice\" --headless --convert-to html \"$tempPath\" --outdir \"$outputDir\"";
        exec($command, $output, $returnVar);

        // Determine the generated HTML file path
        $htmlFilename = preg_replace('/\.(doc|docx)$/i', '.html', $filename);
        $htmlPath = $outputDir . $htmlFilename;

        // If HTML file does not exist, conversion failed
        if (!file_exists($htmlPath)) {
            throw new \Exception('Word to HTML conversion failed.');
        }

        // Load the converted HTML
        $html = file_get_contents($htmlPath);

        // ------------------------------
        // 🔹 CLEAN UP HTML FOR FRONTEND
        // ------------------------------

        // Remove <br> tags with ProseMirror-related classes
        $html = preg_replace('/<br[^>]*ProseMirror-trailingBreak[^>]*>/i', '', $html);

        // Remove <div title="header"> and <div title="footer"> completely
        $html = preg_replace('/<div[^>]*title=["\']header["\'][^>]*>.*?<\/div>/is', '', $html);
        $html = preg_replace('/<div[^>]*title=["\']footer["\'][^>]*>.*?<\/div>/is', '', $html);

        // Remove empty <p> or <div> tags (even if they include <br> or &nbsp;)
        $html = preg_replace('/<(p|div)[^>]*>\s*(<br\s*\/?>)?\s*<\/\1>/i', '', $html);

        // Final trim
        $html = trim($html);

        // --------------------------------------------
        // 🔹 HANDLE IMAGE PATHS (copied & rewritten)
        // --------------------------------------------

        $imageFolder = $outputDir . str_replace('.html', '', $htmlFilename) . '.files';
        $publicImageFolder = "{$uploadDir}/images";

        if (File::exists($imageFolder)) {
            File::ensureDirectoryExists(storage_path("app/public/{$publicImageFolder}"));
            foreach (File::allFiles($imageFolder) as $img) {
                $name = $img->getFilename();
                File::copy($img->getPathname(), storage_path("app/public/{$publicImageFolder}/$name"));
                $publicUrl = asset("storage/{$publicImageFolder}/$name");

                // Replace image references in HTML
                $html = preg_replace(
                    '/(<img[^>]+src=["\'])' . preg_quote($name, '/') . '(["\'])/i',
                    '$1' . $publicUrl . '$2',
                    $html
                );
            }
        }

        // Save cleaned HTML for future use (optional)
        $finalHtmlPath = storage_path("app/public/{$uploadDir}/note_content.html");
        File::ensureDirectoryExists(dirname($finalHtmlPath));
        file_put_contents($finalHtmlPath, $html);

        // Return HTML for frontend use
        return $html;
    }

}
