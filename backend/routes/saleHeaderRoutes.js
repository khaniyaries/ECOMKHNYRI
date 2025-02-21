import express from 'express';
import { getCurrentSaleHeader, updateSaleHeader, getInactive, setActive, deleteHeader } from '../controllers/saleHeaderController.js';

const router = express.Router();

router.get('/current', getCurrentSaleHeader);
router.post('/update', updateSaleHeader);
router.get('/inactive', getInactive);
router.put('/setActive/:id', setActive);
router.delete('/:id', deleteHeader);

export default router;
