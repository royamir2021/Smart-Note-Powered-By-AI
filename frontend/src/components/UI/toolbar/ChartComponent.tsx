// ChartComponent.tsx
import React from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js'
import { NodeViewWrapper } from '@tiptap/react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
)

export default function ChartComponent({ node }) {
  let { type, data } = node.attrs

  // Step 1: Parse if data is a string
  try {
    if (typeof data === 'string') {
      data = JSON.parse(data)
    }
  } catch (err) {
    console.warn('Failed to parse chart data', err)
    data = null
  }

  // Step 2: Validate data
  const isValidData =
    data &&
    typeof data === 'object' &&
    Array.isArray(data.labels) &&
    Array.isArray(data.datasets) &&
    data.datasets.length > 0 &&
    Array.isArray(data.datasets[0].data)

  const renderChart = () => {
    if (!isValidData) {
      return (
        <div className="text-red-500 text-sm bg-red-50 p-3 border rounded">
          ⚠️ Invalid chart data. Please check chart structure.
        </div>
      )
    }

    switch (type) {
      case 'bar':
        return <Bar data={data} />
      case 'line':
        return <Line data={data} />
      case 'pie':
        return <Pie data={data} />
      default:
        return <p className="text-gray-500 text-sm">Unknown chart type: {type}</p>
    }
  }

  return (
    <NodeViewWrapper className="chart-block p-3 bg-white shadow-sm rounded border max-w-lg mx-auto">
      {renderChart()}
    </NodeViewWrapper>
  )
}
