import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = ({ activeItem }) => {
  const { getCartCount } = useCart();
  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-[#2D1B0E] via-[#800020] to-[#2D1B0E] text-[#D4AF37] text-[10px] py-2.5 px-4 text-center tracking-[0.3em] uppercase font-bold border-b border-[#D4AF37]/20">
        Complimentary Worldwide Shipping on Bridal Masterpieces <span className="mx-2 opacity-50">|</span> Limited Festive Collection Live
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-500">
        <nav className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" id="nav-logo-link" className="flex flex-col items-center group">
              <span className="brand-font text-2xl lg:text-3xl font-bold tracking-tighter maroon-shimmer">Banaras</span>
              <span className="text-[8px] lg:text-[9px] uppercase text-[#D4AF37] -mt-1 font-bold animate-tracking-breathe">Heritage</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link to="/" className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group ${activeItem === 'home' ? 'text-[#800020]' : 'text-gray-600 hover:text-[#800020]'}`}>
              Home
              <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-[#D4AF37] transition-all duration-300 ${activeItem === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/collection" className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group ${activeItem === 'collections' ? 'text-[#800020]' : 'text-gray-600 hover:text-[#800020]'}`}>
              Collections
              <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-[#D4AF37] transition-all duration-300 ${activeItem === 'collections' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/about" className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group ${activeItem === 'heritage' ? 'text-[#800020]' : 'text-gray-600 hover:text-[#800020]'}`}>
              Heritage
              <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-[#D4AF37] transition-all duration-300 ${activeItem === 'heritage' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/about" className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group ${activeItem === 'about' ? 'text-[#800020]' : 'text-gray-600 hover:text-[#800020]'}`}>
              About Us
              <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-[#D4AF37] transition-all duration-300 ${activeItem === 'about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center border-b border-gray-200 pb-1 focus-within:border-[#D4AF37] transition-all duration-300 group">
              <iconify-icon icon="lucide:search" className="text-lg text-gray-400 group-focus-within:text-[#D4AF37] transition-colors"></iconify-icon>
              <input type="text" placeholder="Search our weave..." className="bg-transparent border-none focus:ring-0 text-xs tracking-wider px-3 w-40 text-gray-700 placeholder:text-gray-400 outline-none" />
            </div>
            
            <div className="flex items-center space-x-5 text-gray-700">
              <Link to="/login" className="hover:text-[#D4AF37] transition-all duration-300 transform hover:-translate-y-1 hover:scale-110">
                <iconify-icon icon="lucide:user" className="text-xl"></iconify-icon>
              </Link>
              <Link to="/cart" className="relative hover:text-[#D4AF37] transition-all duration-300 transform hover:-translate-y-1 hover:scale-110">
                <iconify-icon icon="lucide:shopping-bag" className="text-xl"></iconify-icon>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#800020] text-[#D4AF37] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md animate-bounce">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
