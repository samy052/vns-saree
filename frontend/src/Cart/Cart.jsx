import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Cart.css';

const Cart = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col">
      <Header activeItem="cart" />

      <main className="flex-grow py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Cart Title */}
          <div className="mb-12 text-center animate-slide-up">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#800020] mb-4 uppercase brand-font tracking-widest">Shopping Bag</h1>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-4"></div>
            <p className="serif-text text-[#3D2817]/60 italic text-lg">Your handpicked heritage pieces awaiting grace.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Cart Items List */}
            <div className="w-full lg:w-2/3 space-y-6">
              {/* Item 1 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#D4AF37]/10 flex flex-col sm:flex-row items-center gap-6 item-row transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-32 h-40 flex-shrink-0 rounded overflow-hidden shadow-md">
                  <img src="https://images.unsplash.com/photo-1583391733956-6c7827448d08?auto=format&fit=crop&q=80" alt="Saree" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="brand-font text-xl text-[#800020] mb-1">Katan Silk Pure</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-semibold">Maroon & Real Gold Zari • SKU: BH-2024-01</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-4 text-sm font-medium">
                    <button className="text-gray-400 hover:text-[#800020] transition-colors">Save to Wishlist</button>
                    <span className="text-gray-300">|</span>
                    <button className="flex items-center space-x-1 text-red-700 hover:text-red-900 transition-colors">
                      <iconify-icon icon="lucide:trash-2"></iconify-icon>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-end gap-4">
                  <span className="text-xl font-bold text-[#3D2817]">₹45,000</span>
                  <div className="flex items-center border border-[#D4AF37]/30 rounded-sm bg-white overflow-hidden">
                    <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#800020] transition-colors">
                      <iconify-icon icon="lucide:minus" className="text-xs"></iconify-icon>
                    </button>
                    <input type="number" defaultValue="1" className="w-10 text-center text-sm font-bold bg-transparent outline-none border-none focus:ring-0" />
                    <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#800020] transition-colors">
                      <iconify-icon icon="lucide:plus" className="text-xs"></iconify-icon>
                    </button>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#D4AF37]/10 flex flex-col sm:flex-row items-center gap-6 item-row transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-32 h-40 flex-shrink-0 rounded overflow-hidden shadow-md">
                  <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80" alt="Saree" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="brand-font text-xl text-[#800020] mb-1">Organza Gold Zari</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-semibold">Champagne Cream • SKU: BH-2024-42</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-4 text-sm font-medium">
                    <button className="text-gray-400 hover:text-[#800020] transition-colors">Save to Wishlist</button>
                    <span className="text-gray-300">|</span>
                    <button className="flex items-center space-x-1 text-red-700 hover:text-red-900 transition-colors">
                      <iconify-icon icon="lucide:trash-2"></iconify-icon>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-end gap-4">
                  <span className="text-xl font-bold text-[#3D2817]">₹32,500</span>
                  <div className="flex items-center border border-[#D4AF37]/30 rounded-sm bg-white overflow-hidden">
                    <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#800020] transition-colors">
                      <iconify-icon icon="lucide:minus" className="text-xs"></iconify-icon>
                    </button>
                    <input type="number" defaultValue="1" className="w-10 text-center text-sm font-bold bg-transparent outline-none border-none focus:ring-0" />
                    <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#800020] transition-colors">
                      <iconify-icon icon="lucide:plus" className="text-xs"></iconify-icon>
                    </button>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#D4AF37]/10 flex flex-col sm:flex-row items-center gap-6 item-row transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-32 h-40 flex-shrink-0 rounded overflow-hidden shadow-md">
                  <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80" alt="Saree" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="brand-font text-xl text-[#800020] mb-1">Georgette Butidar</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-semibold">Royal Navy Blue • SKU: BH-2024-11</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-4 text-sm font-medium">
                    <button className="text-gray-400 hover:text-[#800020] transition-colors">Save to Wishlist</button>
                    <span className="text-gray-300">|</span>
                    <button className="flex items-center space-x-1 text-red-700 hover:text-red-900 transition-colors">
                      <iconify-icon icon="lucide:trash-2"></iconify-icon>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-end gap-4">
                  <span className="text-xl font-bold text-[#3D2817]">₹28,000</span>
                  <div className="flex items-center border border-[#D4AF37]/30 rounded-sm bg-white overflow-hidden">
                    <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#800020] transition-colors">
                      <iconify-icon icon="lucide:minus" className="text-xs"></iconify-icon>
                    </button>
                    <input type="number" defaultValue="1" className="w-10 text-center text-sm font-bold bg-transparent outline-none border-none focus:ring-0" />
                    <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#800020] transition-colors">
                      <iconify-icon icon="lucide:plus" className="text-xs"></iconify-icon>
                    </button>
                  </div>
                </div>
              </div>

              {/* Shopping Guarantee */}
              <div className="pt-8 flex flex-col sm:flex-row gap-6 border-t border-[#D4AF37]/20">
                <div className="flex items-center space-x-3 opacity-60">
                  <iconify-icon icon="lucide:truck" className="text-2xl"></iconify-icon>
                  <span className="text-xs font-semibold tracking-wider">SECURE WORLDWIDE SHIPPING</span>
                </div>
                <div className="flex items-center space-x-3 opacity-60">
                  <iconify-icon icon="lucide:lock" className="text-2xl"></iconify-icon>
                  <span className="text-xs font-semibold tracking-wider">PCI-DSS COMPLIANT PAYMENT</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <aside className="w-full lg:w-1/3 animate-slide-up sticky top-28" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-[#800020]">
                <h2 className="brand-font text-2xl text-[#3D2817] mb-8 uppercase tracking-wider font-bold">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[#3D2817]/70">
                    <span>Subtotal (3 items)</span>
                    <span className="font-semibold">₹1,05,500</span>
                  </div>
                  <div className="flex justify-between text-[#3D2817]/70">
                    <span>Shipping</span>
                    <span className="text-green-700 font-semibold uppercase tracking-wider">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-[#3D2817]/70">
                    <span>GST (Estimated)</span>
                    <span className="font-semibold">₹5,275</span>
                  </div>
                  <div className="pt-4 border-t border-[#D4AF37]/20">
                    <div className="flex justify-between text-2xl font-bold text-[#800020]">
                      <span>Total</span>
                      <span>₹1,10,775</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest text-right">Inclusive of all taxes</p>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-10">
                  <label className="block text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-2">Heritage Code</label>
                  <div className="flex">
                    <input type="text" placeholder="Enter code" className="flex-grow border border-[#D4AF37]/30 border-r-0 px-4 py-2 text-sm outline-none focus:border-[#800020] bg-[#F5F1E8]/20" />
                    <button className="px-6 py-2 bg-[#800020] text-[#D4AF37] text-sm font-bold uppercase tracking-widest hover:bg-[#3D2817] transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                <Link to="/checkout" className="checkout-btn-3d w-full py-4 bg-[#800020] text-[#D4AF37] font-bold text-lg uppercase tracking-[0.2em] shadow-lg border border-[#800020] flex items-center justify-center space-x-3 rounded-sm">
                  <span>Secure Checkout</span>
                  <iconify-icon icon="lucide:chevron-right" className="text-xl"></iconify-icon>
                </Link>

                <div className="mt-8 text-center">
                  <p className="text-xs text-gray-500 mb-4 font-semibold uppercase tracking-widest">Accepted Payment Methods</p>
                  <div className="flex justify-center items-center space-x-4 grayscale opacity-40">
                    <iconify-icon icon="logos:visa" className="text-3xl"></iconify-icon>
                    <iconify-icon icon="logos:mastercard" className="text-2xl"></iconify-icon>
                    <iconify-icon icon="logos:apple-pay" className="text-3xl"></iconify-icon>
                    <iconify-icon icon="logos:google-pay" className="text-3xl"></iconify-icon>
                  </div>
                </div>
              </div>

              {/* Return Policy Link */}
              <div className="mt-6 bg-[#800020]/5 p-4 rounded text-center border border-[#800020]/10">
                <p className="text-xs text-[#800020] font-medium leading-relaxed">
                  <iconify-icon icon="lucide:info" className="inline-block align-middle mr-1"></iconify-icon>
                  7-Day Hassle-Free Returns on Heritage Pieces. <a href="#" className="underline font-bold hover:text-[#3D2817]">Details</a>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
