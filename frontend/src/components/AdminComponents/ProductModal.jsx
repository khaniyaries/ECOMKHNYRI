import "./productModal.css";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { uploadToCloudinary, deleteFromCloudinary } from '../../../config/cloudinary.js';
import { LoadingSpinner } from "../LoadingSpinner";

const ProductModal = ({ isOpen, onClose, onSubmit, initialData}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    stock: initialData?.stock || '',
    colors: initialData?.colors || [],
    sizes: initialData?.sizes || [],
    percentageOff: initialData?.percentageOff || 0,
    isFlashSale: initialData?.isFlashSale || false
  });
  
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialData?.subcategory || '');
  const [existingImages, setExistingImages] = useState(initialData?.images || []);
  const [newFiles, setNewFiles] = useState([]);
  const [selectedColors, setSelectedColors] = useState(initialData?.colors || []);
  const [selectedSizes, setSelectedSizes] = useState(initialData?.sizes || []);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState(new Set());
  const [primaryImageIndex, setPrimaryImageIndex] = useState(
    initialData?.images?.findIndex(img => img.isPrimary) || 0
  );
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/categories');
            const data = await response.json();
            
            // Filter using isSubcategory flag
            const mainCategories = data.filter(cat => !cat.isSubcategory);
            const subCategories = data.filter(cat => cat.isSubcategory);
            
            setCategories(mainCategories);
            setSubcategories(subCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    fetchCategories();
}, []);

// Get subcategories for selected category
const getSubcategoriesForCategory = (categoryId) => {
    return subcategories.filter(subcat => subcat.parent === categoryId);
};



  const deleteImageFromCloudinary = async (imageUrl) => {
    try {
        await deleteFromCloudinary(imageUrl);
        return true;
    } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
        return false;
    }
};


  const handleColorChange = (e) => {
    const colors = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedColors(colors);
  };

  const handleSizeChange = (e) => {
    const sizes = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedSizes(sizes);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...uploadedFiles]);
  };

  const handleImageDelete = (image, index) => {
    const imageUrl = typeof image === 'string' ? image : image.url;
    
    if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
        setImagesToDelete(prev => [...prev, imageUrl]);
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    }
};

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }));
      setNewColor('');
    }
  };
  
  const removeColor = (colorToRemove) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove)
    }));
  };
  
  // Size handling functions
  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize]
      }));
      setNewSize('');
    }
  };
  
  const removeSize = (sizeToRemove) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(size => size !== sizeToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        // Delete tracked images first
        if (imagesToDelete.length > 0) {
            await deleteFromCloudinary(imagesToDelete);
        }

        // Upload new images
        const uploadPromises = newFiles.map(file => uploadToCloudinary(file));
        const newImageUrls = await Promise.all(uploadPromises);
        
        // Reset all isPrimary flags first
        const updatedExistingImages = existingImages.map((img, index) => ({
            ...img,
            isPrimary: index === primaryImageIndex
        }));

        const newImages = newImageUrls.map((url, index) => ({
            url,
            isPrimary: (index + existingImages.length) === primaryImageIndex
        }));

        const allImages = [...updatedExistingImages, ...newImages];

        const productData = {
            ...formData,
            images: allImages
        };

        await onSubmit(productData);
        setNewFiles([]);
        setImagesToDelete([]);
        onClose();
    } catch (error) {
        console.error('Product submission error:', error);
    }finally{
      setIsLoading(false);
    }
};


  
useEffect(() => {
  if (initialData) {

      const currentCategory = categories.find(cat => cat._id === initialData.category);
      const currentSubcategory = subcategories.find(subcat => subcat._id === initialData.subcategory);
      setFormData({
          name: initialData.name || '',
          price: initialData.price || '',
          description: initialData.description || '',
          category: initialData.category || '',
          subcategory: initialData.subcategory || '',
          stock: initialData.stock || '',
          colors: initialData.colors || [],
          sizes: initialData.sizes || [],
          percentageOff: initialData.percentageOff || 0,
          isFlashSale: initialData.isFlashSale || false
      });
      setExistingImages(initialData.images || []);
      setPrimaryImageIndex(initialData.images?.findIndex(img => img.isPrimary) || 0);
      setSelectedColors(initialData.colors || []);
      setSelectedSizes(initialData.sizes || []);
      setSelectedCategory(currentCategory?._id || initialData.category);
      setSelectedSubcategory(currentSubcategory?._id || initialData.subcategory);
  }
}, [initialData, categories, subcategories]);
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {isLoading && <LoadingSpinner />}
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-black/5 p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={selectedCategory}
                onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory('');
                    setFormData(prev => ({
                        ...prev,
                        category: e.target.value
                    }));
                }}
                className="mt-1 block w-full rounded-md p-2 bg-black/5 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
            >
                <option value="">Select Category</option>
                {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                        {cat.name}
                    </option>
                ))}
            </select>
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700">Subcategory</label>
              <select
                  name="subcategory"
                  value={selectedSubcategory}
                  onChange={(e) => {
                      setSelectedSubcategory(e.target.value);
                      setFormData(prev => ({
                          ...prev,
                          subcategory: e.target.value
                      }));
                  }}
                  className="mt-1 block w-full rounded-md p-2 bg-black/5 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={!selectedCategory}
              >
                  <option value="">Select Subcategory</option>
                  {selectedCategory && getSubcategoriesForCategory(selectedCategory).map(subcat => (
                      <option key={subcat._id} value={subcat._id}>
                          {subcat.name}
                      </option>
                  ))}
              </select>
          </div>
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md p-2 bg-black/5 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md p-2 bg-black/5 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input
                type="number"
                name="percentageOff"
                value={formData.percentageOff}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="mt-1 block w-full rounded-md p-2 bg-black/5 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="mt-1 block w-full rounded-md p-2 bg-black/5 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Colors</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="mt-1 block w-full rounded-md p-2 bg-black/5 p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Add a color"
              />
              <button
                type="button"
                onClick={addColor}
                className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.colors.map(color => (
                <span
                  key={color}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Sizes</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="mt-1 block w-full rounded-md p-2 bg-black/5 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Add a size"
              />
              <button
                type="button"
                onClick={addSize}
                className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.sizes.map(size => (
                <span
                  key={size}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Flash Sale Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFlashSale"
              name="isFlashSale"
              checked={formData.isFlashSale}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isFlashSale" className="ml-2 block text-sm text-gray-900">
              Include in Flash Sale
            </label>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {existingImages.map((img, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={img.url}
                    alt={`Product ${index}`}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <input
                      type="radio"
                      name="primaryImage"
                      checked={index === primaryImageIndex}
                      onChange={() => setPrimaryImageIndex(index)}
                      className="h-4 w-4"
                    />
                    <button
                        type="button"
                        onClick={() => handleImageDelete(img.url || img, index)}
                        className="bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                        ✕
                    </button>
                  </div>
                </div>
              ))}
              {newFiles.map((file, index) => (
                <div key={`new-${index}`} className="relative group">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`New ${index}`}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <input
                      type="radio"
                      name="primaryImage"
                      checked={index + existingImages.length === primaryImageIndex}
                      onChange={() => setPrimaryImageIndex(index + existingImages.length)}
                      className="h-4 w-4"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(file, index)}
                      className="bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
