import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const rootRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.slice(0, 4)); // Get first 4 for featured
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

 useEffect(() => {
  const root = rootRef.current;
  if (!root) return;

  // 1. Intersection Observer (One-time reveal)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Ek baar animation ho gayi toh observe karna band kar do
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.1 });

  root.querySelectorAll('.reveal-up, .avatar-reveal').forEach(el => observer.observe(el));

  // 2. Optimized Parallax
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const heroImg = root.querySelector('.saree-card-inner img');
        
        if (heroImg) {
          heroImg.style.transform = `scale(1.1) translateY(${scrolled * 0.1}px)`;
        }

        root.querySelectorAll('.parallax-bg').forEach(el => {
          const speed = el.getAttribute('data-speed') || 0.05;
          el.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
    observer.disconnect();
  };
}, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F5F1E8]" ref={rootRef}>


      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <img 
            src="https://images.pexels.com/photos/16747080/pexels-photo-16747080.jpeg?cs=srgb&dl=pexels-stijn-dijkstra-1306815-16747080.jpg&fm=jpg" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none z-0" 
            alt="Kashi Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F1E8] via-transparent to-transparent z-0"></div>

          <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="flex flex-col justify-center">
              <div className="overflow-hidden">
                <span className="inline-block text-[#D4AF37] tracking-[0.4em] uppercase text-sm mb-4 font-bold animate-fade-in-up">
                  Handwoven in Kashi
                </span>
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-bold text-[#800020] leading-[1.1] mb-6 animate-fade-in-up delay-100">
                <span className="animate-elegant-breath block">
                  Authentic <br />
                  <span className="gold-shimmer inline-block">Banarasi</span> <br />
                  Elegance
                </span>
              </h1>
              
              <p className="serif-text text-xl text-[#3D2817]/80 italic mb-10 max-w-lg animate-fade-in-up delay-300">
                Where six yards of pure silk meets the timeless craftsmanship of generations. Experience luxury that breathes heritage.
              </p>
              
              <div className="flex flex-wrap gap-6 animate-fade-in-up delay-500">
                <Link to="/collection" id="hero-cta-shop" className="px-8 py-4 bg-[#800020] text-[#D4AF37] font-bold rounded-sm border border-[#800020] hover:bg-transparent hover:text-[#800020] transition-all duration-300 shadow-xl shimmer-btn-wrap text-center hover:scale-105 transform">
                  SHOP COLLECTION
                </Link>
                <a href="#" id="hero-cta-story" className="px-8 py-4 border border-[#800020] text-[#800020] font-bold rounded-sm hover:bg-[#800020] hover:text-white transition-all duration-300 shimmer-btn-wrap hover:scale-105 transform">
                  OUR HERITAGE
                </a>
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              {/* 3D Floating Saree Visual */}
              <div className="relative saree-card-3d">
                <div className="saree-card-inner w-[300px] h-[450px] lg:w-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]/50 animate-float relative z-10">
                  <img src="https://tilfi.com/cdn/shop/products/KOH0003Red_Kashi_PureKatanSilkKashiGhatSaree_1200x.jpg?v=1689252962" alt="Premium Banarasi Saree" className="w-full h-full object-cover" />
                  
                  {/* Elegant Text Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B0E]/95 via-[#3D2817]/40 to-transparent flex items-end p-8 opacity-90 hover:opacity-100 transition-opacity duration-700">
                    <div className="text-white transform translate-y-4 hover:translate-y-0 transition-transform duration-700 ease-out w-full">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-px bg-[#D4AF37] flex-grow transform origin-left scale-x-100 transition-transform duration-1000 delay-100"></div>
                        <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase whitespace-nowrap">Katan Silk Pure</p>
                        <div className="h-px bg-[#D4AF37] flex-grow transform origin-right scale-x-100 transition-transform duration-1000 delay-100"></div>
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-bold brand-font text-center drop-shadow-lg">The Royal Brocade</h3>
                    </div>
                  </div>
                </div>
                
                {/* Dynamic Glowing Accents */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full blur-[40px] animate-pulse z-0 group-hover:from-[#D4AF37]/40 transition-colors duration-700"></div>
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-gradient-to-tr from-[#800020]/20 to-transparent rounded-full blur-[50px] animate-pulse z-0 group-hover:from-[#800020]/40 transition-colors duration-700" style={{ animationDelay: '1.5s' }}></div>
                
                {/* Micro-animations (Sparkles) */}
                <div className="absolute top-1/4 -right-6 w-2 h-2 bg-[#D4AF37] rounded-full shadow-[0_0_15px_#D4AF37] animate-ping z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300"></div>
                <div className="absolute bottom-1/3 -left-8 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37] animate-ping z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-700" style={{ animationDuration: '2s' }}></div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-elegant">
            <iconify-icon icon="lucide:chevron-down" className="text-3xl text-[#D4AF37]"></iconify-icon>
          </div>
        </section>

        {/* Featured Collections Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#3D2817] mb-4 uppercase brand-font tracking-widest">The Signature Collection</h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">Curated pieces reflecting centuries of weaving excellence, from the ghats of Ganga to your wardrobe.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                <div className="col-span-full text-center py-20">
                  <p className="serif-text italic text-gray-600">Selecting the finest threads...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className="serif-text italic text-gray-600">New masterpieces arriving soon.</p>
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-4 shadow-lg transition-transform duration-500 group-hover:-translate-y-2">
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <span className="absolute top-4 left-4 z-20 bg-[#D4AF37] text-[#800020] text-[10px] font-bold px-2 py-1 rounded-sm animate-pulse-gold uppercase tracking-tighter">Signature Piece</span>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        <Link to={`/product/${product.slug}`} className="block w-full py-2 bg-[#D4AF37] text-white text-center text-sm font-bold tracking-widest uppercase">VIEW DETAILS</Link>
                      </div>
                    </div>
                    <h3 className="brand-font text-xl text-[#800020] mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 tracking-wider">₹{Number(product.price).toLocaleString('en-IN')}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Video/Heritage Showcase */}
        <section className="py-20 bg-[#3D2817] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 parallax-bg" data-speed="0.12">
            <img src="https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?auto=format&fit=crop&q=80" className="w-full h-full object-contain grayscale" alt="pattern" />
          </div>
          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Every thread tells a story of Banaras</h2>
            <p className="serif-text text-xl italic mb-12 leading-relaxed opacity-90">
              "Our weavers spend weeks on a single masterpiece, meticulously weaving pure gold and silver threads into the finest silk. This isn't just a saree; it's an inheritance."
            </p>
            <a href="#" id="watch-heritage-video" className="inline-flex items-center space-x-4 group">
              <span className="w-16 h-16 rounded-full border border-[#D4AF37] flex items-center justify-center transition-transform group-hover:scale-110 bg-[#D4AF37]/10">
                <iconify-icon icon="lucide:play" className="text-2xl text-[#D4AF37]"></iconify-icon>
              </span>
              <span className="text-[#D4AF37] font-bold tracking-widest uppercase">Watch the Craftsmanship</span>
            </a>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-[#F5F1E8]">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold text-[#3D2817] mb-4">The Voices of Grace</h2>
                <p className="text-gray-600">Hear from our worldwide family who trust us for their most special moments.</p>
              </div>
              <div className="flex space-x-4">
                <button className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all">
                  <iconify-icon icon="lucide:arrow-left"></iconify-icon>
                </button>
                <button className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all">
                  <iconify-icon icon="lucide:arrow-right"></iconify-icon>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-[#D4AF37]/10 hover:shadow-xl transition-shadow">
                <div className="flex text-[#D4AF37] mb-6">
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                </div>
                <p className="serif-text text-lg italic mb-8">"The intricate zari work is beyond my imagination. I wore it for my wedding and everyone couldn't stop praising the craftsmanship of this pure Katan silk."</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 avatar-reveal">
                    <img src="https://i.pravatar.cc/150?u=priya" alt="User" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3D2817]">Priya Sharma</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">New York, USA</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-[#D4AF37]/10 hover:shadow-xl transition-shadow">
                <div className="flex text-[#D4AF37] mb-6">
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                </div>
                <p className="serif-text text-lg italic mb-8">"Authentic Banarasi sarees are hard to find online, but Banaras Heritage is the real deal. The weight and texture of the silk speak volumes."</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 avatar-reveal">
                    <img src="https://i.pravatar.cc/150?u=ananya" alt="User" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3D2817]">Ananya Reddy</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Hyderabad, India</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-[#D4AF37]/10 hover:shadow-xl transition-shadow">
                <div className="flex text-[#D4AF37] mb-6">
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                </div>
                <p className="serif-text text-lg italic mb-8">"Fastest shipping I've experienced. The packaging was royal, ensuring the delicate silk arrived in perfect condition. Truly a premium experience."</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 avatar-reveal">
                    <img src="https://i.pravatar.cc/150?u=meera" alt="User" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3D2817]">Meera Kapoor</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">London, UK</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 bg-white border-y border-[#D4AF37]/20">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around items-center gap-8">
            <div className="flex items-center space-x-4">
              <iconify-icon icon="lucide:shield-check" className="text-3xl text-[#800020]"></iconify-icon>
              <div>
                <h5 className="font-bold text-sm uppercase tracking-wider">100% Authentic</h5>
                <p className="text-xs text-gray-500">Certified Handloom Mark</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <iconify-icon icon="lucide:truck" className="text-3xl text-[#800020]"></iconify-icon>
              <div>
                <h5 className="font-bold text-sm uppercase tracking-wider">Free Shipping</h5>
                <p className="text-xs text-gray-500">On orders over ₹10,000</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <iconify-icon icon="lucide:lock" className="text-3xl text-[#800020]"></iconify-icon>
              <div>
                <h5 className="font-bold text-sm uppercase tracking-wider">Secure Payment</h5>
                <p className="text-xs text-gray-500">PCI Compliant Gateway</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <iconify-icon icon="lucide:refresh-cw" className="text-3xl text-[#800020]"></iconify-icon>
              <div>
                <h5 className="font-bold text-sm uppercase tracking-wider">Easy Returns</h5>
                <p className="text-xs text-gray-500">7-day hassle free policy</p>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Home;
