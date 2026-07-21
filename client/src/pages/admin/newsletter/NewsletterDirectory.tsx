import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Users, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import RichTextEditor from "../../../components/admin/product-form/RichTextEditor";
import { useProductsQuery } from "../../../queries/productQueries";
import {
  useAdminSubscribersQuery,
  useSendNewsletterMutation,
  type Subscriber,
} from "../../../queries/newsletterQueries";

const SubscribersModal = ({
  subscribers,
  onClose,
}: {
  subscribers: Subscriber[];
  onClose: () => void;
}) => (
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

      <h3 className="font-logo text-xl font-light text-luxury-cream mb-4">
        Subscribers ({subscribers.length})
      </h3>

      {subscribers.length === 0 ? (
        <p className="text-sm text-luxury-cream/50 py-6 text-center">No subscribers yet.</p>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto rounded-xl border border-luxury-gold/10">
          <table className="min-w-full">
            <thead className="bg-luxury-ink sticky top-0">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                  Email
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                  Subscribed On
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-gold/10">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="bg-luxury-card">
                  <td className="px-4 py-2.5 text-sm text-luxury-cream/80 max-w-[200px] truncate">
                    {subscriber.email}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-luxury-cream/60 whitespace-nowrap">
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        subscriber.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-luxury-cream/10 text-luxury-cream/50 border border-luxury-cream/20"
                      }`}
                    >
                      {subscriber.isActive ? "active" : "unsubscribed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  </div>
);

const NewsletterDirectory = () => {
  const { data: subscribersData, isLoading: isLoadingSubscribers } = useAdminSubscribersQuery();
  const { data: products = [], isLoading: isLoadingProducts } = useProductsQuery();
  const sendMutation = useSendNewsletterMutation();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  // Bumped on every successful send to force RichTextEditor to remount -
  // it only syncs its contentEditable DOM from `value` once on mount (see
  // that component), so clearing `message` alone wouldn't clear the editor.
  const [formVersion, setFormVersion] = useState(0);
  const [isSubscribersModalOpen, setIsSubscribersModalOpen] = useState(false);

  const activeCount = subscribersData?.activeCount ?? 0;

  const toggleProduct = (id: number) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setSubject("");
    setMessage("");
    setSelectedProductIds([]);
    setFormVersion((v) => v + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    if (activeCount === 0) {
      toast.error("There are no active subscribers to send to");
      return;
    }
    if (
      !window.confirm(
        `Send this newsletter to ${activeCount} subscriber${activeCount === 1 ? "" : "s"}? This cannot be undone.`
      )
    ) {
      return;
    }

    sendMutation.mutate(
      { subject: subject.trim(), message, productIds: selectedProductIds },
      {
        onSuccess: (result) => {
          toast.success(
            `Newsletter sent to ${result.sentCount}/${result.total} subscribers` +
              (result.failedCount ? ` (${result.failedCount} failed)` : "")
          );
          resetForm();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to send newsletter");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-luxury-ink">
      <div className="bg-luxury-card border border-luxury-gold/10 rounded-xl shadow-md p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="font-logo text-3xl font-bold text-luxury-cream">Newsletter</h1>
          <button
            type="button"
            onClick={() => setIsSubscribersModalOpen(true)}
            disabled={isLoadingSubscribers}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold text-sm font-medium hover:bg-luxury-gold/20 transition-colors duration-300 disabled:opacity-60 disabled:cursor-wait"
          >
            <Users size={15} />
            {isLoadingSubscribers ? "Loading..." : `${activeCount} active subscriber${activeCount === 1 ? "" : "s"}`}
            {!isLoadingSubscribers && subscribersData && subscribersData.total !== activeCount && (
              <span className="text-luxury-cream/40 font-normal">
                ({subscribersData.total} total)
              </span>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
          <div>
            <label className="block text-xs uppercase tracking-widest text-luxury-cream/50 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="e.g. New Arrivals - Winter Collection"
              className="w-full px-4 py-3 rounded-xl border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-luxury-cream/50 mb-1.5">
              Message
            </label>
            <RichTextEditor
              key={formVersion}
              value={message}
              onChange={setMessage}
              placeholder="Write your newsletter message here..."
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-luxury-cream/50 mb-1.5">
              Feature Products <span className="text-luxury-cream/30 normal-case">(optional)</span>
            </label>

            {isLoadingProducts ? (
              <p className="text-sm text-luxury-cream/50 py-4">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-luxury-cream/50 py-4">No published products available.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto rounded-xl border border-luxury-gold/10 divide-y divide-luxury-gold/10">
                {products.map((product) => {
                  const isSelected = selectedProductIds.includes(product.id);
                  return (
                    <button
                      type="button"
                      key={product.id}
                      onClick={() => toggleProduct(product.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-luxury-gold/5 transition-colors duration-300 text-left"
                    >
                      <span
                        className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors duration-300 ${
                          isSelected
                            ? "bg-luxury-gold border-luxury-gold text-luxury-ink"
                            : "border-luxury-gold/30 text-transparent"
                        }`}
                      >
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <img
                        src={product.productImage}
                        alt={product.title}
                        className="w-9 h-9 object-cover rounded-md border border-luxury-gold/10 flex-shrink-0"
                      />
                      <span className="flex-1 min-w-0 truncate text-sm text-luxury-cream/80">
                        {product.title}
                      </span>
                      <span className="text-xs text-luxury-cream/50 whitespace-nowrap">
                        PKR {product.discountPrice && product.isOnSale ? product.discountPrice : product.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            {selectedProductIds.length > 0 && (
              <p className="text-xs text-luxury-cream/50 mt-1.5">
                {selectedProductIds.length} product{selectedProductIds.length === 1 ? "" : "s"} selected
              </p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={sendMutation.isPending || activeCount === 0}
            className="bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sendMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>Send Newsletter to {activeCount} Subscriber{activeCount === 1 ? "" : "s"}</span>
              </>
            )}
          </motion.button>
        </form>
      </div>

      <AnimatePresence>
        {isSubscribersModalOpen && (
          <SubscribersModal
            subscribers={subscribersData?.subscribers ?? []}
            onClose={() => setIsSubscribersModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsletterDirectory;
