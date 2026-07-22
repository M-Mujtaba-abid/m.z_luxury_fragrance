import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  CheckCircle2,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSubmitContactMessageMutation } from "../../queries/contactQueries";
import SEO from "../../components/ui/SEO";
import Breadcrumb from "../../components/ui/Breadcrumb";

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email Us",
    value: "support@mzluxury.com",
    href: "mailto:support@mzluxury.com",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+92 300 1234567",
    href: "tel:+923001234567",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "123 Fragrance Avenue, Lahore, Pakistan",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon - Sat: 10:00 AM - 8:00 PM",
  },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ContactUs = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const submitMutation = useSubmitContactMessageMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitMutation.mutate(form, {
      onSuccess: () => {
        toast.success("Your message has been sent. We'll get back to you soon!");
        setForm(INITIAL_FORM);
        setJustSubmitted(true);
        setTimeout(() => setJustSubmitted(false), 4000);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to send your message");
      },
    });
  };

  return (
    <div className="relative min-h-screen bg-luxury-ink overflow-hidden">
      <SEO title="Contact Us" description="Get in touch with M.Z Luxury Fragrances" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-luxury-gold/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-luxury-gold/5 blur-[100px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Contact" }]} />

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-luxury-gold font-bold uppercase block mb-3">
            We'd love to hear from you
          </span>
          <h1 className="font-logo text-4xl md:text-5xl font-light text-luxury-cream tracking-wide">
            Contact Us
          </h1>
          <p className="text-sm font-light text-luxury-cream/60 mt-3 max-w-md mx-auto">
            Questions about an order, a fragrance, or just want to say hello? Send us a
            message and our concierge team will respond promptly.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        >
          {/* Contact Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            {CONTACT_INFO.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-luxury-gold/10 bg-luxury-card hover:border-luxury-gold/30 transition-colors duration-300">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <Icon size={18} className="text-luxury-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-luxury-cream/50 mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm text-luxury-cream font-medium">{item.value}</p>
                  </div>
                </div>
              );

              return item.href ? (
                <a key={item.label} href={item.href} className="block">
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}

            <div className="pt-2">
              <p className="text-[10px] uppercase tracking-widest text-luxury-cream/50 mb-3">
                Follow Us
              </p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-xl border border-luxury-gold/10 bg-luxury-card flex items-center justify-center text-luxury-cream/70 hover:text-luxury-gold hover:border-luxury-gold/30 transition-colors duration-300"
                    >
                      <Icon size={16} strokeWidth={1.5} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <div className="relative rounded-3xl border border-luxury-gold/10 bg-luxury-card shadow-xl p-6 sm:p-10 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-luxury-gold-bright/50 to-transparent" />

              <h2 className="font-logo text-2xl font-light text-luxury-cream tracking-wide mb-1">
                Send us a Message
              </h2>
              <p className="text-xs text-luxury-cream/50 mb-8">
                Fill out the form below and we'll be in touch within 24 hours.
              </p>

              <AnimatePresence>
                {justSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-sm overflow-hidden"
                  >
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>Message sent successfully! We'll respond soon.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxury-cream/40"
                  />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-3 py-3 rounded-xl border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
                    placeholder="Your full name"
                  />
                </div>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxury-cream/40"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-3 py-3 rounded-xl border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
                    placeholder="Your email address"
                  />
                </div>

                <div className="relative">
                  <MessageSquare
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxury-cream/40"
                  />
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-3 py-3 rounded-xl border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60 resize-none"
                    placeholder="Tell us more..."
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink py-3.5 px-4 rounded-xl font-semibold text-sm tracking-wide uppercase transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg shadow-luxury-gold/10 disabled:opacity-60 disabled:cursor-wait"
                >
                  {submitMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
