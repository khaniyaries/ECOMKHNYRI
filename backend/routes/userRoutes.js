import express from 'express'
import { getUsers, updateUser } from '../controllers/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/profile', authMiddleware, getUsers)
router.put('/profile/update/:targetUserId?', authMiddleware, updateUser)

export default router
