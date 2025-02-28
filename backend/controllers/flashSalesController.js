import FlashSale from '../models/flashSale.js';
import Product from '../models/productModel.js';

// Create or Update Flash Sale Period
export const setFlashSalePeriod = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    
    let flashSale = await FlashSale.findOne();
    if (flashSale) {
      flashSale.startTime = startTime;
      flashSale.endTime = endTime;
    } else {
      flashSale = new FlashSale({ startTime, endTime });
    }
    
    await flashSale.save();
    res.status(200).json(flashSale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Products to Flash Sale
export const addProductsToFlashSale = async (req, res) => {
    try {
      const { products } = req.body
      const productIds = products.map(p => p.productId)
      
      // Add product to flash sale
      const flashSale = await FlashSale.findOne({ isActive: true })
      flashSale.products.push(...products.map(p => ({
        product: p.productId,
        flashSalePrice: p.flashSalePrice
      })))
      await flashSale.save()
  
      // Update product with flash sale status and price
      await Product.findByIdAndUpdate(productIds[0], {
        isFlashSale: true,
        flashSalePrice: products[0].flashSalePrice
      })
  
      // Verify and sync product statuses
      const flashSaleProducts = await FlashSale.findOne({ isActive: true })
        .populate('products.product')
      
      const flashSaleProductIds = flashSaleProducts.products.map(p => p.product._id.toString())
      
      // Update all products to match flash sale status
      await Product.updateMany(
        { _id: { $nin: flashSaleProductIds } },
        { 
          isFlashSale: false,
          $unset: { flashSalePrice: "" }
        }
      )
  
      res.status(200).json(flashSale)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  
  export const removeProductsFromFlashSale = async (req, res) => {
    try {
      const { productIds } = req.body
      
      // Remove product reference from flash sale
      const flashSale = await FlashSale.findOne({ isActive: true })
      flashSale.products = flashSale.products.filter(
        p => !productIds.includes(p.product.toString())
      )
      await flashSale.save()
  
      // Update product status and remove flash sale price
      await Product.updateMany(
        { _id: { $in: productIds } },
        { 
          isFlashSale: false,
          $unset: { flashSalePrice: "" }
        }
      )
  
      res.status(200).json(flashSale)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

// Toggle Flash Sale Status
export const toggleFlashSaleStatus = async (req, res) => {
  try {
    const flashSale = await FlashSale.findOne();
    if (!flashSale) {
      return res.status(404).json({ message: 'No flash sale found' });
    }

    flashSale.isActive = !flashSale.isActive;
    await flashSale.save();

    res.status(200).json(flashSale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Active Flash Sale Products
export const getActiveFlashSale = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const now = new Date();
    
    const flashSale = await FlashSale.findOne({
      startTime: { $lte: now },
      endTime: { $gte: now },
      isActive: true
    }).populate('products.product');

    if (!flashSale) {
      return res.status(200).json([]);
    }

    const products = flashSale.products
      .map(p => ({
        ...p.product.toObject(),
        flashSalePrice: p.flashSalePrice
      }))
      .slice(0, limit);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFlashSalePeriod = async (req, res) => {
    try {
      const flashSale = await FlashSale.findOne({ isActive: true })
        .select('startTime endTime isActive');
      
      if (!flashSale) {
        return res.status(200).json(null);
      }
      
      res.status(200).json({
        startTime: flashSale.startTime,
        endTime: flashSale.endTime,
        isActive: flashSale.isActive
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };