export const cartApi = {
    fetchProductsByIds: async (productIds) => {
        const response = await fetch('http://localhost:8080/api/v1/products/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds })
        });
        return response.json();
    },

    migrateGuestCart: async (cartItems) => {
        const response = await fetch('http://localhost:8080/api/v1/cart/migrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cartItems })
        });
        return response.json();
    }
};
