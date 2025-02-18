import express from 'express';
import { adminLogin } from '../controllers/adminLoginController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.route('/adminLogin').post(adminLogin);

export default router;
