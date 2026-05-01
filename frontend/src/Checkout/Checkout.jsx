import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Checkout.css';

const Checkout = () => {
  const [activePayment, setActivePayment] = useState('card');

  useEffect(() => {
    // Reveal animations on mount
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('reveal');
      }, index * 100);
    });
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F5F1E8]">
      <Header activeItem="" />

      <main className="flex-grow py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Checkout Progress */}
          <div className="flex items-center justify-center mb-16 space-x-4 md:space-x-12 animate-slide-up">
            <div className="flex items-center space-x-3">
              <span className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm border border-green-200">
                <iconify-icon icon="lucide:check" className="text-lg"></iconify-icon>
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-gray-500 hidden md:block">Cart</span>
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className="flex items-center space-x-3">
              <span className="w-10 h-10 rounded-full bg-[#800020] text-[#D4AF37] flex items-center justify-center font-bold text-sm shadow-lg">
                2
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-[#800020]">Checkout</span>
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className="flex items-center space-x-3 opacity-40">
              <span className="w-10 h-10 rounded-full bg-white text-gray-400 flex items-center justify-center font-bold text-sm border border-gray-300">
                3
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-gray-500 hidden md:block">Confirmation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Section: Forms */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Shipping Address Section */}
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#D4AF37]/10 checkout-section">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-[#3D2817] flex items-center brand-font">
                    <iconify-icon icon="lucide:truck" className="mr-3 text-[#D4AF37]"></iconify-icon>
                    Shipping Details
                  </h2>
                  <button className="text-[#800020] text-sm font-bold uppercase tracking-wider hover:underline">
                    Select Saved Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="checkout-input-group">
                    <label className="block text-xs font-bold text-[#3D2817]/60 uppercase tracking-widest mb-2">Full Name</label>
                    <div className="checkout-input-inner">
                      <input type="text" placeholder="Ananya Sharma" className="w-full bg-[#F5F1E8]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020] transition-colors" />
                    </div>
                  </div>
                  <div className="checkout-input-group">
                    <label className="block text-xs font-bold text-[#3D2817]/60 uppercase tracking-widest mb-2">Email Address</label>
                    <div className="checkout-input-inner">
                      <input type="email" placeholder="ananya@example.com" className="w-full bg-[#F5F1E8]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020] transition-colors" />
                    </div>
                  </div>
                  <div className="checkout-input-group md:col-span-2">
                    <label className="block text-xs font-bold text-[#3D2817]/60 uppercase tracking-widest mb-2">Street Address</label>
                    <div className="checkout-input-inner">
                      <input type="text" placeholder="House No. 123, Heritage Lane" className="w-full bg-[#F5F1E8]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020] transition-colors" />
                    </div>
                  </div>
                  <div className="checkout-input-group">
                    <label className="block text-xs font-bold text-[#3D2817]/60 uppercase tracking-widest mb-2">City</label>
                    <div className="checkout-input-inner">
                      <input type="text" placeholder="Varanasi" className="w-full bg-[#F5F1E8]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020] transition-colors" />
                    </div>
                  </div>
                  <div className="checkout-input-group">
                    <label className="block text-xs font-bold text-[#3D2817]/60 uppercase tracking-widest mb-2">Postal Code</label>
                    <div className="checkout-input-inner">
                      <input type="text" placeholder="221001" className="w-full bg-[#F5F1E8]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020] transition-colors" />
                    </div>
                  </div>
                  <div className="checkout-input-group">
                    <label className="block text-xs font-bold text-[#3D2817]/60 uppercase tracking-widest mb-2">Phone Number</label>
                    <div className="checkout-input-inner">
                      <input type="tel" placeholder="+91 98765 43210" className="w-full bg-[#F5F1E8]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020] transition-colors" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Method Section */}
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#D4AF37]/10 checkout-section">
                <h2 className="text-2xl font-bold text-[#3D2817] mb-8 flex items-center brand-font">
                  <iconify-icon icon="lucide:credit-card" className="mr-3 text-[#D4AF37]"></iconify-icon>
                  Payment Options
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card Option */}
                  <div className={`payment-card group ${activePayment === 'card' ? 'active' : ''}`} onClick={() => setActivePayment('card')}>
                    <div className={`payment-card-inner p-6 border-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${activePayment === 'card' ? 'border-[#800020] bg-white' : 'border-[#D4AF37]/10 bg-[#F5F1E8]/30'}`}>
                      <iconify-icon icon="lucide:credit-card" className={`text-3xl mb-4 ${activePayment === 'card' ? 'text-[#800020]' : 'text-[#D4AF37]'}`}></iconify-icon>
                      <span className="font-bold text-[#3D2817]">Credit / Debit</span>
                      <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  {/* UPI Option */}
                  <div className={`payment-card group ${activePayment === 'upi' ? 'active' : ''}`} onClick={() => setActivePayment('upi')}>
                    <div className={`payment-card-inner p-6 border-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${activePayment === 'upi' ? 'border-[#800020] bg-white' : 'border-[#D4AF37]/10 bg-[#F5F1E8]/30'}`}>
                      <iconify-icon icon="simple-icons:phonepe" className={`text-3xl mb-4 ${activePayment === 'upi' ? 'text-[#800020]' : 'text-[#D4AF37]'}`}></iconify-icon>
                      <span className="font-bold text-[#3D2817]">UPI Payment</span>
                      <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">GPay, PhonePe, Paytm</p>
                    </div>
                  </div>
                  {/* Net Banking Option */}
                  <div className={`payment-card group ${activePayment === 'net' ? 'active' : ''}`} onClick={() => setActivePayment('net')}>
                    <div className={`payment-card-inner p-6 border-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${activePayment === 'net' ? 'border-[#800020] bg-white' : 'border-[#D4AF37]/10 bg-[#F5F1E8]/30'}`}>
                      <iconify-icon icon="lucide:landmark" className={`text-3xl mb-4 ${activePayment === 'net' ? 'text-[#800020]' : 'text-[#D4AF37]'}`}></iconify-icon>
                      <span className="font-bold text-[#3D2817]">Net Banking</span>
                      <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">All Major Indian Banks</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 p-6 bg-[#F5F1E8]/50 rounded-xl border border-[#D4AF37]/20">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Card Number" className="col-span-2 w-full bg-white border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020]" />
                      <input type="text" placeholder="MM / YY" className="w-full bg-white border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020]" />
                      <input type="password" placeholder="CVV" className="w-full bg-white border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020]" />
                    </div>
                    <p className="text-[10px] text-gray-400 flex items-center uppercase tracking-widest font-semibold">
                      <iconify-icon icon="lucide:lock" className="mr-1 text-xs"></iconify-icon>
                      Your card information is encrypted and securely stored.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Section: Summary */}
            <div className="lg:col-span-4">
              <div className="summary-card space-y-8 sticky top-28">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#D4AF37]/20">
                  <h3 className="text-xl font-bold text-[#3D2817] mb-8 uppercase tracking-widest border-b border-[#D4AF37]/10 pb-4 brand-font">Order Summary</h3>
                  
                  <div className="space-y-6 mb-8">
                    {/* Item 1 */}
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#F5F1E8]">
                        <img src="https://images.unsplash.com/photo-1583391733956-6c7827448d08?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Saree" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-xs font-bold text-[#3D2817] line-clamp-1 uppercase tracking-wider">Royal Crimson Katan Silk</h4>
                        <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">Zari Border • Pure Silk</p>
                        <p className="text-sm font-bold text-[#800020]">₹42,500</p>
                      </div>
                    </div>
                    {/* Item 2 */}
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#F5F1E8]">
                        <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Saree" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-xs font-bold text-[#3D2817] line-clamp-1 uppercase tracking-wider">Emerald Meenakari Brocade</h4>
                        <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">Antique Zari • Floral Buta</p>
                        <p className="text-sm font-bold text-[#800020]">₹38,900</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#D4AF37]/10 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 uppercase tracking-widest font-bold">Subtotal</span>
                      <span className="font-bold text-[#3D2817]">₹81,400</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 uppercase tracking-widest font-bold">Tax (GST 5%)</span>
                      <span className="font-bold text-[#3D2817]">₹4,070</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 uppercase tracking-widest font-bold">Shipping</span>
                      <span className="font-bold text-green-600">FREE</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flex space-x-2">
                      <input type="text" placeholder="PROMO CODE" className="flex-grow bg-[#F5F1E8]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-2 focus:outline-none focus:border-[#800020] text-xs uppercase font-bold tracking-widest" />
                      <button className="px-4 py-2 border border-[#800020] text-[#800020] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#800020] hover:text-white transition-all">
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t-2 border-[#D4AF37]/20">
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-sm font-bold text-[#3D2817] uppercase tracking-[0.2em]">Total Payable</span>
                      <span className="text-2xl font-bold text-[#800020]">₹85,470</span>
                    </div>
                    
                    <Link to="/order-confirmation" id="place-order-btn" className="w-full block text-center py-5 bg-[#800020] text-[#D4AF37] font-bold rounded-xl gold-btn-shimmer shadow-2xl transition-all transform hover:scale-[1.02] hover:-translate-y-1 uppercase tracking-[0.2em] text-sm">
                      PLACE SECURE ORDER
                    </Link>
                    <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em]">
                      By clicking, you agree to our <a href="#" className="underline hover:text-[#800020]">Terms</a>
                    </p>
                  </div>
                </div>

                <div className="bg-[#800020]/5 p-6 rounded-2xl border border-[#800020]/10 flex items-start space-x-4">
                  <iconify-icon icon="lucide:help-circle" className="text-xl text-[#800020] mt-0.5"></iconify-icon>
                  <div>
                    <h5 className="text-xs font-bold text-[#3D2817] uppercase tracking-wider">Need Concierge Assistance?</h5>
                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed uppercase tracking-widest">Experts are available 24/7 to help you with sizing or weave details.</p>
                    <a href="#" className="inline-block text-[#800020] text-xs font-bold mt-2 uppercase tracking-[0.2em] underline">Chat Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
