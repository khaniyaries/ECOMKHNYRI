"use client"
import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { fetchProducts } from '@/utils/productapi.js';
import axios from 'axios';

export default function Banners() {
    const [isLoading, setIsLoading] = useState(false);

    const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([""]);
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    productId: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [bannersRes, productsRes] = await Promise.all([
    //   axios.get('/api/admin/banner'),
      fetchProducts()
    ]);
    setBanners(bannersRes.data);
    setProducts(productsRes.data);
  };

  const handleNewBannerChange = (e) => {
    setNewBanner({
      ...newBanner,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    });
  };

  const handleBannerChange = (bannerId, field, value) => {
    setBanners(banners.map(banner => 
      banner._id === bannerId ? { ...banner, [field]: value } : banner
    ));
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    await axios.post('/api/admin/banner', newBanner);
    setNewBanner({
      title: '',
      subtitle: '',
      productId: '',
      order: 0,
      isActive: true
    });
    fetchData();
  };

  const handleUpdateBanner = async (banner) => {
    await axios.put('/api/admin/banner', banner);
    fetchData();
  };

  const handleDeleteBanner = async (bannerId) => {
    await axios.delete('/api/admin/banner', { data: { id: bannerId } });
    fetchData();
  };

  return (
    <div className="space-y-8">
      {/* Existing Banners */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Current Banners</h2>
        {banners.map((banner) => (
          <div key={banner._id} className="border p-4 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Title</label>
                <input
                  value={banner.title}
                  onChange={(e) => handleBannerChange(banner._id, 'title', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block mb-2">Subtitle</label>
                <input
                  value={banner.subtitle}
                  onChange={(e) => handleBannerChange(banner._id, 'subtitle', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-2">Product</label>
                <select
                  value={banner.productId._id}
                  onChange={(e) => handleBannerChange(banner._id, 'productId', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Order</label>
                <input
                  type="number"
                  value={banner.order}
                  onChange={(e) => handleBannerChange(banner._id, 'order', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={banner.isActive}
                    onChange={(e) => handleBannerChange(banner._id, 'isActive', e.target.checked)}
                  />
                  Active
                </label>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleUpdateBanner(banner)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteBanner(banner._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Banner Form */}
      <div className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Add New Banner</h2>
        <form onSubmit={handleCreateBanner} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Title</label>
            <input
              name="title"
              value={newBanner.title}
              onChange={handleNewBannerChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-2">Subtitle</label>
            <input
              name="subtitle"
              value={newBanner.subtitle}
              onChange={handleNewBannerChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Product</label>
            <select
              name="productId"
              value={newBanner.productId}
              onChange={handleNewBannerChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Order</label>
            <input
              type="number"
              name="order"
              value={newBanner.order}
              onChange={handleNewBannerChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={newBanner.isActive}
                onChange={handleNewBannerChange}
              />
              Active
            </label>
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create Banner
          </button>
        </form>
      </div>
    </div>
  );
}
