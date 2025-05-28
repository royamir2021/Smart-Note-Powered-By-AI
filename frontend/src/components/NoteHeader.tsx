import React from 'react'
import { BookOpen, X, Move } from 'lucide-react'

interface NoteHeaderProps {
  onClose: () => void
  onResize: () => void
  onDragStart?: (e: React.MouseEvent) => void
}

export default function NoteHeader({ onClose, onResize, onDragStart }: NoteHeaderProps) {
  return (
    <div
      onMouseDown={onDragStart}
      className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-2 rounded-t-md shadow-sm cursor-move sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-5"
    >
      <div className="flex items-center gap-2 truncate">
        <BookOpen size={16} className="text-purple-400 shrink-0" />
        <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 truncate">
          {'My Note'}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onResize}
          title="Resize"
          className="p-1.5 text-gray-500 hover:text-gray-800 sm:p-2 lg:p-2.5"
        >
          <Move size={16} />
        </button>

        <button
          onClick={onClose}
          title="Close"
          className="p-1.5 text-red-500 hover:text-red-700 sm:p-2 lg:p-2.5"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
