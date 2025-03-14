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
import { HiChevronRight, HiChevronDown } from 'react-icons/hi'
import { env } from "../../config/config.js";
import { MdArrowOutward } from "react-icons/md";


const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [categories, setCategories] = useState([])
    const [mainCategories, setMainCategories] = useState([])
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)

    const router = useRouter()

    const [authStatus, setAuthStatus] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('token')
        }
        return false
    })

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token')
            setAuthStatus(!!token)
        }

        // Check immediately
        checkAuth()

        // Set up interval to check auth status
        const interval = setInterval(checkAuth, 1000)

        // Clean up interval
        return () => clearInterval(interval)
    }, [])

    const handleProfileAction = (path) => {
        if (!authStatus) {
            localStorage.setItem('redirectAfterLogin', path)
            router.push('/sign-in')
            return
        }

        setIsProfileOpen(false)
        router.push(path)
    }

    useEffect(() => {
        setAuthStatus(isAuthenticated)
    }, [isAuthenticated])

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await fetch(`${env.API_URL}/api/v1/categories`)
            const data = await response.json()
            setCategories(data)
            setMainCategories(data.filter(cat => !cat.isSubcategory))
          } catch (error) {
            console.error('Error fetching categories:', error)
          }
        }
        fetchCategories()
      }, [])

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
                        width={85} 
                        height={40} 
                        className="object-contain"
                    />
                </Link>
                <div className="lg:w-[30%] md:w-[40%] hidden md:visible md:flex md:flex-row md:justify-evenly font-poppins">
                    <Link href='/' className="md:text-sm lg:text-base">Home</Link>
                    <Link href='/contact-us' className="md:text-sm lg:text-base">Contact</Link>
                    <Link href='/about' className="md:text-sm lg:text-base">About</Link>
                    {!authStatus ? (
                        <Link href='/signup' className="md:text-sm lg:text-base">Sign Up</Link>
                    ) : null}
                    
                </div>
                <div className="w-[50%] lg:w-[45%] md:w-[50%] flex flex-row gap-2 mr-2 md:mr-4 lg:mr-0 justify-end lg:justify-center lg:gap-4 md:gap-2">
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
                                    onClick={() => handleProfileAction('/user/myaccount/cancellations')} 
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
                                {authStatus? (
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
            <div className={`mobile-menu fixed top-0 left-0 h-full w-screen z-50 bg-white text-black transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                
                <div className="h-12 w-full text-white bg-black items-center flex justify-between px-2">
                    <h1>Checkout Exciting Products</h1>
                    <Link
                    onClick={handleLinkClick}
                    className="flex gap-1"
                    href='/products'
                    >
                        Explore 
                        <MdArrowOutward className="h-5 w-5"/>
                    </Link>
                </div>
                <div className="flex justify-between items-center p-6">
                    
                    <Image 
                        src="/images/logo.png" 
                        alt="Yarees Logo" 
                        width={60} 
                        height={35} 
                        className="object-contain"
                    />
                    <h2 className="text-xl font-bold">Menu</h2>
                    <CgCloseO 
                    className="h-6 w-6 -mt-5 cursor-pointer hover:text-gray-400" 
                    onClick={() => toggleMenu()}
                    />
                </div>

                <div className="flex flex-col font-poppins">
                    <Link 
                    href='/' 
                    onClick={handleLinkClick} 
                    className="px-6 py-3 border-gray-800 hover:bg-black/5 transition-colors flex justify-between items-center group"
                    >
                    <span>Home</span>
                    <HiChevronRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                    </Link>

                    {/* Categories Dropdown */}
                    <div className="relative">
                        <button 
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="w-full px-6 py-3 border-gray-800 hover:bg-black/5 transition-colors flex justify-between items-center"
                        >
                        <span>Categories</span>
                        <HiChevronDown className={`h-5 w-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCategoryOpen && (
                        <div className="bg-gray-50">
                            {mainCategories.map((category) => (
                            <Link
                                key={category._id}
                                href={`/products/${category._id}`}
                                onClick={handleLinkClick}
                                className="px-8 py-2 hover:bg-black/5 transition-colors flex justify-between items-center"
                            >
                                <span>{category.name}</span>
                                <HiChevronRight className="h-5 w-5" />
                            </Link>
                            ))}
                        </div>
                        )}
                    </div>

                    <Link 
                    href='/contact-us' 
                    onClick={handleLinkClick} 
                    className="px-6 py-3 border-gray-800 hover:bg-black/5 transition-colors flex justify-between items-center group"
                    >
                    <span>Contact</span>
                    <HiChevronRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link 
                    href='/about' 
                    onClick={handleLinkClick} 
                    className="px-6 py-3 border-gray-800 hover:bg-black/5 transition-colors flex justify-between items-center group"
                    >
                    <span>About</span>
                    <HiChevronRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link 
                    href='/signup' 
                    onClick={handleLinkClick} 
                    className="px-6 py-3 border-gray-800 hover:bg-black/5 transition-colors flex justify-between items-center group"
                    >
                    <span>Sign Up</span>
                    <HiChevronRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                    </Link>
                    
                </div>
            </div>
        </>
        
    )
}

export default Navbar;