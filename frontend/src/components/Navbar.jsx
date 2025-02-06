"use client"
import Link from "next/link";
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
            <nav className="h-full w-full items-center md:border-b flex flex-row">
                <div className="md:hidden ml-2" onClick={() => toggleMenu()}>
                    <CgMenuBoxed className="h-6 w-6"/>
                </div>
                <div className="lg:w-[25%] md:w-[15%] w-[40%]">
                    <h1 className="font-extrabold text-2xl font-inter text-left ml-2 md:ml-0 md:text-center">YAREES</h1>
                </div>
                <div className="lg:w-[30%] md:w-[40%] hidden md:visible md:flex md:flex-row md:justify-evenly font-poppins">
                    <Link href='/' className="">Home</Link>
                    <Link href='/' className="">Contact</Link>
                    <Link href='/' className="">About</Link>
                    <Link href='/' className="">Sign Up</Link>
                </div>
                <div className="w-[50%] lg:w-[45%] md:w-[50%] flex flex-row gap-1 mr-2 md:mr-4 lg:mr-0 justify-end lg:justify-center lg:gap-4 md:gap-2">
                    <div className="md:flex md:flex-row items-center hidden md:visible relative">
                        <input 
                            type="search" 
                            className="h-8 w-[calc(100%+50px)] p-4 pr-6 placeholder:text-sm placeholder:font-poppins rounded-sm bg-[#F5F5F5] placeholder:text-slate-500" 
                            placeholder="What are you looking for?"
                        /> 
                        <LuSearch className="absolute right-3" />
                    </div>
                    <div className="p-2">
                        <FaRegHeart />
                    </div>
                    <div className="p-2">
                        <IoCartOutline />
                    </div>
                    <div className="bg-red-500 rounded-full p-2 cursor-pointer relative" onClick={toggleProfileMenu}>
                        <GoPerson color="white" />
                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <div className="absolute right-[50%] top-full mt-0 md:text-base text-sm bg-black/10 backdrop-blur-sm shadow-lg rounded-lg w-48 md:w-max p-2 font-poppins z-50">
                                <Link href="/" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded">
                                    <GoPerson /> Manage My Account
                                </Link>
                                <Link href="/" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded">
                                <   FiShoppingBag /> My Order
                                </Link>
                                <Link href="/" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded">
                                    <CgCloseO/> My Cancellations
                                </Link>
                                <Link href="/" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded">
                                    <IoIosStarOutline /> My Reviews
                                </Link>
                                <Link href="/" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded">
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
            <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                <CgCloseO className="right-4 top-4 absolute h-5 w-5" onClick={() => toggleMenu()}/>
                <div className="flex flex-col p-4 space-y-4 font-poppins">
                    <Link href='/' className="">Home</Link>
                    <Link href='/' className="">Contact</Link>
                    <Link href='/' className="">About</Link>
                    <Link href='/' className="">Sign Up</Link>
                </div>
            </div>
        </>
        
    )
}

export default Navbar;