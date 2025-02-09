"use client"
import { useState, useEffect } from "react"
import ProductCard from "@/components/ProductCard.jsx"

const products = [
    {
        name: "Wireless Gaming Mouse",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
        price: 120,
        originalPrice: 150,
        discount: 20,
        rating: 4.3,
        reviews: 42,
    },
    {
        name: "Mechanical Gaming Keyboard",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
        price: 180,
        originalPrice: 220,
        discount: 18,
        rating: 4.6,
        reviews: 89,
    },
    {
        name: "RGB Gaming Mouse Pad",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
        price: 35,
        originalPrice: 50,
        discount: 30,
        rating: 4.2,
        reviews: 120,
    },
    {
        name: "Gaming Chair with Lumbar Support",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
        price: 300,
        originalPrice: 400,
        discount: 25,
        rating: 4.7,
        reviews: 230,
    },
    {
        name: "Gaming Monitor 144Hz",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
        price: 320,
        originalPrice: 380,
        discount: 15,
        rating: 4.8,
        reviews: 175,
    },
    {
        name: "Pro Gaming Headset",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
        price: 250,
        originalPrice: 300,
        discount: 20,
        rating: 4.5,
        reviews: 65,
    },
    {
        name: "Gaming Mouse Bungee",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
        price: 25,
        originalPrice: 40,
        discount: 37,
        rating: 4.1,
        reviews: 54,
    },
    {
        name: "VR Headset for Gaming",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
        price: 450,
        originalPrice: 500,
        discount: 10,
        rating: 4.9,
        reviews: 310,
    },
    {
        name: "Gaming Laptop Cooling Pad",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
        price: 50,
        originalPrice: 70,
        discount: 28,
        rating: 4.3,
        reviews: 95,
    },
    {
        name: "High-Speed Gaming Router",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
        price: 180,
        originalPrice: 220,
        discount: 18,
        rating: 4.7,
        reviews: 150,
    },
    {
        name: "Gaming Desk with LED Lights",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
        price: 280,
        originalPrice: 350,
        discount: 20,
        rating: 4.6,
        reviews: 210,
    },
    {
        name: "Wireless Controller for PC/Console",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cOJaVKYVNPstyxx9h8vDV4tAtnpVRp.png",
        price: 60,
        originalPrice: 80,
        discount: 25,
        rating: 4.4,
        reviews: 130,
    }
];

const OurProducts = ({ currentPage, rows, setTotalPages }) => {
    const [productsPerPage, setProductsPerPage] = useState(0)
    const [visibleProducts, setVisibleProducts] = useState([])

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            const columns = width >= 1024 ? 4 : width >= 768 ? 3 : 2
            const itemsPerPage = columns * rows
            setProductsPerPage(itemsPerPage)
            
            // Calculate total pages and update parent
            const pages = Math.ceil(products.length / itemsPerPage)
            setTotalPages(pages)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [rows, setTotalPages])

    useEffect(() => {
        const start = currentPage * productsPerPage
        const end = start + productsPerPage
        const currentProducts = products.slice(start, end)
        setVisibleProducts(currentProducts)
    }, [currentPage, productsPerPage])

    // Remove the transform style and let the visibleProducts handle the display
return (
    <div className="w-full">
        <div className="overflow-hidden relative">
            <div className="product-scroll-container w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                    {visibleProducts.map((product, index) => (
                        <div key={index}>
                            <ProductCard {...product} />
                        </div>
                    ))}
                </div>
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