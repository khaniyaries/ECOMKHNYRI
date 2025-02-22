import express from 'express'
import { getAnalytics, getCustomDateAnalytics } from '../controllers/analyticsController.js'

const router = express.Router()

router.get('/analytics', getAnalytics)
router.get('/analytics/custom', getCustomDateAnalytics)

export default router
