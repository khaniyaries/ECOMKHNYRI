import { User } from '../models/userModel.js'
import Product from '../models/productModel.js'

export const createReview = async (req, res) => {
  try {
    const { productId } = req.params
    const { rating, title, comment, images } = req.body
    const userId = req.body.userId // Get userId from request body

    const product = await Product.findById(productId)
    
    const review = {
      userId, // This ensures userId is properly set
      rating,
      title,
      comment,
      images,
      createdAt: new Date()
    }

    product.reviews.push(review)
    
    // Update average rating
    const totalRating = product.reviews.reduce((sum, item) => sum + item.rating, 0)
    product.averageRating = totalRating / product.reviews.length
    product.totalRatings = product.reviews.length

    await product.save()

    const populatedProduct = await Product.findById(productId)
      .populate('reviews.userId', 'name photo', 'users')

    res.status(201).json({
      success: true,
      reviews: populatedProduct.reviews
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params
    
    const product = await Product.findById(productId)
    .populate('reviews.userId', 'name photo', 'users')  // Specify the model name 'users'
    .select('reviews')

    res.json({
      success: true,
      reviews: product.reviews
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const adminRespondToReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params
    const { response } = req.body

    const product = await Product.findOneAndUpdate(
      { 
        _id: productId,
        'reviews._id': reviewId 
      },
      {
        $set: {
          'reviews.$.adminResponse': {
            comment: response,
            respondedAt: new Date()
          }
        }
      },
      { new: true }
    ).populate('reviews.userId', 'name photo', 'users')

    res.json({
      success: true,
      reviews: product.reviews
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteReview = async (req, res) => {
    try {
      const { productId, reviewId } = req.params
      const userId = req.query._id
      const isAdmin = req.query.role === 'admin'
  
      const product = await Product.findById(productId)
      
      // Find review index
      const reviewIndex = product.reviews.findIndex(
        review => review._id.toString() === reviewId
      )
  
      if (reviewIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        })
      }
  
      // Check if user owns the review or is admin
      if (!isAdmin && product.reviews[reviewIndex].userId.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this review'
        })
      }
  
      // Remove review
      product.reviews.splice(reviewIndex, 1)
  
      // Update average rating
      if (product.reviews.length > 0) {
        const totalRating = product.reviews.reduce((sum, item) => sum + item.rating, 0)
        product.averageRating = totalRating / product.reviews.length
      } else {
        product.averageRating = 0
      }
      product.totalRatings = product.reviews.length
  
      await product.save()
  
      res.json({
        success: true,
        message: 'Review deleted successfully'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }
  
  export const getUserReviews = async (req, res) => {
    try {
      const userId = req.query._id
      
      const products = await Product.find({
        'reviews.userId': userId
      }).select('reviews images name category subcategory')
      
      // Extract reviews belonging to the user
      const userReviews = products.flatMap(product => {
        const reviews = product.reviews.filter(review => 
          review.userId.toString() === userId.toString()
        )
        return reviews.map(review => ({
          ...review.toObject(),
          productId: {
            _id: product._id,
            name: product.name,
            images: product.images,
            category: product.category,
            subcategory: product.subcategory
          }
        }))
      })
  
      res.json({
        success: true,
        reviews: userReviews
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }
  