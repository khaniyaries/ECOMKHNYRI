import express from 'express';
import { googleSignup, createUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/google/signup', googleSignup);
router.post('/signup', createUser);
router.post('/login', loginUser);

export default router;
