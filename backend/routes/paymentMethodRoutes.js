import express from 'express';
import { getAllPaymentMethods, addPaymentMethod, deletePaymentMethod } from '../controllers/paymentMethodController.js';

const router = express.Router();

router.get('/payment-methods', getAllPaymentMethods);
router.post('/payment-method', addPaymentMethod);
router.delete('/payment-method/:id', deletePaymentMethod);

export default router;
