import React from "react";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, StarIcon } from "@heroicons/react/solid";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

const NUM_STARS = 5;

export default function QuizResults({ questions, answers, previousScore, score, onTryAgain }) {
  // Calculate stats
  const total = questions.length;
  const correctCount = questions.reduce((sum, q) => (answers[q.id] === q.correct_index ? sum + 1 : sum), 0);
  // `score` is now passed as a prop from parent (QuizView)
  const prev = typeof previousScore === "number" ? previousScore : null;
  const diff = prev !== null ? score - prev : null;

  // Determine comparison UI
  let comparisonIcon = <MinusIcon className="w-5 h-5 text-gray-400" />;
  let comparisonColor = "text-gray-600";
  let comparisonText = "No Change";
  let showCongrats = false;
  if (diff !== null && diff > 0) {
    comparisonIcon = <ArrowUpIcon className="w-5 h-5 text-green-500" />;
    comparisonColor = "text-green-600";
    comparisonText = `+${diff}%`;
    showCongrats = true;
  }
  if (diff !== null && diff < 0) {
    comparisonIcon = <ArrowDownIcon className="w-5 h-5 text-red-500" />;
    comparisonColor = "text-red-600";
    comparisonText = `${diff}%`;
    showCongrats = false;
  }

  // Star positions (0% - 100% split)
  const starThresholds = Array.from({ length: NUM_STARS }, (_, i) => (i * 100) / (NUM_STARS - 1));

  // Gradient color based on score
  const getBarGradient = () => {
    if (score <= 25) return "from-red-500 to-orange-400";
    if (score <= 50) return "from-orange-400 to-yellow-300";
    if (score <= 75) return "from-yellow-300 to-lime-400";
    return "from-lime-400 to-green-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-2 sm:p-5 lg:p-8 w-full max-w-full sm:max-w-xl lg:max-w-4xl mx-auto relative overflow-hidden">

      {/* Confetti for high score */}
      <AnimatePresence>
        {score >= 75 && (
          <motion.div
            key="confetti"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none"
          >
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Congratulatory animation/message if improved */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            key="congrats"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex items-center justify-center gap-2 mb-3"
          >
            <span role="img" aria-label="Party" className="text-3xl">🎉</span>
            <span className="text-green-700 text-lg font-bold animate-bounce">
              Well done! You improved by {diff}%!
            </span>
            <span role="img" aria-label="Star" className="text-3xl">⭐</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top: Previous score & comparison */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-base text-gray-500">Previous Score:</span>
          <span className="text-xl font-bold text-gray-600">{prev !== null ? `${prev}%` : "--"}</span>
        </div>
        <div className={`flex items-center gap-1 ${comparisonColor}`}>
          {comparisonIcon}
          <span className="font-semibold">{comparisonText}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-base text-gray-500">Your Score:</span>
          <span className="text-2xl font-extrabold text-purple-700">{score}%</span>
        </div>
      </div>

      {/* Questions & correct answers */}
      <div className="text-center text-sm text-gray-500 mb-6">
        Questions: <b>{total}</b> &nbsp;|&nbsp; Correct Answers: <b>{correctCount}</b>
      </div>

      {/* Progress bar with stars (no number in the center) */}
      <div className="relative mb-8 w-full">
        <div className="h-8 rounded-full bg-gray-200 relative shadow-inner flex items-center">
          <motion.div
            className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${getBarGradient()}`}
            style={{
              width: `${score}%`,
              minWidth: score > 0 ? 32 : 0,
              transition: "width 0.9s cubic-bezier(0.32,0.72,0.44,1.15)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
          />
          {starThresholds.map((pct, idx) => (
            <div
              key={idx}
              className="absolute"
              style={{
                left: `calc(${pct}% - 16px)`,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
            >
              <StarIcon
                className={
                  score >= pct
                    ? "w-7 h-7 text-yellow-400 drop-shadow animate-pulse"
                    : "w-7 h-7 text-gray-300"
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Table of questions and answers */}
      <div className="overflow-x-auto mb-7">
        <table className="w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">#</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">Question</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">Correct</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">Your Answer</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">Result</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((q, idx) => {
              const studentIndex = answers[q.id];
              const studentAns = typeof studentIndex === "number" ? q.options[studentIndex] : "Not answered";
              const correctAns = q.options[q.correct_index];
              const isCorrect = studentIndex === q.correct_index;
              return (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-2 font-semibold text-purple-600">{idx + 1}</td>
                  <td className="px-2 sm:px-4 py-2 text-gray-700">{q.question}</td>
                  <td className="px-2 sm:px-4 py-2 text-green-600 font-medium">{correctAns}</td>
                  <td className={`px-2 sm:px-4 py-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                    {studentAns}
                  </td>
                  <td className="px-2 py-1 sm:px-3 sm:py-2">
                    {isCorrect ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Try Again */}
      <div className="text-center">
        <button
          onClick={onTryAgain}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
