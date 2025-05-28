// src/modules/folders/folderApi.ts

import API from '../../lib/api';

/**
 * Fetch all folders with their notes.
 */
export const fetchFolders = async (studentId, courseId) => {
  const res = await API.get('/folders', {
    params: {
      student_id: studentId,
      course_id: courseId,
    }
  });
  return res.data.data;
};

/**
 * Create a new folder.
 * @param name - Name of the new folder
 */
export const createFolder = async (data: {
  name: string;
  student_id: number;
  course_id: number;
}) => {
  const res = await API.post('/folders', data);
  return res.data.data;
};
/**
 * Rename an existing folder.
 * @param folderId - Folder ID to rename
 * @param newName - New folder name
 */
export const renameFolder = async (folderId: number, newName: string) => {
  const res = await API.put(`/folders/${folderId}/rename`, { name: newName });
  return res.data.data;
};

/**
 * Delete a folder if it has no notes.
 * @param folderId - ID of the folder to delete
 */
export const deleteFolder = async (folderId: number) => {
  const res = await API.delete(`/folders/${folderId}`);
  return res.data;
};

/**
 * Move a note to a different folder.
 * @param noteId - ID of the note
 * @param folderId - Target folder ID (or null to unassign)
 */
export const moveNoteToFolder = async (
  noteId: number,
  folderId: number | null
) => {
  const res = await API.post('/folders/move-note', {
    note_id: noteId,
    folder_id: folderId,
  });
  return res.data;
};
