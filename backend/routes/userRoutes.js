import express from 'express'
import { getUsers, updateUser, getCustomers, getCustomerDetails } from '../controllers/userController.js'

const router = express.Router()

router.get('/profile', getUsers)
router.put('/profile/update/:targetUserId?', updateUser)
// Add these routes to userRoutes.js

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerDetails);


export default router
