import express from 'express'
import { getUsers, updateUser, getCustomers, getCustomerDetails } from '../controllers/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/profile', authMiddleware, getUsers)
router.put('/profile/update/:targetUserId?', authMiddleware, updateUser)
// Add these routes to userRoutes.js

router.get('/customers', authMiddleware, getCustomers);
router.get('/customers/:id', authMiddleware, getCustomerDetails);


export default router
