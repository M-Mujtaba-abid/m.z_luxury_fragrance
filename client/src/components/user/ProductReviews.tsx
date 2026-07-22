import React, { useEffect, useState } from "react";
import { Star, ThumbsUp, X, BadgeCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useProductReviewsQuery, useMarkReviewHelpfulMutation } from "../../queries/reviewQueries";
import type { Review, RatingBreakdownRow } from "../../redux/types/reviewTypes";

interface ProductReviewsProps {
  productId: number;
}

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: RatingBreakdownRow[];
}

const StarRow: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => (
  <div className="flex text-luxury-gold">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < Math.round(rating) ? "currentColor" : "none"}
        className={i < Math.round(rating) ? "" : "text-luxury-cream/20"}
      />
    ))}
  </div>
);

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<Review[]>([]);
  // Kept separate from the live per-page query result so summary stats
  // (and the already-loaded list) stay visible while a later page is
  // still fetching in the background — averageRating/totalReviews/
  // ratingBreakdown are identical across pages anyway.
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { data: pageResult } = useProductReviewsQuery(productId, page, 10);
  const markHelpfulMutation = useMarkReviewHelpfulMutation();

  useEffect(() => {
    setPage(1);
    setAccumulated([]);
    setSummary(null);
  }, [productId]);

  useEffect(() => {
    if (!pageResult) return;
    setSummary({
      averageRating: pageResult.averageRating,
      totalReviews: pageResult.totalReviews,
      ratingBreakdown: pageResult.ratingBreakdown,
    });
    setAccumulated((prev) => (page === 1 ? pageResult.reviews : [...prev, ...pageResult.reviews]));
  }, [pageResult, page]);

  const handleLoadMore = () => {
    setPage((p) => p + 1);
  };

  const handleHelpful = (reviewId: number) => {
    markHelpfulMutation.mutate(reviewId, {
      onSuccess: (result) => {
        setAccumulated((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: result.helpfulCount } : r))
        );
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Please login to mark this helpful");
      },
    });
  };

  if (!summary) return null;

  const { averageRating, totalReviews, ratingBreakdown } = summary;
  const hasMore = accumulated.length < totalReviews;

  return (
    <div id="reviews" className="mt-8 bg-luxury-ink border border-luxury-gold/10 rounded-lg p-6 space-y-8 scroll-mt-24">
      <h2 className="font-logo text-2xl font-light text-luxury-cream tracking-wide">Customer Reviews</h2>

      {totalReviews === 0 ? (
        <p className="text-luxury-cream/60 text-sm">No reviews yet. Be the first to share your experience.</p>
      ) : (
        <>
          {/* Summary */}
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <span className="text-5xl font-bold text-luxury-cream">{averageRating.toFixed(1)}</span>
              <StarRow rating={averageRating} size={20} />
              <span className="text-xs text-luxury-cream/50">
                {totalReviews} review{totalReviews !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex-1 w-full space-y-1.5">
              {ratingBreakdown.map((row) => (
                <div key={row.star} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-luxury-cream/60">{row.star} star</span>
                  <div className="flex-1 h-2 rounded-full bg-luxury-elevated overflow-hidden">
                    <div
                      className="h-full bg-luxury-gold rounded-full"
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-luxury-cream/50">{row.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual reviews */}
          <div className="space-y-6 divide-y divide-luxury-gold/10">
            {accumulated.map((review) => (
              <div key={review.id} className="pt-6 first:pt-0 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-luxury-cream text-sm">
                      {review.User
                        ? `${review.User.firstName} ${review.User.lastName?.charAt(0) || ""}.`
                        : "Verified Buyer"}
                    </span>
                    <span
                      title="This reviewer purchased the product before reviewing it"
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-[10px] font-medium uppercase tracking-wide"
                    >
                      <BadgeCheck size={11} />
                      Verified Purchase
                    </span>
                    <StarRow rating={review.rating} />
                  </div>
                  <span className="text-xs text-luxury-cream/40">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {review.comment && (
                  <p className="text-sm text-luxury-cream/70 leading-relaxed">{review.comment}</p>
                )}

                {review.images?.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {review.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLightboxImage(img)}
                        className="w-16 h-16 rounded-lg overflow-hidden border border-luxury-gold/10"
                      >
                        <img src={img} alt={`review-${review.id}-${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleHelpful(review.id)}
                  className="flex items-center gap-1.5 text-xs text-luxury-cream/50 hover:text-luxury-gold transition-colors duration-300 pt-1"
                >
                  <ThumbsUp size={13} />
                  <span>Helpful ({review.helpfulCount})</span>
                </button>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2.5 border border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold/10 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
              >
                Load More Reviews
              </button>
            </div>
          )}
        </>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute right-6 top-6 p-2 rounded-full bg-luxury-ink text-luxury-cream/70 hover:text-luxury-gold"
          >
            <X size={20} />
          </button>
          <img
            src={lightboxImage}
            alt="review full"
            className="max-w-full max-h-full rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
