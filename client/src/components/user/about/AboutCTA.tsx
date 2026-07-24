import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { itemVariants } from "./animations";

const AboutCTA = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={itemVariants}
      className="relative rounded-3xl border border-luxury-gold/15 bg-luxury-card overflow-hidden"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-luxury-gold-bright/50 to-transparent" />
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-luxury-gold/5 blur-[80px]" />

      <div className="relative px-6 sm:px-10 py-12 sm:py-16 text-center">
        <span className="text-[10px] tracking-[0.3em] text-luxury-gold font-bold uppercase block mb-3">
          Begin Your Journey
        </span>
        <h2
          id="cta-heading"
          className="font-logo text-2xl sm:text-3xl md:text-4xl font-light text-luxury-cream tracking-wide mb-3"
        >
          Discover Your Signature Scent
        </h2>
        <p className="text-sm text-luxury-cream/60 max-w-md mx-auto mb-8">
          Explore our curated collection of luxury fragrances and find the scent that
          tells your story.
        </p>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/all"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink rounded-xl font-semibold text-sm tracking-wide uppercase transition-colors duration-300 shadow-lg shadow-luxury-gold/10"
          >
            Shop Now
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutCTA;
