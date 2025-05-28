import React from 'react'
import { Bold, Italic } from 'lucide-react'
import { Editor } from '@tiptap/react'

interface Props { editor: Editor }

const toolbarBtn = (isActive: boolean) =>
  `w-9 h-9 flex items-center justify-center rounded
   ${isActive
     ? 'bg-gray-100 text-blue-700'
     : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'}
   transition-all duration-150 cursor-pointer
  `

const iconFont = "font-thin text-[15px] tracking-tight text-gray-500 flex items-baseline leading-none"

export default function FormattingButtons({ editor }: Props) {
  return (
    <>
      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={toolbarBtn(editor.isActive('bold'))}
        title="Bold"
        type="button"
      >
        <Bold size={16} />
      </button>
      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={toolbarBtn(editor.isActive('italic'))}
        title="Italic"
        type="button"
      >
        <Italic size={16} />
      </button>
      {/* Heading 2 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={toolbarBtn(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
        type="button"
      >
        <span className={iconFont} style={{ fontFamily: 'Arial, Inter, sans-serif' }}>
          H
          <span className="text-xs ml-0.5 font-thin text-gray-500" style={{ fontFamily: 'Arial, Inter, sans-serif' }}>2</span>
        </span>
      </button>
      {/* Subscript */}
      <button
        onClick={() => editor?.chain().focus().toggleSubscript().run()}
        className={toolbarBtn(editor?.isActive('subscript'))}
        title="Subscript"
        type="button"
      >
        <span className={iconFont} style={{ fontFamily: 'Arial, Inter, sans-serif' }}>
          X
          <sub className="text-xs ml-0.5 font-thin text-gray-500" style={{ fontFamily: 'Arial, Inter, sans-serif' }}>2</sub>
        </span>
      </button>
      {/* Superscript */}
      <button
        onClick={() => editor?.chain().focus().toggleSuperscript().run()}
        className={toolbarBtn(editor?.isActive('superscript'))}
        title="Superscript"
        type="button"
      >
        <span className={iconFont} style={{ fontFamily: 'Arial, Inter, sans-serif' }}>
          X
          <sup className="text-xs ml-0.5 font-thin text-gray-500" style={{ fontFamily: 'Arial, Inter, sans-serif' }}>2</sup>
        </span>
      </button>
    </>
  )
}
