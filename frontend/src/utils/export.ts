import { generateHTML } from '@tiptap/html'

import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'

import { FontSize } from '../extensions/FontSize'
import { FontFamily } from '../extensions/FontFamily'
import { MathBlock } from '../extensions/MathBlock'
import { ChartBlock } from '../extensions/ChartBlock'


const extensions = [
  StarterKit.configure({
    history: false,
    bulletList: false,
    orderedList: false,
    listItem: false,
    heading: false,
  }),
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
]


export function exportNoteToWord(noteJson: any) {
  const html = generateHTML(noteJson, extensions)

  const blob = new Blob(
    [`<html><head><meta charset="utf-8"></head><body>${html}</body></html>`],
    { type: 'application/msword' }
  )

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'note.doc'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
