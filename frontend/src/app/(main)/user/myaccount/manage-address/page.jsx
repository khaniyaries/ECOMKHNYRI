"use client"
import React, { useState, useEffect } from 'react';
import SidebarContent from "@/components/SidebarContent.jsx"
import { CgCloseO } from "react-icons/cg";

const SavedAddresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Home",
      fullName: "John Doe",
      phone: "+91 9876543210",
      address: "123, Green Valley Apartments",
      locality: "Richmond Road",
      city: "Bangalore",
      state: "Karnataka",
      pinCode: "560025",
      isDefault: true,
    },
    {
      id: 2,
      name: "Office",
      fullName: "John Doe",
      phone: "+91 9876543211",
      address: "456, Tech Park",
      locality: "Whitefield",
      city: "Bangalore",
      state: "Karnataka",
      pinCode: "560066",
      isDefault: false,
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
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

  return (
    <div className="container w-full h-full mx-auto px-4 md:px-20 lg:px-40 py-20">
    <div className="flex flex-col lg:flex-row justify-center">
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
    <div className="w-full mx-auto p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Saved Addresses</h1>
        <button
          onClick={() => {
            setEditingAddress(null);
            setShowAddForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add New Address
        </button>
      </div>

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{address.name}</span>
                {address.isDefault && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingAddress(address);
                    setShowAddForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-2 text-gray-600">
              <p className="font-medium">{address.fullName}</p>
              <p>{address.phone}</p>
              <p>{address.address}</p>
              <p>{address.locality}</p>
              <p>
                {address.city}, {address.state} - {address.pinCode}
              </p>
            </div>

            {!address.isDefault && (
              <button
                onClick={() => handleSetDefault(address.id)}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
              >
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Address Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Home, Office"
                  defaultValue={editingAddress?.name}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={editingAddress?.fullName}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue={editingAddress?.phone}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  defaultValue={editingAddress?.address}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Locality/Area
                </label>
                <input
                  type="text"
                  defaultValue={editingAddress?.locality}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    defaultValue={editingAddress?.city}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    defaultValue={editingAddress?.pinCode}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  defaultValue={editingAddress?.state}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingAddress ? 'Save Changes' : 'Add Address'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
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
    </div>
  );
};

export default SavedAddresses;