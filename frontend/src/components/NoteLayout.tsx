import React, { useState } from 'react';
import NoteSidebar from "./NoteSidebar";
import { Menu } from 'lucide-react';

type Note = {
  id: number;
  title: string;
};

type Props = {
  activeTab: "notes" | "flashcards" | "quizzes";
  onTabChange: (tab: "notes" | "flashcards" | "quizzes") => void;
  notes: Note[];
  onNewNote: () => void;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (noteId: number) => void;
  children: React.ReactNode;
};

export default function NoteLayout({
  activeTab,
  onTabChange,
  notes,
  onNewNote,
  onSelectNote,
  onDeleteNote,
  children,
}: Props) {
  // Responsive sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={24} className="text-purple-600" />
      </button>
      {/* Sidebar */}
      <NoteSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        notes={notes}
        onNewNote={onNewNote}
        onSelectNote={onSelectNote}
        onDeleteNote={onDeleteNote}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
