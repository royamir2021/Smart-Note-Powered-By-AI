import React from 'react'
import { List, ListOrdered, ListChecks } from 'lucide-react'
import { Editor } from '@tiptap/react'

interface Props { editor: Editor }

const toolbarBtn = (isActive: boolean) =>
  `w-9 h-9 flex items-center justify-center rounded
   ${isActive
     ? 'bg-gray-100 text-blue-700'
     : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'}
   transition-all duration-150 cursor-pointer
  `

export default function ListButtons({ editor }: Props) {
  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={toolbarBtn(editor.isActive('bulletList'))}
        title="Bullet List"
        type="button"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={toolbarBtn(editor.isActive('orderedList'))}
        title="Ordered List"
        type="button"
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={toolbarBtn(editor.isActive('taskList'))}
        title="Checklist"
        type="button"
      >
        <ListChecks size={16} />
      </button>
    </>
  )
}
