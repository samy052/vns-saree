import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="bg-[#800020] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Socials */}
          <div className="lg:col-span-1">
            <Link to="/" id="footer-logo" className="flex flex-col items-start mb-6">
              <span className="brand-font text-3xl font-bold tracking-tighter text-[#D4AF37]">Banaras</span>
              <span className="text-xs tracking-[0.3em] uppercase text-white/70 -mt-1">Heritage</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Preserving the ancient craft of hand-weaving for the modern woman who values tradition.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                <iconify-icon icon="mdi:facebook"></iconify-icon>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                <iconify-icon icon="mdi:instagram"></iconify-icon>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                <iconify-icon icon="mdi:pinterest"></iconify-icon>
              </a>
            </div>
          </div>

          {/* Heritage Links */}
          <div>
            <h4 className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm mb-6">Our Heritage</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">The History of Weave</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Meet the Master Weavers</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Authenticity Guide</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Saree Care & Storage</a></li>
            </ul>
          </div>

          {/* Customer Support Links */}
          <div>
            <h4 className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm mb-6">Customer Concierge</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Track Your Masterpiece</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Blouse Stitching Guide</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Shipping & Deliveries</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm mb-6">Stay Elegant</h4>
            <p className="text-white/60 text-sm mb-4">Join our exclusive circle for first access to new collections and heritage stories.</p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email Address" className="w-full bg-white/10 border-b border-[#D4AF37]/50 py-3 px-0 focus:outline-none focus:border-[#D4AF37] text-sm text-white placeholder:text-white/30" />
              <button type="submit" className="absolute right-0 bottom-3 text-[#D4AF37] hover:scale-110 transition-transform">
                <iconify-icon icon="lucide:arrow-right-circle" className="text-2xl"></iconify-icon>
              </button>
            </form>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 tracking-widest">
          <p>© 2024 BANARAS HERITAGE PVT LTD. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#">PRIVACY POLICY</a>
            <a href="#">COOKIE SETTINGS</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
