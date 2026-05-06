import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import { API_ENDPOINTS } from "../../config/api";

const HERO_SAREES = [
  {
    id: 1,
    name: "Royal Red Katan",
    price: "₹12,999",
    image: "https://tilfi.com/cdn/shop/products/KOH0003Red_Kashi_PureKatanSilkKashiGhatSaree_1200x.jpg?v=1689252962",
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Golden Zari Silk",
    price: "₹15,499",
    image: "https://www.holyweaves.com/cdn/shop/files/HW4488-1.jpg?v=1711186445&width=1200",
    badge: "New Arrival"
  },
  {
    id: 3,
    name: "Midnight Blue Heritage",
    price: "₹14,999",
    image: "https://www.holyweaves.com/cdn/shop/files/HW4502-1.jpg?v=1711187445&width=1200",
    badge: "Limited Edition"
  },
  {
    id: 4,
    name: "Classic Silk",
    price: "₹9,999",
    image: "https://www.holyweaves.com/cdn/shop/files/HW4481-1.jpg?v=1711185445&width=1200",
    badge: "Trending"
  },
  {
    id: 5,
    name: "Rose Pink Heritage",
    price: "₹11,499",
    image: "https://www.holyweaves.com/cdn/shop/files/HW4495-1.jpg?v=1711186845&width=1200",
    badge: "Artisan Choice"
  }
];

const Home = () => {
  const rootRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [heroSarees, setHeroSarees] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    // Fetch Dynamic Hero Sarees
    fetch(`${API_ENDPOINTS.products}?storeFrontVisibility=true`)
      .then((res) => res.json())
      .then((data) => {
        const items = data.items || data;
        if (items && items.length > 0) {
          setHeroSarees(items);
        } else {
          setHeroSarees(HERO_SAREES); // Fallback if no products flagged
        }
        setHeroLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching hero sarees:", err);
        setHeroSarees(HERO_SAREES); // Fallback on error
        setHeroLoading(false);
      });

    // Fetch Special Collection products
    fetch(`${API_ENDPOINTS.products}?specialCollection=true&limit=20`)
      .then((res) => res.json())
      .then((data) => {
        const items = data.items || data;
        setProducts(items.slice(0, 8));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const getCoverImage = (product) => {
    const allImages = [
      ...(product.images || []),
      ...(product.productImages || []),
    ];
    if (allImages.length === 0) return product.image_url || "";
    const cover =
      allImages.find((img) => img.is_cover || img.is_primary) || allImages[0];
    return cover.url;
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // 1. Intersection Observer (One-time reveal)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    root
      .querySelectorAll(".reveal-up, .avatar-reveal")
      .forEach((el) => observer.observe(el));

    // 2. Optimized Parallax
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const heroImg = root.querySelector(".saree-card-inner img");

          if (heroImg) {
            heroImg.style.transform = `scale(1.1) translateY(${scrolled * 0.1}px)`;
          }

          root.querySelectorAll(".parallax-bg").forEach((el) => {
            const speed = el.getAttribute("data-speed") || 0.05;
            el.style.transform = `translateY(${scrolled * speed}px)`;
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#F5F1E8]"
      ref={rootRef}
    >
      <main>
        {/* Hero Section - Compact Height */}
        <section className="relative h-[85vh] min-h-[650px] flex items-center overflow-hidden bg-[#2D1B0E]">
          {/* Hero Background Image with Dark Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://t4.ftcdn.net/jpg/09/59/22/75/360_F_959227512_u0Hg5qCKW10OgI4GYaS0bdbHk1sjHPEP.jpg"
              alt="Varanasi Assi Ghat"
              className="w-full h-full object-cover opacity-70"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B0E]/20 to-transparent"></div>
          </div>

          <div className="w-full px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="flex flex-col items-start text-left max-w-xl">
              <div className="mb-6 animate-fade-in-up">
                <div className="premium-badge">
                  <span className="dot"></span>
                  PREMIUM SAREES AT BEST PRICES
                </div>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-fade-in-up delay-100 premium-title drop-shadow-2xl">
                <span className="italic-text text-white">Worn by Queens.</span> <br />
                <span className="text-[#D4AF37]">Made for You.</span> <br />
                {/* <span className="text-white">Sarees</span> */}
              </h1>

              <div className="hero-divider mb-8 animate-fade-in-up delay-200"></div>

              <p className="text-lg text-white mb-10 animate-fade-in-up delay-300 leading-relaxed font-light drop-shadow-md">
                The most celebrated silk sarees in the world, now at prices you'll love.
                <span className="text-[#D4AF37] font-medium"> Handcrafted on the ghats of Varanasi with pure silk, real gold zari, and generations of passion.</span>
              </p>

              {/* Price & Shipping Highlight */}
              <div className="flex flex-wrap gap-4 mb-10 animate-fade-in-up delay-400">
                <div className="feature-pill">
                  <iconify-icon
                    icon="lucide:tag"
                    className="text-[#D4AF37]"
                  ></iconify-icon>
                  <span>Starting from ₹2,999</span>
                </div>
                <div className="feature-pill">
                  <iconify-icon
                    icon="lucide:truck"
                    className="text-[#D4AF37]"
                  ></iconify-icon>
                  <span>Free Shipping</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 animate-fade-in-up delay-500">
                <Link
                  to="/collection"
                  className="hero-cta-primary group shimmer-effect"
                >
                  <span>SHOP NOW</span>
                  <iconify-icon
                    icon="lucide:arrow-right"
                    className="group-hover:translate-x-2 transition-transform duration-300"
                  ></iconify-icon>
                </Link>
                <Link
                  to="/testimonials"
                  className="hero-cta-secondary group shimmer-effect"
                >
                  <iconify-icon icon="lucide:play-circle" className="text-xl"></iconify-icon>
                  <span>Watch Our Artisans</span>
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center items-center w-full overflow-visible">
              {/* Coverflow Swiper for 3D Cards */}
              <div className="relative w-full max-w-[850px] lg:max-w-[1000px]">
                {heroLoading ? (
                  <div className="flex justify-center items-center gap-4 py-10">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className={`w-[180px] h-[270px] lg:w-[280px] lg:h-[420px] rounded-2xl bg-white/10 animate-pulse border border-white/20 relative overflow-hidden ${i !== 2 ? 'opacity-40 scale-90' : 'z-10'}`}
                      >
                        <div className="absolute inset-0 shimmer-bg opacity-20"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Swiper
                    key={heroSarees.length}
                    modules={[Autoplay, Pagination, EffectCoverflow]}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={3}
                    observer={true}
                    observeParents={true}
                    coverflowEffect={{
                      rotate: 15,
                      stretch: -120,
                      depth: 200,
                      modifier: 1.5,
                      slideShadows: false,
                    }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    loop={heroSarees.length > 3}
                    className="hero-swiper-coverflow"
                  >
                    {heroSarees.map((saree, index) => (
                      <SwiperSlide key={saree.id}>
                        <div className="relative saree-card-3d group py-10 px-4">
                          <div 
                            className="saree-card-inner permanent-highlight w-[260px] h-[390px] lg:w-[350px] lg:h-[525px] mx-auto rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(212,175,55,0.3)] animate-float relative z-10 transition-all duration-500"
                            style={{ animationDelay: `${index * 0.5}s` }}
                          >
                            <img
                              src={saree.image || getCoverImage(saree)}
                              alt={saree.name}
                              className="w-full h-full object-cover"
                            />

                            {/* Discount Badge */}
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#800020] text-xs lg:text-sm font-bold px-3 py-2 rounded-lg shadow-lg animate-bounce z-20">
                              {saree.discount_percent ? `${saree.discount_percent}% OFF` : "20% OFF"}
                            </div>

                            {/* Elegant Text Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B0E]/95 via-[#3D2817]/20 to-transparent flex items-end p-6 lg:p-8 opacity-100">
                              <div className="text-white w-full">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <div className="h-px bg-[#D4AF37] w-8"></div>
                                  <span className="bg-[#D4AF37] text-[#800020] text-[10px] lg:text-[12px] font-bold px-3 py-1 rounded-full uppercase">
                                    {saree.badge || "Exclusive"}
                                  </span>
                                  <div className="h-px bg-[#D4AF37] w-8"></div>
                                </div>
                                <h3 className="text-xl lg:text-3xl font-bold brand-font text-center text-[#D4AF37] drop-shadow-lg truncate">
                                  {saree.name}
                                </h3>
                                <p className="text-center text-white/80 text-sm lg:text-lg mt-2">
                                  ₹{Number(saree.selling_price || (typeof saree.price === 'string' ? saree.price.replace(/[^0-9]/g, '') : saree.price)).toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}

                {/* Glowing Accents - Adjusted for wider carousel */}
                <div className="absolute top-0 right-0 w-64 h-64 permanent-glow-gold rounded-full z-0 animate-glow-breath opacity-40"></div>
                <div
                  className="absolute bottom-0 left-0 w-80 h-80 permanent-glow-maroon rounded-full z-0 animate-glow-breath opacity-40"
                  style={{ animationDelay: "2s" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-elegant z-20">
            <div className="scroll-arrow-wrap">
              <iconify-icon icon="lucide:arrow-down" className="text-xl"></iconify-icon>
            </div>
          </div>
        </section>

        {/* Featured Collections Section */}
        <section className="py-16 bg-gradient-to-b from-white via-[#FFF8F0] to-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#800020]"></div>

          <div className="w-full px-4 lg:px-12 relative z-10">
            <div className="text-center mb-10">
              <span className="inline-block bg-[#800020] text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                Handpicked For You
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 uppercase brand-font tracking-widest enhanced-shimmer">
                Special Collection
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#800020] mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Beautiful sarees made with love for your special moments
              </p>
            </div>

            <div className="special-collection-carousel relative px-4 md:px-10">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-4 bg-[#f0e6d8]"></div>
                      <div className="h-5 bg-[#f0e6d8] rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-[#f0e6d8] rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-600">Special collection coming soon.</p>
                </div>
              ) : (
                <>
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={{
                      nextEl: ".swiper-button-next-custom",
                      prevEl: ".swiper-button-prev-custom",
                    }}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    breakpoints={{
                      640: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 },
                      1280: { slidesPerView: 4 },
                    }}
                    className="pb-16"
                  >
                    {products.map((product) => (
                      <SwiperSlide key={product.id}>
                        <div className="group cursor-pointer h-full">
                          <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-4 shadow-2xl transition-all duration-500 group-hover:-translate-y-3">
                            <img
                              src={getCoverImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                              <Link
                                to={`/product/${product.slug}`}
                                className="block w-full py-3 bg-[#D4AF37] text-[#800020] text-center text-sm font-extrabold tracking-[0.2em] uppercase rounded-lg shadow-xl"
                              >
                                View Collection
                              </Link>
                            </div>
                          </div>
                          <div className="text-center px-2">
                            <h3 className="brand-font text-2xl text-[#800020] mb-2 truncate">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-xl font-black text-[#800020]">
                                ₹{Number(product.selling_price || product.price).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <button className="swiper-button-prev-custom absolute top-1/2 -left-4 md:-left-8 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-[#800020] z-30">
                    <iconify-icon icon="lucide:chevron-left" className="text-2xl"></iconify-icon>
                  </button>
                  <button className="swiper-button-next-custom absolute top-1/2 -right-4 md:-right-8 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-[#800020] z-30">
                    <iconify-icon icon="lucide:chevron-right" className="text-2xl"></iconify-icon>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-[#800020] text-white text-center relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-[#D4AF37]">Every Saree Tells a Story</h2>
            <p className="text-xl mb-12 opacity-90">Handcrafted with love by skilled artisans at prices you'll love.</p>
            <Link to="/testimonials" className="inline-flex items-center gap-4 group">
              <span className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center transition-transform group-hover:scale-110">
                <iconify-icon icon="lucide:play" className="text-2xl text-[#800020]"></iconify-icon>
              </span>
              <span className="text-[#D4AF37] font-bold uppercase tracking-widest">Watch Video</span>
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-[#F5F1E8]">
          <div className="w-full px-4 lg:px-12">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-[#800020] mb-4">What Our Customers Say</h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-[#D4AF37]/10">
                  <div className="flex text-[#D4AF37] mb-6">
                    <iconify-icon icon="mdi:star"></iconify-icon>
                    <iconify-icon icon="mdi:star"></iconify-icon>
                    <iconify-icon icon="mdi:star"></iconify-icon>
                    <iconify-icon icon="mdi:star"></iconify-icon>
                  </div>
                  <p className="text-lg mb-8 italic">"The quality is great and the design is beautiful. Highly recommended!"</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#3D2817]">Happy Customer</h4>
                      <p className="text-xs text-gray-500 uppercase">Verified Buyer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 bg-[#3D2817]">
          <div className="w-full px-4 flex flex-wrap justify-around items-center gap-8">
            <div className="flex items-center space-x-4 text-white">
              <iconify-icon icon="lucide:shield-check" className="text-3xl text-[#D4AF37]"></iconify-icon>
              <span>Genuine Product</span>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <iconify-icon icon="lucide:truck" className="text-3xl text-[#D4AF37]"></iconify-icon>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <iconify-icon icon="lucide:lock" className="text-3xl text-[#D4AF37]"></iconify-icon>
              <span>Safe Payment</span>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <iconify-icon icon="lucide:refresh-cw" className="text-3xl text-[#D4AF37]"></iconify-icon>
              <span>Easy Returns</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
