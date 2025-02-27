import express from 'express'
import { getUsers, updateUser, getCustomers, getCustomerDetails,deletecustomers } from '../controllers/userController.js'

const router = express.Router()

router.get('/profile', getUsers)
router.put('/profile/update/:targetUserId?', updateUser)
// Add these routes to userRoutes.js

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerDetails);
router.delete('/customers/:id',deletecustomers);



export default router
