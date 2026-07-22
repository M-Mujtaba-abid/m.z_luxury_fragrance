import { motion } from "framer-motion";
import {
  ShieldCheck,
  Database,
  Cookie,
  CreditCard,
  Share2,
  Lock,
  UserCheck,
  Baby,
  RefreshCw,
  Mail,
} from "lucide-react";
import SEO from "../../components/ui/SEO";
import Breadcrumb from "../../components/ui/Breadcrumb";

const LAST_UPDATED = "July 22, 2026";

const SECTIONS = [
  {
    icon: Database,
    title: "Information We Collect",
    body: [
      "When you create an account, place an order, or contact us, we collect information such as your name, email address, phone number, shipping address, and payment details.",
      "We also automatically collect certain information when you visit our site, including your IP address, browser type, device information, and browsing behaviour, to help us improve your experience.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "How We Use Your Information",
    body: [
      "We use your information to process and deliver orders, manage your account, respond to enquiries, and send order updates or promotional communications you have opted into.",
      "We may also use aggregated, non-identifying data to analyse trends and improve our products, website, and customer experience.",
    ],
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    body: [
      "Our website uses cookies and similar technologies to remember your preferences, keep your cart up to date, and understand how visitors use our site.",
      "You can control or disable cookies through your browser settings, though some features of the site may not function properly without them.",
    ],
  },
  {
    icon: CreditCard,
    title: "Payment & Order Information",
    body: [
      "Payments are processed through trusted, PCI-compliant third-party payment gateways. We do not store your full card details on our servers.",
      "Order information is retained for as long as necessary to fulfil your purchase, handle returns, and comply with our legal and accounting obligations.",
    ],
  },
  {
    icon: Share2,
    title: "Data Sharing & Third Parties",
    body: [
      "We do not sell your personal information. We share data only with trusted partners who help us operate our business, such as payment processors, shipping couriers, and email service providers.",
      "These partners are bound by confidentiality obligations and are only permitted to use your data to perform the services we request.",
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    body: [
      "We apply industry-standard technical and organisational safeguards to protect your personal information from unauthorised access, alteration, disclosure, or destruction.",
      "While we work hard to protect your data, no method of transmission over the internet is completely secure, and we encourage you to keep your account credentials confidential.",
    ],
  },
  {
    icon: UserCheck,
    title: "Your Rights & Choices",
    body: [
      "You may access, update, or request deletion of your personal information at any time by managing your account or contacting our support team.",
      "You can also opt out of marketing emails at any time using the unsubscribe link included in every newsletter we send.",
    ],
  },
  {
    icon: Baby,
    title: "Children's Privacy",
    body: [
      "Our website and services are intended for individuals aged 18 and above. We do not knowingly collect personal information from children, and any such data discovered will be promptly removed.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal and regulatory reasons. The updated version will always be posted on this page with a revised date.",
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

const PrivacyPolicy = () => {
  return (
    <div className="relative min-h-screen bg-luxury-ink overflow-hidden">
      <SEO
        title="Privacy Policy"
        description="Learn how M.Z Luxury Fragrances collects, uses, and protects your personal information."
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-luxury-gold/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-luxury-gold/5 blur-[100px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <Breadcrumb items={[{ label: "Home", path: "/web" }, { label: "Privacy Policy" }]} />

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-luxury-gold font-bold uppercase block mb-3">
            Your Trust Matters
          </span>
          <h1 className="font-logo text-4xl md:text-5xl font-light text-luxury-cream tracking-wide">
            Privacy Policy
          </h1>
          <p className="text-sm font-light text-luxury-cream/60 mt-3 max-w-xl mx-auto">
            This policy explains how M.Z Luxury Fragrance collects, uses, and safeguards your
            personal information when you shop with us.
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
              Questions About Your Privacy?
            </h2>
            <p className="text-sm text-luxury-cream/60 max-w-md mx-auto mb-4">
              If you have any questions about this Privacy Policy or how we handle your data,
              reach out to our team.
            </p>
            <a
              href="mailto:luxuryfragrancemz@gmail.com"
              className="inline-block text-sm font-medium text-luxury-gold hover:text-luxury-gold-bright transition-colors duration-300"
            >
              luxuryfragrancemz@gmail.com
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
