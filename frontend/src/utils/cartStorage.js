const GUEST_CART_DAYS = 14;

export const cartStorage = {
    addItem: (productId, quantity) => {
        const currentItems = cartStorage.getCartItems();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + GUEST_CART_DAYS);
        
        const updatedItems = [...currentItems];
        const existingItem = updatedItems.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            updatedItems.push({ productId, quantity });
        }
        
        localStorage.setItem('guestCart', JSON.stringify({
            items: updatedItems,
            expiryDate: expiryDate.toISOString()
        }));
    },
    
    getCartItems: () => {
        const cartData = localStorage.getItem('guestCart');
        if (!cartData) return [];
        
        const { items, expiryDate } = JSON.parse(cartData);
        if (new Date() > new Date(expiryDate)) {
            localStorage.removeItem('guestCart');
            return [];
        }
        return items; // Array of { productId, quantity }
    },
    migrateAndClear: async () => {
        const items = cartStorage.getCartItems();
        if (items.length > 0) {
            await cartApi.migrateGuestCart(items);
            localStorage.removeItem('guestCart');
        }
    }
};
