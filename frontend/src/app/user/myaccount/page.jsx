"use client"

import Link from "next/link"
import { useState } from "react"
import { CgCloseO } from "react-icons/cg";
import SidebarContent from "@/components/SidebarContent.jsx"
import { useEffect } from 'react';

export default function AccountPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebarElement = document.querySelector('.sidebar-menu');
      if (isMenuOpen && sidebarElement && !sidebarElement.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="container w-full h-full mx-auto px-4 md:px-20 lg:px-40 py-20">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-8">
        <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Link href="/" className="text-black/50 hover:text-black/70">Home /</Link>
          <span className="text-black">My Account</span>
        </nav>
        <div className="md:text-sm text-xs">
          Welcome! <span className="text-red-500">Md Rimel</span>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-4 gap-8">
        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden mb-4 px-4 py-2 border rounded-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          Menu
        </button>

        {/* Mobile Sidebar */}
        <div className={`sidebar-menu lg:hidden fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-white shadow-lg transition-transform duration-200 ease-in-out z-50 p-4`}>
          <CgCloseO 
            className="absolute right-4 top-4 h-5 w-5 cursor-pointer" 
            onClick={() => setIsMenuOpen(false)}
          />
          <SidebarContent setIsMenuOpen={setIsMenuOpen} />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 md:shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] md:py-6 md:px-14">
          <div className="space-y-6">
            <h2 className="text-xl font-medium font-poppins text-red-500">Edit Your Profile</h2>
            <form className="space-y-4 md:space-y-6 lg:space-y-8">
              <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                <div>
                  <label className="text-sm md:text-base font-poppins font-normal block mb-1">First Name</label>
                  <input 
                    placeholder="Md" 
                    className="w-full px-3 py-2 border bg-black/5 placeholder:text-black/60 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm md:text-base font-poppins font-normal block mb-1">Last Name</label>
                  <input 
                    placeholder="Rimel" 
                    className="w-full px-3 py-2 border bg-black/5 placeholder:text-black/60 rounded-md"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                <div>
                  <label className="text-sm md:text-base font-poppins font-normal block mb-1">Email</label>
                  <input 
                    placeholder="rimel111@gmail.com" 
                    className="w-full px-3 py-2 border bg-black/5 placeholder:text-black/60 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm md:text-base font-poppins font-normal block mb-1">Address</label>
                  <input 
                    placeholder="Kingston, 5236, United State" 
                    className="w-full px-3 py-2 border bg-black/5 placeholder:text-black/60 rounded-md"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm md:text-base font-poppins font-normal">Password Changes</h3>
                
                <input
                placeholder="Current Password" 
                type="password" 
                className="w-full px-3 py-2 border bg-black/5 placeholder:text-black/60 rounded-md"
                />
            
                <input 
                placeholder="New Password"
                type="password" 
                className="w-full px-3 py-2 border bg-black/5 placeholder:text-black/60 rounded-md"
                />
            
            
                <input
                placeholder="Confirm New Password" 
                type="password" 
                className="w-full px-3 py-2 border bg-black/5 placeholder:text-black/60 rounded-md"
                />
                
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" className="px-4 py-2 border rounded-md">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
