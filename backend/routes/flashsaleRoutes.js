import express from 'express';
import {
  setFlashSalePeriod,
  addProductsToFlashSale,
  removeProductsFromFlashSale,
  toggleFlashSaleStatus,
  getActiveFlashSale,
  getFlashSalePeriod
} from '../controllers/flashSalesController.js';

const router = express.Router();

router.post('/period', setFlashSalePeriod);
router.post('/products', addProductsToFlashSale);
router.delete('/products', removeProductsFromFlashSale);
router.patch('/toggle', toggleFlashSaleStatus);
router.get('/active', getActiveFlashSale);
router.get('/period', getFlashSalePeriod);


export default router;