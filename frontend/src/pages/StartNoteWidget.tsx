import React, { useEffect, useState } from "react";
import { fetchAndCreateNote } from "../modules/notes/noteApi";
import { BookOpen, PencilLine } from "lucide-react";
import ResizableDraggableIframe from "../components/ResizableIframe";
import { setupTokenRefreshTimers, clearTokenTimers } from '../utils/tokenManager';

/**
 * StartNoteWidget Component
 * - Handles note-taking iframe initialization and session/timer management.
 * - Ensures only one timer/session is active at a time.
 * - Listens for LMS messages to start/close session.
 */
export default function StartNoteWidget() {
  const [showIframe, setShowIframe] = useState(false);
  const [token, setToken] = useState<string>("");
  const [noteId, setNoteId] = useState<number | null>(null);

  useEffect(() => {
    /**
     * Handles incoming messages from LMS/parent app.
     */
    const handleMessage = async (event: MessageEvent) => {
      // Always clear previous timers before starting new session!
      clearTokenTimers();

      const student = event.data;

      // Handle iframe close command
      if (student?.type === "CLOSE_IFRAME") {
        setShowIframe(false);
        clearTokenTimers();
        return;
      }

      // Validate incoming student info
      if (
        !student?.student_id ||
        !student?.course_id ||
        !student?.unit_number ||
        !student?.lesson_title
      ) {
        console.warn("Invalid student info", student);
        return;
      }

      try {
        // Fetch or create the note and set up the session
        const { note, token } = await fetchAndCreateNote(student);
        setToken(token);
        setNoteId(note.id);
        setShowIframe(true);
        setupTokenRefreshTimers(); // Only one timer/session per user!
        // Save session data
        sessionStorage.setItem(
          "note_session",
          JSON.stringify({
            token,
            note_id: note.id,
            student_id: student.student_id,
            course_id: student.course_id,
            unit_number: student.unit_number,
            lesson_title: student.lesson_title,
          })
        );
      } catch (err) {
        console.error("Error initializing widget:", err);
      }
    };

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "REQUEST_STUDENT_INFO" }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTokenTimers(); // Always clean up timers on unmount
    };
  }, []);

  /**
   * Handles the start button click - clears any previous session and timers,
   * then requests new student data from LMS.
   */
  const handleStartClick = () => {
    sessionStorage.removeItem("note_session");
    setShowIframe(false);
    clearTokenTimers();
    window.parent.postMessage({ type: "REQUEST_STUDENT_INFO" }, "*");
  };

  /**
   * Closes the iframe and clears session data and timers.
   */
  const handleClose = () => {
    sessionStorage.removeItem("note_session");
    setShowIframe(false);
    clearTokenTimers();
  };

  // Construct the iframe URL based on session data
  const iframeUrl =
    showIframe && noteId && token
      ? `/iframe/notes?note_id=${noteId}&token=${token}`
      : "";

  return (
    <>
      {/* Modern, Responsive, and Beautiful Start Note Button */}
      <button
        onClick={handleStartClick}
        className={`
          fixed top-5 left-5 z-50 
          flex items-center gap-2 px-5 py-2.5
          rounded-full shadow-lg border border-purple-400
          bg-gradient-to-r from-purple-500 via-violet-400 to-fuchsia-400
          text-white font-semibold text-base sm:text-lg
          transition-all
          hover:scale-105 hover:shadow-2xl hover:from-purple-600 hover:to-fuchsia-500
          active:scale-95
          outline-none focus-visible:ring-2 focus-visible:ring-purple-300
          ring-offset-2
          backdrop-blur-sm
          cursor-pointer
          min-w-[150px]
          sm:min-w-[180px]
        `}
        style={{
          boxShadow:
            "0 2px 16px 0 rgba(80,30,150,0.18), 0 1.5px 3px 0 rgba(120,50,210,0.10)",
        }}
      >
        <span className="flex items-center gap-1">
          <BookOpen size={22} className="drop-shadow-sm" />
          <PencilLine size={20} className="drop-shadow-sm" />
        </span>
        <span className="ml-1 sm:ml-2 tracking-wide font-bold">
          Start Note
        </span>
      </button>

      {/* Resizable and Draggable Iframe */}
      {showIframe && iframeUrl && (
        <ResizableDraggableIframe src={iframeUrl} onClose={handleClose} />
      )}
    </>
  );
}
