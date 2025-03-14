"use client"
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image.js'
import ProductCard from '@/components/ProductCard'
import { env } from '../../../../../config/config.js'
import { useParams } from 'next/navigation.js'

export default function ProductsByCategoryPage() {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef(null)
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)


  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${env.API_URL}/api/v1/products/category/${category}?page=${page}&limit=12`)
      const data = await response.json()
      
      if (data.length === 0) {
        setHasMore(false)
        return
      }

      setProducts(prev => [...prev, ...data])
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(`${env.API_URL}/api/v1/categories`)
      const data = await response.json()
      
      setCategories(data)
    // Use 'data' directly for filtering, not 'categories' state
    const subs = data.filter(cat => cat.parent === category)
    console.log(subs)
    setSubcategories(subs)
    }

    fetchCategories()
  }, [category])


  useEffect(() => {
    const fetchCategory = async () => {
      if (category) {  // Only fetch if categoryId exists
        try {
          const response = await fetch(`${env.API_URL}/api/v1/categories/get/${category}`);
          const data = await response.json();
          setCategoryName(data.name);
        } catch (error) {
          console.error('Error fetching category:', error)
        }
      }
    }
  
    fetchCategory()
  }, [category])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchProducts()
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading])

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-10 bg-red-500 rounded" />
            <span className="text-red-500 font-bold text-xs">Our Products</span>
          </div>
          <h2 className="text-4xl font-bold">{categoryName || ""}</h2>
        </div>

        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {subcategories?.map((subcat) => (
              <Link
                href={`/products/${category}/${subcat._id}`}
                key={subcat?._id}
                className="flex flex-col items-center justify-center gap-2 shrink-0"
              >
              <div className="rounded-full flex justify-center w-[120px] h-[120px] bg-white transition-all hover:bg-white/5 border-2">
                {subcat?.image && (
                    <Image
                      src={subcat.image?.url}
                      alt={subcat?.name}
                      height={120}
                      width={120}
                      className="rounded-full"
                    />
                  )}
              </div>
              <span className="text-sm font-medium text-center px-2 line-clamp-2">{subcat?.name}</span>
              </Link>
            ))}
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link 
              href={`/products/${product.category}/${product.subcategory}/${product._id}`}
              className="w-full"
              key={product._id}
            >
              <ProductCard {...product} />
            </Link>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        )}

        {!loading && hasMore && (
          <div ref={observerTarget} className="h-20" />
        )}

        {!hasMore && (
          <div className="text-center py-8 text-gray-500">
            No more products to load
          </div>
        )}
      </div>
    </div>
  )
}
