"use client"

import { useEffect, useState } from "react"
import { formatTime } from "@/utils/format-time.js"

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState(345600) // 4 days in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const time = formatTime(timeLeft)

  return (
    <div className="flex items-center gap-2 text-4xl font-bold">
      <div>{time.days}</div>
      <div className="text-red-500">:</div>
      <div>{time.hours}</div>
      <div className="text-red-500">:</div>
      <div>{time.minutes}</div>
      <div className="text-red-500">:</div>
      <div>{time.seconds}</div>
    </div>
  )
}

