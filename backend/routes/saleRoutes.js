import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
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

router.post('/sales', authMiddleware, createSale);
router.get('/sales', authMiddleware, getAllSales);
router.patch('/sales/:id/status', authMiddleware, updateSaleStatus);
router.get('/dashboard/stats', authMiddleware, getDashboardStats);
router.get('/user/:userId/orders', getUserOrders);

router.get('/sales/:id', authMiddleware, getSaleById)
router.get('/invoice/:id/view', authMiddleware, viewInvoice)
router.get('/invoice/:id/download', authMiddleware, downloadInvoice)



export default router;
