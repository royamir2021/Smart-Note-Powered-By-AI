import React from 'react';

interface FlashcardProps {
  question: string;
  answer: string;
  flipped: boolean;
  setFlipped: (val: boolean) => void;
}

export default function Flashcard({ question, answer, flipped, setFlipped }: FlashcardProps) {
  return (
    <div
      className="w-full max-w-full px-4 h-[60vh] sm:h-[65vh] lg:h-[70vh] mx-auto perspective cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl flex items-center justify-center text-center font-semibold text-gray-700 text-2xl sm:text-3xl px-4 sm:px-8 lg:px-12 py-8 break-words overflow-hidden">
          {question}
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-purple-100 rounded-2xl shadow-xl flex items-center justify-center text-purple-800 font-semibold text-2xl sm:text-3xl px-4 sm:px-8 lg:px-12 py-8 break-words overflow-hidden">
          {answer}
        </div>
      </div>
    </div>
  );
}
