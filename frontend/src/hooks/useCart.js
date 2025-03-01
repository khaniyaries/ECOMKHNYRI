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

    const removeFromCart = async (productId) => {
        const userId = localStorage.getItem('userId');
        try {
          if (user) {
            await fetch(`${env.API_URL}/api/v1/cart/${userId}/remove/${productId}`, {
              method: 'DELETE'
            });
          } else {
            cartStorage.removeItem(productId);
          }
          await loadCartProducts();
        } catch (error) {
          console.error('Error removing item:', error);
        }
      };

      const updateQuantity = async (productId, quantity) => {
        const userId = localStorage.getItem('userId');
        try {
          if (user) {
            await fetch(`${env.API_URL}/api/v1/cart/update-quantity`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, productId, quantity })
            });
          } else {
            cartStorage.updateQuantity(productId, quantity);
          }
          await loadCartProducts();
        } catch (error) {
          console.error('Error updating quantity:', error);
        }
      };

      return { 
        cartProducts, 
        quantities, 
        setQuantities, 
        isLoading, 
        refreshCart: loadCartProducts, 
        addToCart,
        removeFromCart,  // Add this line
        updateQuantity   // Add this for future use
    };
};
