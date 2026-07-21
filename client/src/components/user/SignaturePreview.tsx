// import React, { useState } from "react";
// import { ShoppingBag, Star, ShieldCheck, Truck, RefreshCw } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useCart } from "../../hooks/useCart";

// export const SignaturePreview: React.FC = () => {
//   const navigate = useNavigate();
//   const { addToCart } = useCart();

//   const [selectedSize, setSelectedSize] = useState<string>("100ML");
//   const [quantity, setQuantity] = useState<number>(1);
//   const [isAdding, setIsAdding] = useState(false);

//   // Mock product details that align with existing database ID or schema
//   const productData = {
//     id: 2, // Matches Oud & Gold Edition ID if seeded, or fallback
//     title: "Oud & Gold Special Edition hyyyyyyyyy",
//     originalPrice: 12000,
//     price: 8500,
//     description:
//       "A mysterious, warm, and highly captivating blend. We combine rare organic agarwood (oud) with amber resin, patchouli leaf, and a top note of dry saffron. Perfectly distilled and housed in our handcrafted crystal vessel.",
//     productImage: "/m.z.jpg",
//     category: "Men",
//     stock: 12,
//   };

//   let displayPrice = productData.price;
//   if (selectedSize === "15ML") {
//     displayPrice = Math.round(displayPrice * 0.4);
//   } else if (selectedSize === "50ML") {
//     displayPrice = Math.round(displayPrice * 0.75);
//   }

//   const handleAddToCart = async (checkoutNow = false) => {
//     setIsAdding(true);
//     try {
//       await addToCart(productData.id, quantity);
//       toast.success(`${productData.title} added to cart!`);
//       if (checkoutNow) navigate("/web/checkout");
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to add to cart");
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   return (
//     <div className="mt-16 rounded-[40px] p-8 md:p-16 border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/40 backdrop-blur-md">
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

//         {/* Left Side: Product Gallery & Zoom */}
//         <div className="lg:col-span-6 flex flex-col items-center">
//           <div className="relative aspect-square w-full max-w-[450px] overflow-hidden rounded-3xl group bg-white dark:bg-neutral-900 shadow-sm border border-neutral-100 dark:border-neutral-900">
//             <img
//               src={productData.productImage}
//               alt={productData.title}
//               className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
//               onError={(e) => {
//                 e.currentTarget.src =
//                   "https://scentsnsecrets.com/cdn/shop/files/Category_Pic.jpg2_8916d01e-88d5-4da1-8116-e75e132c7451_600x.webp?v=1755089833";
//               }}
//             />
//             <div className="absolute right-4 bottom-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] tracking-widest text-white uppercase font-light">
//               Interactive Preview
//             </div>
//           </div>
//         </div>

//         {/* Right Side: Options & Direct Purchase */}
//         <div className="lg:col-span-6 space-y-6">
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <span className="px-2.5 py-0.5 text-[9px] tracking-widest font-bold bg-amber-500 text-white rounded-full uppercase">
//                 Signature Collection
//               </span>
//               <div className="flex text-amber-400 items-center gap-0.5">
//                 <Star size={12} fill="currentColor" className="stroke-none" />
//                 <span className="text-xs text-neutral-800 dark:text-neutral-200 font-semibold ml-0.5">
//                   4.9 (182 Reviews)
//                 </span>
//               </div>
//             </div>
//             <h2 className="text-3xl sm:text-4xl font-light text-neutral-900 dark:text-white tracking-wide">
//               {productData.title}
//             </h2>
//           </div>

//           <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
//             {productData.description}
//           </p>

//           {/* Pricing */}
//           <div className="flex items-baseline gap-3 pt-2">
//             <span className="text-3xl font-semibold text-neutral-900 dark:text-white">
//               Rs. {displayPrice}
//             </span>
//             <span className="text-sm text-neutral-400 line-through">
//               Rs. {productData.originalPrice}
//             </span>
//             <span className="text-xs text-emerald-500 font-medium ml-2">
//               In Stock (Guaranteed Delivery)
//             </span>
//           </div>

//           {/* Selection configuration */}
//           <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
//             {/* Size Variants */}
//             <div>
//               <span className="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold block mb-2">
//                 Size / Volume
//               </span>
//               <div className="flex gap-3">
//                 {["15ML", "50ML", "100ML"].map((size) => (
//                   <button
//                     key={size}
//                     onClick={() => setSelectedSize(size)}
//                     className={`px-4 py-2 text-xs font-semibold tracking-wider rounded-lg border transition-all duration-300 ${selectedSize === size
//                         ? "bg-black dark:bg-white text-white dark:text-black border-transparent shadow-md"
//                         : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 bg-transparent hover:border-neutral-400"
//                       }`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Quantity */}
//             <div>
//               <span className="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold block mb-2">
//                 Quantity
//               </span>
//               <div className="inline-flex items-center border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-900/50">
//                 <button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="px-3.5 py-1.5 text-neutral-500 hover:text-black dark:hover:text-white transition-colors duration-300"
//                 >
//                   -
//                 </button>
//                 <span className="px-4 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
//                   {quantity}
//                 </span>
//                 <button
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="px-3.5 py-1.5 text-neutral-500 hover:text-black dark:hover:text-white transition-colors duration-300"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Action buttons */}
//           <div className="space-y-3 pt-4">
//             <div className="flex gap-4">
//               <button
//                 onClick={() => handleAddToCart(false)}
//                 disabled={isAdding}
//                 className="flex-1 py-3.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition duration-300"
//               >
//                 {isAdding ? (
//                   <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <>
//                     <ShoppingBag size={14} />
//                     <span>Add to Bag</span>
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={() => handleAddToCart(true)}
//                 className="flex-1 py-3.5 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-xl text-xs font-semibold uppercase tracking-wider transition duration-300"
//               >
//                 Buy Now
//               </button>
//             </div>

//             {/* Trust Badges */}
//             <div className="grid grid-cols-3 gap-2 pt-4 text-[10px] text-center text-neutral-400 dark:text-neutral-500">
//               <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-900">
//                 <ShieldCheck size={14} className="text-emerald-500" />
//                 <span>Secure SSL Checkout</span>
//               </div>
//               <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-900">
//                 <Truck size={14} className="text-blue-500" />
//                 <span>Complimentary Delivery</span>
//               </div>
//               <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-900">
//                 <RefreshCw size={14} className="text-amber-500" />
//                 <span>Easy Exchange Sizing</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignaturePreview;
