import React from "react";
import { motion } from "framer-motion";
import { Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useAdminAllReviewsQuery,
  useAdminDeleteReviewMutation,
} from "../../../queries/reviewQueries";

const ReviewDirectory: React.FC = () => {
  const { data: adminReviews = [], isLoading } = useAdminAllReviewsQuery();
  const deleteMutation = useAdminDeleteReviewMutation();

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Review deleted successfully");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to delete review");
      },
    });
  };

  return (
    <div className="min-h-screen bg-luxury-ink">
      <div className="bg-luxury-card border border-luxury-gold/10 rounded-xl shadow-md p-6">
        <h1 className="font-logo text-3xl font-bold text-luxury-cream mb-6">Review Management</h1>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 rounded-full border-2 border-luxury-gold/20 border-t-luxury-gold animate-spin" />
          </div>
        )}

        {!isLoading && adminReviews.length === 0 && (
          <p className="text-luxury-cream/50 text-center py-10">No reviews found.</p>
        )}

        {!isLoading && adminReviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-x-auto rounded-lg border border-luxury-gold/10"
          >
            <table className="min-w-full">
              <thead className="bg-luxury-elevated">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60 hidden md:table-cell">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60 hidden lg:table-cell">
                    Comment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60 hidden md:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-gold/10">
                {adminReviews.map((review) => (
                  <tr key={review.id} className="bg-luxury-card hover:bg-luxury-gold/5 transition-colors duration-300">
                    <td className="px-4 py-3 text-luxury-cream/80 max-w-[160px] truncate">
                      {review.Product?.title || `Product #${review.productId}`}
                    </td>
                    <td className="px-4 py-3 text-luxury-cream/60 hidden md:table-cell">
                      {review.User ? `${review.User.firstName} ${review.User.lastName}` : `User #${review.userId}`}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-luxury-gold">
                        <Star size={13} fill="currentColor" className="stroke-none" />
                        <span className="text-luxury-cream text-sm font-medium">{review.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-luxury-cream/60 hidden lg:table-cell max-w-[240px] truncate">
                      {review.comment || "—"}
                    </td>
                    <td className="px-4 py-3 text-luxury-cream/50 hidden md:table-cell">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={deleteMutation.isPending && deleteMutation.variables === review.id}
                        className="flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-500/20 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReviewDirectory;
