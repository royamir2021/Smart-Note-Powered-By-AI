import React, { useRef, useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { importWordFile } from "../../../lib/importFile";
import { generateJSON } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

interface Props {
  onImported: (json: any) => void; // receives JSON instead of raw HTML
  setIsLoading: (loading: boolean) => void;
}

export default function FileImport({ onImported, setIsLoading }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");

  // Read session data (e.g., note_id) from sessionStorage
  const getNoteSession = () => {
    try {
      const raw = sessionStorage.getItem("note_session");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  // Clean up raw HTML (removes <br>, <p>, header/footer, etc.)
  const cleanHtml = (html: string) => {
    return html
      .replace(/<br[^>]*ProseMirror-trailingBreak[^>]*>/gi, "")
      .replace(/<div[^>]*title=["']?(header|footer)["']?[^>]*>.*?<\/div>/gis, "")
      .replace(/<(p|div)[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, "")
      .replace(/(<br\s*\/?>\s*){2,}/gi, "<br/>")
      .trim();
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const session = getNoteSession();
    const noteId = session?.note_id;

    if (!file) return;
    if (!noteId) {
      console.error("Note is not selected or not available in session.");
      return;
    }

    setFileName(file.name);
    setIsLoading(true);

    try {
      // Fetch HTML from backend
      const rawHtml = await importWordFile(file, noteId);
      const cleanedHtml = cleanHtml(rawHtml);

      // Convert cleaned HTML to Tiptap JSON
      const json = generateJSON(cleanedHtml, [StarterKit]);

      // Send JSON to parent for insertion
      onImported(json);
    } catch (err) {
      console.error("Failed to import file. Please try again.", err);
    } finally {
      setIsLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-0 group relative">
      <button
        type="button"
        onClick={handleButtonClick}
        className="flex flex-col items-center justify-center text-xs text-gray-400 
                   hover:scale-110 hover:-translate-y-0.5 transition-all duration-200"
        title="Import Word"
      >
        <ArrowDownToLine size={22} className="text-gray-400 group-hover:text-blue-500" />
      </button>
      <span className="text-[11px] mt-1 text-gray-500 group-hover:text-blue-500 transition-all">
        Word
      </span>
      <input
        ref={inputRef}
        type="file"
        accept=".doc,.docx"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
