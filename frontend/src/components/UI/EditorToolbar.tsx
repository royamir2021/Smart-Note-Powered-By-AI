import React from 'react'
import { Editor } from '@tiptap/react'
import FormattingButtons from './toolbar/FormattingButtons'
import ListButtons from './toolbar/ListButtons'
import AlignButtons from './toolbar/AlignButtons'
import InsertButtons from './toolbar/InsertButtons'
import ExportButtons from './toolbar/ExportButtons'
import AiButtons from './toolbar/AiButtons'
import EmojiButton from './toolbar/EmojiButton'
import FontStyleSelector from './toolbar/FontStyleSelector'
import FontSizeButtons from './toolbar/FontSizeButtons'
import ColorPicker from './toolbar/ColorPicker'
import ImportWordButton from './toolbar/ImportButton' 

interface Props {
  editor: Editor | null
  setIsLoading: (loading: boolean) => void
}

export default function EditorToolbar({ editor, setIsLoading }: Props) {
  if (!editor) return null

  return (
    <div
      className="
        sticky top-0 z-30 bg-white flex flex-wrap gap-2 border-b
        px-2 py-2 shadow-sm
        overflow-x-auto
        overflow-y-visible
        max-h-none
        relative
      "
      style={{ minHeight: "auto" }}
    >
      <FontStyleSelector editor={editor} />
      <FontSizeButtons editor={editor} />
      <div className="w-px h-7 bg-gray-200 mx-2" />
      
      <FormattingButtons editor={editor} />
      <div className="w-px h-7 bg-gray-200 mx-2" />
      <ListButtons editor={editor} />
      <div className="w-px h-7 bg-gray-200 mx-2" />
      <AlignButtons editor={editor} />
      <div className="w-px h-7 bg-gray-200 mx-2" />
      <InsertButtons editor={editor} />
      <div className="w-px h-7 bg-gray-200 mx-2" />
      <ColorPicker editor={editor} />
      <EmojiButton editor={editor} />
      
      <div className="w-px h-7 bg-gray-200 mx-2" />
  
      <AiButtons setIsLoading={setIsLoading} />
      {/*<div className="w-px h-7 bg-gray-200 mx-2" /> */}
      {/*   <ExportButtons editor={editor}  setIsLoading={setIsLoading} />*/}
      {/*<div className="w-px h-7 bg-gray-200 mx-2" />*/}
{/*     <ImportWordButton*/}
{/*  setIsLoading={setIsLoading}*/}
{/*  onImported={(jsonContent) => {*/}
{/*    editor?.chain().focus().insertContent(jsonContent).run();*/}
{/*  }}*/}
{/*/>*/}

    </div>
  )
}
