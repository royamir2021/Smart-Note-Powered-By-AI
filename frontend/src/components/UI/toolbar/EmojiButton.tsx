import React, { useRef, useEffect, useState } from 'react'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { createPortal } from 'react-dom'
import { Editor } from '@tiptap/react'

interface Props {
  editor: Editor
}

export default function EmojiButton({ editor }: Props) {
  const [showEmoji, setShowEmoji] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    if (!showEmoji) return
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmoji(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showEmoji])


  useEffect(() => {
    if (!showEmoji) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowEmoji(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [showEmoji])

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="p-2  rounded hover:bg-gray-100 transition-all"
        title="Insert Emoji"
        onClick={() => setShowEmoji(v => !v)}
      >
        😄
      </button>
      {showEmoji && createPortal(
        <div
          ref={pickerRef}
          className="fixed top-1/2 left-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl border"
          style={{ width: 340, maxWidth: "95vw" }}
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji: any) => {
              editor.chain().focus().insertContent(emoji.native).run()
              setShowEmoji(false)
            }}
            theme="light"
            style={{ width: "100%" }}
          />
        </div>,
        document.body
      )}
    </div>
  )
}
