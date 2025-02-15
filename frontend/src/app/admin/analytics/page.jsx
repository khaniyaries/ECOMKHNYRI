"use client"

import { useState } from "react"
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Sample data generation function (same as before)
const generateData = (years) => {
  const data = []
  const currentDate = new Date()
  for (let i = 0; i < years * 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    data.unshift({
      date: date.toISOString().slice(0, 7), // YYYY-MM format
      orders: Math.floor(Math.random() * 1000) + 500,
      revenue: Math.floor(Math.random() * 100000) + 50000,
      totalCustomers: Math.floor(Math.random() * 1000) + 5000,
      activeCustomers: Math.floor(Math.random() * 800) + 3000,
    })
  }
  return data
}

const sampleData = generateData(5) // 5 years of data

const timeRanges = [
  { label: "5 Years", value: 60 },
  { label: "3 Years", value: 36 },
  { label: "1 Year", value: 12 },
  { label: "6 Months", value: 6 },
  { label: "1 Month", value: 1 },
]

export default function Analytics() {
  const [selectedRange, setSelectedRange] = useState(60)
  const [showActiveCustomers, setShowActiveCustomers] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const filteredData = sampleData.slice(-selectedRange)

  const handleCustomDateFilter = () => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const filtered = sampleData.filter((item) => {
        const date = new Date(item.date)
        return date >= start && date <= end
      })
      setSelectedRange(filtered.length)
    }
  }

  useAdminAuth();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>

      <div className="flex space-x-4 mb-4">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => setSelectedRange(range.value)}
            className={`px-4 py-2 rounded ${selectedRange === range.value ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="flex space-x-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button onClick={handleCustomDateFilter} className="px-4 py-2 bg-blue-600 text-white rounded">
          Apply Custom Range
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <AnalyticsChart
            title="Orders Over Time"
            data={filteredData.map((item) => item.orders)}
            labels={filteredData.map((item) => item.date)}
            label="Orders"
            color="rgb(75, 192, 192)"
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <AnalyticsChart
            title="Revenue Over Time"
            data={filteredData.map((item) => item.revenue)}
            labels={filteredData.map((item) => item.date)}
            label="Revenue"
            color="rgb(255, 99, 132)"
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Customers</h2>
            <button
              onClick={() => setShowActiveCustomers(!showActiveCustomers)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {showActiveCustomers ? "Show Total" : "Show Active"}
            </button>
          </div>
          <AnalyticsChart
            title={showActiveCustomers ? "Active Customers Over Time" : "Total Customers Over Time"}
            data={filteredData.map((item) => (showActiveCustomers ? item.activeCustomers : item.totalCustomers))}
            labels={filteredData.map((item) => item.date)}
            label={showActiveCustomers ? "Active Customers" : "Total Customers"}
            color={showActiveCustomers ? "rgb(255, 159, 64)" : "rgb(54, 162, 235)"}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <AnalyticsChart
            title="Average Order Value Over Time"
            data={filteredData.map((item) => item.revenue / item.orders)}
            labels={filteredData.map((item) => item.date)}
            label="Average Order Value"
            color="rgb(153, 102, 255)"
          />
        </div>
      </div>
    </div>
  )
}

