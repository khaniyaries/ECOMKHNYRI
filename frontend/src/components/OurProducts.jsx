"use client"
import { useState, useEffect } from "react"
import ProductCard from "@/components/ProductCard.jsx"
import { env } from "../../config/config.js"
import Link from "next/link.js"

const OurProducts = ({ currentPage, rows, setTotalPages }) => {
    const [productsPerPage, setProductsPerPage] = useState(0)
    const [visibleProducts, setVisibleProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchRandomProducts = async (count) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${env.API_URL}/api/v1/products/random/${count}`)
            const data = await response.json()
            setVisibleProducts(data)
            
            // Set total pages based on a fixed total (e.g., 100 products)
            const totalProducts = 12 // You can adjust this or fetch from an API
            const pages = Math.ceil(totalProducts / count)
            setTotalPages(pages)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            const count = width >= 1024 ? 8 : 6
            setProductsPerPage(count)
            fetchRandomProducts(count)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (productsPerPage > 0) {
            fetchRandomProducts(productsPerPage)
        }
    }, [currentPage, productsPerPage])

    // Remove the transform style and let the visibleProducts handle the display
return (
    <div className="w-full">
        <div className="overflow-hidden relative">
            <div className="product-scroll-container w-full">
                {isLoading ? 
                (
                    <div className="flex justify-center items-center h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                        {visibleProducts.map((product) => (
                            <Link 
                            key={product._id}
                            href={`/products/${product.category}/${product.subcategory}/${product._id}`}
                            >
                                <ProductCard {...product} />
                            </Link>
                        ))}
                    </div>
                )}
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


export default OurProducts;