import { Line } from "react-chartjs-2"

export default function AnalyticsChart({ title, data, labels, label, color }) {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: color.replace(')', ', 0.1)'),
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (label === "Revenue" || label === "Average Order Value") {
              return '$' + value.toLocaleString()
            }
            return value.toLocaleString()
          }
        }
      }
    }
  }

  return (
    <div style={{ height: '400px' }}>
      <Line data={chartData} options={options} />
    </div>
  )
}
