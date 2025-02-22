import express from 'express'
import { getAnalytics, getCustomDateAnalytics } from '../controllers/analyticsController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/analytics', authMiddleware, getAnalytics)
router.get('/analytics/custom', authMiddleware, getCustomDateAnalytics)

export default router
