import { env } from "../../config/config.js";

export const cartApi = {
    fetchProductsByIds: async (productIds) => {
        const response = await fetch(`${env.API_URL}/api/v1/products/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds })
        });
        return response.json();
    },

    migrateGuestCart: async (userId, cartItems) => {
        console.log('Migrating cart with data:', { userId, cartItems });
        
        const response = await fetch(`${env.API_URL}/api/v1/cart/migrate`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userId, items: cartItems })
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to migrate cart');
        }
        return data;
    }
};
