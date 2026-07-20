import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Star, Check, EyeOff, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useAdminTestimonialsQuery,
  useAdminApproveTestimonialMutation,
  useAdminEditTestimonialMutation,
  useAdminDeleteTestimonialMutation,
  type Testimonial,
} from "../../../queries/testimonialQueries";

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${isActive
        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
      }`}
  >
    {isActive ? "approved" : "pending"}
  </span>
);

const EditTestimonialModal = ({
  testimonial,
  onClose,
}: {
  testimonial: Testimonial;
  onClose: () => void;
}) => {
  const [name, setName] = useState(testimonial.name);
  const [country, setCountry] = useState(testimonial.country);
  const [gender, setGender] = useState<"male" | "female">(testimonial.gender);
  const [rating, setRating] = useState(testimonial.rating);
  const [thinking, setThinking] = useState(testimonial.thinking);
  const editMutation = useAdminEditTestimonialMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !country.trim() || !thinking.trim()) {
      toast.error("Name, country and message are required");
      return;
    }

    editMutation.mutate(
      { id: testimonial.id, name: name.trim(), country: country.trim(), gender, rating, thinking: thinking.trim() },
      {
        onSuccess: () => {
          toast.success("Testimonial updated successfully");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to update testimonial");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-luxury-elevated border border-luxury-gold/20 rounded-2xl shadow-2xl p-6 z-10"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-luxury-cream/60 hover:text-luxury-gold transition-colors duration-300"
        >
          <X size={18} />
        </button>

        <h3 className="font-logo text-xl font-light text-luxury-cream mb-4">Edit Testimonial</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-widest text-luxury-cream/50 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 focus:border-luxury-gold-bright/60"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-luxury-cream/50 mb-1.5">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 focus:border-luxury-gold-bright/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-luxury-cream/50 mb-1.5">
              Gender
            </label>
            <div className="flex gap-3">
              {(["female", "male"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider border transition-colors duration-300 ${gender === g
                      ? "bg-luxury-gold/10 text-luxury-gold border-luxury-gold/40"
                      : "bg-luxury-ink text-luxury-cream/60 border-luxury-gold/10"
                    }`}
                >
                  {g === "female" ? "Female" : "Male"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-luxury-cream/50 mb-1.5">
              Rating
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="p-0.5">
                  <Star
                    size={22}
                    className={star <= rating ? "text-luxury-gold" : "text-luxury-cream/20"}
                    fill={star <= rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-luxury-cream/50 mb-1.5">
              Message
            </label>
            <textarea
              value={thinking}
              onChange={(e) => setThinking(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-3 rounded-xl border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 resize-none focus:border-luxury-gold-bright/60"
            />
          </div>

          <button
            type="submit"
            disabled={editMutation.isPending}
            className="w-full bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
          >
            {editMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const TestimonialDirectory = () => {
  const { data: testimonials, isLoading, isError } = useAdminTestimonialsQuery();
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const approveMutation = useAdminApproveTestimonialMutation();
  const deleteMutation = useAdminDeleteTestimonialMutation();

  const handleToggleStatus = (testimonial: Testimonial) => {
    approveMutation.mutate(
      { id: testimonial.id, isActive: !testimonial.isActive },
      {
        onSuccess: () => toast.success(testimonial.isActive ? "Testimonial unapproved" : "Testimonial approved"),
        onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to update status"),
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Testimonial deleted successfully"),
      onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to delete testimonial"),
    });
  };

  return (
    <div className="min-h-screen bg-luxury-ink">
      <div className="bg-luxury-card border border-luxury-gold/10 rounded-xl shadow-md p-6">
        <h1 className="font-logo text-3xl font-bold text-luxury-cream mb-6">
          Testimonial Management
        </h1>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 rounded-full border-2 border-luxury-gold/20 border-t-luxury-gold animate-spin" />
          </div>
        )}

        {isError && <p className="text-red-400 text-center py-10">Failed to load testimonials.</p>}

        {!isLoading && !isError && testimonials?.length === 0 && (
          <p className="text-luxury-cream/50 text-center py-10">No testimonials found.</p>
        )}

        {!isLoading && !isError && !!testimonials?.length && (
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
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60 hidden md:table-cell">
                    Country
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-gold/10">
                {testimonials.map((testimonial) => (
                  <tr
                    key={testimonial.id}
                    className="bg-luxury-card hover:bg-luxury-gold/5 transition-colors duration-300"
                  >
                    <td className="px-4 py-3 text-luxury-cream/80 max-w-[140px] truncate">
                      {testimonial.name}
                    </td>
                    <td className="px-4 py-3 text-luxury-cream/60 hidden md:table-cell">
                      {testimonial.country}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex text-luxury-gold gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" className="stroke-none" />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-luxury-cream/80 max-w-[220px] truncate">
                      {testimonial.thinking}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge isActive={testimonial.isActive} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingTestimonial(testimonial)}
                          className="flex items-center gap-1.5 bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-luxury-gold/20 transition-colors duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(testimonial)}
                          disabled={approveMutation.isPending}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors duration-300 disabled:opacity-60 ${testimonial.isActive
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            }`}
                        >
                          {testimonial.isActive ? <EyeOff size={13} /> : <Check size={13} />}
                          {testimonial.isActive ? "Unapprove" : "Approve"}
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          disabled={deleteMutation.isPending}
                          className="flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-500/20 transition-colors duration-300 disabled:opacity-60"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {editingTestimonial && (
          <EditTestimonialModal
            testimonial={editingTestimonial}
            onClose={() => setEditingTestimonial(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestimonialDirectory;
