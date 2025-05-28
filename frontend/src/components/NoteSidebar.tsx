import React, { useState, useEffect } from "react";
import {
  PlusCircle, FolderPlus, Folder,
  ChevronRight, ChevronDown, NotebookPen, Trash2, X
} from "lucide-react";
import toast from "react-hot-toast";
import { deleteNote } from "../modules/notes/noteApi";
import {
  fetchFolders, createFolder, renameFolder, deleteFolder, moveNoteToFolder
} from "../modules/folders/folderApi";


interface Note {
  id: number;
  title: string;
}
interface Props {
  notes: Note[];
  onNewNote: () => void;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (noteId: number) => void;
  selectedNoteId?: number;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}
// Folder structure type
interface FolderItem {
  id: number;
  name: string;
  notes: Note[];
  open: boolean;
}

export default function NoteSidebar({
 notes, onNewNote, onSelectNote, onDeleteNote,
  selectedNoteId, sidebarOpen, setSidebarOpen
}: Props) {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [draggedNote, setDraggedNote] = useState<Note | null>(null);

   // --- READ studentId & courseId from sessionStorage ---
  // The expected sessionStorage key is "note_session", but change it if your key is different!
  const session = sessionStorage.getItem("note_session");
  const sessionData = session ? JSON.parse(session) : {};
  const studentId = sessionData.student_id;
  const courseId = sessionData.course_id;

  // Load folders from API on mount
 useEffect(() => {
    // Don't call API if IDs are missing (wait for session)
    if (!studentId || !courseId) return;
    const loadFolders = async () => {
      try {
        // Pass IDs to fetchFolders API function
        const data = await fetchFolders(studentId, courseId);
        setFolders(data.map((f: any) => ({ ...f, open: false })));
      } catch (err) {
        console.error("Failed to load folders:", err);
      }
    };
    loadFolders();
  }, [studentId, courseId]);

  // Add new folder
    const addFolder = async () => {
        if (!studentId || !courseId) {
            toast.error("Missing session data");
            return;
        }

        try {
            const newFolder = await createFolder({
                name: "Untitled Folder",
                student_id: studentId,
                course_id: courseId,
            });
            setFolders((prev) => [...prev, { ...newFolder, notes: [], open: true }]);
        } catch (err) {
            toast.error("Could not create folder");
        }
    };


    // Rename folder
  const updateFolderName = async (id: number, name: string) => {
    const trimmed = name.trim();
    setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name: trimmed } : f)));
    if (!trimmed) {
      toast.error("Folder name cannot be empty");
      return;
    }
    try {
      await renameFolder(id, trimmed);
    } catch (err) {
      toast.error("Rename failed");
    }
  };

  // Move note to a folder by drag & drop
  const handleDrop = async (folderId: number) => {
    if (!draggedNote) return;
    try {
      await moveNoteToFolder(draggedNote.id, folderId);
      setFolders((prev) =>
        prev.map((folder) => {
          let notes = folder.notes.filter((n) => n.id !== draggedNote.id);
          if (folder.id === folderId) notes = [...notes, draggedNote];
          return { ...folder, notes };
        })
      );
      setDraggedNote(null); // Clear drag state
    } catch (err) {
      toast.error("Could not move note");
    }
  };

  // Move note out of any folder (drop on "No Folder" area)
  const handleDropToNoFolder = async () => {
    if (!draggedNote) return;
    try {
      await moveNoteToFolder(draggedNote.id, null); // null means remove from any folder
      setFolders((prev) =>
        prev.map((folder) => ({
          ...folder,
          notes: folder.notes.filter((n) => n.id !== draggedNote.id),
        }))
      );
      setDraggedNote(null);
    } catch (err) {
      toast.error("Could not move note out of folder");
    }
  };

  // Open/close folder
  const toggleFolder = (folderId: number) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, open: !folder.open } : folder
      )
    );
  };

  // Delete a folder
 // Delete a folder ONLY if it is empty
const handleDeleteFolder = async (folderId: number) => {
  // If the folder has notes, show error and do not delete
  const folder = folders.find(f => f.id === folderId);
  if (folder && folder.notes.length > 0) {
    toast.error("You must remove all notes from this folder before deleting it.");
    return;
  }
  // Otherwise, delete as usual
  try {
    await deleteFolder(folderId);
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
  } catch (err) {
    toast.error("Could not delete folder");
  }
};


  // Delete a note (removes from all lists/folders)
  const handleDeleteNote = async (noteId: number) => {
    try {
      await deleteNote(noteId);
      onDeleteNote(noteId);
      setFolders((prev) =>
        prev.map((folder) => ({
          ...folder,
          notes: folder.notes.filter((n) => n.id !== noteId),
        }))
      );
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  // Notes not in any folder
  const outsideNotes = notes.filter(
    (note) => !folders.some((f) => f.notes.find((n) => n.id === note.id))
  );

  // Sidebar classes for responsive design
  const sidebarClasses = `
    fixed top-0 left-0 z-50
    h-full w-4/5 max-w-xs bg-white border-r shadow-lg
    flex flex-col p-3 space-y-4 overflow-y-auto
    transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:relative md:z-0 md:w-[240px] md:max-w-none md:shadow-sm md:p-4
    md:translate-x-0
  `;

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      <aside className={sidebarClasses} style={{ minHeight: "100vh" }}>
        {/* Mobile close button */}
        <div className="flex md:hidden justify-end mb-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        {/* New Note button */}
      <button
  className="group w-full flex items-center gap-2 text-sm font-semibold text-white bg-purple-500 hover:bg-purple-600 px-3 py-2 rounded-md shadow transition-all duration-300 hover:scale-105"
  onClick={() => { onNewNote(); setSidebarOpen(false); }}
>
  <span className="inline-block transition group-hover:animate-spin-slow">
    <PlusCircle size={20} className="mr-1" />
  </span>
  New Note
</button>
        <hr className="border-gray-300" />
        <div className="flex items-center gap-2 text-xs text-gray-700 font-semibold uppercase tracking-wide">
  <NotebookPen size={16} className="text-purple-500 animate-bounce" />
  <span>Your Notes</span>
</div>

        {/* "No Folder" drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropToNoFolder}
          className="py-2 border-dashed border-2 border-gray-200 rounded text-xs text-gray-500 text-center my-2 cursor-pointer"
        >
          Drop here to remove from folder
        </div>

        {/* Notes not in any folder */}
        <div className="space-y-1 mt-2">
          {outsideNotes.map((note) => (
            <div
              key={note.id}
              draggable
              onDragStart={() => setDraggedNote(note)}
              className={`flex items-center justify-between px-3 py-1 rounded-md text-sm cursor-move truncate transition font-semibold ${
                note.id === selectedNoteId
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex-1 truncate cursor-pointer" onClick={() => onSelectNote(note)}>
                {note.title || "Untitled"}
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-gray-400 hover:text-red-600 ml-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Folders */}
        {folders.map((folder) => (
          <div
            key={folder.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(folder.id)}
          >
            {/* Folder header */}
            <div
              className="flex items-center justify-between px-2 py-1 mt-0 rounded-md bg-purple-50 text-sm font-bold text-purple-700 cursor-pointer hover:bg-purple-100 transition"
              onClick={() => toggleFolder(folder.id)}
            >
              <div className="flex items-center gap-2">
                <Folder size={18} className="text-purple-500" />


               <input
  value={folder.name}
  // Let the user type anything (including empty). Only update state.
  onChange={(e) => {
    const name = e.target.value;
    setFolders((prev) =>
      prev.map((f) => (f.id === folder.id ? { ...f, name } : f))
    );
  }}
  // When input loses focus, validate the folder name and save if valid.
  onBlur={() => {
    const trimmed = folder.name.trim();
    if (!trimmed) {
      toast.error("Folder name cannot be empty");
      // If the name is empty, set a default value and DO NOT save to server.
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folder.id ? { ...f, name: "Untitled Folder" } : f
        )
      );
      return;
    }
    // If valid, send rename to server.
    renameFolder(folder.id, trimmed).catch(() =>
      toast.error("Rename failed")
    );
  }}
  // Allow saving with Enter key (triggers blur event)
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }}
  className="bg-transparent focus:outline-none w-full font-semibold"
/>

                
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                >
                  <X size={14} className="text-gray-400 hover:text-red-600" title="Delete folder" />
                </button>
                {folder.open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </div>
            {/* Notes inside folder */}
            {folder.open && (
              <div className="ml-4 mt-2 space-y-1">
                {folder.notes.map((note) => (
                  <div
                    key={note.id}
                    draggable
                    onDragStart={() => setDraggedNote(note)}
                    className={`flex items-center justify-between px-3 py-1 text-xs rounded-md truncate cursor-move font-semibold ${
                      note.id === selectedNoteId
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex-1 truncate cursor-pointer" onClick={() => onSelectNote(note)}>
                      {note.title || "Untitled"}
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-400 hover:text-red-600 ml-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Add folder button */}
        <button
          onClick={addFolder}
          className="w-full mt-6 flex items-center justify-center text-sm text-purple-600 hover:text-purple-800"
        >
          <FolderPlus size={18} className="mr-2" />
          Add Folder
        </button>
      </aside>
    </>
  );
}
