import { useState, useEffect } from "react";

const slides = [
  {
    image: "/edit.jpg",
    // heading: "Fresh Organic Vegetables",
    // text: "Get the best quality organic veggies directly from farms.",
  },
  {
    image: "/image.jpg",
    // heading: "Daily Essentials",
    // text: "Affordable groceries delivered to your doorstep.",
  },
  {
    image: "/carosel.jpg",
    // heading: "Healthy Fruits",
    // text: "Juicy and fresh fruits for your healthy lifestyle.",
  },
  {
    image: "/m.z.jpg",
    // heading: "Dairy Products",
    // text: "Pure milk, butter, and cheese with guaranteed freshness.",
  },
  {
    image: "https://scentsnsecrets.com/cdn/shop/files/Website_1920_x_830_1_copy_1_1920x830_crop_center.webp?v=1749129011",
    heading: "",
    text: "",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  // Auto slide every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow-lg">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.heading}
            className="w-full h-full object-cover"
          />

          {/* Overlay Text */}
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
              {slide.heading}
            </h2>
            <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
              {slide.text}
            </p>
          </div>
        </div>
      ))}

      {/* Dots Indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
