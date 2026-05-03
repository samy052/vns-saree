import { Link } from 'react-router-dom';
import './Collection.css';

const Collection = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F5F1E8]">


      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex text-xs uppercase tracking-widest text-gray-500 mb-8">
          <Link to="/" id="breadcrumb-home" className="hover:text-[#800020]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#800020] font-bold">Collections</span>
        </nav>

        {/* Page Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D4AF37]/20 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#3D2817] mb-2 uppercase brand-font tracking-widest">Our Masterpieces</h1>
            <p className="serif-text italic text-gray-600 text-lg">Exploring the intersection of timeless silk and modern grace.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Sort By:</span>
            <select className="bg-white border border-[#D4AF37]/30 rounded-full px-6 py-2 text-sm focus:outline-none focus:border-[#800020] appearance-none cursor-pointer">
              <option>Newest Arrivals</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Popularity</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
            {/* Collection Type */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#800020] mb-6 border-b border-[#D4AF37]/30 pb-2">Category</h4>
              <div className="space-y-4">
                <label className="flex items-center group cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 border-[#D4AF37]/50 text-[#800020] focus:ring-[#800020] rounded-sm" />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-[#800020] transition-colors">Bridal Classics</span>
                </label>
                <label className="flex items-center group cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 border-[#D4AF37]/50 text-[#800020] focus:ring-[#800020] rounded-sm" />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-[#800020] transition-colors">Festival Silks</span>
                </label>
                <label className="flex items-center group cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 border-[#D4AF37]/50 text-[#800020] focus:ring-[#800020] rounded-sm" />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-[#800020] transition-colors">Traditional Katan</span>
                </label>
                <label className="flex items-center group cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 border-[#D4AF37]/50 text-[#800020] focus:ring-[#800020] rounded-sm" />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-[#800020] transition-colors">Contemporary Fusion</span>
                </label>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#800020] mb-6 border-b border-[#D4AF37]/30 pb-2">Price Range</h4>
              <div className="space-y-4">
                <input type="range" className="w-full accent-[#800020]" min="5000" max="200000" />
                <div className="flex justify-between text-xs font-bold text-gray-500 tracking-wider">
                  <span>₹5,000</span>
                  <span>₹2,00,000+</span>
                </div>
              </div>
            </div>

            {/* Fabric */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#800020] mb-6 border-b border-[#D4AF37]/30 pb-2">Fabric</h4>
              <div className="space-y-4">
                <label className="flex items-center group cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 border-[#D4AF37]/50 rounded-sm" />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-[#800020]">Pure Katan Silk</span>
                </label>
                <label className="flex items-center group cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 border-[#D4AF37]/50 rounded-sm" />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-[#800020]">Organza Zari</span>
                </label>
                <label className="flex items-center group cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 border-[#D4AF37]/50 rounded-sm" />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-[#800020]">Tussar Banarasi</span>
                </label>
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#800020] mb-6 border-b border-[#D4AF37]/30 pb-2">Color</h4>
              <div className="flex flex-wrap gap-3">
                <button className="w-8 h-8 rounded-full bg-[#800020] ring-2 ring-offset-2 ring-transparent hover:ring-[#D4AF37] transition-all"></button>
                <button className="w-8 h-8 rounded-full bg-[#D4AF37] ring-2 ring-offset-2 ring-transparent hover:ring-[#800020] transition-all"></button>
                <button className="w-8 h-8 rounded-full bg-[#3D2817] ring-2 ring-offset-2 ring-transparent hover:ring-[#D4AF37] transition-all"></button>
                <button className="w-8 h-8 rounded-full bg-[#2E4A3E] ring-2 ring-offset-2 ring-transparent hover:ring-[#D4AF37] transition-all"></button>
                <button className="w-8 h-8 rounded-full bg-[#E5E7EB] ring-2 ring-offset-2 ring-transparent hover:ring-[#800020] transition-all"></button>
              </div>
            </div>

            <button className="w-full py-4 bg-[#800020] text-[#D4AF37] font-bold text-xs uppercase tracking-widest hover:bg-[#3D2817] transition-colors rounded-sm shadow-lg">
              Apply Filters
            </button>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* Product Card 1 */}
              <div className="saree-card-3d">
                <div className="saree-card-inner group">
                  <Link to="/product/royal-crimson" className="block relative overflow-hidden aspect-[3/4] rounded-xl shadow-lg border border-[#D4AF37]/20">
                    <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80" alt="Crimson Katan Silk" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 z-10">
                      <button className="w-10 h-10 rounded-full bg-white/90 text-[#800020] flex items-center justify-center shadow-md hover:bg-[#800020] hover:text-white transition-colors">
                        <iconify-icon icon="lucide:heart"></iconify-icon>
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="flex items-center text-[#D4AF37] text-xs space-x-1 mb-1">
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <span className="ml-1 text-white opacity-80">(24)</span>
                      </div>
                    </div>
                  </Link>
                  <div className="mt-4 text-center px-2">
                    <h3 className="text-lg font-bold text-[#800020] mb-1 uppercase brand-font tracking-wider">The Royal Crimson</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">Pure Katan Silk • Handloom</p>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <span className="text-xl font-bold text-[#3D2817]">₹45,999</span>
                      <span className="text-sm text-gray-400 line-through">₹52,000</span>
                    </div>
                    <button className="w-full py-3 border border-[#800020] text-[#800020] font-bold text-xs uppercase tracking-widest hover:bg-[#800020] hover:text-[#D4AF37] transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="saree-card-3d">
                <div className="saree-card-inner group">
                  <Link to="/product/ivory-moonlight" className="block relative overflow-hidden aspect-[3/4] rounded-xl shadow-lg border border-[#D4AF37]/20">
                    <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80" alt="Ivory Brocade" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 z-10">
                      <button className="w-10 h-10 rounded-full bg-white/90 text-[#800020] flex items-center justify-center shadow-md hover:bg-[#800020] hover:text-white transition-colors">
                        <iconify-icon icon="lucide:heart"></iconify-icon>
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="flex items-center text-[#D4AF37] text-xs space-x-1 mb-1">
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star-half"></iconify-icon>
                        <span className="ml-1 text-white opacity-80">(18)</span>
                      </div>
                    </div>
                  </Link>
                  <div className="mt-4 text-center px-2">
                    <h3 className="text-lg font-bold text-[#800020] mb-1 uppercase brand-font tracking-wider">Ivory Moonlight</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">Tissue Silk • Zari Border</p>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <span className="text-xl font-bold text-[#3D2817]">₹32,500</span>
                    </div>
                    <button className="w-full py-3 border border-[#800020] text-[#800020] font-bold text-xs uppercase tracking-widest hover:bg-[#800020] hover:text-[#D4AF37] transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="saree-card-3d">
                <div className="saree-card-inner group">
                  <Link to="/product/forest-legacy" className="block relative overflow-hidden aspect-[3/4] rounded-xl shadow-lg border border-[#D4AF37]/20">
                    <img src="https://images.unsplash.com/photo-1583391733956-6c7827448d08?auto=format&fit=crop&q=80" alt="Forest Green Silk" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 z-10">
                      <button className="w-10 h-10 rounded-full bg-white/90 text-[#800020] flex items-center justify-center shadow-md hover:bg-[#800020] hover:text-white transition-colors">
                        <iconify-icon icon="lucide:heart"></iconify-icon>
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="flex items-center text-[#D4AF37] text-xs space-x-1 mb-1">
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <span className="ml-1 text-white opacity-80">(42)</span>
                      </div>
                    </div>
                  </Link>
                  <div className="mt-4 text-center px-2">
                    <h3 className="text-lg font-bold text-[#800020] mb-1 uppercase brand-font tracking-wider">Forest Legacy</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">Guldavari Weave • Heavy Zari</p>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <span className="text-xl font-bold text-[#3D2817]">₹58,900</span>
                    </div>
                    <button className="w-full py-3 border border-[#800020] text-[#800020] font-bold text-xs uppercase tracking-widest hover:bg-[#800020] hover:text-[#D4AF37] transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 4 */}
              <div className="saree-card-3d">
                <div className="saree-card-inner group">
                  <Link to="/product/ancient-gold" className="block relative overflow-hidden aspect-[3/4] rounded-xl shadow-lg border border-[#D4AF37]/20">
                    <img src="https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?auto=format&fit=crop&q=80" alt="Gold Brocade" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 z-10">
                      <button className="w-10 h-10 rounded-full bg-white/90 text-[#800020] flex items-center justify-center shadow-md hover:bg-[#800020] hover:text-white transition-colors">
                        <iconify-icon icon="lucide:heart"></iconify-icon>
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="flex items-center text-[#D4AF37] text-xs space-x-1 mb-1">
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <span className="ml-1 text-white opacity-80">(56)</span>
                      </div>
                    </div>
                  </Link>
                  <div className="mt-4 text-center px-2">
                    <h3 className="text-lg font-bold text-[#800020] mb-1 uppercase brand-font tracking-wider">Ancient Gold</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">Antique Zari • Khadi Silk</p>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <span className="text-xl font-bold text-[#3D2817]">₹84,000</span>
                    </div>
                    <button className="w-full py-3 border border-[#800020] text-[#800020] font-bold text-xs uppercase tracking-widest hover:bg-[#800020] hover:text-[#D4AF37] transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 5 */}
              <div className="saree-card-3d">
                <div className="saree-card-inner group">
                  <Link to="/product/mystic-violet" className="block relative overflow-hidden aspect-[3/4] rounded-xl shadow-lg border border-[#D4AF37]/20">
                    <img src="https://images.unsplash.com/photo-1590736704728-f4730bb3c3af?auto=format&fit=crop&q=80" alt="Deep Violet" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="flex items-center text-[#D4AF37] text-xs space-x-1 mb-1">
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <span className="ml-1 text-white opacity-80">(12)</span>
                      </div>
                    </div>
                  </Link>
                  <div className="mt-4 text-center px-2">
                    <h3 className="text-lg font-bold text-[#800020] mb-1 uppercase brand-font tracking-wider">Mystic Violet</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">Georgette Banarasi • Silver Work</p>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <span className="text-xl font-bold text-[#3D2817]">₹19,500</span>
                    </div>
                    <button className="w-full py-3 border border-[#800020] text-[#800020] font-bold text-xs uppercase tracking-widest hover:bg-[#800020] hover:text-[#D4AF37] transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 6 */}
              <div className="saree-card-3d">
                <div className="saree-card-inner group">
                  <Link to="/product/nocturnal-bloom" className="block relative overflow-hidden aspect-[3/4] rounded-xl shadow-lg border border-[#D4AF37]/20">
                    <img src="https://images.unsplash.com/photo-1610030469915-0248719b7a37?auto=format&fit=crop&q=80" alt="Midnight Black" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="flex items-center text-[#D4AF37] text-xs space-x-1 mb-1">
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <iconify-icon icon="mdi:star"></iconify-icon>
                        <span className="ml-1 text-white opacity-80">(31)</span>
                      </div>
                    </div>
                  </Link>
                  <div className="mt-4 text-center px-2">
                    <h3 className="text-lg font-bold text-[#800020] mb-1 uppercase brand-font tracking-wider">Nocturnal Bloom</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">Tanchoi Weave • Pure Silk</p>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <span className="text-xl font-bold text-[#3D2817]">₹27,800</span>
                    </div>
                    <button className="w-full py-3 border border-[#800020] text-[#800020] font-bold text-xs uppercase tracking-widest hover:bg-[#800020] hover:text-[#D4AF37] transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-20 flex justify-center items-center space-x-4">
              <button className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-gray-400 hover:border-[#800020] hover:text-[#800020] transition-colors">
                <iconify-icon icon="lucide:chevron-left"></iconify-icon>
              </button>
              <button className="w-10 h-10 rounded-full bg-[#800020] text-[#D4AF37] flex items-center justify-center font-bold">1</button>
              <button className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center hover:border-[#800020] hover:text-[#800020] transition-colors">2</button>
              <button className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center hover:border-[#800020] hover:text-[#800020] transition-colors">3</button>
              <span className="text-gray-400 mx-2">...</span>
              <button className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center hover:border-[#800020] hover:text-[#800020] transition-colors">12</button>
              <button className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-gray-600 hover:border-[#800020] hover:text-[#800020] transition-colors">
                <iconify-icon icon="lucide:chevron-right"></iconify-icon>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#3D2817] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?auto=format&fit=crop&q=80" className="w-full h-full object-contain grayscale" alt="pattern" />
        </div>
        <div className="max-w-xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-3xl font-bold mb-4 uppercase tracking-[0.2em] text-[#D4AF37] brand-font">Don't Miss a Weave</h2>
          <p className="serif-text italic text-lg opacity-80 mb-8">Subscribe to our Inner Circle for exclusive access to vintage drops and weaver stories.</p>
          <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" className="flex-1 bg-white/10 border border-[#D4AF37]/30 px-6 py-4 text-sm focus:outline-none focus:border-[#D4AF37] rounded-sm" />
            <button className="bg-[#D4AF37] text-[#800020] font-bold px-8 py-4 uppercase text-xs tracking-widest hover:bg-white transition-colors rounded-sm shadow-lg">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Collection;
