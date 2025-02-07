"use client"
import Image from "next/image";
import FlashSales from "@/components/FlashSale.jsx";
import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from "react-icons/hi";
import { Countdown } from "@/components/countdown";
import CategoryCard from "@/components/CategoryCard.jsx";
import React, {useState} from "react";
import ServiceBenefitsFooter from "@/components/ServiceBenefitsFooter";

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

      <ServiceBenefitsFooter />
    </div>
  );
}
