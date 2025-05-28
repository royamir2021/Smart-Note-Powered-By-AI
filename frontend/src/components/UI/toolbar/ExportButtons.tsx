import React from 'react'
import { ArrowUpToLine } from 'lucide-react'
import { Editor } from '@tiptap/react'
import { exportNoteToPDF, exportNoteToWord } from '../../../lib/api'

interface Props {
  editor: Editor;
  setIsLoading: (loading: boolean) => void;
}

const fadedIconBtn =
  "flex flex-col items-center justify-center text-xs text-gray-400 hover:scale-110 hover:-translate-y-0.5 transition-all duration-200"

export default function ExportButtons({ editor, setIsLoading }: Props) {
  if (!editor) return null

  const session = JSON.parse(sessionStorage.getItem('note_session') || '{}')
  const noteId = session.note_id

  if (!noteId) {
    console.warn('Note ID not found in sessionStorage.')
    return null
  }

  // تابع برای خروجی PDF
  const handleExportPDF = async () => {
    setIsLoading(true)
    try {
      await exportNoteToPDF(noteId)
    } catch (e) {
      // toast.error('PDF export failed')
      alert('PDF export failed!')
    } finally {
      setIsLoading(false)
    }
  }

  // تابع برای خروجی Word
  const handleExportWord = async () => {
    setIsLoading(true)
    try {
      await exportNoteToWord(noteId)
    } catch (e) {
      // toast.error('Word export failed')
      alert('Word export failed!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={handleExportPDF}
        className={`${fadedIconBtn} hover:text-indigo-600`}
        title="Export as PDF"
        disabled={!noteId}
      >
        <ArrowUpToLine size={20} />
        <span>PDF</span>
      </button>

      <button
        type="button"
        onClick={handleExportWord}
        className={`${fadedIconBtn} hover:text-green-600`}
        title="Export as Word"
        disabled={!noteId}
      >
        <ArrowUpToLine size={20} />
        <span>Word</span>
      </button>
    </div>
  )
}
