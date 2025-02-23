"use client"
// components/CategoryModal.jsx
import { useState, useEffect } from 'react';
import { uploadToCloudinary, deleteFromCloudinary } from '../../../config/cloudinary.js';

export default function CategoryModal({ isOpen, onClose, onSubmit, initialData, parentCategories, isSubcategory  }) {
    const [formData, setFormData] = useState({
        name: '',
        image: null,
        parent: '',
        isSubcategory: isSubcategory
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                image: initialData.image,
                parent: initialData.parent || '',
                isSubcategory: initialData.isSubcategory
            });
            setPreviewUrl(initialData.image?.url);
        }
    }, [initialData]);
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting formData:', formData);
    
        try {
            let imageData = formData.image;
            const isSubcategory = !!formData.parent;

            if(!isSubcategory){
                formData.parent = null; // Ensure no parent for main categories
            }
    
            // Handle image upload for all categories
            if (imageFile) {
                if (formData.image?.url) {
                    await deleteFromCloudinary(formData.image.url);
                }
                const uploadedUrl = await uploadToCloudinary(imageFile);
                imageData = { url: uploadedUrl };
            }
    
            await onSubmit({
                ...formData,
                image: imageData,
                isSubcategory,
                parent: isSubcategory ? formData.parent : null
            });
    
            onClose();
        } catch (error) {
            console.error('Category submission error:', error);
        }
    };
    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? 'Edit' : 'Add'} {isSubcategory ? 'Subcategory' : 'Category'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                name: e.target.value
                            }))}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {isSubcategory && (
                        <div>
                            <div className="mb-4 mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Parent Category
                                </label>
                                <select
                                    value={formData.parent}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        parent: e.target.value
                                    }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select a parent category</option>
                                    {parentCategories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                        <div>
                            <div className='mb-4 mt-6'>
                                <label className="block text-sm font-medium text-gray-700">
                                {isSubcategory? "Sub Category Imgae":"Category Image"}
                                </label>
                                <div className="mt-1 flex items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                                        required={!initialData?.image}
                                    />
                                </div>
                                {(previewUrl || initialData?.image?.url) && (
                                    <div className="mt-2">
                                        <img
                                            src={previewUrl || initialData?.image?.url}
                                            alt="Preview"
                                            className="h-32 w-32 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    

                    {/* Image upload section remains the same */}
                    
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            {initialData ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
