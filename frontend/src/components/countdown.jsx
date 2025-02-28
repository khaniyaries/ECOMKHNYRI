"use client"
import { useEffect, useState } from "react"
import { formatTime } from "@/utils/format-time.js"
import { env } from "../../config/config.js"

export function Countdown() {
  const [flashSale, setFlashSale] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const fetchFlashSale = async () => {
      const response = await fetch(`${env.API_URL}/api/v1/flashsales/period`)
      const data = await response.json()
      setFlashSale(data)
    }
    fetchFlashSale()
  }, [])

  useEffect(() => {
    if (flashSale) {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const end = new Date(flashSale.endTime).getTime()
        const difference = Math.max(0, Math.floor((end - now) / 1000))
        setTimeLeft(difference)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [flashSale])

  const time = formatTime(timeLeft)

  return (
    <div className="flex items-center gap-2 lg:text-4xl md:text-2xl text-xl font-bold">
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