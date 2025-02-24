"use client"
import { useState, useEffect } from 'react';
import ProductCard from "@/components/ProductCard.jsx"
import { env } from '../../config/config.js';
import Link from 'next/link';

const WishList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${env.API_URL}/api/v1/user/wishlist?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return <div className="w-full h-40 flex items-center justify-center">Loading...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <div className="mb-6">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-500 mb-6">Explore our products and add your favorites to the wishlist</p>
        <Link 
          href="/products" 
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pt-5 pb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard {...product} isWishlist={true} onWishlistUpdate={fetchWishlist} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishList;
