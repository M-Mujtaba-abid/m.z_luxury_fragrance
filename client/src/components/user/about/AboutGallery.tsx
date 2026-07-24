import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./animations";

const GALLERY_ITEMS = [
  {
    src: "/images/perfume1.jpg",
    alt: "Signature Oud Collection perfume",
    label: "Signature Oud",
  },
  {
    src: "/images/perfume2.jpg",
    alt: "Velvet Rose Eau de Parfum",
    label: "Velvet Rose",
  },
  {
    src: "/images/perfume3.jpg",
    alt: "Amber Noir luxury fragrance",
    label: "Amber Noir",
  },
  {
    src: "/images/perfume4.jpg",
    alt: "Citrus Elixir perfume collection",
    label: "Citrus Elixir",
  },
];

const AboutGallery = () => {
  return (
    <section className="mb-20 lg:mb-28" aria-labelledby="gallery-heading">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={itemVariants}
        className="text-center mb-12"
      >
        <span className="text-[10px] tracking-[0.3em] text-luxury-gold font-bold uppercase block mb-3">
          The Collection
        </span>
        <h2
          id="gallery-heading"
          className="font-logo text-3xl md:text-4xl font-light text-luxury-cream tracking-wide"
        >
          Signature Creations
        </h2>
        <p className="text-sm text-luxury-cream/60 mt-3 max-w-xl mx-auto">
          A glimpse into the fragrances that define the M.Z Luxury Fragrance experience.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
      >
        {GALLERY_ITEMS.map((item) => (
          <motion.figure
            key={item.label}
            variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl border border-luxury-gold/10 aspect-[3/4] hover:border-luxury-gold/30 transition-colors duration-300"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink/80 via-luxury-ink/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <figcaption className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
              <h3 className="font-logo text-sm sm:text-base font-light text-luxury-cream tracking-wide">
                {item.label}
              </h3>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
};

export default AboutGallery;
