import Product from '../models/productModel.js';
import { deleteImages } from '../utils/cloudinary.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFlashSaleProducts = async (req, res) => {
  try {
    const flashSaleProducts = await Product.find({ isFlashSale: true });
    res.status(200).json(flashSaleProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBestSellingProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'sales',
          localField: '_id',
          foreignField: 'product',
          as: 'sales'
        }
      },
      {
        $addFields: {
          totalSales: { $sum: '$sales.quantity' }
        }
      },
      {
        $sort: { totalSales: -1 }
      },
      {
        $limit: 10
      }
    ]);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRandomProducts = async (req, res) => {
  try {
    const { count } = req.params;
    const products = await Product.aggregate([
      { $sample: { size: parseInt(count) } }
    ]);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add these new controller functions

export const createProduct = async (req, res) => {
  try {
      const productData = req.body;
      const product = new Product(productData);
      await product.save();
      res.status(201).json(product);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
      const { id } = req.params;
      const updates = req.body;

      const product = await Product.findByIdAndUpdate(
          id, 
          updates, 
          { new: true }
      );

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json(product);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
      
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const deleteCloudinaryImages = async (req, res) => {
  try {
      const { imageUrls } = req.body;
      const publicIds = imageUrls.map(url => url.split('/').slice(-1)[0].split('.')[0]);
      console.log(imageUrls);
      console.log(publicIds);
      
      const results = await deleteImages(publicIds);
      res.status(200).json({ success: true, results });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};