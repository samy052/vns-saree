import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ activeItem }) => {
  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-[#800020] text-[#D4AF37] text-xs py-2 px-4 text-center tracking-widest uppercase font-semibold border-b border-[#D4AF37]/30">
        Complimentary Worldwide Shipping on Bridal Masterpieces • Limited Festive Collection Live
      </div>

      <header className="sticky top-0 z-50 bg-[#F5F1E8]/95 backdrop-blur-md border-b border-[#D4AF37]/20 transition-all duration-300">
        <nav className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" id="nav-logo-link" className="flex flex-col items-center">
              <span className="brand-font text-2xl font-bold tracking-tighter text-[#800020]">Banaras</span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] -mt-1">Heritage</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link to="/" className={`text-sm font-medium tracking-wide transition-colors relative group ${activeItem === 'home' ? 'text-[#800020]' : 'text-[#3D2817] hover:text-[#800020]'}`}>
              Home
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#800020] transition-all ${activeItem === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/collection" className={`text-sm font-medium tracking-wide transition-colors relative group ${activeItem === 'collections' ? 'text-[#800020]' : 'text-[#3D2817] hover:text-[#800020]'}`}>
              Collections
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#800020] transition-all ${activeItem === 'collections' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/about" className={`text-sm font-medium tracking-wide transition-colors relative group ${activeItem === 'heritage' ? 'text-[#800020]' : 'text-[#3D2817] hover:text-[#800020]'}`}>
              Heritage
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#800020] transition-all ${activeItem === 'heritage' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/about" className={`text-sm font-medium tracking-wide transition-colors relative group ${activeItem === 'about' ? 'text-[#800020]' : 'text-[#3D2817] hover:text-[#800020]'}`}>
              About Us
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#800020] transition-all ${activeItem === 'about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center bg-white/50 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 focus-within:border-[#800020] transition-all">
              <iconify-icon icon="lucide:search" className="text-lg text-gray-400"></iconify-icon>
              <input type="text" placeholder="Search our weave..." className="bg-transparent border-none focus:ring-0 text-sm px-2 w-40 text-[#3D2817] placeholder:text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-5 text-[#3D2817]">
              <Link to="/login" className="hover:text-[#800020] transition-transform hover:scale-110">
                <iconify-icon icon="lucide:user" className="text-xl"></iconify-icon>
              </Link>
              <Link to="/cart" className="relative hover:text-[#800020] transition-transform hover:scale-110">
                <iconify-icon icon="lucide:shopping-bag" className="text-xl"></iconify-icon>
                <span className="absolute -top-1.5 -right-1.5 bg-[#800020] text-[#D4AF37] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
