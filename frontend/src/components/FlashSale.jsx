"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import ProductCard from "@/components/ProductCard.jsx"
import { Countdown } from "@/components/countdown.jsx"

const products = [
  {
    name: "HAVIT HV-G92 Gamepad",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
    price: 120,
    originalPrice: 160,
    discount: 40,
    rating: 5,
    reviews: 88,
  },
  {
    name: "AK-900 Wired Keyboard",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
    price: 960,
    originalPrice: 1160,
    discount: 35,
    rating: 4,
    reviews: 75,
  },
  {
    name: "IPS LCD Gaming Monitor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
    price: 370,
    originalPrice: 400,
    discount: 30,
    rating: 5,
    reviews: 99,
  },
  {
    name: "S-Series Comfort Chair",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
    price: 375,
    originalPrice: 400,
    discount: 25,
    rating: 4.5,
    reviews: 99,
  },
]

const FlashSales = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % (products.length - 3))
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + (products.length - 3)) % (products.length - 3))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-start gap-20 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-10 bg-red-500 rounded" />
            <span className="text-red-500">Today's</span>
          </div>
          <h2 className="text-4xl font-bold">Flash Sales</h2>
        </div>
        <div className="flex flex-col mt-5 items-start gap-4">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Days</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Seconds</div>
            </div>
          </div>
          <Countdown />
          {/* <div className="flex gap-2">
            <button onClick={prev} className="p-2 border rounded-full hover:bg-gray-100">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={next} className="p-2 border rounded-full hover:bg-gray-100">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div> */}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {products.slice(currentIndex, currentIndex + 4).map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <button className="bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 transition-colors">
          View All Products
        </button>
      </div>
    </div>
  )
}

export default FlashSales;