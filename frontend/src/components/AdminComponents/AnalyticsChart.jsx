import { Line } from "react-chartjs-2"

export default function AnalyticsChart({ title, data, labels, label, color }) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: label,
        data: data,
        borderColor: color,
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
  }

  return <Line data={chartData} options={options} />
}

