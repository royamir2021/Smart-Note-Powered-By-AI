import API from '../../lib/api';

/**
 * Fetch flashcards by note ID.
 * @param noteId - The ID of the note.
 * @returns List of flashcards associated with the note.
 */
export const fetchFlashcardsByNoteId = async (noteId: number) => {
  const res = await API.post('/flashcards/by-note', { note_id: noteId });
  return res.data.data;
};

/**
 * Generate flashcards for a specific note.
 * @param noteId - The ID of the note for which flashcards are generated.
 * @returns Generated flashcards data.
 */
export const generateFlashcards = async (noteId: number) => {
  const res = await API.post('/flashcards/generate-flashcard', { note_id: noteId });
  return res.data;
};
