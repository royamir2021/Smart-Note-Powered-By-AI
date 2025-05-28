import React from 'react'
import { Brain, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateFlashcards } from '../../../modules/flashcards/falshCardApi'
import { generateQuiz } from '../../../modules/quizzes/quizApi'

const aiBtnStyle = `
  w-12 h-12 flex flex-col items-center justify-center
  rounded-full
  text-gray-400
  bg-white
  shadow-sm
  hover:scale-110
  active:scale-95
  transition-all duration-150
  cursor-pointer
`

interface AiButtonsProps {
  setIsLoading: (loading: boolean) => void;
}

export default function AiButtons({ setIsLoading }: AiButtonsProps) {
  // Helper to get current note_id from session
  const getNoteId = (): number | null => {
    const session = sessionStorage.getItem("note_session");
    const { note_id } = session ? JSON.parse(session) : {};
    return note_id || null;
  };

  // Handle AI generation for flashcards or quiz
  const handleGenerate = async (type: "flashcard" | "quiz") => {
    const note_id = getNoteId();
    if (!note_id) {
      return toast.error("⚠️ Note ID not found.");
    }

    setIsLoading(true);
    try {
      if (type === "flashcard") {
        await generateFlashcards(note_id);
        toast.success('Flashcards generated from note! 🎉');
      } else {
        await generateQuiz(note_id);
        toast.success('Quiz generated from note! 🚀');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Flashcard Button */}
      <button
        onClick={() => handleGenerate("flashcard")}
        className={`${aiBtnStyle} hover:text-pink-600 hover:bg-pink-50`}
        title="Generate Flashcards with AI"
        type="button"
      >
        <Brain size={22} />
        <span className="text-[11px] mt-1 text-gray-500 group-hover:text-pink-700 transition-all">Flashcard</span>
      </button>
      {/* Quiz Button */}
      <button
        onClick={() => handleGenerate("quiz")}
        className={`${aiBtnStyle} hover:text-indigo-600 hover:bg-indigo-50`}
        title="Generate Quizzes with AI"
        type="button"
      >
        <FileText size={22} />
        <span className="text-[11px] mt-1 text-gray-500 group-hover:text-indigo-700 transition-all">Quiz</span>
      </button>
    </>
  );
}
