"use client"
import Image from "next/image";
import Link from "next/link";
import FlashSales from "@/components/FlashSale.jsx";
import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from "react-icons/hi";
import { Countdown } from "@/components/countdown";
import CategoryCard from "@/components/CategoryCard.jsx";
import React, { useState, useEffect } from "react";
import ServiceBenefitsFooter from "@/components/ServiceBenefitsFooter";
import BestSellers from "@/components/BestSellers.jsx";
import OurProducts from "@/components/OurProducts.jsx";
import ResponsiveBanner from "@/components/ResponsiveBanner.jsx";
import { env } from "../../../config/config.js";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState([])
  const [mainCategories, setMainCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFlashSaleActive, setIsFlashSaleActive] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [activeIndex, setActiveIndex] = useState(2);
  const [banners, setBanners] = useState([])

  // Create separate scroll handlers for each component
  const scrollFlashSales = (direction) => {
    if (window.scrollFlashSales) {
      window.scrollFlashSales(direction)
    }
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${env.API_URL}/api/v1/banners`)
        if (response.ok) {
          const data = await response.json()
          setBanners(data.banners || [])
        }
      } catch (error) {
        console.error("Error fetching banners:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanners()
  }, [])

  useEffect(() => {


    const userid = localStorage.getItem("userId");

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${env.API_URL}/api/v1/categories`)
        const data = await response.json()
        setCategories(data)

        // Split categories and subcategories
        setMainCategories(data.filter(cat => !cat.isSubcategory))
        setSubCategories(data.filter(cat => cat.isSubcategory))
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const checkFlashSaleStatus = async () => {
      try {
        const response = await fetch(`${env.API_URL}/api/v1/flashsales/period`)
        const data = await response.json()

        if (data) {
          // Convert all dates to UTC timestamps for consistent comparison
          const now = new Date().getTime()
          const startTime = new Date(data.startTime).getTime()
          const endTime = new Date(data.endTime).getTime()

          setIsFlashSaleActive(
            data.isActive &&
            now >= startTime &&
            now <= endTime
          )
        }
      } catch (error) {
        console.error('Failed to fetch flash sale status:', error)
      }
    }

    checkFlashSaleStatus()
  }, [])


  const scrollCategories = (direction) => {
    const container = document.querySelector('.category-scroll-container');
    const scrollAmount = 340;

    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };


  const scrollProducts = (direction) => {
    const container = document.querySelector('.product-scroll-container');

    if (container) {
      if (direction === 'left') {
        setCurrentPage(prev => Math.max(0, prev - 1));
      } else {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
      }
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex md:px-10 lg:px-40 pt-12 px-5 flex-col md:flex-row w-full justify-evenly">
        <div className="hidden md:flex md:w-[15%] md:flex-col">
          {mainCategories?.map((category) => (
            <div key={category._id} className="group">
              <a
                href={`/products/${category._id}`}
                className="py-2 text-black font-poppins text-sm lg:text-base font-normal relative w-full flex justify-between items-center"
              >
                {category.name}
                {(category.name === "Women's Fashion" || category.name === "Men's Fashion") && (
                  <span className="text-black font-bold">›</span>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 ease-in-out group-hover:w-full"></span>
              </a>
            </div>
          ))}
        </div>
        <div className="w-full h-[40vh] lg:h-[60vh] md:w-[70%] mx-auto mb-8 mt-4">
          {/* Banner Section */}
          <section>
            {isLoading ? (
              <div className="w-full h-[40vh] lg:h-[60vh] bg-gray-200 animate-pulse rounded-md"></div>
            ) : (
              <ResponsiveBanner banners={banners} autoSlideInterval={5000} />
            )}
        </section>
        </div>

      </div>
      {isFlashSaleActive && (
        <>
          <div className="flex flex-col md:py-16 lg:px-40 md:px-20 px-5 py-5 md:flex-row md:items-center">
            {/* 🔄 First row for small screens */}
            <div className="flex justify-between items-start w-full md:w-auto">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-10 bg-red-500 rounded" />
                  <span className="text-red-500 font-bold text-xs">Today's</span>
                </div>
                <h2 className="md:text-2xl lg:text-4xl text-xl font-bold">Flash Sales</h2>
              </div>

              {/* 🔄 Time display - right aligned on small screens */}
              <div className="flex mt-10 md:mt-9 lg:mt-8 flex-col lg:ml-20 md:ml-5">
                <div className="flex text-[10px] lg:text-xs items-center lg:gap-8 gap-4">
                  <div className="text-center">
                    <div className="text-gray-500 mb-1">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 mb-1">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 mb-1">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 mb-1">Seconds</div>
                  </div>
                </div>
                <Countdown />
              </div>
            </div>

            {/* 🔄 Second row for small screens - centered navigation */}
            <div className="hidden md:flex justify-center mt-5 md:mt-0 md:justify-end gap-2 md:ml-auto w-full md:w-auto">
              <button onClick={() => scrollFlashSales('left')} className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200">
                <HiOutlineArrowSmLeft className="w-6 h-6" />
              </button>
              <button onClick={() => scrollFlashSales('right')} className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200">
                <HiOutlineArrowSmRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          <FlashSales />
        </>
      )}
      <div className="flex flex-col md:py-10 lg:px-40 md:px-20 px-5 py-5">
        {/* 🔄 First row for small screens */}
        <div className="flex justify-between items-start w-full">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-10 bg-red-500 rounded" />
              <span className="text-red-500 font-bold text-xs">Categories</span>
            </div>
            <h2 className="md:text-2xl lg:text-4xl text-2xl font-bold">Browse By Category</h2>
          </div>
          <div className="hidden md:flex mt-12 justify-end gap-2 ml-auto w-auto">
            <button onClick={() => scrollCategories('left')} className="p-2 border bg-gray-100 rounded-full hover:bg-gray-200">
              <HiOutlineArrowSmLeft className="w-6 h-6" />
            </button>
            <button onClick={() => scrollCategories('right')} className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200">
              <HiOutlineArrowSmRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="w-full">
          <CategoryCard categories={mainCategories} />
        </div>
      </div>
      <div className="flex flex-col md:py-0 lg:px-40 md:px-20 px-5 py-5">
        <div className="flex justify-between items-start w-full">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-10 bg-red-500 rounded" />
              <span className="text-red-500 font-bold text-xs">This Month</span>
            </div>
            <h2 className="md:text-2xl lg:text-4xl text-xl font-bold">Best Selling Products</h2>
          </div>
          <button className="bg-red-500 mt-10 md:mt-12 text-white px-8 md:py-3 py-2 rounded-md hover:bg-red-600 transition-colors">
            View All
          </button>
        </div>
        <div className="w-full">
          <BestSellers numberOfProducts={4} />
        </div>
      </div>
      {/* <div className="md:py-0 lg:px-40 md:px-14 h-full w-full px-5 py-20 flex flex-col md:flex-row">
        <div className="h-[70vh] md:h-full md:w-screen w-[100%] bg-black lg:py-20 lg:px-14 md:py-20 md:px-5 p-10 flex flex-col md:flex-row justify-center gap-5 md:gap-3 lg:gap-5">
          <div className="w-full h-[50%] md:w-[50%] md:h-full flex flex-col gap-5 md:gap-10 items-start">
            <h2 className="text-xs text-green-500 font-semibold font-poppins">
              Categories
            </h2>
            <h1 className="lg:text-4xl md:3xl text-white font-semibold font-inter">
              Enhance Your <br/> Music Experience
            </h1>
            <div className="flex flex-row justify-center items-center gap-4">
              <div className="w-10 md:w-16 p-2 md:p-3 text-center bg-white rounded-full">
                <h1 className="text-xs md:text-base font-semibold font-poppins">05</h1>
                <h1 className="text-[8px] md:text-xs font-normal font-poppins">Days</h1>
              </div>
              <div className="w-10 md:w-16 p-2 md:p-3 text-center bg-white rounded-full">
                <h1 className="text-xs md:text-base font-semibold font-poppins">23</h1>
                <h1 className="text-[8px] md:text-xs font-normal font-poppins">Hours</h1>
              </div>
              <div className="w-10 md:w-16 p-2 md:p-3 text-center bg-white rounded-full">
                <h1 className="text-xs md:text-base font-semibold font-poppins">59</h1>
                <h1 className="text-[8px] md:text-xs font-normal font-poppins">Minutes</h1>
              </div>
              <div className="w-10 md:w-16 p-2 md:p-3 text-center bg-white rounded-full">
                <h1 className="text-xs md:text-base font-semibold font-poppins">35</h1>
                <h1 className="text-[8px] md:text-xs font-normal font-poppins">Seconds</h1>
              </div>
            </div>
            <button className="bg-green-500 text-white md:w-40 md:h-14 w-28 h-10 text-base font-semibold font-poppins">
              Buy Now!
            </button>
          </div>
          <div className="w-full h-[50%] md:w-[50%] md:h-auto relative">
            <div className="absolute inset-0 bg-white/30 blur-3xl rounded-full transform scale-100" />
            <div className="relative h-full w-full">
              <Image
                  src="/images/homepage-jbl-speaker.png"
                  alt="Product Picture"
                  fill
                  className="object-contain z-50 relative"
              />
            </div>
          </div>
        </div>
      </div> */}
      <div className="flex flex-col md:py-16 lg:px-40 md:px-20 px-5 py-5">
        {/* 🔄 First row for small screens */}
        <div className="flex justify-between items-start w-full">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-10 bg-red-500 rounded" />
              <span className="text-red-500 font-bold text-xs">Our Products</span>
            </div>
            <h2 className="md:text-2xl lg:text-4xl text-2xl font-bold mb-5">Explore Our Products</h2>
          </div>
          <div className="hidden md:flex mt-12 justify-end gap-2 ml-auto w-auto">
            <button onClick={() => scrollProducts('left')} className="p-2 border bg-gray-100 rounded-full hover:bg-gray-200">
              <HiOutlineArrowSmLeft className="w-6 h-6 " />
            </button>
            <button onClick={() => scrollProducts('right')} className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200">
              <HiOutlineArrowSmRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="w-full">
          <OurProducts
            currentPage={currentPage}
            rows={2}
            setTotalPages={setTotalPages} />
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-10 bg-red-500 rounded" />
            <span className="text-red-500 font-bold text-xs">Featured</span>
          </div>
          <h2 className="text-4xl font-semibold font-inter">New Arrival</h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PlayStation Card */}
          <div className="relative group overflow-hidden rounded-lg">
            <div className="aspect-[4/3]">
              <Image
                fill
                src="/images/ps5.png"
                alt="PlayStation 5 Black and White"
                className="w-full h-full object-cover opacity-90 z-10"
              />
            </div>
            <div className="absolute inset-0 bg-black to-transparent p-8 flex flex-col justify-end">
              <h3 className="text-white text-2xl z-10 font-bold mb-2">PlayStation 5</h3>
              <p className="text-gray-200 z-10 mb-4">Black and White version of the PS5 coming out on sale.</p>
              <a href="#" className="text-white z-10 inline-block hover:underline w-fit">
                Shop Now
              </a>
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="grid grid-rows-[1.5fr,1fr] gap-6">
            {/* Women's Collections Card */}
            <div className="relative group overflow-hidden rounded-lg">
              <div className="aspect-[2/1]">
                <Image
                  fill
                  src="/images/lady.png"
                  alt="Women's Collections"
                  className="w-full h-full object-cover z-10 opacity-90"
                />
              </div>
              <div className="absolute inset-0 bg-black p-6 flex flex-col justify-end">
                <h3 className="text-white text-2xl z-10 font-bold mb-2">Women's Collections</h3>
                <p className="text-gray-200 z-10 mb-4">Featured woman collections that give you another vibe.</p>
                <a href="#" className="text-white z-10 inline-block hover:underline w-fit">
                  Shop Now
                </a>
              </div>
            </div>

            {/* Bottom Row Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Speakers Card */}
              <div className="relative group overflow-hidden rounded-lg">
                <div className="aspect-square">
                  <Image
                    fill
                    src="/images/speaker.png"
                    alt="Amazon Speakers"
                    className="w-full h-full object-contain z-10 opacity-90"
                  />
                </div>
                <div className="absolute inset-0 bg-black p-4 flex flex-col justify-end">
                  <h3 className="text-white text-xl z-10 font-bold mb-1">Speakers</h3>
                  <p className="text-gray-200 text-sm z-10 mb-2">Amazon wireless speakers</p>
                  <a href="#" className="text-white z-10 text-sm inline-block hover:underline w-fit">
                    Shop Now
                  </a>
                </div>
              </div>

              {/* Perfume Card */}
              <div className="relative group overflow-hidden rounded-lg">
                <div className="aspect-square">
                  <Image
                    src="/images/gucci.png"
                    alt="Gucci Perfume"
                    fill
                    className="w-full h-full object-cover z-10 opacity-90"
                  />
                </div>
                <div className="absolute inset-0 bg-black p-4 flex flex-col justify-end">
                  <h3 className="text-white text-xl z-10 font-bold mb-1">Perfume</h3>
                  <p className="text-gray-200 text-sm z-10 mb-2">GUCCI INTENSE OUD EDP</p>
                  <a href="#" className="text-white z-10 text-sm inline-block hover:underline w-fit">
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ServiceBenefitsFooter />
    </div>
  );
}
