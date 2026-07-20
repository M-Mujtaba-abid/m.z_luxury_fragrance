import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { X, Star, ImagePlus, Trash2 } from "lucide-react";
import { useSubmitReviewMutation } from "../../queries/reviewQueries";
import toast from "react-hot-toast";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  productId: number;
  productTitle: string;
  productImage: string;
}

const MAX_IMAGES = 5;

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  orderId,
  productId,
  productTitle,
  productImage,
}) => {
  const submitReviewMutation = useSubmitReviewMutation();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
    setImages([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files].slice(0, MAX_IMAGES));
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating < 1) {
      toast.error("Please select a star rating");
      return;
    }

    submitReviewMutation.mutate(
      { orderId, productId, rating, comment: comment.trim() || undefined, images },
      {
        onSuccess: () => {
          toast.success("Thank you! Your review is now live.");
          resetForm();
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to submit review");
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={handleClose} />

          {/* Container */}
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-luxury-elevated border border-luxury-gold/20 rounded-3xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-300">
            <button
              onClick={handleClose}
              className="absolute right-6 top-6 z-20 p-2 rounded-full bg-luxury-ink text-luxury-cream/70 hover:text-luxury-gold transition-colors duration-300"
            >
              <X size={18} />
            </button>

            <div className="p-6 md:p-8 space-y-6">
              {/* Product header */}
              <div className="flex items-center gap-4 pr-10">
                <img
                  src={productImage}
                  alt={productTitle}
                  className="w-14 h-14 object-cover rounded-xl border border-luxury-gold/10"
                />
                <div>
                  <span className="text-[10px] tracking-widest font-bold text-luxury-gold uppercase block">
                    Write a Review
                  </span>
                  <h2 className="font-logo text-lg font-light text-luxury-cream tracking-wide">
                    {productTitle}
                  </h2>
                </div>
              </div>

              {/* Star rating */}
              <div>
                <span className="text-xs tracking-widest text-luxury-cream/50 uppercase block mb-2">
                  Your Rating
                </span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5"
                    >
                      <Star
                        size={28}
                        className={
                          star <= (hoverRating || rating)
                            ? "text-luxury-gold"
                            : "text-luxury-cream/20"
                        }
                        fill={star <= (hoverRating || rating) ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <span className="text-xs tracking-widest text-luxury-cream/50 uppercase block mb-2">
                  Your Review (optional)
                </span>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Share your experience with this fragrance..."
                  className="w-full bg-luxury-ink border border-luxury-gold/10 rounded-xl p-3 text-sm text-luxury-cream placeholder-luxury-cream/30 focus:outline-none focus:border-luxury-gold/50 transition-colors duration-300 resize-none"
                />
              </div>

              {/* Image upload */}
              <div>
                <span className="text-xs tracking-widest text-luxury-cream/50 uppercase block mb-2">
                  Add Photos (optional)
                </span>
                <div className="flex flex-wrap gap-3">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-luxury-gold/10 group"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`upload-${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
                      >
                        <Trash2 size={16} className="text-luxury-cream" />
                      </button>
                    </div>
                  ))}

                  {images.length < MAX_IMAGES && (
                    <label className="w-16 h-16 rounded-lg border border-dashed border-luxury-gold/30 flex items-center justify-center cursor-pointer hover:border-luxury-gold/60 transition-colors duration-300">
                      <ImagePlus size={18} className="text-luxury-cream/50" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitReviewMutation.isPending}
                className="w-full py-3 bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink font-semibold text-xs tracking-widest uppercase rounded-lg shadow-lg transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitReviewMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewFormModal;
