import express from 'express'
import { createReview, getProductReviews, adminRespondToReview, deleteReview, getUserReviews } from '../controllers/reviewContoller.js'

const router = express.Router()

router.post('/products/:productId/reviews', createReview)
router.get('/products/:productId/reviews', getProductReviews)
router.post('/products/:productId/reviews/:reviewId/respond', adminRespondToReview)
router.delete('/products/:productId/reviews/:reviewId', deleteReview)
router.get('/user/reviews', getUserReviews)

export default router;
