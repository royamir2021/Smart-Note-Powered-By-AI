import React, { useState } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { Dialog } from '@headlessui/react'
import { Trash2 } from "lucide-react"

const defaultColors = [
  '#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#fb7185',
  '#38bdf8', '#facc15', '#4ade80', '#c084fc'
]

interface ChartInsertModalProps {
  isOpen: boolean
  onClose: () => void
  onInsert: (type: string, data: any) => void
}

export default function ChartInsertModal({ isOpen, onClose, onInsert }: ChartInsertModalProps) {
  // State for chart type and rows
  const [type, setType] = useState('bar')
  const [rows, setRows] = useState([{ label: '', value: '', color: '' }])
  const [showValidation, setShowValidation] = useState(false)

  // Add a new row for chart data
  const addRow = () => setRows([...rows, { label: '', value: '', color: '' }])

  // Remove a row by index
  const removeRow = (idx: number) => {
    if (rows.length === 1) return
    setRows(rows.filter((_, i) => i !== idx))
  }

  // Update value in a row
  const updateRow = (index: number, key: string, value: string) => {
    const updated = [...rows]
    updated[index][key] = value
    setRows(updated)
  }

  // Only include valid (filled) rows
  const filteredRows = rows.filter(r => r.label && r.value)

  // Chart.js data object
  const chartData = {
    labels: filteredRows.map(r => r.label),
    datasets: [
      {
        label: 'Chart Data',
        data: filteredRows.map(r => parseFloat(r.value)),
        backgroundColor: filteredRows.map((r, i) => r.color || defaultColors[i % defaultColors.length])
      },
    ],
  }

  // Handle Insert button click
  const handleInsert = () => {
    if (filteredRows.length < 2) {
      setShowValidation(true)
      return
    }
    onInsert(type, chartData)
    setTimeout(() => {
      const editor = document.querySelector('.ProseMirror') as HTMLElement
      if (editor) {
        const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
        editor.dispatchEvent(event)
      }
    }, 100)
    onClose()
  }

  // Pick chart component
  const Chart = type === 'line' ? Line : type === 'pie' ? Pie : Bar

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Dialog.Panel className="relative bg-white p-2 sm:p-6 rounded-xl w-full max-w-[97vw] sm:max-w-3xl shadow-lg overflow-auto max-h-[98vh]">
        <Dialog.Title className="text-lg sm:text-xl font-bold mb-4">Insert Custom Chart</Dialog.Title>
        {/* Chart Type */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="font-medium text-sm">Chart Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-2 py-1 w-full sm:w-auto">
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="mb-5 overflow-x-auto">
          <table className="w-full min-w-[420px] border text-xs sm:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Label</th>
                <th className="border p-2">Value</th>
                <th className="border p-2">Color</th>
                <th className="border p-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border px-1 rounded focus:ring"
                      value={row.label}
                      placeholder={`Label ${i + 1}`}
                      onChange={e => updateRow(i, 'label', e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-full border px-1 rounded focus:ring"
                      value={row.value}
                      placeholder="e.g. 15"
                      onChange={e => updateRow(i, 'value', e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="color"
                      className="w-10 h-6"
                      value={row.color || defaultColors[i % defaultColors.length]}
                      onChange={e => updateRow(i, 'color', e.target.value)}
                    />
                  </td>
                  <td className="border text-center">
                    <button
                      className="rounded-full p-1 text-red-500 hover:bg-red-50"
                      disabled={rows.length === 1}
                      onClick={() => removeRow(i)}
                      tabIndex={-1}
                      title="Remove row"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addRow}
            className="mt-2 px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 w-full sm:w-auto"
          >
            ➕ Add Row
          </button>
          {showValidation && filteredRows.length < 2 && (
            <div className="text-red-500 text-xs mt-2">Please enter at least 2 valid data rows to insert a chart.</div>
          )}
        </div>

        {/* Live Chart Preview */}
        <div className="bg-gray-50 p-2 sm:p-4 rounded border mb-5 flex flex-col items-center">
          {filteredRows.length >= 2 ? (
            <div className="w-full" style={{ maxWidth: 500, minHeight: 200 }}>
              <Chart data={chartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: type === 'pie', position: 'bottom' } }
              }} height={260} />
            </div>
          ) : (
            <div className="text-gray-400 p-6 text-center text-sm">
              Please enter at least 2 data rows to preview chart.
            </div>
          )}
        </div>

        {/* Action buttons (mobile: sticky) */}
        <div className="flex flex-col sm:flex-row gap-2 justify-end sm:sticky sm:bottom-2">
          <button onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200 font-medium"
          >
            Cancel
          </button>
          <button onClick={handleInsert}
            className="w-full sm:w-auto px-4 py-2 rounded border bg-blue-600 text-white hover:bg-blue-700 font-medium"
          >
            Insert Chart
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}
