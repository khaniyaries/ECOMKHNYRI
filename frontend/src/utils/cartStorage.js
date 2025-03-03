import { cartApi } from "./cartapi.js";
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
        const cartData = localStorage.getItem('guestCart');
        if (!cartData) return;
        
        const cart = JSON.parse(cartData);
        cart.items = cart.items.filter(item => item.productId !== productId);
        
        // Maintain the same structure as MongoDB cart
        localStorage.setItem('guestCart', JSON.stringify({
            items: cart.items,
            expiryDate: cart.expiryDate
        }));
    },
    
    updateQuantity: (productId, quantity) => {
        const cartData = localStorage.getItem('guestCart');
        if (!cartData) return;
        
        const cart = JSON.parse(cartData);
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        
        if (itemIndex !== -1) {
            cart.items[itemIndex].quantity = quantity;
        }
        
        localStorage.setItem('guestCart', JSON.stringify({
            items: cart.items,
            expiryDate: cart.expiryDate
        }));
    },
    
    getCartItems: () => {
        const cartData = localStorage.getItem('guestCart');
        if (!cartData) return [];
        
        const cart = JSON.parse(cartData);
        
        if (new Date() > new Date(cart.expiryDate)) {
            localStorage.removeItem('guestCart');
            return [];
        }
        
        return cart.items || [];
    },

    clearCart: () => {
        localStorage.removeItem('guestCart');
    },

    migrateAndClear: async (userId) => {
        const items = cartStorage.getCartItems();
        if (items.length > 0) {
            try {
                const result = await cartApi.migrateGuestCart(userId, items);
                if (result) {
                    cartStorage.clearCart();
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Failed to migrate cart:', error);
                return false;
            }
        }
        return true;
    }
};
