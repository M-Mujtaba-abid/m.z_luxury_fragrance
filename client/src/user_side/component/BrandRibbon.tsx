import React from "react";

const BRAND_NAMES = [
  "CHANEL",
  "DIOR",
  "GUCCI",
  "AESOP",
  "TOM FORD",
  "LE LABO",
  "YSL BEAUTY",
  "ZARA",
  "DYSON",
  "HERMÈS"
];

export const BrandRibbon: React.FC = () => {
  return (
    <div className="w-full bg-luxury-ink text-luxury-cream py-6 overflow-hidden border-y border-luxury-gold/10 select-none">
      <div className="flex whitespace-nowrap gap-12 animate-[scroll_14s_linear_infinite]">
        {/* Double the list for infinite marquee */}
        {[...BRAND_NAMES, ...BRAND_NAMES].map((brand, idx) => (
          <div
            key={idx}
            className="inline-block text-sm md:text-base font-light tracking-[0.4em] hover:text-luxury-gold transition-colors duration-300 cursor-default uppercase"
          >
            {brand}
          </div>
        ))}
      </div>

      {/* Dynamic Keyframes added inline */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default BrandRibbon;
