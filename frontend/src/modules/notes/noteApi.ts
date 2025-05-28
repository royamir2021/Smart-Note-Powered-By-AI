import API from '../../lib/api';

/**
 * Fetches or creates a note for the student and returns the note data along with a JWT token.
 * Also saves token and session details for future refresh and session management.
 * @param studentInfo - Object containing student_id, course_id, unit_number, and lesson_title.
 * @returns The created or fetched note and the JWT token.
 */
export const fetchAndCreateNote = async (studentInfo: any) => {
  // Request a new access token from backend
  const tokenRes = await API.post('/auth/iframe-token', studentInfo);

  const token = tokenRes.data.token;
  // Store token and related session data in sessionStorage for later use
  sessionStorage.setItem('access_token', token);

  // Save token expiry timestamp (issued_at + expires_in) for refresh logic
  sessionStorage.setItem(
  'tokenExpiresAt',
  ((tokenRes.data.issued_at + tokenRes.data.expires_in) * 1000).toString()
);
  // Store student info to use when refreshing the token
  sessionStorage.setItem('studentInfo', JSON.stringify(studentInfo));
  // Save last activity time (used for refresh decisions)
  sessionStorage.setItem('lastActivity', Date.now().toString());

  // Now fetch or create the note for the student using the new token
  const noteRes = await API.post('/notes/get-or-create', studentInfo, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return { note: noteRes.data.data, token };
};


/**
 * Fetches a specific note by its ID
 * @returns The note data.
 */
export const fetchNoteById = async (
  note_id: number,
  token: string,
) => {
  const res = await API.get(
    `/notes/show/${note_id}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data.data;
};
/**
 * Updates the content and title of a specific note.
 * @param note_id - The ID of the note to be updated.
 * @param token - JWT token for authorization.
 * @param content - The new content of the note.
 * @param title - The new title of the note.
 * @returns The updated note data.
 */
export const updateNote = async (
  note_id: number,
  token: string,
  content: any,
  title: string
) => {
  const res = await API.put(
    `/notes/${note_id}`,
    { content, title },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
};

/**
 * Deletes a specific note by its ID.
 * @param noteId - The ID of the note to be deleted.
 * @returns The response data from the server.
 */
export const deleteNote = async (noteId: number) => {
  const res = await API.delete(`/notes/${noteId}`);
  return res.data;
};

/**
 * Creates a new note for a student.
 * @param data - Object containing student_id, course_id, unit_number, and lesson_title.
 * @returns The created note data.
 */
export const createNote = async (data: {
  student_id: number;
  course_id: number;
  unit_number: number;
  lesson_title: string;
}) => {
  const res = await API.post('/notes', data);
  return res.data;
};

/**
 * Fetches all notes for a student and course.
 * @param student_id - Student's ID.
 * @param course_id - Course's ID.
 * @returns Array of notes related to the specified student and course.
 */
export const fetchNotesByStudentCourse = async (
  student_id: number,
  course_id: number
) => {
  const res = await API.post('/notes/by-student-course', { student_id, course_id });
  return res.data.data;
};


