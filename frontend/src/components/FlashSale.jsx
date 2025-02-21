"use client"
import { useEffect, useState } from "react"
import ProductCard from "@/components/ProductCard.jsx"
import { env } from "../../config/config.js"
import Link from "next/link.js"

const FlashSales = ({ numberOfProducts }) => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const productsPerPage = 4

  useEffect(() => {
    const fetchFlashSales = async () => {
      setIsLoading(true)
      try {
        const url = numberOfProducts 
          ? `${env.API_URL}/api/v1/products/flash-sale?limit=${numberOfProducts}`
          : `${env.API_URL}/api/v1/products/flash-sale`
        
        const response = await fetch(url)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching flash sales:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFlashSales()
  }, [numberOfProducts])

  const handleScroll = (direction) => {
    if (direction === 'right') {
      setCurrentIndex((prev) => 
        prev + productsPerPage >= products.length ? 0 : prev + productsPerPage
      )
    } else {
      setCurrentIndex((prev) => 
        prev - productsPerPage < 0 ? Math.max(0, products.length - productsPerPage) : prev - productsPerPage
      )
    }
  }

  // Expose scroll method to parent
  useEffect(() => {
    if (window) {
      window.scrollFlashSales = handleScroll
    }
  }, [products.length])

  const visibleProducts = products.slice(currentIndex, currentIndex + productsPerPage)

  return (
    <div className="max-w-7xl mx-auto mt-0 pb-12">
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto pb-4 scrollbar-hide flash-scroll-container">
            <div className="flex gap-6 min-w-max">
              {visibleProducts.map((product) => (
                <Link 
                href={`/products/${product.category}/${product._id}`}
                className="w-[300px]" key={product._id}>
                  <ProductCard {...product} />
                </Link>
              ))}
            </div>
          </div>

          <div className="md:mt-8 text-center">
            <button className="bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 transition-colors">
              View All Products
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default FlashSales
