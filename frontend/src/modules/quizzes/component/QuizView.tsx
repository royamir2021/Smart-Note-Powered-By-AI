import React, { useEffect, useState } from 'react';
import { getQuizByNote, submitExam } from '../quizApi';
import QuestionItem from './QuestionItem';
import QuizResults from './QuizResult';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import TimerCircle from './TimerCircle';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
  note_id: number;
}

interface Props {
  noteId: number;
}

// Utility function for Fisher-Yates shuffle
function shuffleArray(array: QuizQuestion[]) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
const updateActivity = () => {
  sessionStorage.setItem('lastActivity', Date.now().toString());
};

const QuizView: React.FC<Props> = ({ noteId }) => {
  const [rawQuestions, setRawQuestions] = useState<QuizQuestion[]>([]); // Unshuffled questions
  const [questions, setQuestions] = useState<QuizQuestion[]>([]); // Current shuffled questions
  const [previousScore, setPreviousScore] = useState<number | undefined>(undefined);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Load quiz questions when noteId changes
  useEffect(() => {
    (async () => {
      try {
        const res = await getQuizByNote(noteId);
        const data: QuizQuestion[] = res.data || [];
        setRawQuestions(data); // Store original
        setQuestions(shuffleArray(data)); // Shuffle for first render

        const secs = (data.length || 1) * 60;
        setTimeLeft(secs);
        setTotalTime(secs);

        setScore(null);
        setSubmitted(false);
        setAnswers({});
        setCurrent(0);
        setPreviousScore(undefined);
      } catch (e) {
        console.error('Error loading quiz', e);
      }
    })();
  }, [noteId]);

  // Timer countdown and auto-submit when time runs out
  useEffect(() => {
    if (submitted || totalTime <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, totalTime]);

  // Format seconds as MM:SS string
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Submit the quiz and get previous/current score from backend
  const handleSubmit = async () => {
    if (!questions.length) {
      alert('No valid quiz found for this note.');
      return;
    }

    const total = questions.length;
    const correct = questions.filter(q => answers[q.id] === q.correct_index).length;
    const percent = Math.round((correct / total) * 100);

    const payload = {
      note_id: noteId,
      score: percent,
    };

    try {
      const res = await submitExam(payload);
      setPreviousScore(res.previous_score ?? undefined);
      setScore(res.current_score ?? percent);
      setSubmitted(true);
    } catch (e: any) {
      if (e.response && e.response.status === 422) {
        console.error('Validation error:', e.response.data);
        alert('Validation Error: ' + JSON.stringify(e.response.data));
      } else {
        console.error('Submit error:', e);
        alert('Error submitting exam. See console for details.');
      }
    }
  };

  // Reset quiz with a fresh shuffle every Try Again
  const handleRetry = () => {
    setQuestions(shuffleArray(rawQuestions)); // Shuffle again!
    setAnswers({});
    setCurrent(0);
    setScore(null);
    setSubmitted(false);
    setTimeLeft(totalTime);
    // Keep previousScore for progress comparison
  };

  // Show result page after submission
  if (submitted && score !== null) {
    return (
      <QuizResults
        questions={questions}
        answers={answers}
        previousScore={previousScore}
        score={score}
        onTryAgain={handleRetry}
      />
    );
  }

  // Show message if no questions are available
  if (!questions.length) {
    return <div className="text-center mt-10 text-gray-500">No quiz available.</div>;
  }

  // Current question for rendering
  const q = questions[current];
  const percent = totalTime ? (timeLeft / totalTime) * 100 : 100;

  return (
    <div className="flex flex-col items-center w-full max-w-full sm:max-w-xl lg:max-w-2xl p-2 sm:p-4 bg-white rounded-lg shadow-md">
      {/* Quiz header: shows current question and timer */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-4 gap-2">
        <div className="text-gray-700 text-base sm:text-lg font-semibold">
          Question {current + 1} of {questions.length}
        </div>
        <TimerCircle percentage={percent} time={formatTime(timeLeft)} />
      </div>

      {/* Question body */}
      <QuestionItem
        question={q}
        selected={answers[q.id]}
        onSelect={idx => setAnswers({ ...answers, [q.id]: idx })}
      />

      {/* Navigation buttons */}
      <div className="flex w-full mt-8 items-center justify-between px-2 gap-2">
        <button
          onClick={() => {
              setCurrent(current - 1);
              updateActivity();
            }}
          disabled={current === 0}
          className="bg-purple-500 hover:bg-purple-600 rounded-full p-3 text-white disabled:opacity-40 transition"
          aria-label="Previous"
        >
          <ArrowLeft size={28} />
        </button>

        {current < questions.length - 1 ? (
          <button
            onClick={() => {
              setCurrent(current + 1);
              updateActivity();
            }}
            disabled={answers[q.id] === undefined}
            className="bg-purple-500 hover:bg-purple-600 rounded-full p-3 text-white disabled:opacity-40 transition"
            aria-label="Next"
          >
            <ArrowRight size={28} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg font-bold ml-auto transition"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizView;
