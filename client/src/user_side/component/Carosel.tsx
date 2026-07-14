// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

// interface Slide {
//   id: number;
//   type: "video" | "image";
//   src: string;
//   badge: string;
//   title: string;
//   subtitle: string;
//   description: string;
//   ctaText: string;
//   secondaryCtaText?: string;
//   themeColor: string; // Gradient color theme for buttons/highlights
// }

// const Carosel: React.FC = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isMuted, setIsMuted] = useState(true);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

//   const slides: Slide[] = [
//     {
//       id: 1,
//       type: "video",
//       src: "/Perfume_box_opening_revealing_bo…_202607131129.mp4",
//       badge: "Signature Collection",
//       title: "M.Z Luxury Fragrance",
//       subtitle: "The Art of Fine Perfumery",
//       description: "Experience a sensory journey crafted by master perfumers. Our signature scents combine rare woods, fresh citrus, and exotic spices for an unforgettable impression.",
//       ctaText: "Shop Signature",
//       secondaryCtaText: "Explore Scents",
//       themeColor: "from-amber-500 to-yellow-600",
//     },
//     {
//       id: 2,
//       type: "image",
//       src: "/carosel.jpg",
//       badge: "Premium Quality",
//       title: "Oud & Gold Edition",
//       subtitle: "Bold, Warm, and Captivating",
//       description: "Unveil your signature scent with our special Oud & Gold selection. Crafted to linger beautifully throughout the day and make a sophisticated statement.",
//       ctaText: "View Collection",
//       secondaryCtaText: "Read Story",
//       themeColor: "from-yellow-600 to-amber-700",
//     },
//     {
//       id: 3,
//       type: "image",
//       src: "/m.z.jpg",
//       badge: "Limited Release",
//       title: "Royal Velvet Blend",
//       subtitle: "Sophistication in Every Drop",
//       description: "Indulge in a limited collection built on Turkish rose, Italian bergamot, and rich patchouli. Perfectly bottled in a handcrafted vessel.",
//       ctaText: "Pre-Order Now",
//       themeColor: "from-rose-600 to-purple-800",
//     },
//   ];

//   // Start autoplay timer
//   const startAutoplay = () => {
//     stopAutoplay();
//     // Auto advance every 8 seconds (gives enough time to appreciate the video)
//     autoPlayRef.current = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 8000);
//   };

//   const stopAutoplay = () => {
//     if (autoPlayRef.current) {
//       clearInterval(autoPlayRef.current);
//     }
//   };

//   useEffect(() => {
//     startAutoplay();
//     return () => stopAutoplay();
//   }, [currentSlide]);

//   const handlePrev = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   };

//   const handleNext = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const toggleMute = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (videoRef.current) {
//       videoRef.current.muted = !videoRef.current.muted;
//       setIsMuted(videoRef.current.muted);
//     }
//   };

//   return (
//     <div 
//       className="relative w-full overflow-hidden bg-gray-50 dark:bg-gray-900 border-b border-gray-200/50 dark:border-gray-800/50 pt-[80px]"
//       onMouseEnter={stopAutoplay}
//       onMouseLeave={startAutoplay}
//     >
//       {/* Decorative Background Blobs for 3D depth */}
//       <div className="absolute top-1/4 left-10 w-72 h-72 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
//       <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

//       {/* Main Slide Wrapper */}
//       <div className="relative max-w-7xl mx-auto min-h-[500px] md:min-h-[600px] flex items-center px-4 sm:px-6 lg:px-8 py-10">
//         <AnimatePresence mode="wait">
//           {slides.map((slide, index) => {
//             if (index !== currentSlide) return null;

//             return (
//               <motion.div
//                 key={slide.id}
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.6, ease: "easeInOut" }}
//                 className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
//               >
//                 {/* Left Side: Rich Luxury Text Content */}
//                 <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-4 md:space-y-6 order-2 lg:order-1 z-10">
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.1, duration: 0.5 }}
//                   >
//                     <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/30 rounded-full">
//                       {slide.badge}
//                     </span>
//                   </motion.div>

//                   <motion.h2
//                     initial={{ opacity: 0, y: 15 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2, duration: 0.5 }}
//                     className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-logo text-gray-900 dark:text-white"
//                   >
//                     {slide.title}
//                   </motion.h2>

//                   <motion.h3
//                     initial={{ opacity: 0, y: 15 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.3, duration: 0.5 }}
//                     className={`text-xl sm:text-2xl font-semibold bg-gradient-to-r ${slide.themeColor} bg-clip-text text-transparent`}
//                   >
//                     {slide.subtitle}
//                   </motion.h3>

//                   <motion.p
//                     initial={{ opacity: 0, y: 15 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.4, duration: 0.5 }}
//                     className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl"
//                   >
//                     {slide.description}
//                   </motion.p>

//                   {/* Buttons */}
//                   <motion.div
//                     initial={{ opacity: 0, y: 15 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.5, duration: 0.5 }}
//                     className="flex flex-wrap gap-4 pt-2"
//                   >
//                     <button
//                       onClick={() => {
//                         const productsSection = document.getElementById("featured-products") || document.getElementById("new-arrivals");
//                         if (productsSection) {
//                           productsSection.scrollIntoView({ behavior: "smooth" });
//                         } else {
//                           window.location.href = "/web/all-products";
//                         }
//                       }}
//                       className={`px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-xl bg-gradient-to-r ${slide.themeColor} hover:brightness-105 transition-all duration-300 transform hover:-translate-y-0.5`}
//                     >
//                       {slide.ctaText}
//                     </button>
//                     {slide.secondaryCtaText && (
//                       <button
//                         onClick={() => {
//                           window.location.href = "/web/about";
//                         }}
//                         className="px-6 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-0.5"
//                       >
//                         {slide.secondaryCtaText}
//                       </button>
//                     )}
//                   </motion.div>
//                 </div>

//                 {/* Right Side: 3D Floating Video / Image Showcase */}
//                 <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2 relative select-none">
//                   {slide.type === "video" ? (
//                     <div className="relative w-full max-w-[340px] sm:max-w-[400px] flex flex-col items-center justify-center group/video">
//                       {/* Ambient Glow Background */}
//                       <div className="absolute w-60 h-60 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 group-hover/video:scale-110 transition-transform duration-700" />
                      
//                       {/* Floating container holding the video */}
//                       <motion.div
//                         animate={{ y: [0, -12, 0] }}
//                         transition={{
//                           repeat: Infinity,
//                           duration: 4.5,
//                           ease: "easeInOut"
//                         }}
//                         className="relative w-full aspect-square flex items-center justify-center bg-transparent"
//                       >
//                         <video
//                           ref={videoRef}
//                           src={slide.src}
//                           autoPlay
//                           loop
//                           muted={isMuted}
//                           playsInline
//                           className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover/video:scale-105 mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180"
//                         />
                        
//                         {/* Audio Toggle Indicator Button */}
//                         <button
//                           onClick={toggleMute}
//                           className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 text-gray-800 dark:text-white backdrop-blur shadow-md hover:bg-white dark:hover:bg-gray-700 transition duration-300 opacity-0 group-hover/video:opacity-100 focus:opacity-100 z-20"
//                           title={isMuted ? "Unmute Video" : "Mute Video"}
//                         >
//                           {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
//                         </button>
//                       </motion.div>

//                       {/* 3D Platform Shadow */}
//                       <motion.div 
//                         animate={{
//                           scale: [1, 0.88, 1],
//                           opacity: [0.35, 0.22, 0.35]
//                         }}
//                         transition={{
//                           repeat: Infinity,
//                           duration: 4.5,
//                           ease: "easeInOut"
//                         }}
//                         className="w-48 h-4 bg-black/20 dark:bg-black/50 rounded-full blur-md mt-2 -z-10"
//                       />
//                     </div>
//                   ) : (
//                     <div className="relative w-full max-w-[340px] sm:max-w-[400px] flex flex-col items-center justify-center group/img">
//                       {/* Ambient Glow */}
//                       <div className={`absolute w-60 h-60 bg-gradient-to-tr ${slide.themeColor} opacity-20 dark:opacity-10 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 group-hover/img:scale-110 transition-transform duration-700`} />

//                       {/* Floating Image Wrapper */}
//                       <motion.div
//                         animate={{ y: [0, -10, 0] }}
//                         transition={{
//                           repeat: Infinity,
//                           duration: 5,
//                           ease: "easeInOut"
//                         }}
//                         className="relative w-full aspect-square flex items-center justify-center p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl border border-white/50 dark:border-gray-700/40 shadow-xl overflow-hidden"
//                       >
//                         <img
//                           src={slide.src}
//                           alt={slide.title}
//                           className="w-full h-full object-cover rounded-xl shadow-inner transition-transform duration-500 group-hover/img:scale-105"
//                         />
//                       </motion.div>

//                       {/* Platform Shadow */}
//                       <motion.div 
//                         animate={{
//                           scale: [1, 0.9, 1],
//                           opacity: [0.3, 0.18, 0.3]
//                         }}
//                         transition={{
//                           repeat: Infinity,
//                           duration: 5,
//                           ease: "easeInOut"
//                         }}
//                         className="w-56 h-4 bg-black/25 dark:bg-black/60 rounded-full blur-md mt-4 -z-10"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             );
//           })}
//         </AnimatePresence>
//       </div>

//       {/* Manual Slide Controls */}
//       <button
//         onClick={handlePrev}
//         className="absolute left-4 top-[55%] -translate-y-1/2 p-2.5 rounded-full bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 text-gray-800 dark:text-white backdrop-blur shadow hover:bg-white dark:hover:bg-gray-700 transition duration-300 z-20 cursor-pointer hidden md:flex items-center justify-center"
//         aria-label="Previous Slide"
//       >
//         <ChevronLeft size={20} />
//       </button>

//       <button
//         onClick={handleNext}
//         className="absolute right-4 top-[55%] -translate-y-1/2 p-2.5 rounded-full bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 text-gray-800 dark:text-white backdrop-blur shadow hover:bg-white dark:hover:bg-gray-700 transition duration-300 z-20 cursor-pointer hidden md:flex items-center justify-center"
//         aria-label="Next Slide"
//       >
//         <ChevronRight size={20} />
//       </button>

//       {/* Slide Indicators / Dots */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2.5 z-20">
//         {slides.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => setCurrentSlide(i)}
//             className={`h-2.5 rounded-full transition-all duration-300 ${
//               i === currentSlide 
//                 ? "w-8 bg-gradient-to-r from-amber-500 to-yellow-600 shadow-sm" 
//                 : "w-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
//             }`}
//             aria-label={`Go to slide ${i + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Carosel;



