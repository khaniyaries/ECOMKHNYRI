"use client"
import React, { useState, useEffect } from 'react';
import SidebarContent from "@/components/SidebarContent.jsx"
import { CgCloseO } from "react-icons/cg";

const ItemsReturned = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const [returns] = useState([
        {
          id: 1,
          item: "Smartphone Case",
          date: "2025-01-20",
          reason: "Wrong size",
        },
        {
          id: 2,
          item: "Laptop Stand",
          date: "2025-01-25",
          reason: "Defective item",
        },
      ]);
    
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


    return(
        <div className="container w-full h-full mx-auto px-4 md:px-20 lg:px-40 py-20">
            <div className="flex flex-col lg:flex-row justify-center">
                {/* Mobile Menu Trigger */}
                <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden mb-4 px-4 py-2 w-max border rounded-md flex items-center gap-2"
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
                <div className="w-full md:w-[70%] md:shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] mx-auto p-2 md:p-10">
                    <h2 className="text-2xl font-bold mb-4">My Returns</h2>
                    {returns.length===0?
                    <h2>No returns found</h2>:
                    <div className="space-y-4">
                        {returns.map((returnItem) => (
                        <div key={returnItem.id} className="border p-4 rounded-lg shadow-md">
                            <p className="text-lg font-semibold">{returnItem.item}</p>
                            <p className="text-gray-700">Date: {returnItem.date}</p>
                            <p className="text-gray-500">Reason: {returnItem.reason}</p>
                        </div>
                        ))}
                    </div>
                    }
                </div>
            </div>
        </div>        
    )
}
export default ItemsReturned;