"use client"
import { useState, useEffect } from 'react'
import { env } from '../../../../config/config.js'

const SaleHeaderEditor = () => {
    const [formData, setFormData] = useState({
        headerText: '',
        linkText: '',
        linkUrl: ''
    });

    const [headerData, setHeaderData] = useState({
            headerText: '',
            linkText: '',
            linkUrl: ''
        });
    
        const [inactiveHeaders, setInactiveHeaders] = useState([]);

        useEffect(() => {
            fetchHeaderData();
            fetchInactiveHeaders();
        }, []);
    
        const fetchHeaderData = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/v1/saleheader/current`);
                const data = await response.json();
                setHeaderData(data);
            } catch (error) {
                console.error('Error fetching sale header:', error);
            }
        };
    
        const fetchInactiveHeaders = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/v1/saleheader/inactive`);
                const data = await response.json();
                setInactiveHeaders(data);
            } catch (error) {
                console.error('Error fetching inactive headers:', error);
            }
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const response = await fetch(`${env.API_URL}/api/v1/saleheader/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Sale header updated successfully!');
                    fetchHeaderData();
                    fetchInactiveHeaders();
                    setFormData({ headerText: '', linkText: '', linkUrl: '' });
                }
            } catch (error) {
                console.error('Error updating sale header:', error);
            }
        };
    
        const setActiveHeader = async (id) => {
            try {
                const response = await fetch(`${env.API_URL}/api/v1/saleheader/setActive/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.ok) {
                    alert('Header set as active successfully!');
                    fetchHeaderData();
                    fetchInactiveHeaders();
                }
            } catch (error) {
                console.error('Error setting active header:', error);
            }
        };
    
        const deleteHeader = async (id) => {
            try {
                const response = await fetch(`${env.API_URL}/api/v1/saleheader/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.ok) {
                    alert('Header deleted successfully!');
                    fetchInactiveHeaders();
                }
            } catch (error) {
                console.error('Error deleting header:', error);
            }
        };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Sale Header</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Header Text</label>
                    <input
                        type="text"
                        placeholder={headerData?.headerText}
                        value={formData.headerText}
                        onChange={(e) => setFormData({...formData, headerText: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Link Text</label>
                    <input
                        type="text"
                        placeholder={headerData?.linkText}
                        value={formData.linkText}
                        onChange={(e) => setFormData({...formData, linkText: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Link URL</label>
                    <input
                        type="text"
                        placeholder={headerData?.linkUrl}
                        value={formData.linkUrl}
                        onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Update Header
                </button>
            </form>
            <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Previous Sale Headers</h2>
                {inactiveHeaders.length === 0 ? (
                    <p className="text-gray-500">No inactive sale headers</p>
                ) : (
                    <div className="space-y-4">
                        {inactiveHeaders.map((header) => (
                            <div key={header._id} className="border p-4 rounded-lg">
                                <p className="font-medium">{header.headerText}</p>
                                <p className="text-sm text-gray-600">Link: {header.linkText} → {header.linkUrl}</p>
                                <div className="mt-2 space-x-2">
                                    <button 
                                        onClick={() => setActiveHeader(header._id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Set Active
                                    </button>
                                    <button 
                                        onClick={() => deleteHeader(header._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SaleHeaderEditor;
