"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from '@/hooks/useCart.js';
import { LoadingSpinner } from "@/components/LoadingSpinner.jsx";
import { useState } from "react"
import { env } from "../../../../../config/config.js"
import toast from "react-hot-toast";


const QuantityInput = ({ value, onChange, onRemove }) => {
  const handleDecrease = () => {
    if (value === 1) {
      // Show confirmation dialog
      if (window.confirm('Do you want to remove this item from cart?')) {
        onRemove();
      }
    } else {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleDecrease}
        className="px-2 py-1 border rounded-l-md hover:bg-gray-50"
      >
        -
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-12 px-2 py-1 border-y text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={() => onChange(value + 1)}
        className="px-2 py-1 border rounded-r-md hover:bg-gray-50"
      >
        +
      </button>
    </div>
  )
}

export default function ShoppingCart() {

  const { cartProducts, quantities, setQuantities, isLoading, removeFromCart} = useCart();
   
  const handleQuantityChange = async (productId, newQuantity) => {

    const stockResponse = await fetch(`${env.API_URL}/api/v1/products/${productId}`);
    const productData = await stockResponse.json();
    
    if (newQuantity > productData.stock) {
        toast.error(`Only ${productData.stock} items available in stock`);
        return;
    }

    // Update UI state
    setQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
    }));

    // Get user status
    const user = localStorage.getItem('userId');

    if (user) {
        // Handle logged-in user
        await fetch(`${env.API_URL}/api/v1/cart/update-quantity`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user, productId, quantity: newQuantity })
        });
    } else {
        // Handle guest user - update local storage
        const cartData = localStorage.getItem('guestCart');
        if (cartData) {
            const cart = JSON.parse(cartData);
            cart.items = cart.items.map(item => 
                item.productId === productId 
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            localStorage.setItem('guestCart', JSON.stringify(cart));
        }
    }
};

  const handleRemoveItem = async (productId) => {
    try {
      const userId = localStorage.getItem('userId');
      await fetch(`${env.API_URL}/api/v1/cart/${userId}/remove/${productId}`, {
        method: 'DELETE',
      });
      removeFromCart(productId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container w-full h-full mx-auto px-4 md:px-10 lg:px-20 py-20">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-black/70 text-black/50">Home</Link>
        /
        <span className="text-foreground">Cart</span>
      </nav>

      <div className="w-full mb-8">
        <div className="hidden mb-6 md:grid md:grid-cols-[2fr,1fr,1fr,1fr] gap-4 p-4 shadow-[0_0_15px_rgba(0,0,0,0.05)]">
          <div className="pl-24">Product</div>
          <div className="text-center">Price</div>
          <div className="text-center">Quantity</div>
          <div className="text-right">Subtotal</div>
        </div>

        <div className="space-y-6">
          {cartProducts.items.map((product) => (
            <div key={product._id || product.productId}  className="grid mx-auto w-[80%] md:w-full md:grid-cols-[2fr,1fr,1fr,1fr] gap-4 items-center p-4 shadow-[0_0_15px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-4">
                <Image
                  src={product.productId.images[0]?.url || '/images/placeholder.svg'}
                  alt={product.productId.name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <span className="font-medium">{product.productId.name}</span>
              </div>
              <div className="md:text-center">
                <span className="md:hidden font-medium mr-2">Price: </span>
                ₹{product.productId.price}
              </div>
              <div className="md:flex md:justify-center">
                <span className="md:hidden font-medium mr-2">Quantity: </span>
                <QuantityInput
                  value={quantities[product.productId._id]}
                  onChange={(newQuantity) => handleQuantityChange(product.productId._id, newQuantity)}
                  onRemove={() => handleRemoveItem(product.productId._id)}
                />
              </div>
              <div className="md:text-right">
                <span className="md:hidden font-medium mr-2">Subtotal: </span>
                ₹{product.productId.price * quantities[product.productId._id]}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <Link
            href="/products"
            className="bg-white -mt-2 text-black text-base font-poppins font-medium py-2 px-8 rounded-md border border-black/50"
          >
            Return To Shop
          </Link>
          <button className="bg-white -mt-2 text-black text-base font-poppins font-medium py-2 px-8 rounded-md border border-black/50">
            Update Cart
          </button>
        </div>
      </div>

      {/* Coupon and Cart Total Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Coupon Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Have a Coupon?</h2>
          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              placeholder="Coupon Code"
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <button className="w-[80%] justify-center mx-auto flex md:w-max px-4 py-2 bg-[#DB4444] text-white rounded-md hover:bg-[#db4444c6] transition-colors whitespace-nowrap">
              Apply Coupon
            </button>
          </div>
        </div>

        {/* Cart Total Section */}
        <div className="border-[1.5px] border-black rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Cart Total</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-black">
              <span>Subtotal:</span>
              <span>
              ₹{cartProducts.items.reduce((total, product) => total + (product.productId.price * quantities[product.productId._id]), 0)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-black">
              <span>Shipping:</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between py-2 font-semibold">
              <span>Total:</span>
              <span>
              ₹ {cartProducts.items.reduce((total, product) => total + (product.productId.price * quantities[product.productId._id]), 0)}
              </span>
            </div>
            <button className="w-[80%] justify-center flex md:w-max px-8 py-3 mx-auto rounded-md bg-[#DB4444] text-white hover:bg-[#db4444c6] transition-colors">
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
