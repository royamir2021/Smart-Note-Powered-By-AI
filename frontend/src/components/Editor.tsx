import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { FontSize } from '../extensions/FontSize'
import { FontFamily } from '../extensions/FontFamily'
import { MathBlock } from '../extensions/MathBlock'
import { ChartBlock } from '../extensions/ChartBlock'
import EditorToolbar from './UI/EditorToolbar'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'

interface Props {
  content: any;
  onChange: (json: any) => void;
  setIsLoading: (loading: boolean) => void;
}

/**
 * Main Editor Component using Tiptap.
 * - Loads all extensions (lists, headings, font, color, math, chart, etc.)
 * - Handles content sync and updates.
 * - Responsive design.
 */
export default function Editor({ content, onChange, setIsLoading }: Props) {
  // Setup editor instance with all desired extensions
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        heading: false,
      }),
      Subscript,
      Superscript,
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      FontSize,
      FontFamily,
      Image,
      ChartBlock,
      MathBlock,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ['paragraph'] }),
    ],
    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });

  // Sync content from parent prop if it changes
  useEffect(() => {
    if (!editor) return;
    const current = editor.getJSON();
    if (JSON.stringify(current) !== JSON.stringify(content)) {
      Promise.resolve().then(() => {
        editor.commands.setContent(content);
      });
    }
  }, [content, editor]);

  // Loading state
  if (!editor)
    return (
      <div className="min-h-[200px] flex items-center justify-center text-gray-400">
        Loading editor...
      </div>
    );

return (
  <div className="relative min-h-[260px] w-full border rounded-lg bg-white shadow-sm">
    {/* Toolbar above editor */}
    <EditorToolbar editor={editor} setIsLoading={setIsLoading} />
    {/* Editor Content */}
    <EditorContent
      editor={editor}
      className="ProseMirror max-w-none focus:outline-none px-2 sm:px-4"
    />
  </div>
);


}
