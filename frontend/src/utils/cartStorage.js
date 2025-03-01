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
    
    removeItem: (productId) => {
        const cart = cartStorage.getCartItems();
        const filtered = cart.filter(item => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(filtered));
      },
      
      updateQuantity: (productId, quantity) => {
        const cart = cartStorage.getCartItems();
        const item = cart.find(item => item.productId === productId);
        if (item) item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
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
