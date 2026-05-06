import React, { useState, useEffect, useRef } from "react";
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

const Home = () => {
  const rootRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
            // Ek baar animation ho gayi toh observe karna band kar do
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

          <div className="max-w-7xl mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="flex flex-col items-start text-left max-w-xl">
              <div className="mb-6 animate-fade-in-up">
                <div className="premium-badge">
                  <span className="dot"></span>
                  PREMIUM SAREES AT BEST PRICES
                </div>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-fade-in-up delay-100 premium-title drop-shadow-2xl">
                <span className="italic-text text-white">Beautiful</span> <br />
                <span className="text-[#D4AF37]">Banarasi</span> <br />
                <span className="text-white">Sarees</span>
              </h1>

              <div className="hero-divider mb-8 animate-fade-in-up delay-200"></div>

              <p className="text-lg text-white mb-10 animate-fade-in-up delay-300 leading-relaxed font-light drop-shadow-md">
                Discover our stunning collection of pure silk sarees. Each piece
                is <span className="text-[#D4AF37] font-medium">handcrafted with love</span> by skilled artisans at prices you'll love.
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


            <div className="relative flex justify-center items-center">
              {/* 3D Floating Saree Visual - Slightly Smaller */}
              <div className="relative saree-card-3d group">
                <div className="saree-card-inner permanent-highlight w-[260px] h-[390px] lg:w-[340px] lg:h-[510px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(212,175,55,0.3)] animate-float relative z-10 group-hover:shadow-[0_40px_100px_rgba(212,175,55,0.5)] group-hover:scale-[1.03] group-hover:brightness-110 transition-all duration-500">
                  <img
                    src="https://tilfi.com/cdn/shop/products/KOH0003Red_Kashi_PureKatanSilkKashiGhatSaree_1200x.jpg?v=1689252962"
                    alt="Premium Banarasi Saree"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Elegant Text Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B0E]/95 via-[#3D2817]/20 to-transparent flex items-end p-6 opacity-100">
                    <div className="text-white w-full">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="h-px bg-[#D4AF37] w-8"></div>
                        <span className="bg-[#D4AF37] text-[#800020] text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                          Best Seller
                        </span>
                        <div className="h-px bg-[#D4AF37] w-8"></div>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold brand-font text-center text-[#D4AF37] drop-shadow-lg">
                        Royal Red Katan
                      </h3>
                      <p className="text-center text-white/80 text-sm mt-2">
                        ₹12,999
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dynamic Glowing Accents - Now Permanent with Breathing Animation */}
                <div className="absolute -top-20 -right-20 w-56 h-56 permanent-glow-gold rounded-full z-0 animate-glow-breath"></div>
                <div
                  className="absolute -bottom-20 -left-20 w-72 h-72 permanent-glow-maroon rounded-full z-0 animate-glow-breath"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="absolute top-1/2 -right-24 w-32 h-32 bg-gradient-to-bl from-[#B8860B]/20 to-transparent rounded-full blur-[40px] animate-pulse z-0"
                  style={{ animationDelay: "0.75s" }}
                ></div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#800020] text-xs font-bold px-3 py-2 rounded-lg shadow-lg animate-bounce z-20">
                  20% OFF
                </div>

                {/* Sparkle Effects */}
                <div className="absolute top-1/4 -right-4 w-3 h-3 bg-[#D4AF37] rounded-full shadow-[0_0_20px_#D4AF37] animate-ping z-20"></div>
                <div
                  className="absolute bottom-1/3 -left-4 w-2 h-2 bg-[#D4AF37] rounded-full shadow-[0_0_15px_#D4AF37] animate-ping z-20"
                  style={{ animationDuration: "2s", animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white] animate-ping z-20"
                  style={{ animationDuration: "3s", animationDelay: "1s" }}
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

        {/* Featured Collections Section - Compact Padding */}
        <section className="py-16 bg-gradient-to-b from-white via-[#FFF8F0] to-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#800020]"></div>
          <div className="absolute top-40 -left-20 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 -right-20 w-60 h-60 bg-[#800020]/5 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
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
                // Skeleton Loading Cards with shimmer effect
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-4 bg-gradient-to-r from-[#f0e6d8] via-[#e8dcc8] to-[#f0e6d8] shimmer-bg"></div>
                      <div className="h-5 bg-gradient-to-r from-[#f0e6d8] via-[#e8dcc8] to-[#f0e6d8] shimmer-bg rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gradient-to-r from-[#f0e6d8] via-[#e8dcc8] to-[#f0e6d8] shimmer-bg rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-600">
                    Special collection coming soon.
                  </p>
                </div>
              ) : (
                <>
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={{
                      nextEl: ".swiper-button-next-custom",
                      prevEl: ".swiper-button-prev-custom",
                    }}
                    pagination={{ clickable: true, dynamicBullets: true }}
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
                          <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-4 shadow-2xl transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-[0_20px_40px_rgba(128,0,32,0.2)]">
                            <img
                              src={getCoverImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Diagonal Badge for New Arrival */}
                            {product.is_new_arrival && (
                              <div className="diagonal-badge-container">
                                <div className="diagonal-badge">New</div>
                              </div>
                            )}

                            {/* Badge: Discount Percent */}
                            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                              {product.mrp_price &&
                                Number(product.mrp_price) >
                                  Number(
                                    product.selling_price || product.price,
                                  ) && (
                                  <span className="discount-badge animate-bounce-in">
                                    {Math.round(
                                      ((Number(product.mrp_price) -
                                        Number(
                                          product.selling_price ||
                                            product.price,
                                        )) /
                                        Number(product.mrp_price)) *
                                        100,
                                    )}
                                    % OFF
                                  </span>
                                )}
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                              <Link
                                to={`/product/${product.slug}`}
                                className="block w-full py-3 bg-[#D4AF37] text-[#800020] text-center text-sm font-extrabold tracking-[0.2em] uppercase rounded-lg hover:bg-white transition-all duration-300 shadow-xl"
                              >
                                View Collection
                              </Link>
                            </div>
                          </div>

                          <div className="text-center px-2">
                            <div className="mb-1">
                              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D4AF37]">
                                {product.Category?.name || "Premium Collection"}
                              </span>
                            </div>
                            <h3 className="brand-font text-2xl text-[#800020] mb-2 truncate group-hover:text-[#D4AF37] transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-1 italic">
                              {product.short_description ||
                                product.description?.substring(0, 50) ||
                                "Pure Banarasi Silk Heritage"}
                            </p>
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-xl font-black text-[#800020]">
                                ₹
                                {Number(
                                  product.selling_price || product.price,
                                ).toLocaleString("en-IN")}
                              </span>
                              {product.mrp_price &&
                                Number(product.mrp_price) >
                                  Number(
                                    product.selling_price || product.price,
                                  ) && (
                                  <span className="text-sm text-gray-400 line-through decoration-[#800020]/30">
                                    ₹
                                    {Number(product.mrp_price).toLocaleString(
                                      "en-IN",
                                    )}
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Navigation Buttons */}
                  <button className="swiper-button-prev-custom absolute top-1/2 -left-4 md:-left-8 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl border border-[#D4AF37]/20 flex items-center justify-center text-[#800020] hover:bg-[#800020] hover:text-[#D4AF37] transition-all duration-300 z-30 group">
                    <iconify-icon
                      icon="lucide:chevron-left"
                      className="text-2xl group-hover:-translate-x-0.5 transition-transform"
                    ></iconify-icon>
                  </button>
                  <button className="swiper-button-next-custom absolute top-1/2 -right-4 md:-right-8 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl border border-[#D4AF37]/20 flex items-center justify-center text-[#800020] hover:bg-[#800020] hover:text-[#D4AF37] transition-all duration-300 z-30 group">
                    <iconify-icon
                      icon="lucide:chevron-right"
                      className="text-2xl group-hover:translate-x-0.5 transition-transform"
                    ></iconify-icon>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Video/Story Showcase - Compact Padding */}
        <section className="py-16 bg-gradient-to-br from-[#800020] via-[#3D2817] to-[#800020] text-white relative overflow-hidden">
          {/* Decorative gradient orbs */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#800020]/40 rounded-full blur-3xl"></div>

          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <span className="inline-block bg-[#D4AF37] text-[#800020] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              Our Story
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-[#D4AF37]">
              Every Saree Tells a Story
            </h2>
            <p className="text-xl mb-12 leading-relaxed opacity-90">
              Our artists spend weeks creating each saree with pure gold and
              silver threads. It's more than just clothing - it's art you can
              wear.
            </p>
            <Link
              to="/testimonials"
              id="watch-story-video"
              className="inline-flex items-center gap-4 group"
            >
              <span className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg">
                <iconify-icon
                  icon="lucide:play"
                  className="text-2xl text-[#800020]"
                ></iconify-icon>
              </span>
              <span className="text-[#D4AF37] font-bold tracking-widest uppercase">
                Watch Video
              </span>
            </Link>
          </div>
        </section>

        {/* Testimonials - Compact Padding */}
        <section className="py-16 bg-gradient-to-b from-[#F5F1E8] via-white to-[#F5F1E8] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#800020]"></div>
          <div className="absolute top-20 right-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
            <div className="text-center mb-10">
              <span className="inline-block bg-[#800020] text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                Customer Love
              </span>
              <h2 className="text-4xl font-bold text-[#800020] mb-4">
                What Our Customers Say
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#800020] mx-auto mb-4"></div>
              <p className="text-gray-600">
                Real reviews from people who love our sarees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-[#D4AF37]/10 hover:shadow-xl transition-shadow">
                <div className="flex text-[#D4AF37] mb-6">
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                </div>
                <p className="text-lg mb-8">
                  "I was looking for a genuine Banarasi saree and found it here.
                  The quality is great and the design is beautiful. Highly
                  recommended!"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 avatar-reveal">
                    <img
                      src="https://i.pravatar.cc/150?u=priya"
                      alt="User"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3D2817]">Priya Sharma</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                      New York, USA
                    </p>
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
                <p className="text-lg mb-8">
                  "Fast delivery and beautiful packaging. The saree looks even
                  better in person. Very happy with my purchase!"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 avatar-reveal">
                    <img
                      src="https://i.pravatar.cc/150?u=ananya"
                      alt="User"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3D2817]">Ananya Reddy</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                      Hyderabad, India
                    </p>
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
                <p className="text-lg mb-8">
                  "Bought this for my mother's birthday and she absolutely loved
                  it. Great quality at a good price. Will buy again!"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 avatar-reveal">
                    <img
                      src="https://www.solitarytraveller.com/wp-content/uploads/2020/09/varanasi_assi_ghat-min-1024x768.jpg"
                      className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
                      alt="Assi Ghat Varanasi"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3D2817]">Meera Kapoor</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                      London, UK
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges - Compact Padding */}
        <section className="py-12 bg-gradient-to-r from-[#800020] via-[#3D2817] to-[#800020] relative overflow-hidden">
          {/* Decorative pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M20 20l20-20v40H0V0l20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around items-center gap-8 relative z-10">
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center">
                <iconify-icon
                  icon="lucide:shield-check"
                  className="text-2xl text-[#800020]"
                ></iconify-icon>
              </div>
              <div>
                <h5 className="font-bold text-sm uppercase tracking-wider text-white">
                  Genuine Product
                </h5>
                <p className="text-xs text-[#D4AF37]">Quality Checked</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center">
                <iconify-icon
                  icon="lucide:truck"
                  className="text-2xl text-[#800020]"
                ></iconify-icon>
              </div>
              <div>
                <h5 className="font-bold text-sm uppercase tracking-wider text-white">
                  Free Shipping
                </h5>
                <p className="text-xs text-[#D4AF37]">On orders over ₹10,000</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center">
                <iconify-icon
                  icon="lucide:lock"
                  className="text-2xl text-[#800020]"
                ></iconify-icon>
              </div>
              <div>
                <h5 className="font-bold text-sm uppercase tracking-wider text-white">
                  Safe Payment
                </h5>
                <p className="text-xs text-[#D4AF37]">100% Secure Checkout</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center">
                <iconify-icon
                  icon="lucide:refresh-cw"
                  className="text-2xl text-[#800020]"
                ></iconify-icon>
              </div>
              <div>
                <h5 className="font-bold text-sm uppercase tracking-wider text-white">
                  Easy Returns
                </h5>
                <p className="text-xs text-[#D4AF37]">7 Days Easy Returns</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
