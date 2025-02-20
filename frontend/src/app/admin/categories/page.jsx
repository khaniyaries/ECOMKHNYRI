"use client"
// pages/admin/categories.jsx
import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import CategoryModal from '@/components/AdminComponents/CategoryModal.jsx';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Image from 'next/image';
import { env } from "../../../../config/config.js"


export default function Categories() {
    const { isAuthenticated } = useAdminAuth();
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubcategoryModal, setIsSubcategoryModal] = useState(false);


    useEffect(() => {
        loadCategories();
    }, []);

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setIsSubcategoryModal(false);
        setIsModalOpen(true);
    };
    
    const handleEditSubcategory = (subcategory) => {
        setSelectedCategory(subcategory);
        setIsSubcategoryModal(true);
        setIsModalOpen(true);
    };

    const groupedCategories = categories.reduce((acc, category) => {
        if (!category.isSubcategory) {
            acc[category._id] = {
                ...category,
                children: []
            };
        }
        return acc;
    }, {});
    
    categories.forEach(category => {
        if (category.isSubcategory && category.parent) {
            groupedCategories[category.parent]?.children.push(category);
        }
    });
    

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${env.API_URL}/api/v1/categories`);
            const data = await response.json();
            
            const mainCategories = data.filter(cat => !cat.isSubcategory);
            const subCategories = data.filter(cat => cat.isSubcategory);
            
            const grouped = mainCategories.map(main => ({
                ...main,
                subcategories: subCategories.filter(sub => 
                    sub.parent && sub.parent.toString() === main._id.toString()
                )
            }));
            
            setCategories(grouped);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleCategorySubmit = async (formData) => {
        console.log('Category data being sent:', formData);
        setIsLoading(true);
        try {
            if (selectedCategory) {
                await fetch(`${env.API_URL}/api/v1/categories/${selectedCategory._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                await fetch(`${env.API_URL}/api/v1/categories`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }
            loadCategories();
            setIsModalOpen(false);
            setSelectedCategory(null);
        } catch (error) {
            console.error('Category submission error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setIsLoading(true);
            try {
                // Get category details first
                const categoryToDelete = categories.find(cat => 
                    cat._id === categoryId || 
                    cat.subcategories?.some(sub => sub._id === categoryId)
                );
                
                // Delete image from Cloudinary if it exists
                if (categoryToDelete?.image?.url) {
                    await deleteFromCloudinary(categoryToDelete.image.url);
                }
    
                // Delete category from database
                await fetch(`${env.API_URL}/api/v1/categories/${categoryId}`, {
                    method: 'DELETE'
                });
                
                loadCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    

    if (!isAuthenticated) return null;

    return (
        <div className="space-y-8">
            {isLoading && <LoadingSpinner />}
            
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Categories</h1>
                    <p className="text-gray-600">Manage product categories and subcategories</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setIsSubcategoryModal(false);
                            setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Add Category
                    </button>
                    <button
                        onClick={() => {
                            setIsSubcategoryModal(true);
                            setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                        Add Subcategory
                    </button>
                </div>
            </div>

            <div className="space-y-8">
    {categories.map(category => (
        <div key={category._id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="border-b pb-4 mb-4">
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <div className="flex justify-end mt-2">
                    <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-600 hover:text-red-800"
                    >
                        Delete
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {category.subcategories?.map(sub => (
                    <div key={sub._id} className="bg-gray-50 rounded-lg p-4">
                        <Image
                            src={sub.image.url}
                            alt={sub.name}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover w-full h-48"
                        />
                        <h4 className="mt-2 font-medium">{sub.name}</h4>
                        <div className="mt-2 flex justify-end gap-2">
                            <button
                                onClick={() => handleEditSubcategory(sub)}
                                className="text-sm text-blue-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(sub._id)}
                                className="text-sm text-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ))}
</div>


            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCategory(null);
                }}
                onSubmit={handleCategorySubmit}
                initialData={selectedCategory}
                parentCategories={categories.filter(c => !c.isSubcategory)}
                isSubcategory={isSubcategoryModal}
            />
        </div>
    );
}
