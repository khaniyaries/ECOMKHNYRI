import express from 'express';
import { cartController } from '../controllers/cartController.js';

const router = express.Router();

// Get user's cart
router.get('/:userid', cartController.getUserCart);

// Add item to cart
router.post('/add', cartController.addToCart);

// Update item quantity
router.put('/update-quantity', cartController.updateQuantity);

// Remove item from cart
router.delete('/:userid/remove/:productId', cartController.removeItem);

// Clear entire cart
router.delete('/clear', cartController.clearCart);

// Migrate guest cart to user cart
router.post('/migrate', cartController.migrateGuestCart);

export default router;
