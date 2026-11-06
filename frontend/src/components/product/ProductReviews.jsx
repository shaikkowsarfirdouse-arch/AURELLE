import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShieldCheck, Check, MessageSquare } from 'lucide-react';
import { reviewsAPI } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function ProductReviews({ productId, productName }) {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ error: '', success: '' });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewsAPI.getProductReviews(productId);
      if (res.data?.success) {
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ error: '', success: '' });

    if (!rating || !title.trim() || !comment.trim()) {
      setFeedback({ error: 'Please provide rating, title, and comments.', success: '' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await reviewsAPI.createReview(productId, { rating, title, comment });
      if (res.data?.success) {
        setFeedback({ success: 'Thank you! Your review has been submitted successfully.', error: '' });
        setTitle('');
        setComment('');
        setRating(5);
        setShowForm(false);
        fetchReviews();
      }
    } catch (err) {
      setFeedback({
        error: err.response?.data?.message || 'Failed to submit review',
        success: '',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-8">
      {/* Header & Overall Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-champagne-200 gap-4">
        <div>
          <h3 className="font-serif text-2xl text-noir-900">Customer Reviews</h3>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex text-gold-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(Number(avgRating))
                      ? 'fill-gold-500 text-gold-500'
                      : 'text-champagne-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-serif text-lg font-medium text-noir-900">{avgRating} out of 5</span>
            <span className="text-xs text-noir-500 font-light">({reviews.length} customer reviews)</span>
          </div>
        </div>

        <div>
          {isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-2.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors cursor-pointer"
            >
              {showForm ? 'Cancel Review' : 'Write a Review'}
            </motion.button>
          ) : (
            <p className="text-xs text-noir-500">
              <a href="/login" className="text-gold-700 underline font-medium">
                Sign in
              </a>{' '}
              to share your review for this jewellery.
            </p>
          )}
        </div>
      </div>

      {/* Review Submission Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            className="bg-ivory-100 border border-champagne-300 p-6 space-y-4 overflow-hidden"
          >
            <h4 className="font-serif text-lg text-noir-900">
              Share Your Experience with {productName}
            </h4>

            {feedback.error && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 border border-rose-200">
                {feedback.error}
              </p>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-noir-700 mb-1.5 font-medium">
                Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= rating ? 'fill-gold-500 text-gold-500' : 'text-noir-300'
                      }`}
                    />
                  </motion.button>
                ))}
                <span className="text-xs text-noir-600 ml-2 font-serif font-medium">{rating} Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-noir-700 mb-1.5 font-medium">
                Headline Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Gorgeous Kundan set, looks stunning on sarees!"
                className="w-full px-3 py-2 bg-white border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-noir-700 mb-1.5 font-medium">
                Your Review
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe the shine, weight, packaging, and comfort..."
                className="w-full px-3 py-2 bg-white border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
              />
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Submitting Review...' : 'Submit Review'}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {feedback.success && (
        <p className="text-xs text-emerald-800 bg-emerald-50 p-3 border border-emerald-200">
          {feedback.success}
        </p>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="py-8 text-center text-xs text-noir-400">Loading customer reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center bg-white border border-champagne-200 p-6">
          <MessageSquare className="w-8 h-8 text-gold-600 mx-auto mb-2 stroke-[1.2]" />
          <p className="font-serif text-lg text-noir-800">Be the first to review this jewellery</p>
          <p className="text-xs text-noir-500 mt-1">
            Share your experience with this beautiful handcrafted piece.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="bg-white border border-champagne-200 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm font-semibold text-noir-900">
                    {rev.userName || 'Aurelle Customer'}
                  </span>
                  {rev.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-none font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Buyer
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-noir-400">
                  {new Date(rev.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex text-gold-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= rev.rating ? 'fill-gold-500 text-gold-500' : 'text-champagne-300'
                    }`}
                  />
                ))}
              </div>

              <h5 className="font-serif text-base font-medium text-noir-900 pt-1">{rev.title}</h5>
              <p className="text-xs text-noir-600 leading-relaxed font-light">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

