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
            Your trusted online grocery store with fresh products delivered to
            your doorstep.
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
                href="/web/Men"
                className="transition-colors duration-300 hover:text-luxury-gold"
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="/web/about"
                className="transition-colors duration-300 hover:text-luxury-gold"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/web/contact"
                className="transition-colors duration-300 hover:text-luxury-gold"
              >
                Contact
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
