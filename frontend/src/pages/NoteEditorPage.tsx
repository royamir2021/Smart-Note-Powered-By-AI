import React, { useEffect, useState } from "react";
import NoteLayout from "../components/NoteLayout";
import NoteEditorView from "../modules/notes/component/NoteEditorView";
import FlashcardViewer from "../modules/flashcards/component/FlashcardView";
import QuizView from "../modules/quizzes/component/QuizView";
import { createNote, fetchNotesByStudentCourse } from "../modules/notes/noteApi";

interface Note {
  id: number;
  title: string;
}

const getSessionData = () => {
  const session = JSON.parse(sessionStorage.getItem("note_session") || "{}") || {};
  return {
    student_id: session.student_id,
    course_id: session.course_id,
    unit_number: session.unit_number,
    lesson_title: session.lesson_title,
    note_id: session.note_id,
    token: session.token,
    title: session.title || "My Note",
  };
};

const updateSession = (updates: Partial<ReturnType<typeof getSessionData>>) => {
  const session = getSessionData();
  sessionStorage.setItem("note_session", JSON.stringify({ ...session, ...updates }));
};

export default function NoteEditorPage() {
  const [activeTab, setActiveTab] = useState<"notes" | "flashcards" | "quizzes">("notes");
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [title, setTitle] = useState("My Note");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const session = getSessionData();
    setSelectedNoteId(session.note_id);
    setTitle(session.title);
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      const session = getSessionData();
      const { student_id, course_id } = session;
      if (!student_id || !course_id) return;
      try {
        const notesList = await fetchNotesByStudentCourse(student_id, course_id);
        setNotes(notesList || []);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
    };
    fetchNotes();
  }, []);

  const handleLocalTitleChange = (noteId: number, newTitle: string) => {
    setTitle(newTitle);
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, title: newTitle } : note
      )
    );
    updateSession({ title: newTitle });
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <NoteLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notes={notes}
        onNewNote={async () => {
          const session = getSessionData();
          try {
            const res = await createNote({
              student_id: session.student_id,
              course_id: session.course_id,
              unit_number: session.unit_number,
              lesson_title: session.lesson_title,
            });
            const newNote = res.data;
            updateSession({ note_id: newNote.id, title: "" }); 
            setTitle(""); 
            setNotes((prev) => [...prev, newNote]);
            setSelectedNoteId(newNote.id);
            setSidebarOpen(false);
          } catch (err) {
            console.error("Failed to create new note:", err);
          }
        }}
        onSelectNote={(note) => {
          updateSession({ note_id: note.id, title: note.title });
          setSelectedNoteId(note.id);
          setTitle(note.title);
          setSidebarOpen(false);
        }}
        onDeleteNote={(noteId) => {
          setNotes((prev) => prev.filter((note) => note.id !== noteId));
          if (noteId === selectedNoteId) {
            setSelectedNoteId(null);
            setTitle("My Note");
          }
        }}
        title={title}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
        <div className="flex-1 flex flex-col h-full w-full">
          
          {activeTab === "notes" && selectedNoteId && (
            <NoteEditorView
              noteId={selectedNoteId}
              title={title}
              onTitleChange={handleLocalTitleChange}
              onClose={() => {
                window.parent.postMessage({ type: "CLOSE_IFRAME" }, "*");
                sessionStorage.removeItem("note_session");
              }}
            />
          )}
          {activeTab === "flashcards" && selectedNoteId && (
            <FlashcardViewer noteId={selectedNoteId} />
          )}
          {activeTab === "quizzes" && selectedNoteId && (
            <QuizView noteId={selectedNoteId} />
          )}
        </div>
      </div>
    </div>
  );
}
