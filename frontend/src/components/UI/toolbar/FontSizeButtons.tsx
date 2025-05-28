import React from 'react'
import { Editor } from '@tiptap/react'

interface Props {
  editor: Editor
}

// Minimal, borderless button styles
const btn = `
  w-9 h-9 flex items-center justify-center
  bg-transparent
  rounded
  text-gray-500
  hover:bg-gray-100
  hover:text-blue-600
  transition-all duration-150
  focus:outline-none
  cursor-pointer
  text-[15px] font-bold
`

export default function FontSizeButtons({ editor }: Props) {
  const getCurrentFontSize = (): number => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return 16
    const range = selection.getRangeAt(0)
    const span = range.startContainer.parentElement as HTMLElement
    const size = parseFloat(window.getComputedStyle(span).fontSize)
    return isNaN(size) ? 16 : size
  }

  const handleFontSizeChange = (increase: boolean) => {
    const currentSize = getCurrentFontSize()
    const newSize = increase ? currentSize + 2 : Math.max(8, currentSize - 2)
    editor.chain().focus().setFontSize(`${newSize}px`).run()
  }

  return (
    <div className="flex items-center gap-1">
      <button
        className={btn}
        onClick={() => handleFontSizeChange(true)}
        title="Increase Font Size"
        type="button"
      >
        A↑
      </button>
      <button
        className={btn}
        onClick={() => handleFontSizeChange(false)}
        title="Decrease Font Size"
        type="button"
      >
        A↓
      </button>
    </div>
  )
}
