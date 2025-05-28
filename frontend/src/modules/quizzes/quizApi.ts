import API from '../../lib/api';

/**
 * Sends a request to generate a quiz based on a specific note.
 * @param noteId - The ID of the note for which the quiz is generated.
 * @returns The generated quiz data.
 */
export const generateQuiz = async (noteId: number) => {
    const res = await API.post('/quiz/generate-quiz', { note_id: noteId });
    return res.data;
  };

/**
 * Fetches a quiz by its associated note ID.
 * @param noteId - The ID of the note for which the quiz is fetched.
 * @returns The quiz data for the specified note.
 */
export const getQuizByNote = async (noteId: number) => {
    const res = await API.post('/quiz/get-quiz-by-note', { note_id: noteId });
    return res.data;
  };

/**
 * Submits the exam/quiz result for a student.
 * @param payload - An object containing student ID, quiz ID, and the score.
 * @returns The response data after submitting the exam.
 */
export const submitExam = async (payload: {
  note_id: number;   
  score: number;
}) => {
  const res = await API.put('/quiz/submit-exam', payload);
  return res.data;
};