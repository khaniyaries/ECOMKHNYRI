"use client"
import React, { useState, useEffect } from 'react';
import SidebarContent from "@/components/SidebarContent.jsx"
import { CgCloseO } from "react-icons/cg";
import toast from 'react-hot-toast';
import {env} from '../../../../../../config/config.js'

const SavedAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  
  const fetchAddresses = async () => {
    const userID = localStorage.getItem('userId');
    try {
      const response = await fetch(`${env.API_URL}/api/v1/user/address?userId=${userID}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      toast.error('Failed to fetch addresses');
      setAddresses([]);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    const formData = {
      userId: localStorage.getItem('userId'),
      name: e.target.elements.name.value,
      fullName: e.target.elements.fullname.value, // Match the name attribute from your form
      phone: e.target.elements.phone.value,
      address: e.target.elements.address.value,
      locality: e.target.elements.locality.value,
      city: e.target.elements.city.value,
      state: e.target.elements.state.value,
      pinCode: e.target.elements.pincode.value // Match the name attribute from your form
    };
  
    console.log('Sending data:', formData);
  
    try {
      const url = editingAddress 
        ? `${env.API_URL}/api/v1/user/address/${editingAddress._id}`
        : `${env.API_URL}/api/v1/user/address`;
        
      const method = editingAddress ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
      
      if (response.ok) {
        setAddresses(prev => editingAddress 
          ? prev.map(addr => addr._id === editingAddress._id ? data : addr)
          : [...prev, data]
        );
        setShowAddForm(false);
        toast.success(editingAddress ? 'Address updated successfully!' : 'Address added successfully!');
        fetchAddresses();
      } else {
        throw new Error(data.message || 'Failed to process address');
      }  
    } catch (error) {
      toast.error(error.message || 'Failed to process address');
    }
  };


  const handleSetDefault = async (id) => {
  const userId = localStorage.getItem('userId');
  
  try {
    const response = await fetch(`${env.API_URL}/api/v1/user/address/${id}/default`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId }) // Include userId in request body
    });

    if (!response.ok) {
      throw new Error('Failed to set default address');
    }

    const data = await response.json();
    console.log('Default address response:', data);
    
    await fetchAddresses(); // Refresh the address list
    toast.success('Default address updated');
    
  } catch (error) {
    console.log('Error setting default:', error);
    toast.error('Failed to update default address');
  }
};


  useEffect(() => {
    fetchAddresses();
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleDelete = async (id) => {
    const userID = localStorage.getItem('userId');
    
    toast((t) => (
      <div className="flex flex-col gap-4">
        <p className="font-medium">Are you sure you want to delete this address?</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            onClick={async () => {
              try {
                const response = await fetch(`${env.API_URL}/api/v1/user/address/${id}?userId=${userID}`, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                });
  
                if (response.ok) {
                  setAddresses(addresses.filter(addr => addr._id !== id));
                  toast.success('Address deleted successfully');
                } else {
                  throw new Error('Failed to delete address');
                }
              } catch (error) {
                toast.error('Failed to delete address');
              }
              toast.dismiss(t.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 5000 });
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
    <div className="w-full lg:w-[70%] lg:shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] mx-auto p-5 md:p-10">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center mb-6">
        <h1 className="text-lg md:text-2xl font-semibold">Saved Addresses</h1>
        <button
          onClick={() => {
            setEditingAddress(null);
            setShowAddForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-sm md:text-base text-white rounded-lg hover:bg-blue-700"
        >
          Add New Address
        </button>
      </div>

      {/* Address List */}
      <div className="space-y-4">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address._id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
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
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingAddress(address);
                        setShowAddForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
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
                    onClick={() => handleSetDefault(address._id)}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No addresses found</p>
              <p className="text-sm mt-2">Add a new address to get started</p>
            </div>
          )}
        </div>


      {/* Add/Edit Address Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md h-[60vh] w-full scrollbar-hide overflow-x-auto ">
            <h2 className="text-xl font-semibold mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            
            <form className="space-y-4" onSubmit={handleAddAddress}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Name
                </label>
                <input
                name='name'
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
                name='fullname'
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
                name='phone'
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
                name='address'
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
                name='locality'
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
                  name='city'
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
                  name='pincode'
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
                name='state'
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