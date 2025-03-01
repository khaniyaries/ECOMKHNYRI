import express from 'express';
import {
  createSale,
  getAllSales,
  getSaleById,
  getUserOrders,
  updateSaleStatus,
  getDashboardStats,
  viewInvoice,
  downloadInvoice,
  getReturns,
  getCancellations,
  cancelOrder
} from '../controllers/saleController.js';

const router = express.Router();

router.post('/', createSale);
router.get('/', getAllSales);
router.patch('/:id/status', updateSaleStatus);
router.get('/dashboard/stats', getDashboardStats);
router.get('/user/:userId/orders', getUserOrders);
router.post('/:orderId/cancel', cancelOrder);

router.get('/:id', getSaleById);
router.get('/invoice/:id/view', viewInvoice);
router.get('/invoice/:id/download', downloadInvoice);

router.get('/getreturns',getReturns);
router.get('/getcancellations', getCancellations);


export default router;
