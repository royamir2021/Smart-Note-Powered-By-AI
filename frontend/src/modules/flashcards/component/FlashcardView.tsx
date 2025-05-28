import React, { useEffect, useState } from "react";
import Flashcard from "../../../components/Flashcard/Flashcard";
import { fetchFlashcardsByNoteId } from "../falshCardApi";
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  noteId: number;
}

interface FlashcardData {
  question: string;
  answer: string;
}

/**
 * FlashcardViewer Component
 * - Fetches and displays flashcards for a specific note.
 * - Supports navigation between flashcards and a flip animation.
 * - Adjusted for mobile, tablet, and desktop views.
 */
export default function FlashcardViewer({ noteId }: Props) {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch flashcards by noteId.
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const session = JSON.parse(sessionStorage.getItem("note_session") || "{}");
        const token = session.token;
        if (!token) return;
        const data = await fetchFlashcardsByNoteId(noteId, token);
        setFlashcards(data || []);
      } catch (err) {
        console.error("Error loading flashcards:", err);
      } finally {
        setLoading(false);
      }
    };
    if (noteId) fetchData();
  }, [noteId]);

  /**
   * Reset index and flipped state when flashcards change.
   */
  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [flashcards]);

  /**
   * Navigate to the next flashcard.
   */
  const next = () => {
    if (index < flashcards.length - 1) {
      setIndex(index + 1);
      setFlipped(false);
      sessionStorage.setItem('lastActivity', Date.now().toString());
    }
  };

  /**
   * Navigate to the previous flashcard.
   */
  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setFlipped(false);
      sessionStorage.setItem('lastActivity', Date.now().toString());
    }
  };

  /**
   * Display loading state.
   */
  if (loading) {
    return <div className="text-center text-gray-400 mt-6">Loading flashcards...</div>;
  }

  /**
   * Display empty state.
   */
  if (flashcards.length === 0) {
    return <p className="text-center text-gray-400 mt-6">No flashcards available.</p>;
  }

  const currentFlashcard = flashcards[index];

 return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <Flashcard
        question={currentFlashcard.question}
        answer={currentFlashcard.answer}
        flipped={flipped}
        setFlipped={setFlipped}
      />

      <div className="flex gap-2 sm:gap-4 mt-4 w-full justify-center">
        <button
          onClick={prev}
          className={`bg-purple-500 hover:bg-purple-600 rounded-full p-3 text-white disabled:opacity-40 transition
          ${index === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={index === 0}
        >
          <ArrowLeft size={28} />
        </button>
        <button
          onClick={next}
          className={`bg-purple-500 hover:bg-purple-600 rounded-full p-3 text-white disabled:opacity-40 transition
          ${index === flashcards.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={index === flashcards.length - 1}
        >
         <ArrowRight size={28} />
        </button>
      </div>
      <div className="text-xs sm:text-sm lg:text-base text-gray-500">
        {index + 1} / {flashcards.length}
      </div>
    </div>
  );
}


