import express from 'express';
import { googleSignup, createUser, loginUser, verifyOTP, resendOTP, forgotPassword, verifyForgotPasswordOTP, resendForgotPasswordOTP, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/google/signup', googleSignup);
router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword)
router.post('/verify-forgot-password-otp', verifyForgotPasswordOTP)
router.post('/resend-forgot-password-otp', resendForgotPasswordOTP)
router.post('/reset-password', resetPassword)

export default router;
