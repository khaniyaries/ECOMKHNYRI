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
    
    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/v1/saleheader/current`);
                const data = await response.json();
                setHeaderData(data);
            } catch (error) {
                console.error('Error fetching sale header:', error);
            }
        };

        fetchHeaderData();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
                        // In your frontend code
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
            }
        } catch (error) {
            console.error('Error updating sale header:', error);
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
        </div>
    );
};

export default SaleHeaderEditor;
