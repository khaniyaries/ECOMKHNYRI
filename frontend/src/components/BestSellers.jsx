"use client"
import { useState, useEffect } from "react"
import Link from "next/link.js"
import ProductCard from "@/components/ProductCard.jsx"
import { env } from "../../config/config.js"

const BestSellers = ({ numberOfProducts = 20 }) => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBestSellers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${env.API_URL}/api/v1/products/best-selling?limit=${numberOfProducts}`)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching best sellers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBestSellers()
  }, [numberOfProducts])

  return (
    <div className="w-full pt-5 pb-12">
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link 
            href={`/products/${product.category}/${product.subcategory}/${product._id}`}
            key={product._id}
            >
              <ProductCard {...product} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default BestSellers
