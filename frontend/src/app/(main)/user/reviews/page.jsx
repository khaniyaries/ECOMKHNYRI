"use client"
import { useState, useEffect } from 'react'
import { Star, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/userAuth'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { env } from '../../../../../config/config.js'

export default function UserReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchUserReviews()
    }
  }, [user])

  const fetchUserReviews = async () => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/user/reviews?_id=${localStorage.getItem('userId')}`)
      const data = await response.json()
      setReviews(data.reviews)
      setLoading(false)
    } catch (error) {
      toast.error('Error fetching reviews')
      setLoading(false)
    }
  }

  const handleDeleteReview = async (productId, reviewId) => {
    try {
      const response = await fetch(
        `${env.API_URL}/api/v1/products/${productId}/reviews/${reviewId}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        toast.success('Review deleted successfully')
        fetchUserReviews()
      }
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">You haven't written any reviews yet.</p>
          <Link 
            href="/products" 
            className="text-primary hover:underline"
          >
            Browse products to review
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <Link 
                  href={`/products/${review.productId.category}/${review.productId.subcategory}/${review.productId._id}`}
                  className="flex items-center gap-4 hover:opacity-80"
                >
                  <img
                    src={review.productId.images[0]?.url}
                    alt={review.productId.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{review.productId.name}</h3>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-400" : "fill-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                
                <button
                  onClick={() => handleDeleteReview(review.productId._id, review._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4">
                <h4 className="font-medium">{review.title}</h4>
                <p className="text-gray-600 mt-2">{review.comment}</p>
              </div>

              {review.images?.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Review image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              {review.adminResponse && (
                <div className="mt-4 bg-gray-50 p-4 rounded">
                  <p className="font-medium text-primary">Admin Response:</p>
                  <p className="mt-1">{review.adminResponse.comment}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(review.adminResponse.respondedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
