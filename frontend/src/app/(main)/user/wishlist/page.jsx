"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import WishList from "@/components/WishList";
import ForYou from "@/components/ForYou";
import { env } from '../../../../../config/config.js';
import { useAuth } from '@/hooks/userAuth.js';

const WishListPage = () => {
    const [wishlistCount, setWishlistCount] = useState(0);
    const { user } = useAuth();

    const fetchWishlistCount = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`${env.API_URL}/api/v1/user/wishlist/count?userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setWishlistCount(data.count);
        } catch (error) {
            setWishlistCount(0);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWishlistCount();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Please log in to view your wishlist</h2>
                    <p className="text-gray-600 mb-6">Create an account or log in to save your favorite items</p>
                    <div className="space-y-4">
                        <Link 
                            href="/sign-in" 
                            className="block w-full bg-primary text-white px-6 py-2 rounded-md bg-black/90 transition text-center"
                        >
                            Login
                        </Link>
                        <Link 
                            href="/signup" 
                            className="block w-full border border-primary text-primary px-6 py-2 rounded-md text-center"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    

    return (
        <main className="container w-full h-full mx-auto px-4 md:px-10 lg:px-40 py-20">
            <nav className="mb-8 flex flex-row justify-between">
                <h1 className="text-xl font-poppins font-normal">
                    Wishlist ({wishlistCount})
                </h1>
                <button className="bg-white -mt-2 text-black text-base font-poppins font-medium py-2 px-8 rounded-md border border-black/50">
                    Move All To Bag
                </button>
            </nav>
            <WishList />

            <div className="flex justify-between items-start w-full">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-5 h-10 bg-red-500 rounded" />
                    <span className="font-normal font-poppins text-xl">Just For You</span>
                </div>
                <button 
                    className="bg-white text-black text-base font-poppins font-medium py-2 px-8 rounded-md border border-black/50"
                >
                    See All
                </button>
            </div>
            <ForYou />
        </main>
    );
};

export default WishListPage;
