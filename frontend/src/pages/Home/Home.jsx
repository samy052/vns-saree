import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import "./Home.css";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
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
    image:
      "https://tilfi.com/cdn/shop/products/KOH0003Red_Kashi_PureKatanSilkKashiGhatSaree_1200x.jpg?v=1689252962",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Golden Zari Silk",
    price: "₹15,499",
    image:
      "https://www.holyweaves.com/cdn/shop/files/HW4488-1.jpg?v=1711186445&width=1200",
    badge: "New Arrival",
  },
  {
    id: 3,
    name: "Midnight Blue Heritage",
    price: "₹14,999",
    image:
      "https://www.holyweaves.com/cdn/shop/files/HW4502-1.jpg?v=1711187445&width=1200",
    badge: "Limited Edition",
  },
  {
    id: 4,
    name: "Classic Silk",
    price: "₹9,999",
    image:
      "https://www.holyweaves.com/cdn/shop/files/HW4481-1.jpg?v=1711185445&width=1200",
    badge: "Trending",
  },
  {
    id: 5,
    name: "Rose Pink Heritage",
    price: "₹11,499",
    image:
      "https://www.holyweaves.com/cdn/shop/files/HW4495-1.jpg?v=1711186845&width=1200",
    badge: "Artisan Choice",
  },
];

const Home = () => {
  const rootRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [heroSarees, setHeroSarees] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    formData.append("access_key", "f23a0283-8a44-4d5b-a9bb-bd25ea343936");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showNotification(
          "Message sent successfully! We'll get back to you soon.",
          "success",
        );
        e.target.reset();
      } else {
        showNotification(
          data.message || "Something went wrong. Please try again.",
          "error",
        );
      }
    } catch {
      showNotification("Network error. Please try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Fetch Coupons for Homepage
    fetch(`${API_ENDPOINTS.coupons}/homepage`)
      .then((res) => res.json())
      .then((data) => {
        setCoupons(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching coupons:", err));

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

    // Fetch Approved Feedbacks
    fetch(`${API_ENDPOINTS.feedback}/approved`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFeedbacks(data.data || []);
        }
      })
      .catch((err) => console.error("Error fetching feedbacks:", err));
  }, []);

  const calculateDiscount = (mrp, selling) => {
    if (!mrp || !selling || Number(mrp) <= Number(selling)) return 0;
    return Math.round(((Number(mrp) - Number(selling)) / Number(mrp)) * 100);
  };

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
        {/* Hero Section - Responsive Height */}
        <section className="relative min-h-[650px] lg:h-[85vh] lg:min-h-[650px] flex items-center overflow-visible lg:overflow-hidden bg-[#2D1B0E]">
          {/* Hero Background Image with Dark Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://t4.ftcdn.net/jpg/09/59/22/75/360_F_959227512_u0Hg5qCKW10OgI4GYaS0bdbHk1sjHPEP.jpg"
              alt="Varanasi Assi Ghat"
              className="w-full h-full object-cover opacity-70"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-r from-[#2D1B0E]/20 to-transparent"></div>
          </div>

          {/* Myntra-style Coupon Banner Slider */}
          {coupons.length > 0 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-4">
              <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={coupons.length > 1}
                className="coupon-swiper"
              >
                {coupons.map((coupon) => (
                  <SwiperSlide key={coupon.id}>
                    <div className="coupon-banner-myntra animate-fade-in-down">
                      <div className="coupon-content">
                        <div className="coupon-left">
                          <span className="coupon-title">
                            {coupon.discount_type === "percentage"
                              ? `FLAT ${coupon.discount_percent}% OFF`
                              : `FLAT ₹${Number(coupon.discount_amount).toLocaleString()} OFF`}
                          </span>
                        </div>
                        <div className="coupon-divider"></div>
                        <div className="coupon-right">
                          <p className="coupon-text">
                            {coupon.banner_text || `Use code ${coupon.code}`}
                          </p>
                          <div className="coupon-code-badge">{coupon.code}</div>
                        </div>
                      </div>
                      {/* Scalloped edges */}
                      <div className="scallop-top"></div>
                      <div className="scallop-bottom"></div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          <div className={`w-full px-4 lg:px-12 py-8 lg:py-0 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10 ${coupons.length > 0 ? 'mt-20 lg:mt-24' : ''}`}>
            <div className="flex flex-col items-start text-left max-w-xl">
              <div className="mb-6 animate-fade-in-up">
                <div className="premium-badge">
                  <span className="dot"></span>
                  PREMIUM SAREES AT BEST PRICES
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-fade-in-up delay-100 premium-title drop-shadow-2xl">
                <span className="italic-text text-white">Worn by Queens.</span>{" "}
                <br />
                <span className="text-[#D4AF37]">Made for You.</span> <br />
                {/* <span className="text-white">Sarees</span> */}
              </h1>

              <div className="hero-divider mb-8 animate-fade-in-up delay-200"></div>

              <p className="text-lg text-white mb-10 animate-fade-in-up delay-300 leading-relaxed font-light drop-shadow-md">
                The most celebrated silk sarees in the world, now at prices
                you'll love.
                <span className="text-[#D4AF37] font-medium">
                  {" "}
                  Handcrafted on the ghats of Varanasi with pure silk, real gold
                  zari, and generations of passion.
                </span>
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
                  <iconify-icon
                    icon="lucide:play-circle"
                    className="text-xl"
                  ></iconify-icon>
                  <span>Watch Our Artisans</span>
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center items-center w-full overflow-visible lg:-mt-12">
              {/* Coverflow Swiper for 3D Cards */}
              <div className="relative w-full max-w-[850px] lg:max-w-[1000px]">
                {heroLoading ? (
                  <div className="flex justify-center items-center gap-4 py-10">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-[180px] h-[270px] lg:w-[280px] lg:h-[420px] rounded-2xl bg-white/10 animate-pulse border border-white/20 relative overflow-hidden ${i !== 2 ? "opacity-40 scale-90" : "z-10"}`}
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
                      stretch: -60,
                      depth: 200,
                      modifier: 1.5,
                      slideShadows: false,
                    }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    loop={heroSarees.length > 3}
                    className="hero-swiper-coverflow pb-12"
                  >
                    {heroSarees.map((saree, index) => (
                      <SwiperSlide key={saree.id}>
                        <div className="relative saree-card-3d group px-4">
                          <div
                            className={`saree-card-inner permanent-highlight w-[260px] h-[390px] lg:w-[350px] lg:h-[525px] mx-auto rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(212,175,55,0.3)] animate-float relative z-10 transition-all duration-500 float-delay-${index % 6}`}
                          >
                            <img
                              src={saree.image || getCoverImage(saree)}
                              alt={saree.name}
                              className="w-full h-full object-cover"
                            />

                            {/* Discount Badge */}
                            {(saree.discount_percent ||
                              calculateDiscount(
                                saree.mrp_price || saree.mrp,
                                saree.selling_price,
                              )) > 0 && (
                              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#800020] text-xs lg:text-sm font-bold px-3 py-2 rounded-lg shadow-lg animate-bounce z-20">
                                {saree.discount_percent ||
                                  calculateDiscount(
                                    saree.mrp_price || saree.mrp,
                                    saree.selling_price,
                                  )}
                                % OFF
                              </div>
                            )}

                            {/* Elegant Text Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B0E]/95 via-[#3D2817]/20 to-transparent flex items-end p-6 lg:p-8 opacity-100">
                              <div className="text-white w-full">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <div className="h-px bg-[#D4AF37] w-8"></div>
                                  <span className="bg-[#D4AF37] text-[#800020] text-[10px] lg:text-[12px] font-bold px-3 py-1 rounded-full uppercase">
                                    {saree.badge}
                                  </span>
                                  <div className="h-px bg-[#D4AF37] w-8"></div>
                                </div>
                                <h3 className="text-xl lg:text-3xl font-bold brand-font text-center text-[#D4AF37] drop-shadow-lg truncate">
                                  {saree.name}
                                </h3>
                                <div className="flex flex-col items-center mt-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white text-lg lg:text-2xl font-bold">
                                      ₹
                                      {Number(
                                        saree.selling_price ||
                                          (typeof saree.price === "string"
                                            ? saree.price.replace(/[^0-9]/g, "")
                                            : saree.price),
                                      ).toLocaleString("en-IN")}
                                    </span>
                                    {Number(saree.mrp_price || saree.mrp) >
                                      Number(saree.selling_price) && (
                                      <span className="text-white/60 text-sm line-through">
                                        ₹
                                        {Number(
                                          saree.mrp_price || saree.mrp,
                                        ).toLocaleString("en-IN")}
                                      </span>
                                    )}
                                  </div>
                                  {Number(saree.mrp_price || saree.mrp) >
                                    Number(saree.selling_price) && (
                                    <span className="text-[10px] lg:text-xs font-bold text-[#D4AF37] border border-[#D4AF37] px-2 py-0.5 rounded mt-1">
                                      {calculateDiscount(
                                        saree.mrp_price || saree.mrp,
                                        saree.selling_price,
                                      )}
                                      % OFF
                                    </span>
                                  )}
                                </div>
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
                <div className="absolute bottom-0 left-0 w-80 h-80 permanent-glow-maroon rounded-full z-0 animate-glow-breath opacity-40 glow-delay-long"></div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <button
            onClick={() => {
              document.getElementById('featured-collections')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-elegant z-20 cursor-pointer hover:scale-110 transition-transform"
            aria-label="Scroll to featured collections"
          >
            <div className="scroll-arrow-wrap">
              <iconify-icon
                icon="lucide:arrow-down"
                className="text-xl"
              ></iconify-icon>
            </div>
          </button>
        </section>

        {/* Featured Collections Section */}
        <section id="featured-collections" className="py-16 bg-gradient-to-b from-white via-[#FFF8F0] to-white relative overflow-hidden">
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
                  <p className="text-gray-600">
                    Special collection coming soon.
                  </p>
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
                            <div className="flex flex-col items-center justify-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-xl font-black text-[#800020]">
                                  ₹
                                  {Number(product.selling_price).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                                {Number(product.mrp_price || product.mrp) >
                                  Number(product.selling_price) && (
                                  <span className="text-sm text-gray-500 line-through opacity-70">
                                    ₹
                                    {Number(
                                      product.mrp_price || product.mrp,
                                    ).toLocaleString("en-IN")}
                                  </span>
                                )}
                              </div>
                              {Number(product.mrp_price || product.mrp) >
                                Number(product.selling_price) && (
                                <span className="text-xs font-bold text-[#D4AF37] bg-[#800020] px-2 py-0.5 rounded mt-1">
                                  {calculateDiscount(
                                    product.mrp_price || product.mrp,
                                    product.selling_price,
                                  )}
                                  % OFF
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <button className="swiper-button-prev-custom absolute top-1/2 -left-4 md:-left-8 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-[#800020] z-30">
                    <iconify-icon
                      icon="lucide:chevron-left"
                      className="text-2xl"
                    ></iconify-icon>
                  </button>
                  <button className="swiper-button-next-custom absolute top-1/2 -right-4 md:-right-8 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-[#800020] z-30">
                    <iconify-icon
                      icon="lucide:chevron-right"
                      className="text-2xl"
                    ></iconify-icon>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
        

        {/* Story Section */}
        <section className="py-16 bg-[#800020] text-white text-center relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-[#D4AF37]">
              Every Saree Tells a Story
            </h2>
            <p className="text-xl mb-12 opacity-90">
              Handcrafted with love by skilled artisans at prices you'll love.
            </p>
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-4 group"
            >
              <span className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center transition-transform group-hover:scale-110">
                <iconify-icon
                  icon="lucide:play"
                  className="text-2xl text-[#800020]"
                ></iconify-icon>
              </span>
              <span className="text-[#D4AF37] font-bold uppercase tracking-widest">
                Watch Video
              </span>
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-[#F5F1E8]">
          <div className="w-full px-4 lg:px-12">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-[#800020] mb-4">
                What Our Customers Say
              </h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(feedbacks.length > 0 ? feedbacks : [1, 2, 3])
                .slice(0, 3)
                .map((item, i) => (
                  <div
                    key={item.id || i}
                    className="bg-white p-8 rounded-xl shadow-sm border border-[#D4AF37]/10 reveal-up"
                  >
                    <div className="flex text-[#D4AF37] mb-6">
                      {[...Array(item.rating || 5)].map((_, index) => (
                        <iconify-icon
                          key={index}
                          icon="mdi:star"
                        ></iconify-icon>
                      ))}
                    </div>
                    <p className="text-lg mb-8 italic">
                      "
                      {item.comment ||
                        "The quality is great and the design is beautiful. Highly recommended!"}
                      "
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#F5F1E8] flex items-center justify-center overflow-hidden border border-[#D4AF37]/20">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id || i}`}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#3D2817] capitalize">
                          {item.Customer?.name || "Happy Customer"}
                        </h4>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                          Verified Buyer
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Contact Us / Web3 Form Section */}
        <section className="py-20 bg-[#2D1B0E] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="brand-font text-3xl lg:text-5xl text-[#D4AF37] mb-4 italic-text">
                Get In Touch
              </h2>
              <p className="text-white/60 text-sm lg:text-base max-w-xl mx-auto">
                Have questions about our collection or need help with your
                order? Send us a message and we'll get back to you shortly.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl p-8 lg:p-12 rounded-[2rem] border border-[#D4AF37]/20 shadow-2xl animate-fade-in-up delay-300">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <input
                  type="hidden"
                  name="subject"
                  value="New Inquiry from VNS Saree Website"
                />
                <input
                  type="checkbox"
                  name="botcheck"
                  id=""
                  className="hidden"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      required
                      className="w-full bg-white/5 border-b border-[#D4AF37]/30 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      required
                      className="w-full bg-white/5 border-b border-[#D4AF37]/30 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="How can we help you?"
                    required
                    className="w-full bg-white/5 border-b border-[#D4AF37]/30 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37] transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#D4AF37] text-[#2D1B0E] font-bold py-4 px-12 rounded-full hover:bg-white hover:scale-105 transition-all duration-500 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Subtle Background Elements */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#800020]/20 blur-[100px] rounded-full"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D4AF37]/10 blur-[100px] rounded-full"></div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 bg-[#3D2817]">
          <div className="w-full px-4 flex flex-wrap justify-around items-start gap-8">
            <div className="flex items-center space-x-4 text-white">
              <iconify-icon
                icon="lucide:shield-check"
                className="text-3xl text-[#D4AF37]"
              ></iconify-icon>
              <div className="flex flex-col">
                <span className="font-semibold">Genuine Product</span>
                <span className="text-xs text-white/70">
                  100% Authentic Silk
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <iconify-icon
                icon="lucide:truck"
                className="text-3xl text-[#D4AF37]"
              ></iconify-icon>
              <div className="flex flex-col">
                <span className="font-semibold">Free Shipping</span>
                <span className="text-xs text-white/70">All Over India</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <iconify-icon
                icon="lucide:lock"
                className="text-3xl text-[#D4AF37]"
              ></iconify-icon>
              <div className="flex flex-col">
                <span className="font-semibold">Safe Payment</span>
                <span className="text-xs text-white/70">Secure Checkout</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <iconify-icon
                icon="lucide:refresh-cw"
                className="text-3xl text-[#D4AF37]"
              ></iconify-icon>
              <div className="flex flex-col">
                <span className="font-semibold">Easy Exchange</span>
                <span className="text-xs text-white/70">7 Days Return</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
