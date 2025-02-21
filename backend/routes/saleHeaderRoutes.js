import express from 'express';
import { getCurrentSaleHeader, updateSaleHeader } from '../controllers/saleHeaderController.js';

const router = express.Router();

router.get('/current', getCurrentSaleHeader);
router.post('/update', updateSaleHeader);

export default router;
