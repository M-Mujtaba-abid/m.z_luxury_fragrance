import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, Send, MessageSquareReply } from "lucide-react";
import toast from "react-hot-toast";
import {
  useAdminContactMessagesQuery,
  useAdminReplyToMessageMutation,
  type ContactMessage,
} from "../../../queries/contactQueries";

const StatusBadge = ({ status }: { status: ContactMessage["status"] }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
      status === "replied"
        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
    }`}
  >
    {status}
  </span>
);

const ReplyModal = ({
  message,
  onClose,
}: {
  message: ContactMessage;
  onClose: () => void;
}) => {
  const [replyText, setReplyText] = useState(message.adminReply || "");
  const replyMutation = useAdminReplyToMessageMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error("Reply text is required");
      return;
    }

    replyMutation.mutate(
      { id: message.id, replyText },
      {
        onSuccess: () => {
          toast.success("Reply sent successfully");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to send reply");
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

        <h3 className="font-logo text-xl font-light text-luxury-cream mb-1">
          {message.subject}
        </h3>
        <p className="text-xs text-luxury-cream/50 mb-4">
          From <span className="text-luxury-cream/80">{message.name}</span> ({message.email}) ·{" "}
          {new Date(message.createdAt).toLocaleString()}
        </p>

        <div className="p-4 rounded-xl bg-luxury-ink border border-luxury-gold/10 text-sm text-luxury-cream/80 mb-5 max-h-40 overflow-y-auto">
          {message.message}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs uppercase tracking-widest text-luxury-cream/50">
            Your Reply
          </label>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={5}
            required
            className="w-full px-4 py-3 rounded-xl border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60 resize-none"
            placeholder="Write your reply here..."
          />

          <button
            type="submit"
            disabled={replyMutation.isPending}
            className="w-full bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
          >
            {replyMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>{message.status === "replied" ? "Update Reply" : "Send Reply"}</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const ContactDirectory = () => {
  const { data: messages, isLoading, isError } = useAdminContactMessagesQuery();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  return (
    <div className="min-h-screen bg-luxury-ink">
      <div className="bg-luxury-card border border-luxury-gold/10 rounded-xl shadow-md p-6">
        <h1 className="font-logo text-3xl font-bold text-luxury-cream mb-6">
          Contact Messages
        </h1>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 rounded-full border-2 border-luxury-gold/20 border-t-luxury-gold animate-spin" />
          </div>
        )}

        {isError && (
          <p className="text-red-400 text-center py-10">Failed to load messages.</p>
        )}

        {!isLoading && !isError && messages?.length === 0 && (
          <p className="text-luxury-cream/50 text-center py-10">No messages found.</p>
        )}

        {!isLoading && !isError && !!messages?.length && (
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
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                    Status
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
                {messages.map((message) => (
                  <tr
                    key={message.id}
                    className="bg-luxury-card hover:bg-luxury-gold/5 transition-colors duration-300"
                  >
                    <td className="px-4 py-3 text-luxury-cream/80 max-w-[140px] truncate">
                      {message.name}
                    </td>
                    <td className="px-4 py-3 text-luxury-cream/60 hidden md:table-cell max-w-[180px] truncate">
                      {message.email}
                    </td>
                    <td className="px-4 py-3 text-luxury-cream/80 max-w-[200px] truncate">
                      {message.subject}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={message.status} />
                    </td>
                    <td className="px-4 py-3 text-luxury-cream/50 hidden md:table-cell">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedMessage(message)}
                        className="flex items-center gap-1.5 bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-luxury-gold/20 transition-colors duration-300"
                      >
                        {message.status === "replied" ? (
                          <MessageSquareReply size={13} />
                        ) : (
                          <Mail size={13} />
                        )}
                        {message.status === "replied" ? "View / Edit" : "Reply"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedMessage && (
          <ReplyModal message={selectedMessage} onClose={() => setSelectedMessage(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactDirectory;
