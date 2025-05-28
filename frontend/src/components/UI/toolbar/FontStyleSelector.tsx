import React from 'react'
import { Editor } from '@tiptap/react'

interface Props {
  editor: Editor
}

export default function FontStyleSelector({ editor }: Props) {
 
  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const family = e.target.value
    editor.chain().focus().setMark('textStyle', { fontFamily: family }).run()
  }

  return (
    <div className="flex items-center gap-2">
    <select
  onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
  className="p-2 rounded border border-gray-300 bg-white text-sm cursor-pointer hover:bg-gray-100 transition-all"
>
  <option value="Arial">Arial</option>
  <option value="'Times New Roman'">Times New Roman</option>
  <option value="Georgia">Georgia</option>
  <option value="'Courier New'">Courier New</option>
  <option value="Tahoma">Tahoma</option>
</select>

 
     </div>
  )
}