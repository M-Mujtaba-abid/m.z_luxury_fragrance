import { motion } from "framer-motion";
import {
  FileText,
  UserCircle,
  Tag,
  ShoppingBag,
  Truck,
  RotateCcw,
  Copyright,
  Ban,
  AlertTriangle,
  Scale,
  RefreshCw,
  Mail,
} from "lucide-react";
import SEO from "../../components/ui/SEO";
import Breadcrumb from "../../components/ui/Breadcrumb";

const LAST_UPDATED = "July 22, 2026";

const SECTIONS = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    body: [
      "By accessing or using the M.Z Luxury Fragrance website, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our site or services.",
    ],
  },
  {
    icon: UserCircle,
    title: "Eligibility & Accounts",
    body: [
      "You must be at least 18 years old to create an account or place an order with us. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
    ],
  },
  {
    icon: Tag,
    title: "Products & Pricing",
    body: [
      "We strive to display accurate product descriptions, images, and pricing. However, we reserve the right to correct errors, update pricing, or modify product availability at any time without prior notice.",
      "All prices are listed in the applicable currency shown at checkout and are inclusive of taxes unless stated otherwise.",
    ],
  },
  {
    icon: ShoppingBag,
    title: "Orders & Payment",
    body: [
      "Placing an order constitutes an offer to purchase, which we may accept or decline. Payment must be received in full before an order is processed and dispatched.",
      "We reserve the right to cancel or refuse any order suspected of fraud, error, or violation of these terms.",
    ],
  },
  {
    icon: Truck,
    title: "Shipping & Delivery",
    body: [
      "Delivery timeframes provided at checkout are estimates and not guaranteed. We are not liable for delays caused by couriers, customs, or circumstances beyond our reasonable control.",
      "Risk of loss and title for products pass to you upon delivery to the shipping address provided at checkout.",
    ],
  },
  {
    icon: RotateCcw,
    title: "Returns & Refunds",
    body: [
      "Due to hygiene reasons, opened or used fragrance products cannot be returned unless defective or damaged upon arrival. Unopened items may be returned within 7 days of delivery in their original packaging.",
      "Approved refunds are issued to the original payment method within a reasonable timeframe after we receive and inspect the returned item.",
    ],
  },
  {
    icon: Copyright,
    title: "Intellectual Property",
    body: [
      "All content on this website, including logos, product images, text, and design, is the property of M.Z Luxury Fragrance and protected by applicable intellectual property laws. Reproduction or use without our written consent is prohibited.",
    ],
  },
  {
    icon: Ban,
    title: "Prohibited Conduct",
    body: [
      "You agree not to misuse our website, including attempting unauthorised access, interfering with site security, submitting false information, or using the site for any unlawful purpose.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, M.Z Luxury Fragrance shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products.",
    ],
  },
  {
    icon: Scale,
    title: "Governing Law",
    body: [
      "These Terms & Conditions are governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law principles. Any disputes shall be subject to the exclusive jurisdiction of the courts of Lahore, Pakistan.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Changes to These Terms",
    body: [
      "We may revise these Terms & Conditions at any time. Continued use of our website after changes are posted constitutes your acceptance of the revised terms. Please review this page periodically.",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TermsAndConditions = () => {
  return (
    <div className="relative min-h-screen bg-luxury-ink overflow-hidden">
      <SEO
        title="Terms & Conditions"
        description="Read the terms and conditions governing your use of M.Z Luxury Fragrances and purchases made on our website."
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-luxury-gold/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-luxury-gold/5 blur-[100px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <Breadcrumb items={[{ label: "Home", path: "/web" }, { label: "Terms & Conditions" }]} />

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-luxury-gold font-bold uppercase block mb-3">
            Please Read Carefully
          </span>
          <h1 className="font-logo text-4xl md:text-5xl font-light text-luxury-cream tracking-wide">
            Terms & Conditions
          </h1>
          <p className="text-sm font-light text-luxury-cream/60 mt-3 max-w-xl mx-auto">
            These terms govern your use of the M.Z Luxury Fragrance website and any purchases
            made through it. By shopping with us, you agree to these terms.
          </p>
          <p className="text-[11px] text-luxury-cream/40 mt-4 uppercase tracking-widest">
            Last updated: {LAST_UPDATED}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {SECTIONS.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                variants={itemVariants}
                className="relative rounded-2xl border border-luxury-gold/10 bg-luxury-card p-6 sm:p-8 hover:border-luxury-gold/30 transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <Icon size={18} className="text-luxury-gold" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] text-luxury-gold/60 font-semibold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="font-logo text-xl font-light text-luxury-cream tracking-wide">
                        {section.title}
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {section.body.map((paragraph, i) => (
                        <p key={i} className="text-sm text-luxury-cream/60 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Contact */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl border border-luxury-gold/20 bg-luxury-card p-6 sm:p-8 text-center overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-luxury-gold-bright/50 to-transparent" />
            <Mail size={22} className="text-luxury-gold mx-auto mb-3" strokeWidth={1.5} />
            <h2 className="font-logo text-xl font-light text-luxury-cream tracking-wide mb-2">
              Questions About These Terms?
            </h2>
            <p className="text-sm text-luxury-cream/60 max-w-md mx-auto mb-4">
              If anything here is unclear, our team is happy to help before you place an order.
            </p>
            <a
              href="mailto:support@mzluxury.com"
              className="inline-block text-sm font-medium text-luxury-gold hover:text-luxury-gold-bright transition-colors duration-300"
            >
              support@mzluxury.com
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
