"use client"

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

const ForYou = ({ }) => {
  return (
    <div className="w-full pt-5 pb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={index}>
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ForYou;
