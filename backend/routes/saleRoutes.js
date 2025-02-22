import express from 'express';
import {
  createSale,
  getAllSales,
  getSaleById,
  getUserOrders,
  updateSaleStatus,
  getDashboardStats,
  viewInvoice,
  downloadInvoice
} from '../controllers/saleController.js';

const router = express.Router();

router.post('/sales', createSale);
router.get('/sales', getAllSales);
router.patch('/sales/:id/status', updateSaleStatus);
router.get('/dashboard/stats', getDashboardStats);
router.get('/user/:userId/orders', getUserOrders);

router.get('/sales/:id', getSaleById)
router.get('/invoice/:id/view', viewInvoice)
router.get('/invoice/:id/download', downloadInvoice)



export default router;
