import React from 'react'
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react'
import { Editor } from '@tiptap/react'

interface Props { editor: Editor }
const btn = `
  w-9 h-9 flex items-center justify-center
  bg-transparent
  rounded-none
  text-gray-500
  hover:bg-gray-100
  hover:text-blue-600
  transition-all duration-150
  focus:outline-none
  cursor-pointer
`


export default function AlignButtons({ editor }: Props) {
  return (
    <>
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btn} title="Align Left"><AlignLeft size={18} /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btn} title="Align Center"><AlignCenter size={18} /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btn} title="Align Right"><AlignRight size={18} /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={btn} title="Justify"><AlignJustify size={18} /></button>
    </>
  )
}