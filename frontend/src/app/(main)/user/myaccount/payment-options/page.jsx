"use client"
import React, { useState, useEffect } from 'react';
import SidebarContent from "@/components/SidebarContent.jsx"
import { CgCloseO } from "react-icons/cg";

const SavedPaymentMethods = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [paymentMethods, setPaymentMethods] = useState([
        {
          id: 1,
          cardNumber: "**** **** **** 1234",
          cardHolder: "John Doe",
          expiry: "12/25",
          type: "Visa",
        },
        {
          id: 2,
          cardNumber: "**** **** **** 5678",
          cardHolder: "Jane Smith",
          expiry: "06/24",
          type: "MasterCard",
        },
      ]);
    
      const handleDelete = (id) => {
        setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
      };
    
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
                    <h2 className="text-base md:text-2xl font-bold mb-4">My Saved Payment Options</h2>
                    <div className="space-y-4">
                        {paymentMethods.map((method) => (
                        <div key={method.id} className="border p-4 rounded-lg shadow-md flex justify-between items-center">
                            <div>
                            <p className="text-lg font-semibold">{method.type}</p>
                            <p className="text-gray-700 text-sm md:text-base">{method.cardNumber}</p>
                            <p className="text-gray-500 text-xs md:text-sm">Expiry: {method.expiry}</p>
                            <p className="text-gray-500 text-xs md:text-sm">Cardholder: {method.cardHolder}</p>
                            </div>
                            <button
                            onClick={() => handleDelete(method.id)}
                            className="bg-red-500 text-white text-sm md:text-base px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                            Delete
                            </button>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SavedPaymentMethods;