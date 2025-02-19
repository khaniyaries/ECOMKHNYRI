import express from 'express';
import { cartController } from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes - require authentication
router.use(authMiddleware);

// Get user's cart
router.get('/user', cartController.getUserCart);

// Add item to cart
router.post('/add', cartController.addToCart);

// Update item quantity
router.put('/update-quantity', cartController.updateQuantity);

// Remove item from cart
router.delete('/remove/:productId', cartController.removeItem);

// Clear entire cart
router.delete('/clear', cartController.clearCart);

// Migrate guest cart to user cart
router.post('/migrate', cartController.migrateGuestCart);

export default router;
