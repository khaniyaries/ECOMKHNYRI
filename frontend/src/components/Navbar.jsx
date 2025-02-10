"use client"
import Link from "next/link";
import Image from "next/image"
import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { CgMenuBoxed, CgCloseO } from "react-icons/cg";
import { FiShoppingBag } from "react-icons/fi";
import { IoIosStarOutline } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const toggleProfileMenu = () => {
        setIsProfileOpen(!isProfileOpen);
    }

    return(
        <>
            <nav className="h-full w-full md:p-2 lg:p-0 items-center md:border-b flex flex-row">
                <div className="md:hidden ml-2" onClick={() => toggleMenu()}>
                    <CgMenuBoxed className="h-6 w-6"/>
                </div>
                <Link 
                href="/"
                className="lg:w-[25%] md:w-[25%] w-[40%] flex justify-end md:justify-center items-center flex-row gap-2"
                >
                    <Image 
                        src="/images/logo.png" 
                        alt="Yarees Logo" 
                        width={40} 
                        height={28} 
                        className="object-contain"
                    />
                    <h1 className="font-extrabold text-xl md:text-2xl font-inter text-left md:text-center">YAREES</h1>
                </Link>
                <div className="lg:w-[30%] md:w-[40%] hidden md:visible md:flex md:flex-row md:justify-evenly font-poppins">
                    <Link href='/' className="md:text-sm lg:text-base">Home</Link>
                    <Link href='/user/contact-us' className="md:text-sm lg:text-base">Contact</Link>
                    <Link href='/user/about' className="md:text-sm lg:text-base">About</Link>
                    <Link href='/user/signup' className="md:text-sm lg:text-base">Sign Up</Link>
                </div>
                <div className="w-[50%] lg:w-[45%] md:w-[50%] flex flex-row gap-1 mr-2 md:mr-4 lg:mr-0 justify-end lg:justify-center lg:gap-4 md:gap-2">
                    <div className="md:flex md:flex-row items-center hidden md:visible relative">
                        <input 
                            type="search" 
                            className="h-8 md:w-[calc(100%)] w-[calc(100%+50px)] lg:w-[calc(100%+50px)] p-4 pr-6 placeholder:text-sm placeholder:font-poppins rounded-sm bg-[#F5F5F5] placeholder:text-slate-500" 
                            placeholder="What are you looking for?"
                        /> 
                        <LuSearch className="absolute right-3" />
                    </div>
                    <Link 
                    href="/user/wishlist"
                    className="p-1 md:p-2"
                    >
                        <FaRegHeart />
                    </Link>
                    <Link 
                    className="p-1 md:p-2"
                    href="/user/cart">
                        <IoCartOutline />
                    </Link>
                    <div className="bg-red-500 rounded-full p-1 md:p-2 cursor-pointer relative" onClick={toggleProfileMenu}>
                        <GoPerson color="white" />
                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <div className="absolute right-[50%] top-full mt-0 md:text-base text-white text-sm bg-black/25 backdrop-blur-3xl shadow-lg rounded-lg w-48 md:w-max p-2 font-poppins z-50">
                                <Link href="/user/myaccount" className="flex items-center gap-2 py-2 px-3 hover:bg-black/30 rounded">
                                    <GoPerson /> Manage My Account
                                </Link>
                                <Link href="/" className="flex items-center gap-2 py-2 px-3 hover:bg-black/30  rounded">
                                <   FiShoppingBag /> My Order
                                </Link>
                                <Link href="/" className="flex items-center gap-2 py-2 px-3 hover:bg-black/30  rounded">
                                    <CgCloseO/> My Cancellations
                                </Link>
                                <Link href="/" className="flex items-center gap-2 py-2 px-3 hover:bg-black/30  rounded">
                                    <IoIosStarOutline /> My Reviews
                                </Link>
                                <Link href="/" className="flex items-center gap-2 py-2 px-3 hover:bg-black/30  rounded">
                                    <TbLogout2 /> Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </div> 
            </nav>
            <div className="flex w-[80%] flex-row items-center mx-auto md:hidden relative">
                <input 
                    type="search" 
                    className="h-8 w-[100%] p-4 pr-6 placeholder:text-sm placeholder:font-poppins rounded-sm bg-[#F5F5F5] placeholder:text-slate-500" 
                    placeholder="What are you looking for?"
                /> 
                <LuSearch className="absolute right-3" />
            </div>
            <hr className=" mt-4 md:hidden"/>
            {/* Mobile Side Menu */}
            <div className={`fixed top-0 left-0 h-full w-64 z-50 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                <CgCloseO className="right-4 top-4 absolute h-5 w-5" onClick={() => toggleMenu()}/>
                <div className="flex flex-col p-4 space-y-4 font-poppins">
                    <Link href='/' className="">Home</Link>
                    <Link href='/user/contact-us' className="">Contact</Link>
                    <Link href='/user/about' className="">About</Link>
                    <Link href='/user/signup' className="">Sign Up</Link>
                </div>
            </div>
        </>
        
    )
}

export default Navbar;