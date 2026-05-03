import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]); // For related products
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('story');

  const frameRef = useRef(null);
  const perspectiveRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, allRes] = await Promise.all([
          fetch(`http://localhost:5001/api/products/${slug}`),
          fetch(`http://localhost:5001/api/products`)
        ]);
        
        if (!prodRes.ok) throw new Error('Product not found');
        
        const [prodData, allData] = await Promise.all([prodRes.json(), allRes.json()]);
        
        setProduct(prodData);
        setMainImage(prodData.image_url);
        setProducts(allData.filter(p => p.slug !== slug)); // Filter out current product
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

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
      perspective.addEventListener('mousemove', handleMouseMove);
      perspective.addEventListener('mouseleave', handleMouseLeave);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    if (rootRef.current) {
      rootRef.current.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
    }


    return () => {
      if (perspective) {
        perspective.removeEventListener('mousemove', handleMouseMove);
        perspective.removeEventListener('mouseleave', handleMouseLeave);
      }
      observer.disconnect();
    };
  }, []);

  const changeImage = (src) => {
    setMainImage(src);
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const toggleAccordion = (id) => {
    setActiveAccordion(prev => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]">
        <p className="serif-text italic text-2xl text-[#800020] animate-pulse">Unveiling heritage...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]">
        <div className="text-center">
          <p className="serif-text italic text-2xl text-[#800020] mb-4">This masterpiece has moved.</p>
          <Link to="/collection" className="text-[#D4AF37] font-bold uppercase tracking-widest border-b border-[#D4AF37]">Return to Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F5F1E8]" ref={rootRef}>
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex text-xs uppercase tracking-widest text-[#3D2817]/60 mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li><Link to="/" className="hover:text-[#800020]">Home</Link></li>
            <iconify-icon icon="lucide:chevron-right"></iconify-icon>
            <li><Link to="/collection" className="hover:text-[#800020]">Collections</Link></li>
            <iconify-icon icon="lucide:chevron-right"></iconify-icon>
            <li className="text-[#800020] font-bold">{product.name}</li>
          </ol>
        </nav>

        {/* Product Core Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
            <div className="flex-1 product-3d-perspective" ref={perspectiveRef}>
              <div className="product-3d-frame relative bg-white rounded-xl shadow-2xl overflow-hidden border border-[#D4AF37]/20 group zoom-container" ref={frameRef}>
                <img src={mainImage} alt={product.name} className="w-full h-full object-contain zoom-image" />
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <iconify-icon icon="lucide:rotate-3d" className="text-xl"></iconify-icon>
                </div>
                {product.discount_percent && (
                  <div className="absolute top-6 left-6 bg-[#800020] text-[#D4AF37] px-4 py-1 font-bold text-sm tracking-widest shadow-lg">
                    {product.discount_percent}% OFF
                  </div>
                )}
              </div>
            </div>

            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0">
              {[product.image_url].map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => changeImage(src)}
                  className={`w-20 h-24 md:w-24 md:h-32 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${mainImage === src ? 'border-[#800020]' : 'border-transparent hover:border-[#D4AF37]'}`}
                >
                  <img src={src} className="w-full h-full object-contain" alt={`Thumb ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-6">
              <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-[0.3em] mb-2 block">{product.Variety?.name || 'Handwoven Edit'}</span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#800020] mb-3 leading-tight uppercase">{product.name}</h1>
              <p className="serif-text text-xl italic text-[#3D2817]/70 mb-4">{product.Material?.name || 'Pure Silk'}</p>
              
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

            <div className="bg-white/40 p-6 border border-[#D4AF37]/20 rounded-xl mb-8">
              <div className="flex items-baseline space-x-4 mb-1">
                <span className="text-4xl font-bold text-[#3D2817]">₹{Number(product.price).toLocaleString('en-IN')}</span>
                {product.old_price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">₹{Number(product.old_price).toLocaleString('en-IN')}</span>
                    <span className="text-green-600 font-bold text-sm tracking-wider uppercase">SAVE ₹{Number(product.old_price - product.price).toLocaleString('en-IN')}</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 italic uppercase tracking-widest">Incl. of all taxes & free worldwide shipping</p>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center border border-[#800020]/20 rounded-sm bg-white overflow-hidden">
                  <button onClick={decrementQty} className="w-12 h-14 flex items-center justify-center hover:bg-[#800020] hover:text-white transition-colors">
                    <iconify-icon icon="lucide:minus"></iconify-icon>
                  </button>
                  <input type="number" value={quantity} readOnly className="w-14 h-14 text-center bg-transparent font-bold focus:ring-0 border-none" />
                  <button onClick={incrementQty} className="w-12 h-14 flex items-center justify-center hover:bg-[#800020] hover:text-white transition-colors">
                    <iconify-icon icon="lucide:plus"></iconify-icon>
                  </button>
                </div>

                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 h-14 bg-[#800020] text-[#D4AF37] flex items-center justify-center font-bold tracking-[0.2em] rounded-sm shadow-xl hover:bg-[#3D2817] transition-all transform hover:-translate-y-1 active:scale-95 group w-full md:w-auto"
                >
                  <iconify-icon icon="lucide:shopping-bag" className="text-xl mr-3 group-hover:scale-110 transition-transform"></iconify-icon>
                  ADD TO SAC
                </button>
              </div>

              <div className="flex items-center space-x-6">
                <button className="flex items-center text-sm font-semibold hover:text-[#800020] transition-colors">
                  <iconify-icon icon="lucide:heart" className="text-lg mr-2"></iconify-icon>
                  Save to Wishlist
                </button>
                <button className="flex items-center text-sm font-semibold hover:text-[#800020] transition-colors">
                  <iconify-icon icon="lucide:share-2" className="text-lg mr-2"></iconify-icon>
                  Share Piece
                </button>
              </div>
            </div>

            <div className="border-t border-[#D4AF37]/20">
              {/* Accordion Items */}
              {[
                { id: 'story', title: 'The Weave Story', content: "Woven meticulously over 14 days by master artisan Shri Ramdas, this saree features the rare 'Kimkhab' technique. Every flower in the border is hand-brocaded with pure mulberry silk and tested zari, ensuring a drape that feels like a second skin yet looks like royalty." },
                { id: 'material', title: 'Material & Care', content: "100% Katan Silk. Dry Clean Only. approx. 950g. 6.5 Metres includes 80cm blouse piece." },
                { id: 'shipping', title: 'Shipping & Returns', content: "Ships within 48 hours. Complimentary express delivery globally. We offer a 7-day easy return policy." }
              ].map((item) => (
                <div key={item.id} className={`border-b border-[#D4AF37]/20 py-4 ${activeAccordion === item.id ? 'active' : ''}`}>
                  <button onClick={() => toggleAccordion(item.id)} className="w-full flex items-center justify-between text-left">
                    <span className="brand-font font-bold text-lg tracking-wider uppercase">{item.title}</span>
                    <iconify-icon icon="lucide:chevron-down" className={`transition-transform duration-300 ${activeAccordion === item.id ? 'rotate-180' : ''}`}></iconify-icon>
                  </button>
                  <div className={`accordion-content overflow-hidden transition-all duration-400 ${activeAccordion === item.id ? 'max-h-[500px] mt-4' : 'max-h-0'}`}>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#3D2817]/60 mb-3">Check Delivery Timeline</p>
              <div className="flex space-x-2">
                <input type="text" placeholder="Enter Pincode" className="flex-1 bg-white border border-[#D4AF37]/30 rounded-sm px-4 text-sm focus:ring-[#800020] focus:border-[#800020]" />
                <button className="px-6 py-2 bg-[#D4AF37] text-white font-bold text-xs uppercase tracking-widest">Check</button>
              </div>
              <div className="mt-3 flex items-center space-x-2 text-[#800020]">
                <iconify-icon icon="lucide:truck"></iconify-icon>
                <span className="text-xs font-semibold">Expected Delivery: 3-5 Business Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-24 reveal-up">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-[#800020] uppercase brand-font">Complementary Weaves</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="group cursor-pointer bg-white p-3 rounded-xl shadow-sm border border-[#D4AF37]/10 hover:shadow-xl transition-all">
                <div className="relative overflow-hidden aspect-[3/4] mb-4 rounded-lg">
                  <img src={p.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
                </div>
                <h3 className="brand-font text-lg text-[#800020] mb-1">{p.name}</h3>
                <p className="text-sm text-[#3D2817] font-bold">₹{Number(p.price).toLocaleString('en-IN')}</p>
                <Link to={`/product/${p.slug}`} className="mt-4 block w-full py-2 border border-[#800020] text-[#800020] text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#800020] hover:text-white text-center transition-all">VIEW PIECE</Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetail;
