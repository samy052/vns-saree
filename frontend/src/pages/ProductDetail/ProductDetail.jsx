import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useNotification } from "../../context/NotificationContext";
import { API_ENDPOINTS } from "../../config/api";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [allColors, setAllColors] = useState([]);
  const [products, setProducts] = useState([]); // For related products
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState("story");

  const frameRef = useRef(null);
  const perspectiveRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, allRes, colorsRes] = await Promise.all([
          fetch(`${API_ENDPOINTS.products}/${slug}`),
          fetch(API_ENDPOINTS.products),
          fetch(API_ENDPOINTS.colors),
        ]);

        if (!prodRes.ok) throw new Error("Product not found");

        const [prodData, allData, colorsData] = await Promise.all([
          prodRes.json(),
          allRes.json(),
          colorsRes.json(),
        ]);

        setProduct(prodData);
        setAllColors(colorsData);
        
        const allImages = [...(prodData.images || []), ...(prodData.productImages || [])];
        const coverImg = allImages.find(img => img.is_cover || img.is_primary) || allImages[0];
        const initialColorId = coverImg ? coverImg.color_id : null;
        
        setSelectedColorId(initialColorId);
        setMainImage(coverImg ? coverImg.url : prodData.image_url);
        
        setProducts((allData.rows || allData).filter((p) => p.slug !== slug));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleColorChange = (colorId) => {
    setSelectedColorId(colorId);
    const allImages = [...(product.images || []), ...(product.productImages || [])];
    const colorImages = allImages.filter(img => img.color_id === colorId);
    if (colorImages.length > 0) {
      setMainImage(colorImages[0].url);
    }
  };

  const getDistinctProductColors = () => {
    const allImages = [...(product.images || []), ...(product.productImages || [])];
    if (allImages.length === 0) return [];
    const colorIds = [...new Set(allImages.map(img => img.color_id))].filter(id => id);
    return allColors.filter(c => colorIds.includes(c.id));
  };

  const getVisibleImages = () => {
    const allImages = [...(product.images || []), ...(product.productImages || [])];
    if (allImages.length === 0) return [];
    if (!selectedColorId) return allImages;
    return allImages.filter(img => img.color_id === selectedColorId);
  };

  useEffect(() => {
    const frame = frameRef.current;
    const perspective = perspectiveRef.current;

    const handleMouseMove = (e) => {
      if (!perspective || !frame) return;
      const rect = perspective.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      frame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      if (frame) frame.style.transform = `rotateX(0deg) rotateY(0deg)`;
    };

    if (perspective) {
      perspective.addEventListener("mousemove", handleMouseMove);
      perspective.addEventListener("mouseleave", handleMouseLeave);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 },
    );

    if (rootRef.current) {
      rootRef.current
        .querySelectorAll(".reveal-up")
        .forEach((el) => observer.observe(el));
    }

    return () => {
      if (perspective) {
        perspective.removeEventListener("mousemove", handleMouseMove);
        perspective.removeEventListener("mouseleave", handleMouseLeave);
      }
      observer.disconnect();
    };
  }, [loading]);

  const changeImage = (src) => {
    setMainImage(src);
  };

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    if (!user) {
      showNotification("Please login first", "info");
      navigate("/login");
      return;
    }

    // Stock Validation
    const colorStock = product.color_stocks?.[selectedColorId] ?? product.stock_quantity;
    if (quantity > colorStock) {
      showNotification(`Only ${colorStock} items available in this color!`, "warning");
      return;
    }

    const result = await addToCart(product, quantity, selectedColorId);
    if (result.success) {
      showNotification("Added to Bag!");
    } else {
      showNotification(result.message, "warning");
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      showNotification("Please login first", "info");
      navigate("/login");
      return;
    }
    await toggleWishlist(product);
  };

  const toggleAccordion = (id) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]">
        <p className="serif-text italic text-2xl text-[#800020] animate-pulse">
          Unveiling elegance...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]">
        <div className="text-center">
          <p className="serif-text italic text-2xl text-[#800020] mb-4">
            This product is no longer available.
          </p>
          <Link
            to="/collection"
            className="text-[#D4AF37] font-bold uppercase tracking-widest border-b border-[#D4AF37]"
          >
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  const distinctColors = getDistinctProductColors();
  const visibleImages = getVisibleImages();

  return (
    <div className="relative min-h-screen bg-[#F5F1E8]" ref={rootRef}>
      <main className="max-w-6xl mx-auto px-4 lg:px-12 py-6">
        <nav className="flex text-[10px] uppercase tracking-widest text-[#3D2817]/60 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li><Link to="/" className="hover:text-[#800020]">Home</Link></li>
            <iconify-icon icon="lucide:chevron-right"></iconify-icon>
            <li><Link to="/collection" className="hover:text-[#800020]">Collections</Link></li>
            <iconify-icon icon="lucide:chevron-right"></iconify-icon>
            <li className="text-[#800020] font-bold">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
            <div className="flex-1 product-3d-perspective" ref={perspectiveRef}>
              <div className="product-3d-frame relative bg-white rounded-xl shadow-2xl overflow-hidden border border-[#D4AF37]/20 group zoom-container" ref={frameRef}>
                <img src={mainImage} alt={product.name} className="w-full h-full object-contain zoom-image" />
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <iconify-icon icon="lucide:rotate-3d" className="text-xl"></iconify-icon>
                </div>
                {product.discount_percent > 0 && (
                  <div className="absolute top-6 left-6 bg-[#800020] text-[#D4AF37] px-4 py-1 font-bold text-sm tracking-widest shadow-lg">
                    {product.discount_percent}% OFF
                  </div>
                )}
              </div>
            </div>

            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scroll-smooth custom-scrollbar">
              {visibleImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => changeImage(img.url)}
                  className={`w-20 h-24 md:w-24 md:h-32 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${mainImage === img.url ? "border-[#800020] shadow-md scale-105" : "border-transparent opacity-60 hover:opacity-100 hover:border-[#D4AF37]"}`}
                >
                  <img src={img.url} className="w-full h-full object-cover" alt={`Thumb ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-6">
              <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-[0.3em] mb-2 block">
                {product.Variety?.name || "Handwoven Edit"}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-[#800020] mb-2 leading-tight uppercase brand-font tracking-tight">
                {product.name}
              </h1>
              <p className="serif-text text-lg italic text-[#3D2817]/70 mb-3">
                {product.Material?.name || "Pure Silk"}
              </p>
              <div className="flex items-center space-x-2">
                <div className="flex text-[#D4AF37]">
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star"></iconify-icon>
                  <iconify-icon icon="mdi:star-half"></iconify-icon>
                </div>
                <span className="text-xs font-semibold text-gray-500">4.8 (124 Reviews)</span>
              </div>
            </div>

            <div className="bg-white/60 p-5 border border-[#D4AF37]/20 rounded-xl mb-6 backdrop-blur-sm">
              <div className="flex items-baseline space-x-4 mb-1">
                <span className="text-3xl font-black text-[#3D2817]">₹{Number(product.selling_price).toLocaleString("en-IN")}</span>
                {product.mrp_price > product.selling_price && (
                  <>
                    <span className="text-xl text-gray-400 line-through opacity-60">₹{Number(product.mrp_price).toLocaleString("en-IN")}</span>
                    <span className="text-emerald-600 font-bold text-sm tracking-wider uppercase">SAVE {product.discount_percent}%</span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-gray-500 italic uppercase tracking-[0.2em] font-bold">Incl. of all taxes & free worldwide shipping</p>
            </div>

            {distinctColors.length > 0 && (
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                  Select Color: <span className="text-[#800020]">{allColors.find(c => c.id === selectedColorId)?.name}</span>
                </p>
                <div className="flex flex-wrap gap-4">
                  {distinctColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color.id)}
                      className={`group relative w-8 h-8 rounded-full transition-all duration-300 ${selectedColorId === color.id ? 'ring-2 ring-[#800020] ring-offset-4 scale-110' : 'hover:scale-105'}`}
                      title={color.name}
                    >
                      <div className="w-full h-full rounded-full border border-gray-200 shadow-inner" style={{ backgroundColor: color.hex_code }} />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center border border-[#800020]/20 rounded-sm bg-white overflow-hidden">
                  <button onClick={decrementQty} className="w-10 h-12 flex items-center justify-center hover:bg-[#800020] hover:text-white transition-colors"><iconify-icon icon="lucide:minus"></iconify-icon></button>
                  <input type="number" value={quantity} readOnly className="w-12 h-12 text-center bg-transparent font-bold focus:ring-0 border-none" />
                  <button onClick={incrementQty} className="w-10 h-12 flex items-center justify-center hover:bg-[#800020] hover:text-white transition-colors"><iconify-icon icon="lucide:plus"></iconify-icon></button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-[#800020] text-[#D4AF37] flex items-center justify-center font-bold tracking-[0.2em] rounded-sm shadow-xl hover:bg-[#3D2817] transition-all transform hover:-translate-y-1 active:scale-95 group w-full md:w-auto"
                >
                  <iconify-icon icon="lucide:shopping-bag" className="text-xl mr-3 group-hover:scale-110 transition-transform"></iconify-icon>
                  ADD TO BAG
                </button>
              </div>

              <div className="flex items-center space-x-6">
                <button 
                  onClick={handleWishlist}
                  className={`flex items-center text-sm font-semibold transition-colors ${isInWishlist(product?.id) ? 'text-red-600' : 'hover:text-[#800020]'}`}
                >
                  <iconify-icon icon={isInWishlist(product?.id) ? "mdi:heart" : "lucide:heart"} className="text-lg mr-2"></iconify-icon>
                  {isInWishlist(product?.id) ? 'In Wishlist' : 'Save to Wishlist'}
                </button>
                <button className="flex items-center text-sm font-semibold hover:text-[#800020] transition-colors">
                  <iconify-icon icon="lucide:share-2" className="text-lg mr-2"></iconify-icon>
                  Share Piece
                </button>
              </div>
            </div>

            <div className="border-t border-[#D4AF37]/20">
              {[
                { id: "story", title: "Product Story", content: product.description || "This exquisite piece is a testament to the rich heritage of Banarasi weaving." },
                { id: "material", title: "Material & Specifications", content: (
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Material: {product.Material?.name || "Pure Silk"}</li>
                    {product.weight && <li>Weight: {product.weight}g</li>}
                    {product.length && <li>Length: {product.length} Metres</li>}
                    <li>Care: Dry Clean Only</li>
                  </ul>
                )},
                { id: "shipping", title: "Shipping & Returns", content: "Ships within 48 hours. Complimentary express delivery globally." },
              ].map((item) => (
                <div key={item.id} className={`border-b border-[#D4AF37]/20 py-4 ${activeAccordion === item.id ? "active" : ""}`}>
                  <button onClick={() => toggleAccordion(item.id)} className="w-full flex items-center justify-between text-left">
                    <span className="brand-font font-bold text-lg tracking-wider uppercase">{item.title}</span>
                    <iconify-icon icon="lucide:chevron-down" className={`transition-transform duration-300 ${activeAccordion === item.id ? "rotate-180" : ""}`}></iconify-icon>
                  </button>
                  <div className={`accordion-content overflow-hidden transition-all duration-400 ${activeAccordion === item.id ? "max-h-[500px] mt-4" : "max-h-0"}`}>
                    <div className="text-sm text-gray-600 leading-relaxed">{item.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-24 reveal-up">
          <h2 className="text-3xl font-bold text-[#800020] uppercase brand-font mb-10">More Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="group cursor-pointer bg-white p-3 rounded-xl shadow-sm border border-[#D4AF37]/10 hover:shadow-xl transition-all">
                <Link to={`/product/${p.slug}`}>
                  <div className="relative overflow-hidden aspect-[3/4] mb-4 rounded-lg">
                    <img src={p.images?.[0]?.url || p.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
                  </div>
                  <h3 className="brand-font text-lg text-[#800020] mb-1 truncate">{p.name}</h3>
                  <p className="text-sm text-[#3D2817] font-black">₹{Number(p.selling_price).toLocaleString("en-IN")}</p>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetail;
