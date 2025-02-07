"use client"
import Image from "next/image"
import { Heart, Truck, RotateCcw, Star } from "lucide-react"
import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from "react-icons/hi";
import FlashSales from "@/components/FlashSale.jsx"

export default function ProductPage() {

  const scrollContainer = (direction, containerClass) => {
    const container = document.querySelector(containerClass);
    const scrollAmount = 340;
    
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="container w-full h-full mx-auto px-4 md:px-10 lg:px-20 py-20">
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <a href="#" className="text-slate-400">
              Products
            </a>
          </li>
          <li className="text-slate-400">/</li>
          <li>
            <a href="#" className="text-slate-400">
              Gaming
            </a>
          </li>
          <li className="text-slate-400">/</li>
          <li>Havic HV G-92 Gamepad</li>
        </ol>
      </nav>

      <section className="grid gap-8 md:grid-cols-2">
        <article className="grid gap-4 lg:grid-cols-[100px,1fr] lg:gap-8">
            {/* Main Image */}
            <div className="relative order-1 aspect-square overflow-hidden rounded-lg border bg-muted lg:order-2">
                <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Lu0etEJQR5wqtva35BlhDJ4eev2htx.png"
                    alt="Havic HV G-92 Gamepad"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {/* Navigation Images */}
            <div className="order-2 grid grid-cols-4 gap-4 lg:order-1 lg:grid-cols-1">
                {[1, 2, 3, 4].map((i) => (
                    <button
                        key={i}
                        className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted hover:border-primary lg:h-[100px]"
                    >
                        <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Lu0etEJQR5wqtva35BlhDJ4eev2htx.png"
                            alt={`Product view ${i}`}
                            fill
                            className="object-contain"
                        />
                    </button>
                ))}
            </div>
        </article>

        <article className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold md:text-3xl">Havic HV G-92 Gamepad</h1>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(150 Reviews)</span>
            </div>
            <p className="text-lg font-semibold md:text-xl">$192.00</p>
            <p className="text-sm text-muted-foreground">
              PlayStation 5 Controller Skin High quality vinyl sticker with air channel adhesive for easy bubble-free
              keep & mess free removal Pressure sensitive.
            </p>
          </div>

          <div className="space-y-4">
            
            <div className="space-y-2">
                <h2 className="font-medium">Colors:</h2>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <input 
                            type="radio" 
                            name="color" 
                            id="white" 
                            value="white" 
                            defaultChecked
                            className="w-4 h-4 border-2"
                        />
                        <label htmlFor="white">White</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input 
                            type="radio" 
                            name="color" 
                            id="red" 
                            value="red"
                            className="w-4 h-4 border-2"
                        />
                        <label htmlFor="red">Red</label>
                    </div>
                </div>
            </div>


            <div className="space-y-2">
              <h2 className="font-medium">Size:</h2>
              <div className="flex space-x-2">
                {["XS", "S", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    className="rounded-md border px-4 py-2 text-sm hover:border-primary hover:bg-primary/10"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button className="px-4 py-2 hover:bg-muted">-</button>
                <span className="px-4 py-2">2</span>
                <button className="px-4 py-2 hover:bg-muted">+</button>
              </div>
              <button size="lg">Buy Now</button>
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

