"use client"
import { useState, useEffect } from "react";
import { useAdminAuth } from '@/hooks/useAdminAuth.js';
import ProductModal from '@/components/AdminComponents/ProductModal.jsx';
import { fetchProducts, deleteProduct, uploadImages, createProduct, updateProduct } from '@/utils/productapi.js';
import { processCSV } from '@/utils/csvProcessor.js';
import Image from "next/image";
import Link from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Products() {
  const { isAuthenticated } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All Categories',
    status: 'All Status'
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  

  // In your loadProducts function, update the status filter handling
const loadProducts = async () => {
  setIsLoading(true);
  try {
      const searchParams = new URLSearchParams();
      if (filters.search) searchParams.append('search', filters.search);
      if (filters.category !== 'All Categories') searchParams.append('category', filters.category);
      
      // Get base products
      const data = await fetchProducts(searchParams.toString());
      
      // Apply status filtering on the client side
      let filteredProducts = data;
      if (filters.status !== 'All Status') {
          filteredProducts = data.filter(product => {
              switch (filters.status) {
                  case 'In Stock':
                      return product.stock > 10;
                  case 'Low Stock':
                      return product.stock > 0 && product.stock <= 10;
                  case 'Out of Stock':
                      return product.stock === 0;
                  default:
                      return true;
              }
          });
      }
      
      setProducts(filteredProducts);
  } catch (error) {
      console.error('Error loading products:', error);
  } finally{
    setIsLoading(false);

  }
};


  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const products = await processCSV(file);
      try {
        for (const product of products) {
          await createProduct(product);
        }
        loadProducts();
      } catch (error) {
        console.error('Error in bulk upload:', error);
      }
    }
  };

  const handleProductSubmit = async (formData) => {
    setIsLoading(true);
    try {
        let result;
        if (selectedProduct) {
            result = await updateProduct(selectedProduct._id, {
                ...formData,
                colors: formData.colors || [],
                sizes: formData.sizes || [],
                images: formData.images || []
            });
        } else {
            result = await createProduct(formData);
        }
        
        loadProducts();
        setIsModalOpen(false);
        setSelectedProduct(null);
    } catch (error) {
        console.error('Product submission error:', error);
    }finally{
      setIsLoading(false);
    }
};

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
      loadProducts();
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-8">
      {isLoading && <LoadingSpinner />}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleBulkUpload}
              className="hidden"
              id="bulk-upload"
            />
            <label
              htmlFor="bulk-upload"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              Bulk Upload
            </label>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          placeholder="Search products..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="px-4 py-2 border rounded-lg"
        >
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Books</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="px-4 py-2 border rounded-lg"
        >
          <option>All Status</option>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products?.map(product => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          src={product.images.find(img => img.isPrimary)?.url || "/images/placeholder.svg"}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">SKU: {product._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock > 10 
                        ? 'bg-green-100 text-green-800'
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 10 
                        ? 'In Stock' 
                        : product.stock > 0 
                        ? 'Low Stock' 
                        : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleProductSubmit}
        initialData={selectedProduct}
      />
    </div>
  );
}
