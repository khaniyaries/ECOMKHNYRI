import express from 'express';
import { addressController } from '../controllers/addressController.js';

const router = express.Router();

router.get('/', addressController.getAddresses);
router.post('/', addressController.createAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);
router.put('/:id/default', addressController.setDefaultAddress);

export default router;
