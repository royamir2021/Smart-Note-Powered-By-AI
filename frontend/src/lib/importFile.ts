import API from "./api";

export const importWordFile = async (file, noteId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("note_id", String(noteId));

 
  let token = "";
  const sessionRaw = sessionStorage.getItem("note_session");
  if (sessionRaw) {
    try {
      const session = JSON.parse(sessionRaw);
      token = session.token || "";
    } catch {}
  }

  const response = await API.post("/import/word", formData, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
   
    },
  });

  if (response.data.html) return response.data.html;
  throw new Error(response.data.error || "Import failed");
};
