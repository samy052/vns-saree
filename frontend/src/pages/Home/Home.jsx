import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import "./Home.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { API_ENDPOINTS } from "../../config/api";

/* ── Fallback hero slides ─────────────────────────────────────── */
const HERO_SAREES = [
  {
    id: 1,
    name: "Royal Red Katan",
    image:
      "https://tilfi.com/cdn/shop/products/KOH0003Red_Kashi_PureKatanSilkKashiGhatSaree_1200x.jpg?v=1689252962",
  },
  {
    id: 2,
    name: "Golden Zari Silk",
    image:
      "https://www.holyweaves.com/cdn/shop/files/HW4488-1.jpg?v=1711186445&width=1200",
  },
  {
    id: 3,
    name: "Midnight Blue",
    image:
      "https://www.holyweaves.com/cdn/shop/files/HW4502-1.jpg?v=1711187445&width=1200",
  },
  {
    id: 4,
    name: "Classic Silk",
    image:
      "https://www.holyweaves.com/cdn/shop/files/HW4481-1.jpg?v=1711185445&width=1200",
  },
  {
    id: 5,
    name: "Rose Pink Heritage",
    image:
      "https://www.holyweaves.com/cdn/shop/files/HW4495-1.jpg?v=1711186845&width=1200",
  },
];

/* ── Fabric categories ────────────────────────────────────────── */
const FABRIC_CATEGORIES = [
  { name: "Katan Silk", color: "#7B1A2E", accent: "#9B3A4E" },
  { name: "Organza", color: "#E8A0A0", accent: "#F0C0C0" },
  { name: "Tissue", color: "#C9A84C", accent: "#DEC070" },
  { name: "Chiffon", color: "#2E5E3A", accent: "#3D7A4E" },
  { name: "Georgette", color: "#6B1F3A", accent: "#8B3A5A" },
  { name: "Khaddi", color: "#C8B870", accent: "#DDD090" },
  { name: "Cotton Silk", color: "#1A5F6A", accent: "#2A7F8A" },
  { name: "Satin Silk", color: "#C0395A", accent: "#D05070" },
];

/* ── Saree dropdown items ─────────────────────────────────────── */
const SAREE_TYPES = [
  "Katan Silk",
  "Organza",
  "Tissue",
  "Chiffon",
  "Georgette",
  "Khaddi",
  "Cotton Silk",
  "Satin Silk",
];

/* ── Fallback popular products ───────────────────────────────── */
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Banarasi Katan Silk Saree",
    selling_price: 4999,
    mrp: 8999,
    rating: "4.8",
    reviews: 324,
    image:
      "https://tilfi.com/cdn/shop/products/KOH0003Red_Kashi_PureKatanSilkKashiGhatSaree_1200x.jpg?v=1689252962",
    slug: "katan-silk-saree",
  },
  {
    id: 2,
    name: "Banarasi Organza Saree",
    selling_price: 3499,
    mrp: 6999,
    rating: "4.7",
    reviews: 248,
    image:
      "https://www.holyweaves.com/cdn/shop/files/HW4488-1.jpg?v=1711186445&width=1200",
    slug: "organza-saree",
  },
  {
    id: 3,
    name: "Banarasi Tissue Saree",
    selling_price: 4299,
    mrp: 8499,
    rating: "4.8",
    reviews: 194,
    image:
      "https://www.holyweaves.com/cdn/shop/files/HW4502-1.jpg?v=1711187445&width=1200",
    slug: "tissue-saree",
  },
  {
    id: 4,
    name: "Banarasi Georgette Saree",
    selling_price: 3199,
    mrp: 5999,
    rating: "4.6",
    reviews: 176,
    image:
      "https://www.holyweaves.com/cdn/shop/files/HW4481-1.jpg?v=1711185445&width=1200",
    slug: "georgette-saree",
  },
  {
    id: 5,
    name: "Banarasi Kadhdi Saree",
    selling_price: 3299,
    mrp: 6499,
    rating: "4.7",
    reviews: 153,
    image:
      "https://www.holyweaves.com/cdn/shop/files/HW4495-1.jpg?v=1711186845&width=1200",
    slug: "khaddi-saree",
  },
  {
    id: 6,
    name: "Banarasi Cotton Silk Saree",
    selling_price: 2999,
    mrp: 5499,
    rating: "4.6",
    reviews: 142,
    image:
      "https://tilfi.com/cdn/shop/products/KOH0003Red_Kashi_PureKatanSilkKashiGhatSaree_1200x.jpg?v=1689252962",
    slug: "cotton-silk-saree",
  },
];

/* ════════════════════════════════════════════════════════════════ */
const Home = () => {
  const rootRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [heroSarees, setHeroSarees] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [sareeOpen, setSareeOpen] = useState(false);

  const { showNotification } = useNotification();

  const toggleWishlist = (id) =>
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    formData.append("access_key", "f23a0283-8a44-4d5b-a9bb-bd25ea343936");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          "Message sent successfully! We'll get back to you soon.",
          "success",
        );
        e.target.reset();
      } else {
        showNotification(data.message || "Something went wrong.", "error");
      }
    } catch {
      showNotification("Network error. Please try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetch(`${API_ENDPOINTS.coupons}/homepage`)
      .then((r) => r.json())
      .then((d) => setCoupons(Array.isArray(d) ? d : []))
      .catch(() => {});

    fetch(`${API_ENDPOINTS.products}?storeFrontVisibility=true`)
      .then((r) => r.json())
      .then((d) => {
        const it = d.items || d;
        setHeroSarees(it?.length ? it : HERO_SAREES);
      })
      .catch(() => setHeroSarees(HERO_SAREES))
      .finally(() => setHeroLoading(false));

    fetch(`${API_ENDPOINTS.products}?specialCollection=true&limit=20`)
      .then((r) => r.json())
      .then((d) => setProducts((d.items || d).slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch(`${API_ENDPOINTS.feedback}/approved`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setFeedbacks(d.data || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("active");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    root.querySelectorAll(".reveal-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const calcDiscount = (mrp, sell) => {
    if (!mrp || !sell || Number(mrp) <= Number(sell)) return 0;
    return Math.round(((Number(mrp) - Number(sell)) / Number(mrp)) * 100);
  };

  const getCoverImage = (p) => {
    const imgs = [...(p.images || []), ...(p.productImages || [])];
    if (!imgs.length) return p.image_url || p.image || "";
    return (imgs.find((i) => i.is_cover || i.is_primary) || imgs[0]).url;
  };

  const activeCoupons = coupons.length
    ? coupons
    : [
        {
          id: "fb",
          discount_type: "fixed",
          discount_amount: 500,
          code: "KALA500",
        },
      ];
  const heroSlides = heroSarees.length ? heroSarees : HERO_SAREES;
  const displayProducts = products.length ? products : FALLBACK_PRODUCTS;

  /* ══════════════════════════════════════════════════════════════ */
  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#F5ECD7]"
      ref={rootRef}
    >
      <main>
        <div
          className="w-full flex items-center justify-center gap-3 py-2 px-4 animate-none"
          style={{
            background:
              "linear-gradient(90deg,#5A0015 0%,#900025 50%,#5A0015 100%)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="#D4AF37"
            className="opacity-80 flex-shrink-0"
          >
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <ellipse
                key={i}
                cx="10"
                cy="4"
                rx="1.5"
                ry="3.5"
                fill="#D4AF37"
                transform={`rotate(${deg} 10 10)`}
              />
            ))}
          </svg>
          <p className="text-[#D4AF37] text-xs font-semibold tracking-[0.22em] uppercase animate-none">
            Timeless Weaves.&nbsp;&nbsp;Unmatched Quality.&nbsp;&nbsp;Pure
            Banarasi.
          </p>
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="#D4AF37"
            className="opacity-80 flex-shrink-0"
          >
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <ellipse
                key={i}
                cx="10"
                cy="4"
                rx="1.5"
                ry="3.5"
                fill="#D4AF37"
                transform={`rotate(${deg} 10 10)`}
              />
            ))}
          </svg>
        </div>

        {/* ── 2. Main header ────────────────────────────────────── */}
        <header className="w-full bg-[#F5ECD7] sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-6 xl:px-10 h-[78px] flex items-center justify-between">
            {/* Left nav */}
            <div className="flex-1 flex justify-start">
              <nav className="flex items-center gap-5">
                <Link
                  to="/"
                  className="text-[#3D2817] text-[13px] font-bold uppercase tracking-wide hover:text-[#800020] transition-colors"
                >
                  Home
                </Link>

                {/* Sarees dropdown */}
                <div
                  className="relative"
                  onMouseLeave={() => setSareeOpen(false)}
                >
                  <button
                    onMouseEnter={() => setSareeOpen(true)}
                    className="flex items-center gap-1 text-[#3D2817] text-[13px] font-bold uppercase tracking-wide hover:text-[#800020] transition-colors"
                  >
                    Sarees
                    <svg
                      width="11"
                      height="11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {sareeOpen && (
                    <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-2xl border border-[#D4AF37]/20 py-2 z-50">
                      {SAREE_TYPES.map((name) => (
                        <Link
                          key={name}
                          to={`/collection?fabric=${encodeURIComponent(name)}`}
                          className="block px-4 py-2 text-[13px] text-[#3D2817] hover:bg-[#F5ECD7] hover:text-[#800020] transition-colors"
                        >
                          {name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {[
                  { label: "Collections", to: "/collection" },
                  { label: "New Arrivals", to: "/new-arrivals" },
                  { label: "About Us", to: "/about" },
                  { label: "Contact Us", to: "/contact" },
                ].map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="text-[#3D2817] text-[13px] font-bold uppercase tracking-wide hover:text-[#800020] transition-colors whitespace-nowrap"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Centre: Brand logo */}
            <div className="flex-shrink-0 flex justify-center">
              <Link
                to="/"
                className="flex flex-col items-center select-none group"
              >
                <div
                  className="w-[52px] h-[52px] rounded-full border-2 border-[#B8860B] flex items-center justify-center mb-0.5 group-hover:border-[#D4AF37] transition-colors"
                  style={{
                    background: "linear-gradient(135deg,#2D1B0E,#5A2D0C)",
                  }}
                >
                  <span
                    className="text-[#D4AF37] font-extrabold text-[17px] leading-none"
                    style={{ fontFamily: "Georgia,serif" }}
                  >
                    VNS
                  </span>
                </div>
                <span
                  className="text-[#2D1B0E] font-extrabold text-[13px] tracking-[0.2em] uppercase leading-none"
                  style={{ fontFamily: "Georgia,serif" }}
                >
                  Banarasi
                </span>
                <span
                  className="text-[#800020] text-[11px] italic leading-none mt-0.5"
                  style={{ fontFamily: "Georgia,serif" }}
                >
                  Kala
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="h-px w-7 bg-[#B8860B]" />
                  <span className="text-[#B8860B] text-[7px] tracking-widest uppercase font-semibold">
                    Handcrafted with love
                  </span>
                  <div className="h-px w-7 bg-[#B8860B]" />
                </div>
              </Link>
            </div>

            {/* Right: search + icons */}
            <div className="flex-1 flex justify-end">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for Banarasi Sarees"
                    className="w-52 pl-4 pr-9 py-2 rounded-full bg-white border border-gray-200 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 shadow-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="15"
                      height="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </span>
                </div>

                <button
                  aria-label="Wishlist"
                  className="flex flex-col items-center gap-0.5 text-[#3D2817] hover:text-[#800020] transition-colors"
                >
                  <svg
                    width="21"
                    height="21"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span className="text-[9px] uppercase tracking-wider font-bold">
                    Wishlist
                  </span>
                </button>

                <button
                  aria-label="Cart"
                  className="flex flex-col items-center gap-0.5 text-[#3D2817] hover:text-[#800020] transition-colors"
                >
                  <div className="relative">
                    <svg
                      width="21"
                      height="21"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <span className="absolute -top-1.5 -right-1.5 w-[15px] h-[15px] rounded-full bg-[#800020] text-white text-[8px] font-bold flex items-center justify-center">
                      2
                    </span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-bold">
                    Cart
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ── 3. Fabric category swatches ───────────────────────── */}
        <div className="bg-[#F5ECD7] py-4 px-6 xl:px-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-8 gap-3">
              {FABRIC_CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className="w-full h-[100px] rounded-xl shadow border-[3px] border-white group-hover:border-[#D4AF37] transition-all duration-200 overflow-hidden relative"
                    style={{ background: cat.color }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `repeating-linear-gradient(45deg,${cat.accent}60 0px,${cat.accent}60 2px,transparent 2px,transparent 10px)`,
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(130deg,transparent 28%,rgba(212,175,55,0.55) 50%,transparent 72%)",
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#3D2817] tracking-widest uppercase text-center leading-tight">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4. Coupon banner ──────────────────────────────────── */}
        <div className="w-full">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={activeCoupons.length > 1}
          >
            {activeCoupons.map((coupon) => (
              <SwiperSlide key={coupon.id}>
                <div
                  className="w-full flex items-center justify-between px-10 py-4"
                  style={{
                    background:
                      "linear-gradient(90deg,#5A0015 0%,#8B001F 30%,#8B001F 70%,#5A0015 100%)",
                  }}
                >
                  {/* left rosette */}
                  <svg
                    className="flex-shrink-0 opacity-75"
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="#D4AF37"
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <ellipse
                        key={i}
                        cx="19"
                        cy="7.5"
                        rx="3"
                        ry="6.5"
                        opacity="0.75"
                        transform={`rotate(${deg} 19 19)`}
                      />
                    ))}
                    <circle cx="19" cy="19" r="5.5" opacity="0.35" />
                  </svg>

                  <span
                    className="text-[#D4AF37] font-extrabold tracking-wide flex-1 text-center"
                    style={{
                      fontFamily: "Georgia,serif",
                      fontSize: "clamp(1.15rem,2vw,1.6rem)",
                      textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                    }}
                  >
                    {coupon.discount_type === "percentage"
                      ? `Flat ${coupon.discount_percent}% OFF`
                      : `Flat ₹${Number(coupon.discount_amount).toLocaleString()} OFF`}
                  </span>

                  <div className="w-px h-12 bg-[#D4AF37]/35 mx-8 flex-shrink-0" />

                  <div className="flex flex-col items-start gap-1 flex-shrink-0">
                    <span className="text-white/55 text-[10px] uppercase tracking-[0.22em] font-bold">
                      USE CODE:
                    </span>
                    <div
                      className="px-5 py-1.5 border-2 border-[#D4AF37] rounded text-[#D4AF37] font-extrabold tracking-widest text-[13px]"
                      style={{ background: "rgba(212,175,55,0.1)" }}
                    >
                      {coupon.code}
                    </div>
                  </div>

                  {/* right rosette */}
                  <svg
                    className="flex-shrink-0 opacity-75 ml-8"
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="#D4AF37"
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <ellipse
                        key={i}
                        cx="19"
                        cy="7.5"
                        rx="3"
                        ry="6.5"
                        opacity="0.75"
                        transform={`rotate(${deg} 19 19)`}
                      />
                    ))}
                    <circle cx="19" cy="19" r="5.5" opacity="0.35" />
                  </svg>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ── 5. Hero image slider (pagination + arrows INSIDE) ─── */}
        <div className="relative w-full">
          {heroLoading ? (
            <div className="w-full h-[440px] xl:h-[500px] bg-[#2D1B0E]/20 animate-pulse" />
          ) : (
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={1}
              autoplay={{ delay: 5500, disableOnInteraction: false }}
              loop
              navigation={{
                nextEl: ".hs-next",
                prevEl: ".hs-prev",
              }}
              pagination={{ clickable: true }}
              className="hero-swiper"
            >
              {heroSlides.slice(0, 5).map((s, idx) => (
                <SwiperSlide key={s.id || idx}>
                  <img
                    src={s.image || getCoverImage(s)}
                    alt={s.name}
                    className="w-full h-[440px] xl:h-[500px] object-cover object-center block"
                  />
                </SwiperSlide>
              ))}

              {/* prev / next — rendered as siblings inside Swiper so they overlay */}
              <button className="hs-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-105">
                <svg
                  width="17"
                  height="17"
                  fill="none"
                  stroke="#2D1B0E"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button className="hs-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-105">
                <svg
                  width="17"
                  height="17"
                  fill="none"
                  stroke="#2D1B0E"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </Swiper>
          )}
        </div>

        {/* ── 6. Popular Sarees ─────────────────────────────────── */}
        <div className="bg-[#F5ECD7] pt-8 pb-10">
          <div className="max-w-[1400px] mx-auto px-6 xl:px-10">
            {/* header row */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[#2D1B0E] font-extrabold text-[15px] uppercase tracking-[0.18em]">
                Popular Sarees
              </h2>
              <Link
                to="/collection"
                className="flex items-center gap-1 text-[#800020] font-bold text-[13px] uppercase tracking-wider hover:gap-2 transition-all"
              >
                View All
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </div>

            {/* 6-column card grid */}
            {loading ? (
              <div className="grid grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] rounded-xl bg-[#E8DCC8] mb-3" />
                    <div className="h-2.5 bg-[#E8DCC8] rounded mb-2 w-4/5" />
                    <div className="h-2.5 bg-[#E8DCC8] rounded w-3/5" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-4">
                {displayProducts.slice(0, 6).map((product) => {
                  const sell = Number(product.selling_price || product.price);
                  const mrp = Number(product.mrp_price || product.mrp || 0);
                  const disc = calcDiscount(mrp, sell);
                  const img = getCoverImage(product) || product.image || "";
                  const liked = wishlist[product.id];
                  return (
                    <div key={product.id} className="group">
                      <Link to={`/product/${product.slug}`} className="block">
                        {/* image */}
                        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white shadow mb-2.5">
                          <img
                            src={img}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(product.id);
                            }}
                            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform"
                            aria-label="Wishlist"
                          >
                            <svg
                              width="15"
                              height="15"
                              fill={liked ? "#800020" : "none"}
                              stroke={liked ? "#800020" : "#666"}
                              strokeWidth="1.8"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </button>
                        </div>

                        {/* text */}
                        <div>
                          <h3 className="text-[#2D1B0E] font-semibold text-[12px] leading-snug mb-1 line-clamp-1">
                            {product.name}
                          </h3>
                          <div className="flex items-baseline gap-1.5 flex-wrap mb-0.5">
                            <span className="text-[#2D1B0E] font-extrabold text-[13px]">
                              ₹{sell.toLocaleString("en-IN")}
                            </span>
                            {mrp > sell && (
                              <span className="text-gray-400 text-[11px] line-through">
                                ₹{mrp.toLocaleString("en-IN")}
                              </span>
                            )}
                            {disc > 0 && (
                              <span className="text-[#27AE60] font-bold text-[11px]">
                                {disc}% OFF
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg
                              width="11"
                              height="11"
                              fill="#D4AF37"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-[#555] text-[11px] font-semibold">
                              {product.rating || "4.8"}
                            </span>
                            <span className="text-gray-400 text-[11px]">
                              ({product.reviews || product.review_count || "—"})
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── 7. Trust badges ───────────────────────────────────── */}
        <div className="bg-[#F5ECD7] border-t border-[#D4AF37]/25 py-6">
          <div className="max-w-[1400px] mx-auto px-6 xl:px-10 flex flex-wrap justify-around items-center gap-6">
            {[
              {
                path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
                label: "100% Authentic Banarasi Sarees",
              },
              {
                path: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
                label: "Handcrafted With Love",
              },
              {
                path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
                label: "Secure Payments",
              },
              {
                path: "M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1z",
                label: "Easy Returns",
              },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <svg
                  width="30"
                  height="30"
                  fill="none"
                  stroke="#800020"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="flex-shrink-0"
                >
                  <path d={b.path} />
                </svg>
                <span className="text-[#3D2817] font-semibold text-[13px]">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===================== VIDEO / STORY SECTION ===================== */}
        <section className="py-16 bg-gradient-to-br from-[#800020] via-[#3D2817] to-[#800020] text-white relative overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#800020]/40 rounded-full blur-3xl" />
          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <span className="inline-block bg-[#D4AF37] text-[#800020] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              Our Story
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-[#D4AF37]">
              Every Saree Tells a Story
            </h2>
            <p className="text-xl mb-12 leading-relaxed opacity-90">
              Our artists spend weeks creating each saree with pure gold and
              silver threads. It's more than just clothing — it's art you can
              wear.
            </p>
            <Link
              to="/testimonials"
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

        {/* ===================== TESTIMONIALS ===================== */}
        <section className="py-20 bg-[#FFF8F0] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#800020]/5 rounded-full blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="text-[#800020] font-bold tracking-widest uppercase text-xs mb-4 block">
                Voices of Heritage
              </span>
              <h2 className="text-4xl md:text-5xl font-bold brand-font text-[#3D2817]">
                Customer Love
              </h2>
              <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(feedbacks.length > 0
                ? feedbacks
                : [
                    {
                      id: 1,
                      rating: 5,
                      comment:
                        "The Katan Silk saree I ordered is even more beautiful in person. Truly a piece of art!",
                      Customer: { name: "Priya Sharma" },
                    },
                    {
                      id: 2,
                      rating: 5,
                      comment:
                        "VNS Saree has the most authentic Banarasi collection I've found online. Highly recommend!",
                      Customer: { name: "Anjali Gupta" },
                    },
                    {
                      id: 3,
                      rating: 5,
                      comment:
                        "I wore their hand-woven saree for my daughter's wedding and received so many compliments.",
                      Customer: { name: "Meera Reddy" },
                    },
                  ]
              )
                .slice(0, 3)
                .map((item, i) => (
                  <div
                    key={item.id || i}
                    className="bg-white p-8 rounded-xl shadow-sm border border-[#D4AF37]/10 reveal-up hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex text-[#D4AF37] mb-6">
                      {[...Array(item.rating || 5)].map((_, idx) => (
                        <iconify-icon key={idx} icon="mdi:star"></iconify-icon>
                      ))}
                    </div>
                    <p className="text-lg mb-8 italic text-[#3D2817]">
                      "{item.comment || item.text}"
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#F5F1E8] flex items-center justify-center overflow-hidden border border-[#D4AF37]/20">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.Customer?.name || i}`}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#3D2817] capitalize">
                          {item.Customer?.name || item.name || "Happy Customer"}
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

        {/* ===================== CONTACT ===================== */}
        <section className="py-20 bg-[#2D1B0E] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div className="text-center mb-12">
              <h2 className="brand-font text-3xl lg:text-5xl text-[#D4AF37] mb-4 italic-text">
                Get In Touch
              </h2>
              <p className="text-white/60 text-sm lg:text-base max-w-xl mx-auto">
                Have questions about our collection or need help with your
                order? We'll get back to you shortly.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-8 lg:p-12 rounded-[2rem] border border-[#D4AF37]/20 shadow-2xl">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <input
                  type="hidden"
                  name="subject"
                  value="New Inquiry from VNS Saree Website"
                />
                <input type="checkbox" name="botcheck" className="hidden" />
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
                  />
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
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#800020]/20 blur-[100px] rounded-full" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D4AF37]/10 blur-[100px] rounded-full" />
        </section>
      </main>
    </div>
  );
};

export default Home;
