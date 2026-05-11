import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="bg-[#800020] text-white pt-16 pb-8">
      <div className="w-full px-6 lg:px-16">
        {/* Main Footer Grid - 3 Columns like reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: About Us */}
          <div>
            <h4 className="text-white/80 uppercase tracking-wider text-sm font-medium mb-6">
              About Us
            </h4>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              At Banarasi Kala, we believe a saree is more than just attire - it
              is a symbol of grace, pride, and cultural richness. Our brand was
              built with the idea of bringing India's weaving traditions closer
              to today's generation, blending timeless elegance with a
              refreshing modern edge.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
              >
                <iconify-icon
                  icon="mdi:facebook"
                  className="text-white"
                ></iconify-icon>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
              >
                <iconify-icon
                  icon="mdi:instagram"
                  className="text-white"
                ></iconify-icon>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
              >
                <iconify-icon
                  icon="mdi:twitter"
                  className="text-white"
                ></iconify-icon>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
              >
                <iconify-icon
                  icon="mdi:youtube"
                  className="text-white"
                ></iconify-icon>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (replacing Our Collections) */}
          <div>
            <h4 className="text-white/80 uppercase tracking-wider text-sm font-medium mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/collection"
                  className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Shop All Sarees
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/testimonials"
                  className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link
                  to="/feedback"
                  className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Share Feedback
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div>
            <h4 className="text-white/80 uppercase tracking-wider text-sm font-medium mb-6">
              Policies
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/return-exchange"
                  className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Return & Exchange Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src={logo}
                alt="Banarasi Kala"
                className="w-full h-full object-contain"
              />
            </div>
            {/* <div>
              <span className="text-[#D4AF37] font-bold text-sm tracking-wider">
                BANARASI KALA
              </span>
            </div> */}
          </div>
          <p className="text-white/40 text-xs tracking-wider">
            © 2026 BANARASI KALA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
