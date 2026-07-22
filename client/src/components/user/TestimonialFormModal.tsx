import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useSubmitTestimonialMutation } from "../../queries/testimonialQueries";

interface TestimonialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestimonialFormModal: React.FC<TestimonialFormModalProps> = ({ isOpen, onClose }) => {
  const submitMutation = useSubmitTestimonialMutation();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [thinking, setThinking] = useState("");

  const resetForm = () => {
    setName("");
    setCountry("");
    setGender("female");
    setRating(0);
    setHoverRating(0);
    setThinking("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1) {
      toast.error("Please select a star rating");
      return;
    }

    submitMutation.mutate(
      { name: name.trim(), country: country.trim(), gender, rating, thinking: thinking.trim() },
      {
        onSuccess: () => {
          toast.success("Thanks! Your testimonial will appear after review.");
          handleClose();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to submit testimonial");
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={handleClose} />

          <div
            data-lenis-prevent
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar bg-luxury-elevated border border-luxury-gold/20 rounded-3xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-300"
          >
            <button
              onClick={handleClose}
              className="absolute right-6 top-6 z-20 p-2 rounded-full bg-luxury-ink text-luxury-cream/70 hover:text-luxury-gold transition-colors duration-300"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="pr-10">
                <span className="text-[10px] tracking-widest font-bold text-luxury-gold uppercase block">
                  Share Your Thoughts
                </span>
                <h2 className="font-logo text-lg font-light text-luxury-cream tracking-wide">
                  Tell us about your experience
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs tracking-widest text-luxury-cream/50 uppercase block mb-2">
                    Name
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="w-full bg-luxury-ink border border-luxury-gold/10 rounded-xl p-3 text-sm text-luxury-cream placeholder-luxury-cream/30 focus:outline-none focus:border-luxury-gold/50 transition-colors duration-300"
                  />
                </div>
                <div>
                  <span className="text-xs tracking-widest text-luxury-cream/50 uppercase block mb-2">
                    Country
                  </span>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    placeholder="e.g. France"
                    className="w-full bg-luxury-ink border border-luxury-gold/10 rounded-xl p-3 text-sm text-luxury-cream placeholder-luxury-cream/30 focus:outline-none focus:border-luxury-gold/50 transition-colors duration-300"
                  />
                </div>
              </div>

              <div>
                <span className="text-xs tracking-widest text-luxury-cream/50 uppercase block mb-2">
                  Gender
                </span>
                <div className="flex gap-3">
                  {(["female", "male"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider border transition-colors duration-300 ${
                        gender === g
                          ? "bg-luxury-gold/10 text-luxury-gold border-luxury-gold/40"
                          : "bg-luxury-ink text-luxury-cream/60 border-luxury-gold/10 hover:text-luxury-cream"
                      }`}
                    >
                      {g === "female" ? "Female" : "Male"}
                    </button>
                  ))}
                </div>
              </div>

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
                          star <= (hoverRating || rating) ? "text-luxury-gold" : "text-luxury-cream/20"
                        }
                        fill={star <= (hoverRating || rating) ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs tracking-widest text-luxury-cream/50 uppercase block mb-2">
                  Your Thoughts
                </span>
                <textarea
                  value={thinking}
                  onChange={(e) => setThinking(e.target.value)}
                  rows={4}
                  required
                  placeholder="Share your experience with our fragrances..."
                  className="w-full bg-luxury-ink border border-luxury-gold/10 rounded-xl p-3 text-sm text-luxury-cream placeholder-luxury-cream/30 focus:outline-none focus:border-luxury-gold/50 transition-colors duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full py-3 bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink font-semibold text-xs tracking-widest uppercase rounded-lg shadow-lg transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Submit Testimonial</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TestimonialFormModal;
