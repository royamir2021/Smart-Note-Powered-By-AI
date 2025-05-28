import React, { useRef, useEffect, useState } from 'react'
import { SketchPicker } from 'react-color'
import { Editor } from '@tiptap/react'
import { Paintbrush } from 'lucide-react'
import { createPortal } from 'react-dom'

interface Props {
  editor: Editor
}

export default function ColorPicker({ editor }: Props) {
  const [showPicker, setShowPicker] = useState(false)
  const [color, setColor] = useState('#000000')
  const pickerRef = useRef<HTMLDivElement>(null)

  
  useEffect(() => {
    if (!showPicker) return
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showPicker])

  useEffect(() => {
    if (!showPicker) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPicker(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [showPicker])

  const handleChange = (newColor: any) => {
    const selected = newColor.hex
    setColor(selected)
    editor.chain().focus().setColor(selected).run()
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="p-2  rounded hover:bg-gray-100 transition-all"
        title="Text Color"
      >
        <Paintbrush size={18} style={{ color }} />
      </button>

      {showPicker && createPortal(
        <div
          ref={pickerRef}
          className="fixed top-1/2 left-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-lg rounded bg-white"
          style={{ width: 260, maxWidth: "95vw" }}
        >
          <SketchPicker color={color} onChange={handleChange} />
        </div>,
        document.body
      )}
    </div>
  )
}
