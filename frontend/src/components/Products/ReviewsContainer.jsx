import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, Trash2 } from "lucide-react";
import { postReview, deleteReview } from "../../store/slices/productSlice";

const ReviewsContainer = ({ product, productReviews }) => {
  const { authUser } = useSelector((state) => state.auth);
  const { isReviewDeleting, isPostingReview } = useSelector(
    (state) => state.product,
  );
  const dispatch = useDispatch();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    dispatch(
      postReview({
        productId: product?.id,
        review: { rating: Number(rating), comment: comment.trim() },
      })
    );
    setComment("");
    setRating(5);
  };

  const handleDeleteReview = (reviewId) => {
    dispatch(deleteReview({ productId: product?.id, reviewId }));
  };

  return (
    <div>
      {authUser ? (
        <form onSubmit={handleReviewSubmit} className="mb-10 space-y-4">
          <h4 className="text-base font-semibold text-white">Leave a Review</h4>
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4, 5].map((starVal) => {
              return (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => setRating(starVal)}
                  className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-5 h-5 ${
                      starVal <= rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-500 hover:text-gray-400"
                    }`}
                  />
                </button>
              );
            })}
            <span className="text-xs text-gray-400 ml-2">
              ({rating} of 5 stars)
            </span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            required
            placeholder="Write your review..."
            className="w-full p-4 rounded-xl border border-[#1b2b48] bg-[#070e1b] text-white placeholder-gray-500 focus:outline-none focus:border-[#0080FF] transition-all resize-y min-h-[90px]"
          />
          <button
            type="submit"
            disabled={isPostingReview || !comment.trim()}
            className="px-6 py-2.5 rounded-xl bg-[#0080FF] hover:bg-[#0070e0] text-white font-medium transition-all shadow-md disabled:opacity-50"
          >
            {isPostingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 rounded-xl bg-[#070e1b] border border-[#1b2b48] text-sm text-gray-400">
          Please log in to submit a review for this product.
        </div>
      )}

      <h3 className="text-lg font-semibold text-white mb-6">Customer Reviews</h3>
      {productReviews && productReviews.length > 0 ? (
        <div className="space-y-4">
          {productReviews.map((review) => {
            const reviewerRating = Number(review?.rating) || 0;
            const reviewerId = review?.reviewer?.id || review?.user_id || review?.userId;
            const isOwnReview = String(authUser?.id || "") === String(reviewerId || "");
            return (
              <div
                key={review.review_id || review.id}
                className="p-5 rounded-xl bg-[#070e1b]/80 border border-[#1b2b48]"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={review.reviewer?.avatar?.url || "/avatar-holder.avif"}
                    alt={review?.reviewer?.name || "Reviewer"}
                    className="w-10 h-10 rounded-full object-cover bg-secondary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white text-sm">
                        {review?.reviewer?.name || "Verified Buyer"}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < reviewerRating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mt-2">
                      {review.comment}
                    </p>

                    {isOwnReview && (
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(review.review_id || review.id)}
                        disabled={isReviewDeleting}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-rose-400/30 px-2.5 py-1.5 text-xs font-medium text-rose-400 transition-colors hover:border-rose-400/60 hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Delete your review"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {isReviewDeleting ? "Deleting..." : "Delete Review"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">
          No reviews yet. Be the first one to review this product!
        </p>
      )}
    </div>
  );
};

export default ReviewsContainer;
