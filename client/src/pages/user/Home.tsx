// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useProductsQuery } from "../../queries/productQueries";
// import FeaturedProducts from "./FeaturedProducts";
// import NewArrivals from "./NewArrivals";
// import OnSaleProducts from "./OnSaleProducts";

// // Matches the Product model's real `category` enum (Men/Women/Children)
// const CATEGORY_INFO = [
//   {
//     id: 1,
//     title: "Men",
//     description:
//       "Bold, woody, and unmistakably confident — signature scents crafted for him.",
//     link: "/Men",
//   },
//   {
//     id: 2,
//     title: "Women",
//     description:
//       "Elegant, floral, and effortlessly captivating — fragrances crafted for her.",
//     link: "/Women",
//   },
//   {
//     id: 3,
//     title: "Children",
//     description:
//       "Gentle, playful, and safe for delicate skin — fragrances made for little ones.",
//     link: "/Children",
//   },
// ];

// const Home = () => {
//   const { data: products = [] } = useProductsQuery();

//   // Show a real product per category instead of stock imagery
//   const categories = CATEGORY_INFO.map((cat) => {
//     const representativeProduct = products.find((p: any) => p.category === cat.title);
//     return { ...cat, image: representativeProduct?.productImage as string | undefined };
//   });

//   return (
//     <div className="min-h-screen bg-luxury-ink py-12">
//       <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//         {/* Heading */}
//         <div className="text-center mb-12 px-4">
//           <p className="text-xs font-medium uppercase tracking-[0.3em] text-luxury-gold mb-3">
//             Our Collections
//           </p>
//           <h1 className="font-logo text-4xl font-bold text-luxury-cream mb-4">
//             Fragrances Crafted For Every Story
//           </h1>
//           <p className="text-lg text-luxury-cream/70">
//             Explore our signature scents, thoughtfully composed for him, her, and the little ones.
//           </p>
//         </div>

//         {/* Category Sections */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
//           {categories.map((cat, index) => (
//             <motion.div
//               key={cat.id}
//               className="group relative overflow-hidden rounded-2xl border border-luxury-gold/15 bg-luxury-ink shadow-lg"
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.2 }}
//               viewport={{ once: false }}
//             >
//               {cat.image ? (
//                 <>
//                   <img
//                     src={cat.image}
//                     alt={cat.title}
//                     className="w-full h-56 sm:h-72 lg:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
//                   />
//                   {/* Gradient keeps overlay text readable regardless of photo brightness */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
//                 </>
//               ) : (
//                 <div className="w-full h-56 sm:h-72 lg:h-[400px] flex items-center justify-center bg-luxury-ink">
//                   <span className="font-logo text-5xl text-luxury-gold/20">M.Z</span>
//                 </div>
//               )}

//               {/* Overlay Content */}
//               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
//                 <h2 className="font-logo text-lg sm:text-xl lg:text-2xl font-bold text-luxury-cream mb-2">
//                   {cat.title}
//                 </h2>
//                 <p className="text-xs sm:text-sm lg:text-base text-luxury-cream/80 mb-4 max-w-xs">
//                   {cat.description}
//                 </p>
//                 <Link
//                   to={cat.link}
//                   className="px-4 sm:px-5 py-2 border border-luxury-gold text-luxury-gold text-sm sm:text-base rounded-lg transition-colors duration-300 hover:bg-luxury-gold hover:text-luxury-ink"
//                 >
//                   Shop {cat.title}
//                 </Link>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Separate Sections */}
//         <div className="mt-16 min-h-[360px]">
//           <NewArrivals />
//         </div>
//         <div className="mt-16 min-h-[400px]">
//           <FeaturedProducts />
//         </div>
//         <div className="mt-16 min-h-[400px]">
//           <OnSaleProducts />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
