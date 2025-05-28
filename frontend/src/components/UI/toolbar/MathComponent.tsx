// extensions/MathComponent.tsx
import React, { useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'

export default function MathComponent({ node, updateAttributes }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formula, setFormula] = useState(node.attrs.formula || 'E=mc^2')

  const handleBlur = () => {
    updateAttributes({ formula })
    setIsEditing(false)
  }

  return (
    <NodeViewWrapper as="span" className="inline-math cursor-pointer">
      {isEditing ? (
        <input
          type="text"
          value={formula}
          autoFocus
          onChange={(e) => setFormula(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleBlur()
            }
          }}
          className="inline border px-1 rounded text-sm"
        />
      ) : (
        <span onClick={() => setIsEditing(true)}>
          <InlineMath math={formula} />
        </span>
      )}
    </NodeViewWrapper>
  )
}