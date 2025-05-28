import React from 'react';
import { CheckIcon } from '@heroicons/react/solid';

interface Props {
  question: {
    question: string;
    options: string[];
  };
  selected?: number;
  onSelect: (index: number) => void;
}

const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
const baseColors = [
  'bg-pink-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-amber-600',
  'bg-cyan-400',
  'bg-purple-400'
];
const selectedColors = [
  'bg-pink-600',
  'bg-blue-600',
  'bg-green-600',
  'bg-amber-700',
  'bg-cyan-600',
  'bg-purple-600'
];

/**
 * QuestionItem Component (Fully Responsive + Long Option Support)
 */
const QuestionItem: React.FC<Props> = ({ question, selected, onSelect }) => {
  return (
    <div className="bg-white p-2 xs:p-3 sm:p-4 lg:p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-full sm:max-w-2xl lg:max-w-4xl mx-auto overflow-x-hidden">
      <h3 className="text-left text-base xs:text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-5 lg:mb-8 text-gray-800 leading-snug break-words">
        {question.question}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const bgColor = isSelected
            ? selectedColors[index % selectedColors.length]
            : baseColors[index % baseColors.length];
          const textColor = isSelected ? 'text-black' : 'text-white';
          const scale = isSelected ? 'scale-[1.04]' : 'scale-100';
          const border = isSelected
            ? 'border-2 border-purple-400'
            : 'border border-transparent';

          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`flex items-start gap-2 xs:gap-3 
                px-3 xs:px-4 py-2 xs:py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5
                ${textColor} text-left font-semibold rounded-xl
                transition-all duration-200 transform hover:scale-[1.04] shadow-md w-full max-w-full min-w-0
                ${bgColor} ${scale} ${border} outline-none focus:ring-2 focus:ring-purple-300
                active:scale-95 select-none
                break-words
                overflow-hidden
              `}
              tabIndex={0}
              type="button"
            >
           
              <span className="font-bold shrink-0 text-base xs:text-lg sm:text-xl leading-tight">
                {letters[index] || String.fromCharCode(65 + index)}.
              </span>
              
          
              <span className="block flex-1 text-left break-words leading-tight max-w-full whitespace-pre-line">
                {isSelected && (
                  <CheckIcon className="inline w-4 h-4 xs:w-5 xs:h-5 text-black align-middle mr-1" />
                )}
                <span className="inline">{option}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionItem;
