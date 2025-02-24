"use client"
import React, { useState, useEffect } from 'react';
import SidebarContent from "@/components/SidebarContent.jsx"
import { CgCloseO } from "react-icons/cg";
import toast from 'react-hot-toast';
import {env} from '../../../../../../config/config.js';

const SavedPaymentMethods = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    const handleAddPayment = async (e) => {
        e.preventDefault();
        const formData = {
          userId: localStorage.getItem('userId'),
          cardNumber: e.target.elements.cardNumber.value,
          cardHolder: e.target.elements.cardHolder.value,
          expiry: e.target.elements.expiry.value,
          type: e.target.elements.type.value
        };
      
        try {
          const response = await fetch(`${env.API_URL}/api/v1/user/payment-method`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
          });
      
          const data = await response.json();
          
          if (response.ok) {
            setPaymentMethods(prev => [...prev, data]);
            setShowAddForm(false);
            toast.success('Payment method added successfully!');
          }
        } catch (error) {
          toast.error('Failed to add payment method');
        }
      };
      

    const fetchPaymentMethods = async () => {
        const userId = localStorage.getItem('userId');
        console.log('Fetching with userId:', userId);
        
        try {
          const response = await fetch(`${env.API_URL}/api/v1/user/payment-methods?userId=${userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Response status:', response.status);
          const data = await response.json();
          console.log('Fetched data:', data);
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch payment methods');
          }
          
          setPaymentMethods(data);
        } catch (error) {
          console.log('Error details:', error);
          toast.error('Failed to fetch payment methods');
        }
      };
      

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/user/payment-method/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setPaymentMethods(methods => methods.filter(method => method._id !== id));
        toast.success('Payment method deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete payment method');
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);
    
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
                    
                    {paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                        {paymentMethods.map((method) => (
                        <div key={method._id} className="border p-4 rounded-lg shadow-md flex justify-between items-center">
                            <div>
                            <p className="text-lg font-semibold">{method.type}</p>
                            <p className="text-gray-700 text-sm md:text-base">{method.cardNumber}</p>
                            <p className="text-gray-500 text-xs md:text-sm">Expiry: {method.expiry}</p>
                            <p className="text-gray-500 text-xs md:text-sm">Cardholder: {method.cardHolder}</p>
                            </div>
                            <button
                            onClick={() => handleDelete(method._id)}
                            className="bg-red-500 text-white text-sm md:text-base px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                            Delete
                            </button>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="text-center py-8">
                        <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No saved cards</h3>
                        <p className="mt-1 text-sm text-gray-500">Add a payment method to save it for future purchases.</p>
                        <button 
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        onClick={() => setShowAddForm(true)}
                        >
                        Add Payment Method
                        </button>
                    </div>
                    )}
                </div>
                {showAddForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Add New Payment Method</h2>
                        
                        <form onSubmit={handleAddPayment} className="space-y-4">
                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Type
                            </label>
                            <select
                                name="type"
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            >
                                <option value="Visa">Visa</option>
                                <option value="MasterCard">MasterCard</option>
                                <option value="American Express">American Express</option>
                                <option value="Rupay">Rupay</option>
                            </select>
                            </div>

                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Number
                            </label>
                            <input
                                name="cardNumber"
                                type="text"
                                pattern="\d*"
                                maxLength="16"
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                            </div>

                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Holder Name
                            </label>
                            <input
                                name="cardHolder"
                                type="text"
                                placeholder="JOHN DOE"
                                className="w-full px-3 py-2 border rounded-lg uppercase"
                                required
                            />
                            </div>

                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                            </label>
                            <input
                                name="expiry"
                                type="text"
                                placeholder="MM/YY"
                                pattern="\d{2}/\d{2}"
                                maxLength="5"
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                            </div>

                            <div className="flex gap-2 mt-6">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                            >
                                Add Card
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            </div>
                        </form>
                        </div>
                    </div>
                    )}
            </div>

        </div>
    )
}
export default SavedPaymentMethods;