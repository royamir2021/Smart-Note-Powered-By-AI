import React, { useState, useRef } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { Editor } from '@tiptap/react'
import { uploadImage } from '../../../lib/api'
import ChartInsertModal from '../../models/ChartInsertModal'

interface Props {
  editor: Editor
}

export default function InsertButtons({ editor }: Props) {
  const [isChartModalOpen, setIsChartModalOpen] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Handles the image upload from user input
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Get session info for note and student
    const session = JSON.parse(sessionStorage.getItem('note_session') || '{}')
    const noteId = session?.note_id
    const studentId = session?.student_id

    if (!noteId || !studentId) {
      alert('Note or student info missing.')
      return
    }

    try {
      // Upload image to backend
      const { url } = await uploadImage(file, noteId, studentId)
      if (url) {
        // Insert image in editor, then a new paragraph
        editor.chain().focus().insertContent([
          { type: 'image', attrs: { src: url, alt: 'Uploaded Image' } },
          { type: 'paragraph' }
        ]).run()
      }
    } catch (error: any) {
      if (error.response?.data) {
        alert(JSON.stringify(error.response.data))
      }
      console.error('Image upload failed:', error)
    }
  }

  // Main button style
  const btnClass = `
    w-9 h-9 flex items-center justify-center
    rounded-full
    text-gray-400
    bg-white
    shadow-sm
    hover:scale-110
    hover:text-blue-600
    hover:bg-blue-50
    active:scale-95
    transition-all duration-150
    cursor-pointer
  `

  return (
    <>
      {/* Math Formula Button */}
      <button
        type="button"
        onClick={() => editor.chain().focus().insertMathBlock().run()}
        className={btnClass}
        title="Insert Math Formula"
      >
        <span className="text-lg font-semibold">∑</span>
      </button>

      {/* Chart Button */}
      <button
        type="button"
        onClick={() => setIsChartModalOpen(true)}
        className={btnClass}
        title="Insert Chart"
      >
        <span className="text-lg">📊</span>
      </button>

      {/* Chart Insert Modal */}
      <ChartInsertModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        onInsert={(type, data) => {
          editor.chain().focus().insertContent([
            { type: 'chartBlock', attrs: { type, data } },
            { type: 'paragraph' },
          ]).run()
        }}
      />

      {/* Image Upload Button */}
      <label className={btnClass} title="Upload Image">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <ImageIcon size={20} />
      </label>
    </>
  )
}
