import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy } from 'react';
import { Toaster } from 'react-hot-toast';

// Lazy load the pages to optimize the bundle size
const NoteEditorPage = lazy(() => import('./pages/NoteEditorPage'));
const StartNoteWidget = lazy(() => import('./pages/StartNoteWidget'));

/**
 * Main Application Component
 * Handles routing and global components (e.g., Toaster for notifications)
 */
export default function App() {
  return (
    <BrowserRouter>
      {/* Notification system positioned at the top center of the screen */}
      <Toaster position="top-center" />

      {/* Application Routes */}
      <Routes>
        {/* Entry point for the widget, usually triggered by LMS or external app */}
        <Route path="/" element={<StartNoteWidget />} />

        {/* Note Editor - Opens inside an iframe or as a standalone view */}
        <Route path="/iframe/notes" element={<NoteEditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
