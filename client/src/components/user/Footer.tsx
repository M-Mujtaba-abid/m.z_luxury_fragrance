import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-luxury-ink text-luxury-cream/70">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        {/* Brand / About */}
        <div>
          <h2 className="font-logo text-2xl font-bold text-luxury-cream mb-4">
            M.Z Luxury Fragrance
          </h2>
          <p className="text-sm text-luxury-cream/60">
            Handcrafted fragrances, thoughtfully composed to make your story
            unforgettable — delivered to your door.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-luxury-gold mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/Men"
                className="transition-colors duration-300 hover:text-luxury-gold"
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="transition-colors duration-300 hover:text-luxury-gold"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="transition-colors duration-300 hover:text-luxury-gold"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/wishlist"
                className="transition-colors duration-300 hover:text-luxury-gold"
              >
                Wishlist
              </a>
            </li>
            <li>
              <a
                href="/compare"
                className="transition-colors duration-300 hover:text-luxury-gold"
              >
                Compare
              </a>
            </li>
            <li>
              <a
                href="/testimonials"
                className="transition-colors duration-300 hover:text-luxury-gold"
              >
                Testimonials
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-luxury-gold mb-4">
            Customer Service
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/privacy"
                className="transition-colors duration-300 hover:text-luxury-gold"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="transition-colors duration-300 hover:text-luxury-gold"
              >
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-luxury-gold mb-4">
            Follow Us
          </h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-luxury-cream/70 transition-colors duration-300 hover:text-luxury-gold"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="text-luxury-cream/70 transition-colors duration-300 hover:text-luxury-gold"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="text-luxury-cream/70 transition-colors duration-300 hover:text-luxury-gold"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-luxury-cream/70 transition-colors duration-300 hover:text-luxury-gold"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-luxury-gold/15 py-4 text-center text-sm text-luxury-cream/50">
        © {new Date().getFullYear()} M.Z All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
