import { motion } from "framer-motion";
import { itemVariants } from "./animations";

const STORY_PARAGRAPHS = [
  "M.Z Luxury Fragrance began with a simple conviction: that every person deserves a scent as unique as their story. What started as a small atelier blending rare essences by hand has grown into a house celebrated for its uncompromising quality and artistic vision.",
  "Our philosophy is rooted in the belief that fragrance is not merely worn — it is experienced. Each composition is a carefully orchestrated symphony of top, heart, and base notes, sourced from the finest perfumeries in Grasse, Morocco, and beyond.",
  "From the first sketch of a formula to the final polish on a crystal bottle, every step reflects our dedication to craftsmanship. We pour the same care into a single vial as we would into a limited-edition collection — because luxury, to us, is never an afterthought.",
];

const AboutStory = () => {
  return (
    <section className="mb-20 lg:mb-28" aria-labelledby="our-story-heading">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={itemVariants}
          className="relative order-2 lg:order-1"
        >
          <div className="overflow-hidden rounded-2xl border border-luxury-gold/10 aspect-square max-w-md mx-auto lg:mx-0">
            <img
              src="/images/perfume2.jpg"
              alt="Perfume craftsmanship at M.Z Luxury Fragrance"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={itemVariants}
          className="order-1 lg:order-2"
        >
          <span className="text-[10px] tracking-[0.3em] text-luxury-gold font-bold uppercase block mb-3">
            Our Story
          </span>
          <h2
            id="our-story-heading"
            className="font-logo text-3xl md:text-4xl font-light text-luxury-cream tracking-wide mb-6"
          >
            Crafted With Purpose, Worn With Pride
          </h2>
          <div className="space-y-4">
            {STORY_PARAGRAPHS.map((paragraph, index) => (
              <p key={index} className="text-sm md:text-base text-luxury-cream/60 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutStory;
