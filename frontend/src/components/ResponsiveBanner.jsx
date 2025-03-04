"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { HiOutlineArrowSmRight } from "react-icons/hi"

export default function ResponsiveBanner({ banners = [], autoSlideInterval = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [screenSize, setScreenSize] = useState("desktop")

  const sortedBanners = [...banners].sort((a, b) => a.index - b.index)

  // Determine screen size on mount and when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize("mobile")
      } else if (window.innerWidth < 1024) {
        setScreenSize("tablet")
      } else {
        setScreenSize("desktop")
      }
    }

    // Set initial size
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, autoSlideInterval)
    return () => clearInterval(interval)
  }, [autoSlideInterval])

  const nextSlide = () => {
    if (banners.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }
  }

  const prevSlide = () => {
    if (banners.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
    }
  }

  const handleDotClick = (index) => {
    setCurrentIndex(index)
  }

  // Get the appropriate image URL based on screen size
  const getBannerUrl = (banner) => {
    if (!banner) return ""

    if (banner.responsiveUrls && banner.responsiveUrls[screenSize]) {
      return banner.responsiveUrls[screenSize]
    }

    return banner.url
  }

  // Get dimensions based on screen size
  const getDimensions = (banner) => {
    if (!banner || !banner.dimensions) {
      return { width: "100%", height: "auto" }
    }

    const dimensions = banner.dimensions[screenSize]
    if (!dimensions) {
      return { width: "100%", height: "auto" }
    }

    return {
      aspectRatio: `${dimensions.width} / ${dimensions.height}`,
      maxHeight: screenSize === "mobile" ? "30vh" : "60vh",
    }
  }

  if (!banners || banners.length === 0) {
    return null
  }

  return (
    <div className="w-full relative">
      {/* Banner Container - Responsive height based on screen size */}
      <div
        className="w-full overflow-hidden rounded-md relative h-[40vh] lg:h-[60vh]"
      >
        {/* Banner Slider */}
        <div
          className="flex transition-transform duration-1000 ease-in-out w-full h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {sortedBanners?.map((banner, index) => (
            <div
              key={banner.index || index}
              className="w-full flex-shrink-0 relative"
              style={{
                ...getDimensions(banner),
              }}
            >
              <img
                src={getBannerUrl(banner) || "/placeholder.svg"}
                alt={`Banner ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                className="w-full h-full object-contain md:object-contain"
                style={{ maxHeight: '100%' }}
                />

              {/* Banner Link Overlay */}
              {banner.link && (
                <Link href={banner.link}>
                  <div className="absolute inset-0 z-10">
                    <span className="sr-only">View {banner.linktitle || "banner content"}</span>
                  </div>
                </Link>
              )}

              {/* Banner Title Bar */}
              {banner.linktitle && (
                <Link 
                className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-2 md:p-3 flex justify-between items-center z-20 rounded-t-md"
                href={banner.link}>
                  <div className="text-xs md:text-sm font-medium truncate">{banner.linktitle}</div>
                  <HiOutlineArrowSmRight className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 z-30">
          {sortedBanners?.map((banner, index) => (
            <button
              key={banner.index || index}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-red-500 border md:border-2 border-white outline md:outline-2 outline-gray-400"
                  : "bg-gray-400"
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* Navigation Arrows - Only show on larger screens */}
        <div className="hidden md:block">
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-30 hover:bg-opacity-70"
            aria-label="Previous slide"
          >
            <HiOutlineArrowSmRight className="w-5 h-5 transform rotate-180" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-30 hover:bg-opacity-70"
            aria-label="Next slide"
          >
            <HiOutlineArrowSmRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

