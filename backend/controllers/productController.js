import Product from '../models/productModel.js';
import { deleteImages } from '../utils/cloudinary.js';

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    const products = await Product
      .find({})
      .skip(skip)
      .limit(limit)
      .populate('reviews')
      .sort({ createdAt: -1 })

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

export const cartProducts = async (req, res) => {
  try {
      const { productIds } = req.body;
      const products = await Product.find({ _id: { $in: productIds } });
      res.json({ data: products });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching products' });
  }
};


export const getFlashSaleProducts = async (req, res) => {
  try {
    let query = Product.find({ isFlashSale: true })
      .sort({ percentageOff: -1, createdAt: -1 });
    
    // Only apply limit if it's specified in the query
    if (req.query.limit) {
      const limit = parseInt(req.query.limit);
      query = query.limit(limit);
    }

    const flashSaleProducts = await query;
    res.status(200).json(flashSaleProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getBestSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20

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
        $limit: limit
      }
    ]);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    const products = await Product
      .find({ category })
      .skip(skip)
      .limit(limit)
      .populate('reviews')
      .sort({ createdAt: -1 })

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategory } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    const products = await Product
      .find({ subcategory })
      .skip(skip)
      .limit(limit)
      .populate('reviews')
      .sort({ createdAt: -1 })

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}



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

export const createProduct = async (req, res) => {
  try {
      const productData = req.body;
      
      // Ensure required fields are present
      const requiredFields = ['name', 'price', 'description', 'category', 'stock'];
      for (const field of requiredFields) {
          if (!productData[field]) {
              return res.status(400).json({ message: `Missing required field: ${field}` });
          }
      }
      
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