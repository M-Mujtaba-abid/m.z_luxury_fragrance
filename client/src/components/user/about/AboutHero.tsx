import { motion } from "framer-motion";

const AboutHero = () => {
  return (
    <section className="relative mb-20 lg:mb-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="text-[10px] tracking-[0.3em] text-luxury-gold font-bold uppercase block mb-3">
            Our Heritage
          </span>
          <h1 className="font-logo text-4xl md:text-5xl lg:text-6xl font-light text-luxury-cream tracking-wide leading-tight">
            The Art of
            <span className="block text-luxury-gold mt-1">Timeless Fragrance</span>
          </h1>
          <p className="text-sm md:text-base font-light text-luxury-cream/60 mt-5 max-w-lg leading-relaxed">
            Born from a passion for perfumery and a belief that scent is the most intimate
            form of self-expression — M.Z Luxury Fragrance crafts olfactory journeys that
            linger in memory long after the first spray.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-3xl bg-luxury-gold/5 blur-2xl pointer-events-none" />
          <div className="relative overflow-hidden rounded-3xl border border-luxury-gold/15 aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
            <img
              src="/images/perfume1.jpg"
              alt="M.Z Luxury Fragrance signature perfume bottle"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8">
              <p className="font-logo text-lg sm:text-xl font-light text-luxury-cream/90 italic tracking-wide">
                "Perfume is the art that makes memory tangible."
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
