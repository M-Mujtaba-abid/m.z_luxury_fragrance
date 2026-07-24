import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./animations";

const VALUES = [
  {
    title: "Premium Ingredients",
    description:
      "We source rare natural oils, absolutes, and essences from trusted suppliers worldwide — never compromising on purity or provenance.",
    image: "/images/perfume3.jpg",
    alt: "Premium perfume ingredients",
  },
  {
    title: "Master Craftsmanship",
    description:
      "Every fragrance is composed by skilled perfumers who blend tradition with innovation, ensuring a balanced and refined olfactory profile.",
    image: "/images/perfume4.jpg",
    alt: "Artisan perfume craftsmanship",
  },
  {
    title: "Long-Lasting Sillage",
    description:
      "Our concentrated eau de parfum formulas are designed to evolve beautifully on skin, leaving a trail that endures from dawn to dusk.",
    image: "/images/perfume5.jpg",
    alt: "Long-lasting luxury fragrance",
  },
  {
    title: "Cruelty-Free & Ethical",
    description:
      "We are committed to responsible sourcing and never test on animals. Luxury should feel as good ethically as it smells sensorially.",
    image: "/images/perfume6.jpg",
    alt: "Cruelty-free ethical perfumery",
  },
];

const AboutValues = () => {
  return (
    <section className="mb-20 lg:mb-28" aria-labelledby="our-values-heading">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={itemVariants}
        className="text-center mb-12"
      >
        <span className="text-[10px] tracking-[0.3em] text-luxury-gold font-bold uppercase block mb-3">
          Why Choose Us
        </span>
        <h2
          id="our-values-heading"
          className="font-logo text-3xl md:text-4xl font-light text-luxury-cream tracking-wide"
        >
          Our Values
        </h2>
        <p className="text-sm text-luxury-cream/60 mt-3 max-w-xl mx-auto">
          Four pillars that define every bottle we create and every experience we deliver.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {VALUES.map((value) => (
          <motion.article
            key={value.title}
            variants={itemVariants}
            className="group relative rounded-2xl border border-luxury-gold/10 bg-luxury-card overflow-hidden hover:border-luxury-gold/30 transition-colors duration-300"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={value.image}
                alt={value.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-card via-luxury-card/20 to-transparent" />
            </div>
            <div className="p-5 sm:p-6">
              <h3 className="font-logo text-lg font-light text-luxury-cream tracking-wide mb-2">
                {value.title}
              </h3>
              <p className="text-xs sm:text-sm text-luxury-cream/60 leading-relaxed">
                {value.description}
              </p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default AboutValues;
