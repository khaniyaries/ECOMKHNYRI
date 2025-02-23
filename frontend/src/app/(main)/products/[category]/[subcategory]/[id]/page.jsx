"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, Truck, RotateCcw, Star } from "lucide-react"
import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from "react-icons/hi"
import FlashSales from "@/components/FlashSale.jsx"
import { useRouter, usePathname, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { env } from "../../../../../../../config/config.js"
import { useAuth } from '@/hooks/userAuth.js'
import Link from "next/link.js"


export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {  // Only fetch if categoryId exists
        try {
          const response = await fetch(`${env.API_URL}/api/v1/categories/get/${categoryId}`);
          const data = await response.json();
          setCategoryName(data.name);
        } catch (error) {
          console.error('Error fetching category:', error)
        }
      }
    }
  
    fetchCategory()
  }, [categoryId])
  
  

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0])
      setSelectedSize(product.sizes[0])
      setCategoryId(product.category)
    }
  }, [product])

  useEffect(() => {
    if (product?.images) {
      const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url
      setSelectedImage(primaryImage)
    }
  }, [product])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${env.API_URL}/api/v1/products/${id}`)
        const data = await response.json()
        setProduct(data)
        setCategoryId(data.category)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const scrollContainer = (direction, containerClass) => {
    const container = document.querySelector(containerClass)
    const scrollAmount = 340
    
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    if (user && product?.ratings) {
      const userExistingRating = product.ratings.find(
        r => r.userId === user._id
      )?.rating
      setUserRating(userExistingRating || 0)
    }
  }, [user, product])
  
  const handleRatingClick = async (rating) => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', pathname)
      toast.custom((t) => (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p className="mb-2">Please login to rate this product</p>
          <Link
            href='/sign-in'
            className="text-blue-500 underline"
          >
            Login here
          </Link>
        </div>
      ))
      return
    }
  
    try {
      const response = await fetch(`${env.API_URL}/api/v1/products/${id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating })
      })
  
      if (response.ok) {
        const data = await response.json()
        setUserRating(data.userRating)
        setProduct(prev => ({
          ...prev,
          averageRating: data.averageRating,
          totalRatings: data.totalRatings
        }))
        toast.success('Rating updated successfully!')
      }
    } catch (error) {
      toast.error('Failed to update rating')
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
    </div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <main className="container w-full h-full mx-auto px-4 md:px-10 lg:px-20 py-20">
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><a href="#" className="text-slate-400">Products</a></li>
          <li className="text-slate-400">/</li>
          <li><a href="#" className="text-slate-400">{categoryName}</a></li>
          <li className="text-slate-400">/</li>
          <li>{product.name}</li>
        </ol>
      </nav>

      <section className="grid gap-8 md:grid-cols-2">
        <article className="grid gap-4 lg:grid-cols-[100px,1fr] lg:gap-8">
        <div className="relative order-1 aspect-square overflow-hidden rounded-lg border bg-muted lg:order-2">
          <Image
            src={selectedImage || "/images/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="order-2 grid grid-cols-4 gap-4 lg:order-1 lg:grid-cols-1">
          {product.images.map((image) => (
            <button
              key={image._id}
              onClick={() => setSelectedImage(image.url)}
              className={`relative aspect-square w-full overflow-hidden rounded-lg border hover:border-primary lg:h-[100px] ${
                selectedImage === image.url ? 'border-2 border-primary' : 'border-muted'
              }`}
            >
              <Image
                src={image.url}
                alt={`${product.name} view`}
                fill
                className="object-contain"
              />
            </button>
          ))}
        </div>
        </article>

        <article className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 cursor-pointer transition-colors ${
                      star <= (hoverRating || userRating || product.averageRating)
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted-foreground"
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRatingClick(star)}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.totalRatings || 0} Ratings)
              </span>
            </div>
            <p className="text-lg font-semibold md:text-xl">₹{product.price}</p>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>

          <div className="space-y-4">
          {product && product.colors.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-medium">Colors:</h2>
              <div className="flex items-center space-x-3">
                {product.colors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="color" 
                      id={color} 
                      value={color}
                      checked={selectedColor === color}
                      onChange={() => setSelectedColor(color)}
                      className="w-4 h-4 border-2"
                    />
                    <label htmlFor={color}>{color}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product && product.sizes.length > 0 &&(
          <div className="space-y-2">
            <h2 className="font-medium">Size:</h2>
            <div className="flex space-x-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-md border px-4 py-2 text-sm transition-colors
                    ${selectedSize === size 
                      ? 'border-primary bg-primary/10' 
                      : 'hover:border-primary hover:bg-primary/10'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button className="px-4 py-2 hover:bg-muted">-</button>
                <span className="px-4 py-2">2</span>
                <button className="px-4 py-2 hover:bg-muted">+</button>
              </div>
              <button className="bg-black text-white rounded-md py-2 px-3">Buy Now</button>
              <button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center space-x-4">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Free Delivery</h3>
                <p className="text-sm text-muted-foreground">Enter your postal code for Delivery Availability</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Return Delivery</h3>
                <p className="text-sm text-muted-foreground">Free 30 Days Delivery Returns. Details</p>
              </div>
            </div>
          </div>
        </article>
      </section>
      <div className="flex flex-col md:py-16 px-5 md:px-10 lg:px-20 mt-20 pb-10">
        <div className="flex justify-between items-start w-full">
          
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-10 bg-red-500 rounded" />
            <span className="text-red-500 font-bold text-xs">Related Items</span>
          </div>
            
          <div className="flex justify-end gap-2 ml-auto w-auto">
            <button onClick={() => scrollContainer('left', '.flash-scroll-container')} className="p-2 border bg-gray-100 rounded-full hover:bg-gray-200">
              <HiOutlineArrowSmLeft className="w-6 h-6 " />
            </button>
            <button onClick={() => scrollContainer('right', '.flash-scroll-container')} className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200">
              <HiOutlineArrowSmRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      <FlashSales />
    </main>
  )
}

