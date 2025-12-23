'use client'

import { useState, useEffect } from 'react'
import { Star, Trash2, Send, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/supabase'
import { haptics } from '@/lib/haptics'
import Link from 'next/link'

interface Review {
  id: string
  user_id: string
  user_name: string
  user_email: string
  rating: number
  comment: string
  created_at: string
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  
  // Safely get auth - will be default values until mounted
  let user = null
  let isAuthenticated = false
  
  try {
    const auth = useAuth()
    user = auth.user
    isAuthenticated = auth.isAuthenticated
  } catch (e) {
    // Auth not available yet
  }

  useEffect(() => {
    setMounted(true)
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setIsLoading(true)
      const data = await db.reviews.getAll()
      setReviews(data)
    } catch (err) {
      console.error('Failed to load reviews:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated || !user) {
      setError('Please sign in to submit a review')
      haptics.error()
      return
    }

    if (!newReview.comment.trim()) {
      setError('Please write a comment')
      haptics.error()
      return
    }

    setIsSubmitting(true)
    setError('')
    haptics.tap()

    try {
      const review = {
        user_id: user.id,
        user_name: user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous',
        user_email: user.email || '',
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const savedReview = await db.reviews.create(review)
      setReviews([savedReview, ...reviews])
      setNewReview({ rating: 5, comment: '' })
      haptics.success()
    } catch (err: any) {
      console.error('Failed to submit review:', err)
      setError(err.message || 'Failed to submit review. Please try again.')
      haptics.error()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (reviewId: string, reviewUserId: string) => {
    if (!isAuthenticated || !user) {
      setError('Please sign in to delete reviews')
      haptics.error()
      return
    }

    // Only allow users to delete their own reviews
    if (user.id !== reviewUserId) {
      setError('You can only delete your own reviews')
      haptics.error()
      return
    }

    if (!confirm('Are you sure you want to delete this review?')) return

    haptics.delete()

    try {
      await db.reviews.delete(reviewId)
      setReviews(reviews.filter(r => r.id !== reviewId))
      haptics.success()
    } catch (err: any) {
      console.error('Failed to delete review:', err)
      setError(err.message || 'Failed to delete review')
      haptics.error()
    }
  }

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => {
              haptics.tap()
              setNewReview({ ...newReview, rating: star })
            } : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            disabled={!interactive}
          >
            <Star
              size={interactive ? 28 : 20}
              className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
            />
          </button>
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-8">
        <div className="card">
          <div className="text-center py-8">
            <div className="spinner inline-block w-10 h-10 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Submit Review Form */}
      <div className="card list-item">
        <h3 className="text-2xl font-bold mb-6 text-strong-contrast flex items-center gap-2">
          <Send size={28} />
          Share Your Experience
        </h3>

        {!isAuthenticated ? (
          <div className="p-6 rounded-xl bg-blue-500 bg-opacity-10 border border-blue-400 border-opacity-30 text-center">
            <AlertCircle className="mx-auto mb-3 text-blue-400" size={40} />
            <p className="text-lg font-semibold text-strong-contrast mb-4">
              Sign in to leave a review
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/signin"
                className="btn-primary px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="btn-secondary px-6 py-2 bg-white bg-opacity-10 text-white rounded-lg font-bold hover:bg-opacity-20 transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500 bg-opacity-20 border border-red-400 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Rating */}
            <div>
              <label className="block text-sm font-bold mb-3 text-strong-contrast">
                Your Rating
              </label>
              {renderStars(newReview.rating, true)}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-bold mb-3 text-strong-contrast">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Tell us what you think about the app..."
                className="input-field w-full h-32 p-4 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-20 focus:border-opacity-40 outline-none resize-none text-white placeholder-gray-300"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                  Submitting...
                </span>
              ) : 'Submit Review'}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="card list-item">
        <h3 className="text-2xl font-bold mb-6 text-strong-contrast">
          User Reviews ({reviews.length})
        </h3>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="spinner inline-block w-10 h-10 border-4 border-white border-t-transparent rounded-full"></div>
            <p className="mt-4 text-glass">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-glass text-lg">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="list-item p-6 rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 hover:bg-opacity-15 transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-lg text-strong-contrast">{review.user_name}</p>
                    <p className="text-sm text-glass">{formatDate(review.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {renderStars(review.rating)}
                    {isAuthenticated && user && user.id === review.user_id && (
                      <button
                        onClick={() => handleDelete(review.id, review.user_id)}
                        className="p-2 rounded-lg bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-red-400 hover:text-red-300 transition-all"
                        title="Delete your review"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-glass leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
