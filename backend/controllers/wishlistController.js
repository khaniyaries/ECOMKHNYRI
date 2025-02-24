import Wishlist from '../models/wishlist.js';

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.query.userId })
      .populate('products');
    
    const formattedProducts = wishlist?.products.map(product => ({
      id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      rating: product.rating,
      reviews: product.reviews
    })) || [];
    
    res.status(200).json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [productId] });
    } else {
      wishlist.products.push(productId);
    }
    
    await wishlist.save();
    res.status(200).json({ message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { products: productId } }
    );
    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
};
