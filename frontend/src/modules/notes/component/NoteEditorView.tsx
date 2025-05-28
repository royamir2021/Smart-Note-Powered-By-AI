import React, { useEffect, useState, useCallback, useRef } from "react";
import { debounce } from "lodash";
import Editor from "../../../components/Editor";
import FlashcardViewer from "../../flashcards/component/FlashcardView";
import QuizView from "../../quizzes/component/QuizView";
import { NotebookPen, Brain, FileText } from "lucide-react";
import { fetchNoteById, updateNote } from "../noteApi";
import LoadingSpinner from "../../../components/UI/toolbar/LoadingSpinner";

interface Props {
  noteId: number;
  title: string;
  onTitleChange: (noteId: number, newTitle: string) => void;
  onClose: () => void;
}

export default function NoteEditorView({ noteId, title, onTitleChange, onClose }: Props) {
  const [content, setContent] = useState<any>({ type: "doc", content: [{ type: "paragraph" }] });
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [activeTab, setActiveTab] = useState<"note" | "flashcards" | "quizzes">("note");
  const [isLoading, setIsLoading] = useState(false);

  const session = JSON.parse(sessionStorage.getItem("note_session") || "{}");
  const { token, student_id, course_id, unit_number, lesson_title } = session;

  const lastNoteIdRef = useRef<number | null>(null);

  // Step 1: Keep track of latest noteId
  useEffect(() => {
    lastNoteIdRef.current = noteId;
  }, [noteId]);

  // Step 2: Fetch note content on mount or when noteId changes
  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId || !token) return;
      setIsLoading(true);
      try {
        const note = await fetchNoteById(noteId, token);
        const safeContent = note.content && typeof note.content === "object"
            ? note.content
            : { type: "doc", content: [{ type: "paragraph" }] };
        setContent(safeContent);
        if (note.title && note.title !== title) {
          onTitleChange(noteId, note.title);
        }
      } catch (err) {
        console.error("❌ Failed to fetch note:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNote();
  }, [noteId, token]);

  // Step 3: Debounced auto-save
  const autoSave = useCallback(
      debounce(async (jsonContent: any, title: string) => {
        if (!noteId || !token) return;
        if (lastNoteIdRef.current !== noteId) return; // prevent wrong save

        const safeTitle = typeof title === "string" ? title : "Untitled Note";
        try {
          setStatus("saving");
          await updateNote(noteId, token, jsonContent, safeTitle);
          setStatus("saved");
          sessionStorage.setItem("lastActivity", Date.now().toString());
        } catch (err) {
          console.error("❌ Auto-save error:", err);
        }
      }, 1500),
      [noteId, token]
  );

  // Step 4: Cancel save when switching notes
  useEffect(() => {
    autoSave.cancel();
    setStatus("idle");
  }, [noteId]);

  // Step 5: Trigger auto-save on content/title change
  useEffect(() => {
    autoSave(content, title);
  }, [content, title, autoSave]);

  const tabs = [
    { key: "note", label: "Note", icon: <NotebookPen size={20} /> },
    { key: "flashcards", label: "Flashcards", icon: <Brain size={20} /> },
    { key: "quizzes", label: "Quizzes", icon: <FileText size={20} /> },
  ];

  const tabColors: Record<string, { active: string; inactive: string }> = {
    note: { active: "bg-purple-200 text-purple-900", inactive: "bg-purple-100 text-purple-600 hover:bg-purple-200" },
    flashcards: { active: "bg-blue-200 text-blue-900", inactive: "bg-blue-100 text-blue-600 hover:bg-blue-200" },
    quizzes: { active: "bg-yellow-200 text-yellow-900", inactive: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200" },
  };

  return (
      <div className="h-full w-full flex flex-col items-center px-1 sm:px-2 md:px-4 py-2">
        {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
              <LoadingSpinner />
            </div>
        )}

        {/* Tabs */}
        <div className="flex w-full max-w-xl justify-center items-stretch bg-gray-100 rounded-t-xl overflow-x-auto mb-4 shadow">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const colorClass = isActive ? tabColors[tab.key].active : tabColors[tab.key].inactive;
            return (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex-1 min-w-[80px] sm:min-w-[120px] flex flex-col items-center justify-center px-1 sm:px-3 py-2 transition-all text-xs sm:text-sm ${colorClass} outline-none focus:ring-2`}
                    style={{ borderRight: tab.key !== "quizzes" ? "1px solid #e5e7eb" : "" }}
                >
                  {tab.icon}
                  <span className="mt-1">{tab.label}</span>
                </button>
            );
          })}
        </div>

        <div className="w-full flex-1 flex flex-col items-center overflow-y-auto">
          {activeTab === "note" && (
              <div className="w-full max-w-[700px] mx-auto px-2 sm:px-4">
                <input
                    type="text"
                    value={title ?? ""}
                    onChange={(e) => onTitleChange(noteId, e.target.value)}
                    placeholder="Enter title..."
                    className="w-full text-base sm:text-lg font-medium mb-2 p-2 border border-gray-200 rounded focus:outline-none focus:ring"
                    maxLength={64}
                />
                <div className="w-full bg-white border rounded min-h-[200px] sm:min-h-[320px] shadow-sm transition">
                  <Editor content={content} onChange={setContent} setIsLoading={setIsLoading} />
                </div>
                <div className="text-right text-xs sm:text-sm text-gray-500 mt-2 pr-2">
                  {status === "saving" && "Saving..."}
                  {status === "saved" && "Saved ✅"}
                </div>
              </div>
          )}

          {activeTab === "flashcards" && noteId && (
              <div className="w-full max-w-[700px] mx-auto">
                <FlashcardViewer noteId={noteId} />
              </div>
          )}

          {activeTab === "quizzes" && noteId && student_id && (
              <div className="w-full max-w-[700px] mx-auto">
                <QuizView noteId={noteId} studentId={student_id} />
              </div>
          )}
        </div>
      </div>
  );
}
