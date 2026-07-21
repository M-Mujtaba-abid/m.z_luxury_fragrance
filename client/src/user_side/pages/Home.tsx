import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FeaturedProducts from "../../pages/user/FeaturedProducts";
import NewArrivals from "../../pages/user/NewArrivals";
import OnSaleProducts from "../../pages/user/OnSaleProducts";
import BrandRibbon from "../component/BrandRibbon";
import AppleShowcase from "../component/AppleShowcase";
import SignaturePreview from "../component/SignaturePreview";
import { Star, Mail, ShieldCheck, Award, MessageSquare, Sparkles } from "lucide-react";
import SEO from "../../components/ui/SEO";
import toast from "react-hot-toast";
import { usePublicTestimonialsQuery } from "../../queries/testimonialQueries";
import TestimonialFormModal from "../../components/user/TestimonialFormModal";

const categories = [
  {
    id: 1,
    title: "Men",
    description: "Bold notes of oud, rare woods & leather",
    image:
      "https://scentsnsecrets.com/cdn/shop/files/Category_Pic.jpg2_8916d01e-88d5-4da1-8116-e75e132c7451_600x.webp?v=1755089833",
    hoverImage: "m.z.jpg",
    link: "/web/Men",
    btnColor: "bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink",
  },
  {
    id: 2,
    title: "Women",
    description: "Elegant infusions of Turkish rose & bergamot",
    image:
      "https://scentsnsecrets.com/cdn/shop/files/Category_Pic_b8e87aa3-8ff3-49a9-a139-93cff4fa1201_600x.webp?v=1755090022",
    hoverImage: "carosel.jpg",
    link: "/web/Women",
    btnColor: "bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink",
  },
];

const Home = () => {
  const { data: testimonials } = usePublicTestimonialsQuery();
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  return (
    // Single Dark Navy/Blue Background for the Entire Page
    <div className="min-h-screen bg-luxury-ink text-luxury-cream font-sans">
      <SEO title="Signature Perfume Impressions & Olfactive Journeys" />

      {/* 1. Brands Ribbon Marquee */}
      <div className="pt-2 border-b border-luxury-gold/10">
        <BrandRibbon />
      </div>

      {/* 2. Premium Category Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <span className="text-[10px] sm:text-xs tracking-[0.3em] text-luxury-gold font-bold uppercase block mb-3">
            Olfactive Families
          </span>
          <h1 className="font-logo text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-wide">
            Explore Our Impressions
          </h1>
          <p className="text-xs sm:text-sm font-light text-luxury-cream/70 mt-2 max-w-md mx-auto">
            Sensory blends formulated using standard organic extracts for luxury presence.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full max-w-6xl mx-auto">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              className="relative group overflow-hidden rounded-2xl border border-luxury-gold/20 bg-luxury-card flex flex-col justify-end h-[260px] sm:h-[340px] lg:h-[400px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover absolute inset-0 transform transition-transform duration-700 group-hover:scale-105 group-hover:opacity-0"
              />
              <img
                src={cat.hoverImage}
                alt={`${cat.title} Hover`}
                className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transform scale-105 group-hover:scale-100 transition-all duration-700"
                onError={(e) => {
                  e.currentTarget.src = cat.image;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink via-luxury-ink/60 to-transparent flex flex-col justify-end p-4 sm:p-6 z-10">
                <span className="text-[8px] sm:text-[10px] tracking-widest font-bold text-luxury-gold uppercase mb-1">
                  Collection
                </span>
                <h2 className="font-logo text-base sm:text-2xl lg:text-3xl font-normal text-white tracking-wide leading-tight">
                  {cat.title}
                </h2>
                <p className="text-[10px] sm:text-xs text-luxury-cream/80 font-light mt-1 line-clamp-2">
                  {cat.description}
                </p>
                <div className="mt-3">
                  <Link
                    to={cat.link}
                    className={`inline-block px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg text-[9px] sm:text-xs tracking-wider uppercase font-semibold transition-all duration-300 ${cat.btnColor}`}
                  >
                    Discover {cat.title}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Featured Collections */}
      <div id="featured-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeaturedProducts />
      </div>

      {/* 4. New Arrivals */}
      <div id="new-arrivals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NewArrivals />
      </div>

      {/* 5. Apple-style Showcase */}
      <div>
        <AppleShowcase />
      </div>

      {/* 6. Signature Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SignaturePreview />
      </div>

      {/* 7. On Sale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OnSaleProducts />
      </div>

      {/* 8. Luxury Brand Experience & Story */}
      <div className="bg-luxury-card border-y border-luxury-gold/20 py-16 md:py-24 my-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Image Column - Left */}
            <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-luxury-gold/20 shadow-xl relative group order-last md:order-first">
              <img
                src="https://www.juniormagazine.co.uk/wp-content/uploads/2021/03/jacadi-baby-9fbbd1c.jpeg.webp"
                alt="Brand Story Visual"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            </div>

            {/* Text Column - Right */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs tracking-[0.3em] text-luxury-gold font-bold uppercase block">
                  Our Philosophy
                </span>
                <h2 className="font-logo text-3xl sm:text-4xl font-normal text-white tracking-wide">
                  The Art of Clean Fragrance Distillation
                </h2>
              </div>

              <p className="text-sm sm:text-base text-luxury-cream/80 leading-relaxed font-light">
                We create olfactive poetry. Our team of master perfume curators sources raw flower oils from Grasse, warm resins from India, and rich woods from Cambodia. We merge traditional slow distillation techniques with modern molecular enhancement to guarantee persistent, long-lasting impressions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-luxury-gold/15">
                <div className="space-y-1">
                  <ShieldCheck className="w-6 h-6 text-luxury-gold mb-1" />
                  <h4 className="font-semibold text-sm text-white">Standard Ingredients</h4>
                  <p className="text-luxury-cream/70 font-light text-xs">Zero toxic additives or harmful chemicals.</p>
                </div>
                <div className="space-y-1">
                  <Award className="w-6 h-6 text-luxury-gold mb-1" />
                  <h4 className="font-semibold text-sm text-white">100% Handcrafted</h4>
                  <p className="text-luxury-cream/70 font-light text-xs">Bottled in custom hand-relief crystal flacons.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 9. Reviews & Testimonials */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <MessageSquare className="w-8 h-8 text-luxury-gold mx-auto mb-3" />
            <h2 className="font-logo text-3xl font-light text-white tracking-wide mb-5">
              Global Reviews
            </h2>
            <button
              onClick={() => setIsTestimonialModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
            >
              <MessageSquare size={14} />
              Share Your Thoughts
            </button>
          </div>

          {!!testimonials?.length && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-6 rounded-xl bg-luxury-card border border-luxury-gold/15 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex text-luxury-gold gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" className="stroke-none" />
                      ))}
                    </div>
                    <p className="text-xs text-luxury-cream/80 italic leading-relaxed">
                      "{testimonial.thinking}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-luxury-gold/10 mt-4 flex justify-between items-center text-[11px] text-luxury-cream/60">
                    <span className="font-semibold text-white">{testimonial.name}</span>
                    <span className="text-luxury-gold">{testimonial.country}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TestimonialFormModal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
      />

      {/* 10. Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-luxury-card text-luxury-cream p-8 md:p-14 border border-luxury-gold/20 flex flex-col items-center text-center space-y-6">
          <Mail className="w-10 h-10 text-luxury-gold" />
          <div className="space-y-2 max-w-xl">
            <h2 className="font-logo text-2xl sm:text-3xl font-light text-white tracking-wide">Subscribe to Olfactive Journals</h2>
            <p className="text-xs text-luxury-cream/70 leading-relaxed font-light">
              Receive advanced access to our limited batches, signature blend drops, and historical scents research journals directly in your inbox.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thank you for joining our exclusive circle!");
            }}
            className="w-full max-w-md flex items-center border border-luxury-gold/30 rounded-xl overflow-hidden bg-luxury-ink"
          >
            <input
              type="email"
              placeholder="Your email address"
              required
              className="flex-1 bg-transparent px-4 py-3 text-xs text-white placeholder-luxury-cream/40 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink text-xs font-semibold uppercase tracking-widest transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Home;