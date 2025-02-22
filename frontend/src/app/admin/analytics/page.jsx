"use client"
import { useState, useEffect } from "react"
import { useAdminAuth } from '@/hooks/useAdminAuth.js'
import AnalyticsChart from "@/components/AdminComponents/AnalyticsChart.jsx"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { env } from "../../../../config/config.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const timeRanges = [
  { label: "5 Years", value: 60 },
  { label: "3 Years", value: 36 },
  { label: "1 Year", value: 12 },
  { label: "6 Months", value: 6 },
  { label: "1 Month", value: 1 },
]

export default function Analytics() {
  const { isAuthenticated } = useAdminAuth()
  const [selectedRange, setSelectedRange] = useState(12) // Default to 1 year
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalyticsData()
    }
  }, [isAuthenticated, selectedRange])

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/analytics?months=${selectedRange}`)
      const data = await response.json()
      setAnalyticsData(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  const handleCustomDateFilter = async () => {
    if (startDate && endDate) {
      try {
        const response = await fetch(
          `${env.API_URL}/api/v1/analytics/custom?startDate=${startDate}&endDate=${endDate}`
        )
        const data = await response.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Error fetching custom date analytics:', error)
      }
    }
  }

  if (!isAuthenticated || loading) {
    return null
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => setSelectedRange(range.value)}
            className={`px-4 py-2 rounded transition-colors ${
              selectedRange === range.value 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleCustomDateFilter} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Apply Custom Range
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <AnalyticsChart
            title="Orders Over Time"
            data={analyticsData.orders}
            labels={analyticsData.labels}
            label="Orders"
            color="rgb(75, 192, 192)"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <AnalyticsChart
            title="Revenue Over Time"
            data={analyticsData.revenue}
            labels={analyticsData.labels}
            label="Revenue"
            color="rgb(255, 99, 132)"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <AnalyticsChart
            title="Average Order Value"
            data={analyticsData.averageOrderValue}
            labels={analyticsData.labels}
            label="Average Order Value"
            color="rgb(153, 102, 255)"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <AnalyticsChart
            title="Total Customers"
            data={analyticsData.customers}
            labels={analyticsData.labels}
            label="Customers"
            color="rgb(54, 162, 235)"
          />
        </div>
      </div>
    </div>
  )
}
