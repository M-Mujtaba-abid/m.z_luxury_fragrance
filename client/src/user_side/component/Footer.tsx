import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        {/* Brand / About */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Luxury Fragrance M.Z
          </h2>
          <p className="text-sm">
            Your trusted online grocery store with fresh products delivered to
            your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/web/Men"
                className="transition duration-300 hover:text-blue-400 hover:drop-shadow-[0_0_8px_#3b82f6]"
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="/web/about"
                className="transition duration-300 hover:text-blue-400 hover:drop-shadow-[0_0_8px_#3b82f6]"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/web/contact"
                className="transition duration-300 hover:text-blue-400 hover:drop-shadow-[0_0_8px_#3b82f6]"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Customer Service
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/privacy"
                className="transition duration-300 hover:text-blue-400 hover:drop-shadow-[0_0_8px_#3b82f6]"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="transition duration-300 hover:text-blue-400 hover:drop-shadow-[0_0_8px_#3b82f6]"
              >
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="transition duration-300 hover:text-blue-400 hover:drop-shadow-[0_0_8px_#3b82f6]"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="transition duration-300 hover:text-pink-400 hover:drop-shadow-[0_0_8px_#ec4899]"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="transition duration-300 hover:text-sky-400 hover:drop-shadow-[0_0_8px_#38bdf8]"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="transition duration-300 hover:text-blue-500 hover:drop-shadow-[0_0_8px_#3b82f6]"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} M.Z All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
