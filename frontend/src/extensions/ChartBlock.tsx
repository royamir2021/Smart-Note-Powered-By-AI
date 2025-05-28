// extensions/ChartBlock.tsx
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ChartComponent from '../components/UI/toolbar/ChartComponent'

export const ChartBlock = Node.create({
  name: 'chartBlock',

  group: 'block',
  atom: true,

  addAttributes() {
    return {
      type: {
        default: 'bar',
      },
      data: {
        default: {
          labels: ['Red', 'Blue', 'Yellow'],
          datasets: [
            {
              label: 'My Chart',
              data: [12, 19, 3],
              backgroundColor: ['#f87171', '#60a5fa', '#fbbf24'],
            },
          ],
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'chart-block' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['chart-block', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChartComponent)
  },

  addCommands() {
    return {
      insertChartBlock:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: 'chartBlock',
          }),
    }
  }}
  )