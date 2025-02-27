import { useAuth } from "./userAuth.js";
import { useState, useEffect } from "react";
import { cartStorage } from '@/utils/cartStorage';
import { cartApi } from '@/utils/cartapi.js';
import { env } from "../../config/config.js"

export const useCart = () => {
  
    const { user } = useAuth();
    const [cartProducts, setCartProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCartProducts();
    }, [user]);

    const loadCartProducts = async () => {
        setIsLoading(true);
        
        try {
            const userId = localStorage.getItem('userId');
            let products = [];  // Initialize with empty array
            if (user) {
                const response = await fetch(`${env.API_URL}/api/v1/cart/${userId}`);
                products = await response.json();
            } else {
                const cartItems = cartStorage.getCartItems();
                if (cartItems.length) {
                    const response = await cartApi.fetchProductsByIds(
                        cartItems.map(item => item.productId)
                    );
                    products = response.data.map(product => ({
                        ...product,
                        quantity: cartItems.find(item => item.productId === product._id).quantity
                    }));
                }
            }

            setCartProducts(products || []);
            setQuantities(products.items.reduce((acc, product) => ({
                ...acc,
                [product.productId._id]: product.quantity
            }), {}));
        } finally {
            setIsLoading(false);
        }
    };
    const addToCart = async (productId, quantity) => {
        if (user) {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`${env.API_URL}/api/v1/cart/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({userId, productId, quantity })
            });
            if (response.ok) {
                loadCartProducts();
            }
        } else {
            cartStorage.addItem(productId, quantity);
            loadCartProducts();
        }
    };

    return { cartProducts, quantities, setQuantities, isLoading, refreshCart: loadCartProducts, addToCart };
};
