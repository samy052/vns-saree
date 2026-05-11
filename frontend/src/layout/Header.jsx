import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useState, useEffect } from "react";
import "./Header.css";

const Header = ({ activeItem }) => {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isAuthPage = location.pathname === "/login";
  const userName = user?.name || "User";
  const firstName = userName.split(" ")[0];
  const userPhone = user?.phone || "Welcome to Banarasi Kala";

  // Check if current path is a policy page
  const isPolicyPage = [
    "/privacy-policy",
    "/refund-policy",
    "/return-exchange",
    "/shipping-policy",
    "/terms-conditions",
  ].includes(location.pathname);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/collection?search=${encodeURIComponent(q)}`);
    } else {
      navigate("/collection");
    }
    setSearchQuery("");
  };

  const closeProfile = () => setProfileOpen(false);

  const handleLogout = () => {
    logout();
    closeProfile();
    navigate("/");
  };

  const goProtected = (path) => {
    closeProfile();
    if (user) {
      navigate(path);
    } else {
      navigate("/login", { state: { from: { pathname: path } } });
    }
  };

  return (
    <>
      {/* Top Notification Bar with Marquee */}
      <div className="bg-gradient-to-r from-[#800020] via-[#B8860B] to-[#800020] text-[#FFD700] text-[11px] py-3 px-4 lg:px-12 text-center tracking-[0.15em] uppercase font-bold overflow-hidden relative">
        <div className="marquee-wrapper">
          <span className="marquee-content">
            Premium Banarasi Sarees at Best Prices | Free Shipping | Pure Silk |
            Handcrafted with Love | Premium Quality Guaranteed | Shop Now
          </span>
          <span className="marquee-content">
            Premium Banarasi Sarees at Best Prices | Free Shipping | Pure Silk |
            Handcrafted with Love | Premium Quality Guaranteed | Shop Now
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b-2 border-[#D4AF37]/40 shadow-[0_4px_30px_rgba(128,0,32,0.15)] transition-all duration-500 relative">
        <nav className="w-full px-4 lg:px-12 h-20 flex items-center justify-between">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden flex flex-col items-center justify-center w-11 h-11 border-2 rounded-lg shadow-md space-y-1.5 focus:outline-none active:scale-95 transition-all ${mobileMenuOpen ? "bg-[#800020] border-white" : "bg-white border-[#D4AF37]"}`}
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${mobileMenuOpen ? "bg-white rotate-45 translate-y-2" : "bg-[#800020]"}`}
              ></span>
              <span
                className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${mobileMenuOpen ? "bg-white opacity-0" : "bg-[#800020]"}`}
              ></span>
              <span
                className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${mobileMenuOpen ? "bg-white -rotate-45 -translate-y-2" : "bg-[#800020]"}`}
              ></span>
            </button>

            {/* Logo */}
            <Link
              to="/"
              id="nav-logo-link"
              className="flex items-center gap-2 group"
            >
              <div className="w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-all duration-300 overflow-hidden">
                <img
                  src={logo}
                  alt="VNS Saree Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* <div className="flex flex-col">
                <span className="brand-font text-xl lg:text-2xl font-bold tracking-tighter maroon-shimmer">
                  Banarasi
                </span>
                <span className="text-[20px] lg:text-[20px] uppercase tracking-[0.2em] -mt-0.5 font-bold gold-shimmer animate-tracking-breathe">
                  KALA
                </span>
              </div> */}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link
              to="/"
              className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group ${activeItem === "home" ? "text-[#800020]" : "text-gray-600 hover:text-[#800020]"}`}
            >
              Home
              <span
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-[#D4AF37] transition-all duration-300 ${activeItem === "home" ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </Link>
            <Link
              to="/collection"
              className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group ${activeItem === "collections" ? "text-[#800020]" : "text-gray-600 hover:text-[#800020]"}`}
            >
              Shop
              <span
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-[#D4AF37] transition-all duration-300 ${activeItem === "collections" ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </Link>
            <Link
              to="/about"
              className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group ${activeItem === "about" ? "text-[#800020]" : "text-gray-600 hover:text-[#800020]"}`}
            >
              About
              <span
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-[#D4AF37] transition-all duration-300 ${activeItem === "about" ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </Link>
            <Link
              to="/contact"
              className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group ${activeItem === "contact" ? "text-[#800020]" : "text-gray-600 hover:text-[#800020]"}`}
            >
              Contact
              <span
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-[#D4AF37] transition-all duration-300 ${activeItem === "contact" ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </Link>
            {/* Policy Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPolicyOpen(true)}
              onMouseLeave={() => setPolicyOpen(false)}
            >
              <button
                className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group flex items-center gap-1 ${isPolicyPage ? "text-[#800020]" : "text-gray-600 hover:text-[#800020]"}`}
              >
                Policy
                <iconify-icon
                  icon="lucide:chevron-down"
                  className="text-sm"
                ></iconify-icon>
                <span
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-[#D4AF37] transition-all duration-300 ${isPolicyPage ? "w-full" : "w-0 group-hover:w-full"}`}
                ></span>
              </button>

              {/* Policy Dropdown Menu */}
              {policyOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-[#D4AF37]/20 py-2 z-50">
                  <Link
                    to="/privacy-policy"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFF8F0] hover:text-[#800020] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/refund-policy"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFF8F0] hover:text-[#800020] transition-colors"
                  >
                    Refund Policy
                  </Link>
                  <Link
                    to="/return-exchange"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFF8F0] hover:text-[#800020] transition-colors"
                  >
                    Return & Exchange
                  </Link>
                  <Link
                    to="/shipping-policy"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFF8F0] hover:text-[#800020] transition-colors"
                  >
                    Shipping Policy
                  </Link>
                  <Link
                    to="/terms-conditions"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFF8F0] hover:text-[#800020] transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/testimonials"
              className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group ${activeItem === "blogs" ? "text-[#800020]" : "text-gray-600 hover:text-[#800020]"}`}
            >
              Blogs
              <span
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-[#D4AF37] transition-all duration-300 ${activeItem === "blogs" ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </Link>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className={`hidden md:flex items-center rounded-full border-2 transition-all duration-300 overflow-hidden ${
                searchFocused
                  ? "border-[#800020] bg-white shadow-lg shadow-[#800020]/10 w-72"
                  : "border-[#D4AF37]/40 bg-white w-56"
              }`}
            >
              <button
                type="submit"
                className={`pl-4 pr-2 flex items-center justify-center transition-colors ${
                  searchFocused ? "text-[#800020]" : "text-gray-400"
                }`}
              >
                <iconify-icon
                  icon="lucide:search"
                  className="text-base"
                ></iconify-icon>
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search sarees, silk, wedding..."
                className="bg-transparent border-none focus:ring-0 text-xs tracking-wider pr-4 py-2.5 w-full text-gray-700 placeholder:text-gray-400 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="pr-3 text-gray-400 hover:text-[#800020] transition-colors"
                >
                  <iconify-icon
                    icon="lucide:x"
                    className="text-sm"
                  ></iconify-icon>
                </button>
              )}
            </form>

            <div className="header-actions flex items-stretch text-gray-700">
              {/* Mobile search icon */}
              <button
                onClick={() => navigate("/collection")}
                className="md:hidden header-action-item hover:text-[#D4AF37]"
              >
                <iconify-icon
                  icon="lucide:search"
                  className="text-xl"
                ></iconify-icon>
                <span>Search</span>
              </button>

              {!isAuthPage && (
                <div
                  className="profile-hover-wrap"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button
                    type="button"
                    className={`header-action-item ${profileOpen ? "is-active" : ""}`}
                    aria-expanded={profileOpen}
                    aria-label="Profile menu"
                  >
                    <iconify-icon
                      icon="lucide:user"
                      className="text-xl"
                    ></iconify-icon>
                    <span>Profile</span>
                  </button>

                  {profileOpen && (
                    <div className="profile-hover-panel">
                      {user ? (
                        <>
                          <div className="profile-panel-head">
                            <p className="profile-hello">Hello {firstName}</p>
                            <p className="profile-phone">{userPhone}</p>
                          </div>

                          <div className="profile-panel-group">
                            <button
                              type="button"
                              onClick={() => goProtected("/cart")}
                            >
                              Orders
                            </button>
                            <button
                              type="button"
                              onClick={() => goProtected("/wishlist")}
                            >
                              Wishlist
                            </button>
                            <button
                              type="button"
                              onClick={() => goProtected("/feedback")}
                            >
                              Feedback
                            </button>
                            <Link to="/contact" onClick={closeProfile}>
                              Contact Us
                            </Link>
                          </div>

                          <div className="profile-panel-group">
                            <button type="button" onClick={handleLogout}>
                              Logout
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="profile-panel-head">
                            <p className="profile-hello">Welcome</p>
                            <p className="profile-phone">
                              Login to see orders and wishlist
                            </p>
                          </div>
                          <Link
                            to="/login"
                            onClick={closeProfile}
                            className="profile-login-btn"
                          >
                            Login / Signup
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => goProtected("/wishlist")}
                className="header-action-item"
              >
                <span className="relative flex">
                  <iconify-icon
                    icon="lucide:heart"
                    className="text-xl"
                  ></iconify-icon>
                  {getWishlistCount() > 0 && (
                    <span className="cart-badge">{getWishlistCount()}</span>
                  )}
                </span>
                <span>Wishlist</span>
              </button>

              <button
                onClick={() => goProtected("/cart")}
                className="header-action-item relative"
              >
                <span className="relative flex">
                  <iconify-icon
                    icon="lucide:shopping-bag"
                    className="text-xl"
                  ></iconify-icon>
                  {getCartCount() > 0 && (
                    <span className="cart-badge">{getCartCount()}</span>
                  )}
                </span>
                <span>Bag</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer - Outside Header */}
      <div
        className={`lg:hidden fixed inset-0 z-[100] transition-all duration-300 ${mobileMenuOpen ? "visible" : "invisible"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Drawer Panel - Solid White */}
        <div
          className={`fixed top-0 right-0 h-full w-[280px] shadow-2xl transform transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ backgroundColor: "#ffffff" }}
        >
          {/* Close Button */}
          <div
            className="flex items-center justify-between p-4 border-b border-[#D4AF37]/20"
            style={{ backgroundColor: "#ffffff" }}
          >
            <span className="text-[#800020] font-bold text-lg">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#800020] transition-colors"
              aria-label="Close menu"
            >
              <iconify-icon icon="lucide:x" className="text-2xl"></iconify-icon>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav
            className="flex flex-col py-4"
            style={{ backgroundColor: "#ffffff" }}
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-6 py-3 text-sm font-bold tracking-[0.15em] uppercase transition-colors ${activeItem === "home" ? "text-[#800020]" : "text-gray-700 hover:text-[#800020]"}`}
              style={{
                backgroundColor: activeItem === "home" ? "#FFF8F0" : "#ffffff",
              }}
            >
              Home
            </Link>
            <Link
              to="/collection"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-6 py-3 text-sm font-bold tracking-[0.15em] uppercase transition-colors ${activeItem === "collections" ? "text-[#800020]" : "text-gray-700 hover:text-[#800020]"}`}
              style={{
                backgroundColor:
                  activeItem === "collections" ? "#FFF8F0" : "#ffffff",
              }}
            >
              Shop
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-6 py-3 text-sm font-bold tracking-[0.15em] uppercase transition-colors ${activeItem === "about" ? "text-[#800020]" : "text-gray-700 hover:text-[#800020]"}`}
              style={{
                backgroundColor: activeItem === "about" ? "#FFF8F0" : "#ffffff",
              }}
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-6 py-3 text-sm font-bold tracking-[0.15em] uppercase transition-colors ${activeItem === "contact" ? "text-[#800020]" : "text-gray-700 hover:text-[#800020]"}`}
              style={{
                backgroundColor:
                  activeItem === "contact" ? "#FFF8F0" : "#ffffff",
              }}
            >
              Contact
            </Link>
            <Link
              to="/testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-6 py-3 text-sm font-bold tracking-[0.15em] uppercase transition-colors ${activeItem === "blogs" ? "text-[#800020]" : "text-gray-700 hover:text-[#800020]"}`}
              style={{
                backgroundColor: activeItem === "blogs" ? "#FFF8F0" : "#ffffff",
              }}
            >
              Blogs
            </Link>

            {/* Divider */}
            <div
              className="my-4 border-t border-[#D4AF37]/20"
              style={{ backgroundColor: "#ffffff" }}
            ></div>

            {/* Policy Section */}
            <span
              className="px-6 py-2 text-xs text-gray-500 uppercase tracking-wider"
              style={{ backgroundColor: "#ffffff" }}
            >
              Policies
            </span>
            <Link
              to="/privacy-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-2 text-sm text-gray-600 hover:text-[#800020] transition-colors"
              style={{ backgroundColor: "#ffffff" }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/refund-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-2 text-sm text-gray-600 hover:text-[#800020] transition-colors"
              style={{ backgroundColor: "#ffffff" }}
            >
              Refund Policy
            </Link>
            <Link
              to="/return-exchange"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-2 text-sm text-gray-600 hover:text-[#800020] transition-colors"
              style={{ backgroundColor: "#ffffff" }}
            >
              Return & Exchange
            </Link>
            <Link
              to="/shipping-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-2 text-sm text-gray-600 hover:text-[#800020] transition-colors"
              style={{ backgroundColor: "#ffffff" }}
            >
              Shipping Policy
            </Link>
            <Link
              to="/terms-conditions"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-2 text-sm text-gray-600 hover:text-[#800020] transition-colors"
              style={{ backgroundColor: "#ffffff" }}
            >
              Terms & Conditions
            </Link>

            {/* Divider */}
            <div
              className="my-4 border-t border-[#D4AF37]/20"
              style={{ backgroundColor: "#ffffff" }}
            ></div>

            {/* User Actions */}
            <span
              className="px-6 py-2 text-xs text-gray-500 uppercase tracking-wider"
              style={{ backgroundColor: "#ffffff" }}
            >
              Account
            </span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                goProtected("/cart");
              }}
              className="px-6 py-3 text-left text-sm font-bold tracking-[0.15em] uppercase text-gray-700 hover:text-[#800020] transition-colors flex items-center gap-3"
              style={{ backgroundColor: "#ffffff" }}
            >
              <iconify-icon
                icon="lucide:shopping-bag"
                className="text-lg"
              ></iconify-icon>
              My Orders
              {getCartCount() > 0 && (
                <span className="ml-auto bg-[#800020] text-[#D4AF37] text-xs font-bold px-2 py-0.5 rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                goProtected("/wishlist");
              }}
              className="px-6 py-3 text-left text-sm font-bold tracking-[0.15em] uppercase text-gray-700 hover:text-[#800020] transition-colors flex items-center gap-3"
              style={{ backgroundColor: "#ffffff" }}
            >
              <iconify-icon
                icon="lucide:heart"
                className="text-lg"
              ></iconify-icon>
              Wishlist
              {getWishlistCount() > 0 && (
                <span className="ml-auto bg-[#800020] text-[#D4AF37] text-xs font-bold px-2 py-0.5 rounded-full">
                  {getWishlistCount()}
                </span>
              )}
            </button>
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="px-6 py-3 text-left text-sm font-bold tracking-[0.15em] uppercase text-gray-700 hover:text-[#800020] transition-colors flex items-center gap-3"
                style={{ backgroundColor: "#ffffff" }}
              >
                <iconify-icon
                  icon="lucide:log-out"
                  className="text-lg"
                ></iconify-icon>
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 text-sm font-bold tracking-[0.15em] uppercase text-[#800020] bg-[#FFF8F0] mx-4 mt-2 rounded text-center"
              >
                Login / Signup
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
