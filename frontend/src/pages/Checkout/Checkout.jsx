import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, getSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [activePayment, setActivePayment] = useState('card');
  const [loading, setLoading] = useState(false);
  const rootRef = useRef(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });

  const subtotal = getSubtotal();
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
    // Reveal animations on mount
    if (rootRef.current) {
      const sections = rootRef.current.querySelectorAll('section');
      sections.forEach((section, index) => {
        setTimeout(() => {
          section.classList.add('reveal');
        }, index * 100);
      });
    }
  }, [cart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert("Please fill all shipping details.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Razorpay Order on Backend
      const orderResponse = await fetch('http://localhost:5001/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total })
      });

      const rzpOrder = await orderResponse.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: rzpOrder.amount,
        currency: "INR",
        name: "Banaras Heritage",
        description: "Heritage Saree Purchase",
        order_id: rzpOrder.id,
        handler: async function (response) {
          // 3. Verify Payment on Backend
          const verifyRes = await fetch('http://localhost:5001/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // 4. Save Final Order to Database
            const finalOrderData = {
              customer_name: formData.fullName,
              customer_email: formData.email,
              address: formData.address,
              city: formData.city,
              pincode: formData.pincode,
              phone: formData.phone,
              total_amount: total,
              items: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price
              }))
            };

            const dbRes = await fetch('http://localhost:5001/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(finalOrderData)
            });

            if (dbRes.ok) {
              clearCart();
              navigate('/order-confirmation');
            }
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#800020"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err) {
      console.error('Payment error:', err);
      alert('Error initiating payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F5F1E8]" ref={rootRef}>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="checkout-input-group">
                    <label className="block text-xs font-bold text-[#3D2817]/60 uppercase tracking-widest mb-2">Full Name</label>
                    <div className="checkout-input-inner">
                      <input name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" placeholder="Ananya Sharma" className="w-full bg-[#F5F1E8]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020] transition-colors" />
                    </div>
                  </div>
                  <div className="checkout-input-group">
                    <label className="block text-xs font-bold text-[#3D2817]/60 uppercase tracking-widest mb-2">Email Address</label>
                    <div className="checkout-input-inner">
                      <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="ananya@example.com" className="w-full bg-[#F5F1E8]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020] transition-colors" />
                    </div>
                  </div>
                  <div className="checkout-input-group md:col-span-2">
                    <label className="block text-xs font-bold text-[#3D2817]/60 uppercase tracking-widest mb-2">Street Address</label>
                    <div className="checkout-input-inner">
                      <input name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="House No. 123, Heritage Lane" className="w-full bg-[#F5F1E8]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020] transition-colors" />
                    </div>
                  </div>
                  <div className="checkout-input-group">
                    <label className="block text-xs font-bold text-[#3D2817]/60 uppercase tracking-widest mb-2">City</label>
                    <div className="checkout-input-inner">
                      <input name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="Varanasi" className="w-full bg-[#F5F1E8]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020] transition-colors" />
                    </div>
                  </div>
                  <div className="checkout-input-group">
                    <label className="block text-xs font-bold text-[#3D2817]/60 uppercase tracking-widest mb-2">Postal Code</label>
                    <div className="checkout-input-inner">
                      <input name="pincode" value={formData.pincode} onChange={handleInputChange} type="text" placeholder="221001" className="w-full bg-[#F5F1E8]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020] transition-colors" />
                    </div>
                  </div>
                  <div className="checkout-input-group">
                    <label className="block text-xs font-bold text-[#3D2817]/60 uppercase tracking-widest mb-2">Phone Number</label>
                    <div className="checkout-input-inner">
                      <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="+91 98765 43210" className="w-full bg-[#F5F1E8]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#800020] transition-colors" />
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
                  <div className={`payment-card group cursor-pointer ${activePayment === 'card' ? 'active' : ''}`} onClick={() => setActivePayment('card')}>
                    <div className={`payment-card-inner p-6 border-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${activePayment === 'card' ? 'border-[#800020] bg-white' : 'border-[#D4AF37]/10 bg-[#F5F1E8]/30'}`}>
                      <iconify-icon icon="lucide:credit-card" className={`text-3xl mb-4 ${activePayment === 'card' ? 'text-[#800020]' : 'text-[#D4AF37]'}`}></iconify-icon>
                      <span className="font-bold text-[#3D2817]">Credit / Debit</span>
                      <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  {/* UPI Option */}
                  <div className={`payment-card group cursor-pointer ${activePayment === 'upi' ? 'active' : ''}`} onClick={() => setActivePayment('upi')}>
                    <div className={`payment-card-inner p-6 border-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${activePayment === 'upi' ? 'border-[#800020] bg-white' : 'border-[#D4AF37]/10 bg-[#F5F1E8]/30'}`}>
                      <iconify-icon icon="simple-icons:phonepe" className={`text-3xl mb-4 ${activePayment === 'upi' ? 'text-[#800020]' : 'text-[#D4AF37]'}`}></iconify-icon>
                      <span className="font-bold text-[#3D2817]">UPI Payment</span>
                      <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">GPay, PhonePe, Paytm</p>
                    </div>
                  </div>
                  {/* Net Banking Option */}
                  <div className={`payment-card group cursor-pointer ${activePayment === 'net' ? 'active' : ''}`} onClick={() => setActivePayment('net')}>
                    <div className={`payment-card-inner p-6 border-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${activePayment === 'net' ? 'border-[#800020] bg-white' : 'border-[#D4AF37]/10 bg-[#F5F1E8]/30'}`}>
                      <iconify-icon icon="lucide:landmark" className={`text-3xl mb-4 ${activePayment === 'net' ? 'text-[#800020]' : 'text-[#D4AF37]'}`}></iconify-icon>
                      <span className="font-bold text-[#3D2817]">Net Banking</span>
                      <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">All Major Indian Banks</p>
                    </div>
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
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#F5F1E8]">
                          <img src={item.image_url} className="w-full h-full object-cover" alt={item.name} />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-xs font-bold text-[#3D2817] line-clamp-1 uppercase tracking-wider">{item.name}</h4>
                          <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">{item.quantity} x ₹{Number(item.price).toLocaleString('en-IN')}</p>
                          <p className="text-sm font-bold text-[#800020]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-[#D4AF37]/10 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 uppercase tracking-widest font-bold">Subtotal</span>
                      <span className="font-bold text-[#3D2817]">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 uppercase tracking-widest font-bold">Tax (GST 5%)</span>
                      <span className="font-bold text-[#3D2817]">₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 uppercase tracking-widest font-bold">Shipping</span>
                      <span className="font-bold text-green-600">FREE</span>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t-2 border-[#D4AF37]/20">
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-sm font-bold text-[#3D2817] uppercase tracking-[0.2em]">Total Payable</span>
                      <span className="text-2xl font-bold text-[#800020]">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className={`w-full block text-center py-5 bg-[#800020] text-[#D4AF37] font-bold rounded-xl shadow-2xl transition-all transform hover:scale-[1.02] hover:-translate-y-1 uppercase tracking-[0.2em] text-sm ${loading ? 'opacity-70 cursor-not-allowed' : 'gold-btn-shimmer'}`}
                    >
                      {loading ? 'PROCESSING...' : 'PLACE SECURE ORDER'}
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em]">
                      By clicking, you agree to our <a href="#" className="underline hover:text-[#800020]">Terms</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
