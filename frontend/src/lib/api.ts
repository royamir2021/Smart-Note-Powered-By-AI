// src/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    // 'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const session = JSON.parse(sessionStorage.getItem('note_session') || '{}');
  const token = session.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;



// ================== IMAGE UPLOAD ==================
export const uploadImage = async (
  file: File,
  noteId?: number,
  studentId?: number
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  if (noteId) formData.append('note_id', noteId.toString());
  if (studentId) formData.append('student_id', studentId.toString());

  try {
    const res = await API.post('/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("API responded with:", res.data);
    return res.data;
  } catch (err: any) {
  
    console.error("Image upload error:", err?.response?.data || err);
    throw err;
  }
};


/**
 * View the note as a PDF file in the browser (opens in new tab).
 * @param noteId - ID of the note
 */
export const exportNoteToPDF = async (noteId: number) => {
  try {
    const response = await API.get(
      `/notes/${noteId}/export-pdf`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(response.data);

  
    window.open(url, "_blank");


    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("PDF export failed:", error);
  }
};



/**
 * Download the note as a Word file (content can be JSON in DB).
 * @param noteId - ID of the note
 */

export const exportNoteToWord = async (noteId: number) => {
  try {
    const response = await API.get(
      `/notes/${noteId}/export-word`,
      { responseType: "blob" }
    );


    const url = window.URL.createObjectURL(response.data);

    const a = document.createElement("a");
    a.href = url;
    a.download = `note-${noteId}.doc`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert("Word export failed");
  }
};



// ================== CHEM STRUCTURES ==================

// export const uploadChemStructure = async ({
//   note_id,
//   student_id,
//   svg_data,
//   mol_data,
// }: {
//   note_id: number;
//   student_id: number;
//   svg_data: string;
//   mol_data: string;
// }) => {
//   const res = await API.post('/upload-chem', {
//     note_id,
//     student_id,
//     svg_data,
//     mol_data,
//   });

//   return res.data;
// };
