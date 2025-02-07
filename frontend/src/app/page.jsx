"use client"
import Image from "next/image";
import FlashSales from "@/components/FlashSale.jsx";
import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from "react-icons/hi";
import { Countdown } from "@/components/countdown";
import CategoryCard from "@/components/CategoryCard.jsx";
import React, {useState, useEffect} from "react";
import ServiceBenefitsFooter from "@/components/ServiceBenefitsFooter";
import BestSellers from "@/components/BestSellers.jsx";
import OurProducts from "@/components/OurProducts.jsx";

export default function Home() {

  const categories = [
    "Women's Fashion",
    "Men's Fashion",
    "Electronics",
    "Home & Lifestyle",
    "Medicine",
    "Sports & Outdoor",
    "Baby's & Toys",
    "Groceries & Pets",
    "Health & Beauty",
  ];

  const cardCategories = [
    "Phones",
    "Computers",
    "SmartWatch",
    "Camera",
    "Headphones",
    "Gaming",
  ]

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)


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
      <div className="flex md:px-40 p-20 px-5 flex-col md:flex-row w-full justify-evenly">
        <div className="md:w-[15%] w-max flex-col">
          {categories.map((category) => (
              <div key={category} className="group">
                <a
                  href="#"
                  className="py-2 text-black font-poppins font-normal relative w-full flex justify-between items-center"
                >
                  {category}
                  {(category === "Women's Fashion" || category === "Men's Fashion") && (
                    <span className="text-black font-bold">›</span>
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 ease-in-out group-hover:w-full"></span>
                </a>
              </div>
            ))}
        </div>
        {/* <div className="border-l border-black mx-8 h-[360px]" /> */}
        <div className="md:w-[70%] h-10 md:h-auto bg-black">
          
        </div>

      </div>
      <div className="flex flex-col md:py-16 lg:px-40 md:px-20 px-5 py-5 md:flex-row md:items-center">
        {/* 🔄 First row for small screens */}
        <div className="flex justify-between items-start w-full md:w-auto">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-10 bg-red-500 rounded" />
              <span className="text-red-500 font-bold text-xs">Today's</span>
            </div>
            <h2 className="md:text-2xl lg:text-4xl text-2xl font-bold">Flash Sales</h2>
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
        <div className="flex justify-center mt-5 md:mt-0 md:justify-end gap-2 md:ml-auto w-full md:w-auto">
          <button onClick={() => scrollContainer('left', '.flash-scroll-container')} className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200">
            <HiOutlineArrowSmLeft className="w-6 h-6" />
          </button>
          <button onClick={() => scrollContainer('right', '.flash-scroll-container')} className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200">
            <HiOutlineArrowSmRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      <FlashSales/>
      <div className="flex flex-col md:py-16 lg:px-40 md:px-20 px-5 py-5">
        {/* 🔄 First row for small screens */}
        <div className="flex justify-between items-start w-full">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-10 bg-red-500 rounded" />
              <span className="text-red-500 font-bold text-xs">Categories</span>
            </div>
            <h2 className="md:text-2xl lg:text-4xl text-2xl font-bold">Browse By Category</h2>
          </div>
          <div className="flex mt-12 justify-end gap-2 ml-auto w-auto">
            <button onClick={() => scrollContainer('left', '.category-scroll-container')} className="p-2 border bg-gray-100 rounded-full hover:bg-gray-200">
              <HiOutlineArrowSmLeft className="w-6 h-6 " />
            </button>
            <button onClick={() => scrollContainer('right', '.category-scroll-container')} className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200">
              <HiOutlineArrowSmRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="w-full">
          <CategoryCard />
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
          <BestSellers />
        </div>
      </div>
      <div className="md:py-0 lg:px-40 md:px-14 h-full w-full px-5 py-20 flex flex-col md:flex-row">
        <div className="h-screen md:h-full md:w-screen w-[100%] bg-black lg:py-20 lg:px-14 md:py-20 md:px-5 p-10 flex flex-col md:flex-row justify-center gap-5 md:gap-3 lg:gap-5">
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
      </div>
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
          <div className="flex mt-12 justify-end gap-2 ml-auto w-auto">
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
          setTotalPages={setTotalPages}/>
        </div>
      </div>
      <div className="flex flex-col md:py-16 lg:px-40 md:px-20 px-5 py-5">
        
      </div>

      <ServiceBenefitsFooter />
    </div>
  );
}
