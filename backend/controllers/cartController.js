import Cart from '../models/cart.js';
import Product from '../models/productModel.js';

export const cartController = {
    // Get user's cart with populated product details
    getUserCart: async (req, res) => {
        try {
            const userId = req.params.userid;
            const cart = await Cart.findOne({ userId })
                .populate('items.productId', 'name price images stock');

            if (!cart) {
                return res.json({ items: [] });
            }
            res.json(cart);
        } catch (error) {
            res.status(500).json({ message: "Error fetching cart" });
        }
    },

    // Add item to cart
    addToCart: async (req, res) => {
        try {

            const { userId, productId, quantity } = req.body;

            // Verify product exists and has enough stock
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            if (product.stock < quantity) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }

            let cart = await Cart.findOne({ userId });

            if (!cart) {
                cart = new Cart({ userId, items: [] });
            }

            const existingItem = cart.items.find(
                item => item.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity = quantity;
            } else {
                cart.items.push({ productId, quantity });
            }

            await cart.save();
            res.json(cart);
        } catch (error) {
            res.status(500).json({ message: 'Error adding to cart' });
        }
    },

    // Update cart item quantity
    updateQuantity: async (req, res) => {
        try {
            const { userId, productId, quantity } = req.body;

            const cart = await Cart.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const item = cart.items.find(
                item => item.productId.toString() === productId
            );

            if (!item) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            item.quantity = quantity;
            await cart.save();
            res.json(cart);
        } catch (error) {
            res.status(500).json({ message: 'Error updating quantity' });
        }
    },

    // Remove item from cart
    removeItem: async (req, res) => {
        try {
            const userId = req.params.userid;
            const { productId } = req.params;

            const cart = await Cart.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            cart.items = cart.items.filter(
                item => item.productId.toString() !== productId
            );

            await cart.save();
            res.json(cart);
        } catch (error) {
            res.status(500).json({ message: 'Error removing item' });
        }
    },

    // Clear entire cart
    clearCart: async (req, res) => {
        try {
            const userId = req.user._id;
            await Cart.findOneAndUpdate(
                { userId },
                { $set: { items: [] } }
            );
            res.json({ message: 'Cart cleared successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error clearing cart' });
        }
    },

    // Migrate guest cart to user cart
    migrateGuestCart: async (req, res) => {
        try {
            const { userId, items } = req.body;
            
            console.log('Received migration request:', { userId, items }); // Debug log
    
            if (!userId || !items || !Array.isArray(items)) {
                return res.status(400).json({ message: 'Invalid request data' });
            }
    
            let cart = await Cart.findOne({ userId });
            
            if (!cart) {
                cart = new Cart({ 
                    userId,
                    items: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        addedAt: new Date()
                    }))
                });
            } else {
                for (const guestItem of items) {
                    const existingItem = cart.items.find(
                        item => item.productId.toString() === guestItem.productId
                    );
    
                    if (existingItem) {
                        existingItem.quantity += guestItem.quantity;
                    } else {
                        cart.items.push({
                            productId: guestItem.productId,
                            quantity: guestItem.quantity,
                            addedAt: new Date()
                        });
                    }
                }
            }
    
            const savedCart = await cart.save();
            console.log('Cart saved successfully:', savedCart); // Debug log
            
            res.json(savedCart);
        } catch (error) {
            console.error('Cart migration error:', error); // Debug log
            res.status(500).json({ message: error.message || 'Error migrating cart' });
        }
    }
};
