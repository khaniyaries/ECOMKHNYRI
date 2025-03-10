import express from 'express';
import multer from 'multer';

import {
  getAllProducts,
  cartProducts,
  getFlashSaleProducts,
  getBestSellingProducts,
  getProductsByCategory,
  getProductsBySubcategory,
  getRandomProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addOrUpdateRating,
  getProductRatings,
  deleteCloudinaryImages
} from '../controllers/productController.js';
import { addbanner, getAllBanners, updateBanner, reorderBanners, deleteBanner } from '../controllers/bannerController.js';

const router = express.Router();

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Existing routes
router.get('/products', getAllProducts);
router.get('/products/flash-sale', getFlashSaleProducts);
router.get('/products/best-selling', getBestSellingProducts);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/subcategory/:subcategory', getProductsBySubcategory);
router.get('/products/random/:count', getRandomProducts);
router.get('/products/:id', getProductById);
router.post('/products/bulk', cartProducts);

router.post('/products/:productId/rating', addOrUpdateRating);
router.get('/products/:productId/ratings', getProductRatings);


// New routes with file upload handling
router.post('/products', upload.array('images'), createProduct);
router.post('/delete-images', deleteCloudinaryImages);
router.put('/products/:id', upload.array('images'), updateProduct);
router.delete('/products/:id', deleteProduct);

router.post('/banners', addbanner)
router.get('/banners', getAllBanners)
router.put('/banners', updateBanner)
router.post("/banners/reorder", reorderBanners)
router.delete('/banners/:index', deleteBanner)

export default router;
