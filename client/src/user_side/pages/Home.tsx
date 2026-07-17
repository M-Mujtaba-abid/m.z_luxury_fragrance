import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FeaturedProducts from "../../pages/user/FeaturedProducts";
import NewArrivals from "../../pages/user/NewArrivals";
import OnSaleProducts from "../../pages/user/OnSaleProducts";
import BrandRibbon from "../component/BrandRibbon";
import AppleShowcase from "../component/AppleShowcase";
import SignaturePreview from "../component/SignaturePreview";
import { Star, Mail, ShieldCheck, Award, MessageSquare } from "lucide-react";
import SEO from "../../components/ui/SEO";
import toast from "react-hot-toast";


const categories = [
  {
    id: 1,
    title: "Men",
    description: "Bold notes of oud, rare woods & leather",
    image: "https://scentsnsecrets.com/cdn/shop/files/Category_Pic.jpg2_8916d01e-88d5-4da1-8116-e75e132c7451_600x.webp?v=1755089833",
    hoverImage: "m.z.jpg",
    link: "/web/Men",
    btnColor: "bg-black hover:bg-neutral-800 text-white border border-neutral-800",
  },
  {
    id: 2,
    title: "Women",
    description: "Elegant infusions of Turkish rose & bergamot",
    image: "https://scentsnsecrets.com/cdn/shop/files/Category_Pic_b8e87aa3-8ff3-49a9-a139-93cff4fa1201_600x.webp?v=1755090022",
    hoverImage: "carosel.jpg",
    link: "/web/Women",
    btnColor: "bg-black hover:bg-neutral-800 text-white border border-neutral-800",
  },
  {
    id: 3,
    title: "Children",
    description: "Soft, hypoallergenic chamomile & honey mist",
    image: "https://www.juniormagazine.co.uk/wp-content/uploads/2024/07/EAU_TP_1-a594a8f-725x1024.jpg",
    hoverImage: "https://www.juniormagazine.co.uk/wp-content/uploads/2021/03/jacadi-baby-9fbbd1c.jpeg.webp",
    link: "/web/Children",
    btnColor: "bg-black hover:bg-neutral-800 text-white border border-neutral-800",
  },
];

const REVIEWS = [
  {
    name: "Genevieve R.",
    text: "The sillage of Oud & Gold is absolute perfection. It commands presence without overpowering the room.",
    rating: 5,
    role: "Paris, France"
  },
  {
    name: "Marcus A.",
    text: "Aesop meets Tom Ford. Incredible craftsmanship and packaging. The customer service feels like a private concierge.",
    rating: 5,
    role: "London, UK"
  },
  {
    name: "Elena S.",
    text: "A truly premium sensory experience. The bottle itself is a work of art on my vanity.",
    rating: 5,
    role: "Milan, Italy"
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
      <SEO title="Signature Perfume Impressions & Olfactive Journeys" />

      {/* 1. Brands Ribbon Marquee */}
      <div className="pt-2">
        <BrandRibbon />
      </div>

      {/* 2. Premium Category Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] text-neutral-400 dark:text-neutral-500 font-bold uppercase block mb-3">
            Olfactive Families
          </span>
          <h1 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white tracking-wide">
            Explore Our Impressions
          </h1>
          <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 mt-2 max-w-md mx-auto">
            Sensory blends formulated using standard organic extracts for luxury presence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              className="relative group overflow-hidden rounded-3xl border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col justify-end"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              style={{ aspectRatio: "3/4" }}
            >
              {/* Normal Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover absolute inset-0 transform transition-transform duration-700 group-hover:scale-105 group-hover:opacity-0"
              />

              {/* Hover Image */}
              <img
                src={cat.hoverImage}
                alt={`${cat.title} Hover`}
                className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transform scale-105 group-hover:scale-100 transition-all duration-700"
                onError={(e) => {
                  e.currentTarget.src = cat.image; // Fallback to original image if hover fails
                }}
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 z-10">
                <span className="text-[10px] tracking-widest font-bold text-amber-400 uppercase mb-1">
                  Collection
                </span>
                <h2 className="text-2xl font-light text-white tracking-wide">
                  {cat.title}
                </h2>
                <p className="text-xs text-neutral-300 font-light mt-1.5 line-clamp-2 max-w-[85%]">
                  {cat.description}
                </p>
                <div className="mt-4">
                  <Link
                    to={cat.link}
                    className={`inline-block px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase font-semibold transition-all duration-300 ${cat.btnColor}`}
                  >
                    Discover {cat.title}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Featured Collections Section */}
      <div id="featured-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeaturedProducts />
      </div>

      {/* 4. New Arrivals Section */}
      <div id="new-arrivals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NewArrivals />
      </div>

      {/* 5. Apple-style Product Showcase Section */}
      <div className="">
        <AppleShowcase />
      </div>

      {/* 6. Signature Product Direct-Purchase Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SignaturePreview />
      </div>

      {/* 7. On Sale Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OnSaleProducts />
      </div>

      {/* 8. Luxury Brand Experience & Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.3em] text-neutral-400 dark:text-neutral-500 font-bold uppercase block">
              Our Philosophy
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 dark:text-white tracking-wide">
              The Art of Clean Fragrance Distillation
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
              We create olfactive poetry. Our team of master perfume curators sources raw flower oils from Grasse, warm resins from India, and rich woods from Cambodia. We merge traditional slow distillation techniques with modern molecular enhancement to guarantee persistent, long-lasting impressions.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 text-xs">
              <div className="space-y-2">
                <ShieldCheck className="w-6 h-6 text-amber-500" />
                <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Standard Ingredients</h4>
                <p className="text-neutral-500 dark:text-neutral-400 font-light">Zero toxic additives or harmful chemicals.</p>
              </div>
              <div className="space-y-2">
                <Award className="w-6 h-6 text-emerald-500" />
                <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">100% Handcrafted</h4>
                <p className="text-neutral-500 dark:text-neutral-400 font-light">Bottled in custom hand-relief crystal flacons.</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-neutral-100 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900 shadow-sm relative group">
            <img
              src="https://www.juniormagazine.co.uk/wp-content/uploads/2021/03/jacadi-baby-9fbbd1c.jpeg.webp"
              alt="Brand Story Visual"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-neutral-950/20" />
          </div>
        </div>
      </div>

      {/* 9. Reviews & Testimonials */}
      <div className="bg-neutral-50 dark:bg-neutral-900/40 py-16 border-y border-neutral-100 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <MessageSquare className="w-8 h-8 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h2 className="text-3xl font-light text-neutral-900 dark:text-white tracking-wide">
              Global Reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-900/60 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" className="stroke-none" />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 italic leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>
                <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900 mt-6 flex justify-between items-center text-[11px] text-neutral-500">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{rev.name}</span>
                  <span>{rev.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 10. Luxury Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-[40px] overflow-hidden bg-black text-white p-8 md:p-16 border border-neutral-850 shadow-2xl flex flex-col items-center text-center space-y-6">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          <Mail className="w-10 h-10 text-amber-500 animate-pulse" />
          <div className="space-y-2 max-w-xl">
            <h2 className="text-3xl font-light tracking-wide">Subscribe to Olfactive Journals</h2>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Receive advanced access to our limited batches, signature blend drops, and historical scents research journals directly in your inbox.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thank you for joining our exclusive circle!");
            }}
            className="w-full max-w-md flex items-center border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/50 focus-within:border-neutral-600 transition-colors duration-300"
          >
            <input
              type="email"
              placeholder="Your email address"
              required
              className="flex-1 bg-transparent px-4 py-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-white hover:bg-neutral-200 text-black text-xs font-semibold uppercase tracking-widest transition duration-300"
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
