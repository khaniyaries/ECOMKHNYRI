"use client"
import Link from "next/link";
import Image from "next/image"
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { LuSearch } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { CgMenuBoxed, CgCloseO } from "react-icons/cg";
import { FiShoppingBag } from "react-icons/fi";
import { IoIosStarOutline } from "react-icons/io";
import { TbLogout2, TbLogin2 } from "react-icons/tb";
import { useAuth } from '@/hooks/userAuth.js'


const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const router = useRouter()

    const handleProfileAction = (path) => {
        if (!isAuthenticated) {
            // Store the intended destination
            localStorage.setItem('redirectAfterLogin', path)
            router.push('/sign-in')
            return
        }
        router.push(path)
    }


    useEffect(() => {
        const handleClickOutside = (event) => {
            // Handle mobile menu
            const sidebarElement = document.querySelector('.mobile-menu');
            if (isOpen && sidebarElement && !sidebarElement.contains(event.target) && !event.target.closest('.menu-trigger')) {
                setIsOpen(false);
            }

            // Handle profile dropdown
            const profileElement = document.querySelector('.profile-trigger');
            if (isProfileOpen && profileElement && !profileElement.contains(event.target) && !event.target.closest('.profile-trigger')) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, isProfileOpen]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const toggleProfileMenu = () => {
        setIsProfileOpen(!isProfileOpen);
    }

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return(
        <>
            <nav className="h-full w-full md:p-2 lg:p-0 items-center md:border-b flex flex-row">
                <Link 
                href="/"
                className="lg:w-[25%] md:w-[25%] w-[40%] flex ml-2 justify-start md:justify-center items-center"
                >
                    <Image 
                        src="/images/logo.png" 
                        alt="Yarees Logo" 
                        width={60} 
                        height={35} 
                        className="object-contain"
                    />
                </Link>
                <div className="lg:w-[30%] md:w-[40%] hidden md:visible md:flex md:flex-row md:justify-evenly font-poppins">
                    <Link href='/' className="md:text-sm lg:text-base">Home</Link>
                    <Link href='/contact-us' className="md:text-sm lg:text-base">Contact</Link>
                    <Link href='/about' className="md:text-sm lg:text-base">About</Link>
                    {!isAuthenticated ? (
                        <Link href='/signup' className="md:text-sm lg:text-base">Sign Up</Link>
                    ) : ""}
                    
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
                    <div className="bg-red-500 rounded-full p-1 md:p-2 cursor-pointer relative profile-trigger" onClick={toggleProfileMenu}>
                        <GoPerson color="white" />
                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <div className="absolute right-[50%] top-full mt-0 md:text-base text-white text-sm bg-black/25 backdrop-blur-3xl shadow-lg rounded-lg w-48 md:w-max p-2 font-poppins z-50">
                                <button 
                                    onClick={() => handleProfileAction('/user/myaccount')} 
                                    className="w-full flex items-center gap-2 py-2 px-3 hover:bg-black/30 rounded"
                                >
                                    <GoPerson /> Manage My Account
                                </button>
                                <button 
                                    onClick={() => handleProfileAction('/user/orders')} 
                                    className="w-full flex items-center gap-2 py-2 px-3 hover:bg-black/30  rounded"
                                >
                                <   FiShoppingBag /> My Order
                                </button>
                                <button 
                                    onClick={() => handleProfileAction('/user/cancellations')} 
                                    className="w-full flex items-center gap-2 py-2 px-3 hover:bg-black/30  rounded"
                                >
                                    <CgCloseO/> My Cancellations
                                </button>
                                <button 
                                    onClick={() => handleProfileAction('/user/reviews')} 
                                    className="w-full flex items-center gap-2 py-2 px-3 hover:bg-black/30  rounded"
                                >
                                    <IoIosStarOutline /> My Reviews
                                </button>
                                {isAuthenticated ? (
                                    <button 
                                        onClick={logout} 
                                        className="w-full flex items-center gap-2 py-2 px-3 hover:bg-black/30 rounded"
                                    >
                                        <TbLogout2 /> Logout
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => router.push('/sign-in')} 
                                        className="w-full flex items-center gap-2 py-2 px-3 hover:bg-black/30 rounded"
                                    >
                                        <TbLogin2 /> Login
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="md:hidden menu-trigger" onClick={() => toggleMenu()}>
                        <CgMenuBoxed className="h-6 w-6"/>
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
            <div className={`mobile-menu fixed top-0 left-0 h-full w-64 z-50 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                <CgCloseO className="right-4 top-4 absolute h-5 w-5" onClick={() => toggleMenu()}/>
                <div className="flex flex-col p-4 space-y-4 font-poppins">
                    <Link href='/' onClick={handleLinkClick} className="">Home</Link>
                    <Link href='/user/contact-us' onClick={handleLinkClick} className="">Contact</Link>
                    <Link href='/user/about' onClick={handleLinkClick} className="">About</Link>
                    <Link href='/user/signup' onClick={handleLinkClick} className="">Sign Up</Link>
                </div>
            </div>
        </>
        
    )
}

export default Navbar;