"use client"
import { useState } from "react"
import ProductCard from "@/components/ProductCard.jsx"

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
    <div className="max-w-7xl mx-auto mt-0 pb-12">
      {/* 🔄 Modified container structure for small screens */}

      <div className="overflow-x-auto pb-4 scrollbar-hide flash-scroll-container">
        <div className="flex gap-6 min-w-max">
          {products.slice(currentIndex, currentIndex + 4).map((product, index) => (
            <div className="w-[300px]" key={index}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>

      <div className="md:mt-8 text-center">
        <button className="bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 transition-colors">
          View All Products
        </button>
      </div>
    </div>
  )
}

export default FlashSales
