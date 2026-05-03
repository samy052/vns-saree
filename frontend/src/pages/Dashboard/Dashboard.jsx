import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // 3D Tilt Effect
    const cards = root.querySelectorAll('.profile-card-3d');

    cards.forEach(card => {
      const inner = card.querySelector('.profile-card-inner');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        inner.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });

    // Reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1 });

    if (root) {
      root.querySelectorAll('.reveal-section').forEach(section => observer.observe(section));
    }

  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F5F1E8]" ref={rootRef}>



      <main className="flex-grow py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Profile Breadcrumbs */}
          <nav className="flex text-[10px] uppercase tracking-[0.2em] text-[#3D2817]/60 mb-10 font-bold">
            <Link to="/" className="hover:text-[#800020]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#800020]">My Account</span>
          </nav>

          {/* User Hero Section */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-[#D4AF37]/20 mb-12 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative reveal-section">
            <div className="absolute top-0 right-0 w-64 h-full opacity-15 pointer-events-none">
              <img src="https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?auto=format&fit=crop&q=80" className="w-full h-full object-contain" alt="pattern" />
            </div>

            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-[#D4AF37] p-1 shadow-2xl overflow-hidden bg-white">
                <img src="https://i.pravatar.cc/150?u=aditirao" alt="Aditi Rao" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#800020] w-12 h-12 rounded-full flex items-center justify-center border-2 border-white animate-float">
                <iconify-icon icon="mdi:crown" className="text-2xl text-[#D4AF37]"></iconify-icon>
              </div>
            </div>

            <div className="flex-grow text-center md:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-[#800020] mb-2 brand-font uppercase tracking-tight">Aditi Rao Hydari</h1>
              <p className="serif-text italic text-xl text-[#3D2817]/60 mb-6">Heritage Member since 2022</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-[#800020]/5 px-4 py-2 rounded-full border border-[#800020]/10 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#800020]">Loyalty Tier:</span>
                  <span className="text-xs font-bold gold-shimmer uppercase tracking-widest">Silk Elite</span>
                </div>
                <div className="bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/20 flex items-center gap-2">
                  <iconify-icon icon="lucide:gem" className="text-[#800020]"></iconify-icon>
                  <span className="text-xs font-bold text-[#3D2817] uppercase tracking-widest">2,450 Points</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button className="px-8 py-3 bg-[#800020] text-[#D4AF37] font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#3D2817] transition-colors shadow-lg">
                Edit Profile
              </button>
              <Link to="/login" className="px-8 py-3 border border-[#800020] text-[#800020] font-bold rounded-xl text-[10px] uppercase text-center tracking-widest hover:bg-[#800020] hover:text-white transition-colors">
                Logout
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Sidebar Nav */}
            <aside className="lg:col-span-3 space-y-2">
              <button className="w-full sidebar-link active flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all">
                <iconify-icon icon="lucide:layout-dashboard" className="text-xl"></iconify-icon>
                Dashboard
              </button>
              <button className="w-full sidebar-link flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-[#3D2817]/60 hover:bg-[#D4AF37]/10 hover:text-[#800020] transition-all">
                <iconify-icon icon="lucide:shopping-bag" className="text-xl"></iconify-icon>
                My Orders
              </button>
              <button className="w-full sidebar-link flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-[#3D2817]/60 hover:bg-[#D4AF37]/10 hover:text-[#800020] transition-all">
                <iconify-icon icon="lucide:heart" className="text-xl"></iconify-icon>
                Wishlist
              </button>
              <button className="w-full sidebar-link flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-[#3D2817]/60 hover:bg-[#D4AF37]/10 hover:text-[#800020] transition-all">
                <iconify-icon icon="lucide:map-pin" className="text-xl"></iconify-icon>
                Saved Addresses
              </button>
              <button className="w-full sidebar-link flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-[#3D2817]/60 hover:bg-[#D4AF37]/10 hover:text-[#800020] transition-all">
                <iconify-icon icon="lucide:award" className="text-xl"></iconify-icon>
                Heritage Rewards
              </button>
              <button className="w-full sidebar-link flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-[#3D2817]/60 hover:bg-[#D4AF37]/10 hover:text-[#800020] transition-all">
                <iconify-icon icon="lucide:settings" className="text-xl"></iconify-icon>
                Account Settings
              </button>
            </aside>

            {/* Main Dashboard Content */}
            <div className="lg:col-span-9 space-y-12">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-section">
                <div className="profile-card-3d">
                  <div className="profile-card-inner bg-white p-8 rounded-2xl border border-[#D4AF37]/20 shadow-sm transition-all duration-300">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Orders</p>
                    <h3 className="text-3xl font-bold text-[#800020]">12 Pieces</h3>
                    <div className="mt-4 h-1 w-full bg-[#F5F1E8] rounded-full overflow-hidden">
                      <div className="h-full bg-[#800020] w-3/4"></div>
                    </div>
                  </div>
                </div>
                <div className="profile-card-3d">
                  <div className="profile-card-inner bg-white p-8 rounded-2xl border border-[#D4AF37]/20 shadow-sm transition-all duration-300">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Heritage Points</p>
                    <h3 className="text-3xl font-bold text-[#D4AF37]">2,450</h3>
                    <p className="text-[8px] mt-2 text-green-600 font-bold uppercase tracking-widest">+240 recently earned</p>
                  </div>
                </div>
                <div className="profile-card-3d">
                  <div className="profile-card-inner bg-[#800020] p-8 rounded-2xl shadow-xl transition-all duration-300">
                    <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-2">Current Reward</p>
                    <h3 className="text-xl font-bold text-white uppercase brand-font tracking-tight">15% Voucher</h3>
                    <button className="mt-4 text-[10px] font-bold text-[#D4AF37] underline tracking-widest uppercase">REDEEM NOW</button>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <section className="reveal-section">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-[#3D2817] brand-font uppercase tracking-widest">Active Heritage Orders</h2>
                  <Link to="/orders" className="text-[10px] font-bold text-[#800020] uppercase tracking-widest hover:underline">View All History</Link>
                </div>

                <div className="space-y-6">
                  {/* Order Card 1 */}
                  <div className="bg-white rounded-2xl p-6 border border-[#D4AF37]/10 shadow-sm flex flex-col md:flex-row items-center gap-8 group hover:border-[#D4AF37]/30 transition-all">
                    <div className="w-24 h-32 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                      <img src="https://images.unsplash.com/photo-1583391733956-6c7827448d08?auto=format&fit=crop&q=80" alt="Saree" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <h4 className="font-bold text-[#800020] text-lg uppercase brand-font tracking-tight">Royal Crimson Katan Silk</h4>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Order #BH-98234-A • Oct 10, 2024</p>
                        </div>
                        <p className="text-xl font-bold text-[#3D2817]">₹42,500</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#D4AF37] w-1/3"></div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Artisan Prep</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      <button className="px-6 py-2 bg-[#800020] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#3D2817] transition-all shadow-md">
                        Track Order
                      </button>
                      <button className="px-6 py-2 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Order Card 2 (Delivered) */}
                  <div className="bg-white/60 rounded-2xl p-6 border border-[#D4AF37]/10 shadow-sm flex flex-col md:flex-row items-center gap-8 opacity-80 group">
                    <div className="w-24 h-32 rounded-xl overflow-hidden shadow-md flex-shrink-0 grayscale-[50%] group-hover:grayscale-0 transition-all duration-500">
                      <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80" alt="Saree" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <h4 className="font-bold text-[#800020] text-lg uppercase brand-font tracking-tight">Ivory Moon Organza</h4>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Order #BH-87122-C • Sept 15, 2024</p>
                        </div>
                        <p className="text-xl font-bold text-[#3D2817]">₹28,200</p>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Delivered on Sept 19</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      <button className="px-6 py-2 border border-[#800020] text-[#800020] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#800020] hover:text-white transition-all">
                        Reorder Item
                      </button>
                      <button className="px-6 py-2 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                        Help / Support
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Two Column Grid for Wishlist & Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 reveal-section">
                {/* Wishlist Peek */}
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-[#3D2817] brand-font uppercase tracking-widest">Wishlist Highlight</h2>
                    <Link to="/wishlist" className="text-[10px] font-bold text-[#800020] uppercase tracking-widest">All 8 Items</Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg">
                      <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                        <p className="text-white font-bold text-xs uppercase tracking-widest">Emerald Jaal</p>
                        <p className="text-[#D4AF37] text-[10px] font-bold">₹34,500</p>
                      </div>
                      <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 text-[#800020] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <iconify-icon icon="lucide:shopping-cart"></iconify-icon>
                      </button>
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg">
                      <img src="https://images.unsplash.com/photo-1590736704728-f4730bb3c3af?auto=format&fit=crop&q=80" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                        <p className="text-white font-bold text-xs uppercase tracking-widest">Midnight Silk</p>
                        <p className="text-[#D4AF37] text-[10px] font-bold">₹22,900</p>
                      </div>
                      <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 text-[#800020] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <iconify-icon icon="lucide:shopping-cart"></iconify-icon>
                      </button>
                    </div>
                  </div>
                </section>

                {/* Addresses Peek */}
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-[#3D2817] brand-font uppercase tracking-widest">Primary Addresses</h2>
                    <button className="text-[10px] font-bold text-[#800020] uppercase tracking-widest hover:underline">Add New</button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-6 bg-white rounded-2xl border-2 border-[#800020] relative shadow-sm">
                      <div className="absolute top-4 right-4 bg-[#800020] text-[#D4AF37] text-[8px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">Default</div>
                      <h4 className="font-bold mb-1 uppercase text-xs tracking-widest">Home - Hyderabad</h4>
                      <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-widest font-semibold">
                        702, Heritage Heights, 4th Main Road<br/>
                        Jubilee Hills, Hyderabad, 500033
                      </p>
                      <div className="mt-4 flex gap-4 text-[10px] font-bold uppercase tracking-widest text-[#800020]">
                        <button className="hover:underline">Edit</button>
                        <button className="hover:underline text-gray-400">Delete</button>
                      </div>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm opacity-60">
                      <h4 className="font-bold mb-1 uppercase text-xs tracking-widest">Work - Mumbai</h4>
                      <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-widest font-semibold">
                        Starlight Studios, Floor 12, West Wing<br/>
                        Bandra Kurla Complex, Mumbai, 400051
                      </p>
                      <div className="mt-4 flex gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <button className="hover:text-[#800020]">Edit</button>
                        <button className="hover:text-[#800020]">Set Default</button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Dashboard;
