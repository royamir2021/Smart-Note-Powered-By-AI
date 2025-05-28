// extensions/MathBlock.tsx
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import MathComponent from '../components/UI/toolbar/MathComponent'

export const MathBlock = Node.create({
  name: 'mathBlock',

  inline: true,
  group: 'inline',  
  atom: true,

  addAttributes() {
    return {
      formula: {
        default: 'E=mc^2',
      },
    }
  },

  parseHTML() {
    return [{ tag: 'math-block' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['math-block', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathComponent)
  },
  addCommands() {
    return {
      insertMathBlock:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { formula: 'E=mc^2' },
          })
        },
    }
  },
})