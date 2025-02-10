"use client"

import { RiLinkedinLine } from "react-icons/ri";
import { LuTwitter } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";
import ServiceBenefitsFooter from "@/components/ServiceBenefitsFooter";
const About = () => {

    const [activeIndex, setActiveIndex] = useState(2);

    const handleDotClick = (index) => {
        setActiveIndex(index);
        // Here you can add functionality to navigate slides when a dot is clicked
      };

    return (
        <div className="w-full h-full relative ">
            <div className="md:pl-40 md:py-20 py-32 px-5">
                <h1 className="text-sm text-slate-600">Home / <span className="text-black">About</span></h1>
                
                <div className="flex mt-6 md:mt-0 flex-col items-center md:flex-row"> {/* Added items-center for vertical alignment */}
                    <section className="max-w-[90%] md:max-w-[50%] md:pr-20">
                        <h1 className="text-4xl font-bold mb-6">Our Story</h1>
                        <p className="mb-6">
                            Launced in 2015, Exclusive is South Asia's premier online shopping makterplace with an active presense in Bangladesh. 
                            Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands 
                            and serves 3 millioons customers across the region. 
                        </p>
                        <p>
                            Exclusive has more than 1 Million products to offer, growing at a very fast. 
                            Exclusive offers a diverse assotment in categories ranging from consumer.
                        </p>
                    </section>
                    
                    <div className="flex-1 md:mt-0 mt-6">
                        <Image
                            src="/images/side-image.png"
                            alt="Side Image"
                            height={609}
                            width={705}
                            className="object-cover w-full h-full"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
            <div className="w-full px-16 md:px-28 py-10 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    <div className="group flex flex-col h-[230px] justify-center items-center gap-1 p-4 bg-white border-[2px] border-gray-300 hover:border-red-500 rounded-md transition-transform duration-300 hover:bg-red-500">
                        <div className="rounded-full bg-gray-300 mb-2 h-max w-max p-2 z-10 group-hover:bg-gray-200/50">
                            <div className="rounded-full bg-black h-max w-max p-1 z-20 group-hover:bg-white">
                                <Image
                                src="/images/icon-shop.png"
                                alt="Active Sellers"
                                height={40}
                                width={40}
                                className="mx-auto invert-0 group-hover:invert"
                                sizes="(max-width: 768px) 96px, 96px"
                                loading="lazy"
                                />
                            </div>
                        </div>
                        <h3 className="text-center text-2xl font-inter font-bold text-black group-hover:text-white">
                            10.5k
                        </h3>
                        <h4 className="text-center font-poppins font-normal text-black group-hover:text-white">
                            Active Sellers
                        </h4>
                    </div>
                    <div className="group flex flex-col h-[230px] justify-center items-center gap-1 p-4 bg-white border-[2px] border-gray-300 hover:border-red-500 rounded-md transition-transform duration-300 hover:bg-red-500">
                        <div className="rounded-full bg-gray-300 mb-2 h-max w-max p-2 z-10 group-hover:bg-gray-200/50">
                            <div className="rounded-full bg-black h-max w-max p-1 z-20 group-hover:bg-white">
                                <Image
                                src="/images/icon-sale.png"
                                alt="Monthly Sales"
                                height={40}
                                width={40}
                                className="mx-auto invert-0 group-hover:invert"
                                sizes="(max-width: 768px) 96px, 96px"
                                loading="lazy"
                                />
                            </div>
                        </div>
                        <h3 className="text-center text-2xl font-inter font-bold text-black group-hover:text-white">
                            33k
                        </h3>
                        <h4 className="text-center font-poppins font-normal text-black group-hover:text-white">
                            Monthly Product Sold
                        </h4>
                    </div>
                    <div className="group flex flex-col h-[230px] justify-center items-center gap-1 p-4 bg-white border-[2px] border-gray-300 hover:border-red-500 rounded-md transition-transform duration-300 hover:bg-red-500">
                        <div className="rounded-full bg-gray-300 mb-2 h-max w-max p-2 z-10 group-hover:bg-gray-200/50">
                            <div className="rounded-full bg-black h-max w-max p-1 z-20 group-hover:bg-white">
                                <Image
                                src="/images/icon-shopping-bag.png"
                                alt="Active Customers"
                                height={40}
                                width={40}
                                className="mx-auto invert-0 group-hover:invert"
                                sizes="(max-width: 768px) 96px, 96px"
                                loading="lazy"
                                />
                            </div>
                        </div>
                        <h3 className="text-center text-2xl font-inter font-bold text-black group-hover:text-white">
                            45.5k
                        </h3>
                        <h4 className="text-center font-poppins font-normal text-black group-hover:text-white">
                            Active Customers
                        </h4>
                    </div>
                    <div className="group flex flex-col h-[230px] justify-center items-center gap-1 p-4 bg-white border-[2px] border-gray-300 hover:border-red-500 rounded-md transition-transform duration-300 hover:bg-red-500">
                        <div className="rounded-full bg-gray-300 mb-2 h-max w-max p-2 z-10 group-hover:bg-gray-200/50">
                            <div className="rounded-full bg-black h-max w-max p-1 z-20 group-hover:bg-white">
                                <Image
                                src="/images/icon-money-bag.png"
                                alt="Gross Sales Annually"
                                height={40}
                                width={40}
                                className="mx-auto invert-0 group-hover:invert"
                                sizes="(max-width: 768px) 96px, 96px"
                                loading="lazy"
                                />
                            </div>
                        </div>
                        <h3 className="text-center text-2xl font-inter font-bold text-black group-hover:text-white">
                            25k
                        </h3>
                        <h4 className="text-center font-poppins font-normal text-black group-hover:text-white">
                            Annual Gross Sale
                        </h4>
                    </div>
                </div>
            </div>
            <div className="md:px-10 px-10 lg:px-32 py-10 md:py-20">
                <div className="flex flex-col justify-center gap-4">
                    <div className="flex w-full justify-center gap-10 md:gap-4 lg:gap-10 md:flex-row flex-col items-center">
                        <div className="h-auto w-full md:max-w-[370px] bg-white relative md:border-0 md:p-0 border-2 p-1">
                            <div className="bg-[#F5F5F5] h-[430px] flex items-end justify-center">
                                <div className="relative h-[300px] w-full max-w-[236px]">

                                    <Image
                                        src="/images/members/first.png"
                                        alt="Founder and CEO Image"
                                        fill
                                        className="mx-auto mb-0 mt-auto object-contain max-h-[391px]"
                                    />  
                                </div> 
                            </div>
                            <div className="flex flex-col mt-4 gap-2 justify-center">
                                <h1 className="font-inter font-medium text-2xl">
                                    Tom Cruise
                                </h1>
                                <h2 className="font-normal font-poppins text-base">
                                    Founder & Chairman
                                </h2>
                                <div className="flex w-full h-auto flex-row gap-4 justify-start">
                                    <LuTwitter className="h-5 w-5"/>
                                    <FaInstagram className="h-5 w-5"/>
                                    <RiLinkedinLine className="h-5 w-5"/>
                                </div>
                            </div>
                        </div>
                        <div className="h-auto w-full md:max-w-[370px] bg-white relative md:border-0 md:p-0 border-2 p-1">
                            <div className="bg-[#F5F5F5] h-[430px] flex items-end justify-center">
                                <div className="relative h-[300px] w-full max-w-[294px]">
                                    <Image
                                        src="/images/members/second.png"
                                        alt="Managing Director"
                                        fill
                                        className="mx-auto mb-0 mt-auto object-contain max-h-[391px]"
                                    /> 
                                </div>    
                            </div>
                            <div className="flex flex-col mt-4 gap-2 justify-center">
                                <h1 className="font-inter font-medium text-2xl">
                                    Emma Watson
                                </h1>
                                <h2 className="font-normal font-poppins text-base">
                                   Managing Director
                                </h2>
                                <div className="flex w-full h-auto flex-row gap-4 justify-start">
                                    <LuTwitter className="h-5 w-5"/>
                                    <FaInstagram className="h-5 w-5"/>
                                    <RiLinkedinLine className="h-5 w-5"/>
                                </div>
                            </div>
                        </div>
                        <div className="h-auto w-full md:max-w-[370px] bg-white relative md:border-0 md:p-0 border-2 p-1">
                            <div className="bg-[#F5F5F5] h-[430px] flex items-end justify-center">
                                <div className="relative h-[300px] w-full max-w-[326px]">
                                    <Image
                                        src="/images/members/third.png"
                                        alt="Product Designer"
                                        fill
                                        className="mx-auto mb-0 mt-auto object-contain max-h-[391px]"
                                    /> 
                                </div>  
                            </div>
                            <div className="flex flex-col mt-4 gap-2 justify-center">
                                <h1 className="font-inter font-medium text-2xl">
                                    Will Smith
                                </h1>
                                <h2 className="font-normal font-poppins text-base">
                                    Product Designer
                                </h2>
                                <div className="flex w-full h-auto flex-row gap-4 justify-start">
                                    <LuTwitter className="h-5 w-5"/>
                                    <FaInstagram className="h-5 w-5"/>
                                    <RiLinkedinLine className="h-5 w-5"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Dots Navigation */}
                    <div className="w-full h-full flex mt-4 justify-center gap-4">
                        {[0, 1, 2, 3, 4].map((index) => (
                            <button
                                key={index}
                                className={`w-4 h-4 rounded-full transition-all duration-300
                                ${activeIndex === index 
                                    ? "bg-red-500 border-2 border-white outline outline-2 outline-gray-400" 
                                    : "bg-gray-400"
                                }`}
                                onClick={() => handleDotClick(index)}
                            ></button>
                        ))}
                    </div>

                </div>
            </div>
            <ServiceBenefitsFooter />
        </div>
    )
}

export default About;