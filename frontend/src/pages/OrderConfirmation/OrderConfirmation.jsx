import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    // Reveal animations on mount
    if (rootRef.current) {
      const reveals = rootRef.current.querySelectorAll(".reveal-up");

      reveals.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("active");
        }, index * 200);
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8]" ref={rootRef}>
      <main className="flex-grow py-12 lg:py-20">
        <div className="w-full px-4 lg:px-12">
          {/* Success Hero */}
          <div className="text-center mb-16 reveal-up">
            <div className="flex justify-center mb-8">
              <svg
                className="checkmark"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className="checkmark-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="checkmark-check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-[#800020] mb-4 brand-font">
              A New Story Begins
            </h1>
            <p className="serif-text text-xl italic text-[#3D2817]/80">
              Your order is being prepared with care and attention.
            </p>

            <div className="mt-8 inline-block bg-white/50 backdrop-blur px-8 py-3 rounded-full border border-[#D4AF37]/30">
              <p className="text-sm tracking-widest font-semibold uppercase">
                Order Number:{" "}
                <span className="gold-shimmer ml-2">#BK-98234-A</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Order Flow & Items */}
            <div className="lg:col-span-7 space-y-12">
              {/* Order Timeline */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#D4AF37]/10 reveal-up">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2 brand-font">
                  <Icon
                    icon="lucide:truck"
                    className="text-[#D4AF37]"
                  ></Icon>
                  Shipment Tracking
                </h3>
                <div className="relative">
                  {/* Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100"></div>

                  <div className="space-y-8 relative">
                    <div className="flex items-start gap-6 timeline-step active">
                      <div className="step-icon w-12 h-12 rounded-full border-2 border-gray-100 bg-white flex items-center justify-center z-10">
                        <Icon
                          icon="lucide:check-circle-2"
                          className="text-xl text-[#800020]"
                        ></Icon>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#800020] uppercase tracking-wider text-sm">
                          Order Confirmed
                        </h4>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                          Today, 10:45 AM • We have received your order
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6 timeline-step">
                      <div className="step-icon w-12 h-12 rounded-full border-2 border-gray-100 bg-white flex items-center justify-center z-10 text-gray-400">
                        <Icon
                          icon="lucide:box"
                          className="text-xl"
                        ></Icon>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-400 uppercase tracking-wider text-sm">
                          Artisan Preparation
                        </h4>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                          Estimated: Oct 12, 2024 • Quality checking & finishing
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6 timeline-step">
                      <div className="step-icon w-12 h-12 rounded-full border-2 border-gray-100 bg-white flex items-center justify-center z-10 text-gray-400">
                        <Icon
                          icon="lucide:ship"
                          className="text-xl"
                        ></Icon>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-400 uppercase tracking-wider text-sm">
                          Out for Delivery
                        </h4>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                          Expected Arrival: Oct 15 - Oct 18
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Recap */}
              <div className="reveal-up">
                <h3 className="text-2xl font-bold mb-6 brand-font uppercase tracking-widest">
                  Items in your Order
                </h3>
                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex items-center gap-6 bg-white p-4 rounded-xl shadow-sm border border-[#D4AF37]/10">
                    <div className="w-24 h-32 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        src="https://images.unsplash.com/photo-1583391733956-6c7827448d08?auto=format&fit=crop&q=80"
                        alt="Royal Brocade"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg text-[#800020] uppercase brand-font tracking-tight">
                            The Royal Brocade
                          </h4>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1">
                            Katan Silk Pure • Crimson Gold
                          </p>
                        </div>
                        <p className="font-bold text-[#3D2817]">₹42,500</p>
                      </div>
                      <div className="mt-4 text-xs text-[#D4AF37] font-bold flex items-center gap-2 uppercase tracking-widest">
                        <Icon
                          icon="lucide:tag"
                          className="text-sm"
                        ></Icon>
                        Gift Wrapped: Yes
                      </div>
                    </div>
                  </div>
                  {/* Item 2 */}
                  <div className="flex items-center gap-6 bg-white p-4 rounded-xl shadow-sm border border-[#D4AF37]/10">
                    <div className="w-24 h-32 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80"
                        alt="Organza Classic"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg text-[#800020] uppercase brand-font tracking-tight">
                            Traditional Organza Classic
                          </h4>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1">
                            Pure Organza Silk • Silver Zari
                          </p>
                        </div>
                        <p className="font-bold text-[#3D2817]">₹28,200</p>
                      </div>
                      <div className="mt-4 text-xs text-gray-500 font-bold uppercase tracking-widest">
                        Quantity: 1
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Policy Callout */}
              <div className="bg-[#800020]/5 p-6 rounded-xl border-l-4 border-[#800020] reveal-up">
                <h4 className="font-bold text-[#800020] mb-2 uppercase text-xs tracking-[0.2em]">
                  Quality Guarantee
                </h4>
                <p className="text-xs text-[#3D2817]/80 leading-relaxed uppercase tracking-widest font-medium">
                  We offer a 7-day hassle-free return policy for any
                  authenticity concerns. Each saree is marked with a unique
                  silk-mark and handloom certification code which can be
                  verified upon delivery.
                </p>
              </div>
            </div>

            {/* Right Column: Summary & Support */}
            <div className="lg:col-span-5 space-y-8">
              {/* Delivery & Payment Summary */}
              <div className="bg-[#3D2817] text-white p-8 rounded-2xl shadow-xl reveal-up">
                <h3 className="text-xl font-bold mb-8 text-[#D4AF37] brand-font uppercase tracking-widest">
                  Delivery Details
                </h3>

                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-3 font-bold">
                      Shipping Address
                    </p>
                    <p className="font-bold text-lg tracking-wide">
                      Aditi Rao Hydari
                    </p>
                    <p className="text-white/70 leading-relaxed text-sm mt-1">
                      702, Kala Heights, 4th Main Road
                      <br />
                      Jubilee Hills, Hyderabad, 500033
                      <br />
                      Telangana, India
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-3 font-bold">
                        Payment Method
                      </p>
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="logos:visa"
                          className="text-2xl"
                        ></Icon>
                        <span className="font-bold text-sm">•••• 9823</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-3 font-bold">
                        Shipping Method
                      </p>
                      <p className="font-bold text-sm tracking-widest">
                        ROYAL EXPRESS
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <p className="text-white/60 uppercase tracking-widest">
                        Subtotal
                      </p>
                      <p className="font-bold">₹70,700</p>
                    </div>
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <p className="text-white/60 uppercase tracking-widest">
                        Insurance
                      </p>
                      <p className="font-bold">₹450</p>
                    </div>
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <p className="text-white/60 uppercase tracking-widest">
                        Shipping
                      </p>
                      <p className="text-[#D4AF37] font-bold">FREE</p>
                    </div>
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/20">
                      <p className="text-lg font-bold uppercase tracking-[0.2em]">
                        Total Paid
                      </p>
                      <p className="text-2xl font-bold text-[#D4AF37]">
                        ₹71,150
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Support */}
              <div className="bg-white p-8 rounded-2xl border border-[#D4AF37]/20 shadow-sm reveal-up">
                <h3 className="text-lg font-bold mb-4 brand-font uppercase tracking-widest">
                  Need Assistance?
                </h3>
                <p className="text-xs text-gray-500 mb-6 uppercase tracking-widest font-semibold leading-relaxed">
                  Our support team is available 24/7 to help you with your order
                  or any questions.
                </p>
                <div className="space-y-4">
                  <a
                    href="mailto:support@banarasikala.com"
                    className="flex items-center gap-4 p-4 rounded-lg bg-[#F5F1E8] hover:bg-[#D4AF37]/10 transition-colors group"
                  >
                    <Icon
                      icon="lucide:mail"
                      className="text-xl text-[#800020]"
                    ></Icon>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#800020]">
                        Email Us
                      </p>
                      <p className="text-xs text-gray-700 font-bold">
                        support@banarasikala.com
                      </p>
                    </div>
                    <Icon
                      icon="lucide:chevron-right"
                      className="ml-auto text-gray-300 group-hover:text-[#800020] transition-transform group-hover:translate-x-1"
                    ></Icon>
                  </a>
                  <a
                    href="tel:+912212345678"
                    className="flex items-center gap-4 p-4 rounded-lg bg-[#F5F1E8] hover:bg-[#D4AF37]/10 transition-colors group"
                  >
                    <Icon
                      icon="lucide:phone"
                      className="text-xl text-[#800020]"
                    ></Icon>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#800020]">
                        Call Us
                      </p>
                      <p className="text-xs text-gray-700 font-bold">
                        +91 22 1234 5678
                      </p>
                    </div>
                    <Icon
                      icon="lucide:chevron-right"
                      className="ml-auto text-gray-300 group-hover:text-[#800020] transition-transform group-hover:translate-x-1"
                    ></Icon>
                  </a>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="pt-4 reveal-up">
                <Link
                  to="/collection"
                  id="continue-shopping-btn"
                  className="w-full flex items-center justify-center gap-3 py-5 bg-[#800020] text-[#D4AF37] font-bold rounded-xl shadow-2xl hover:scale-[1.02] transition-all uppercase tracking-[0.2em] text-sm"
                >
                  <Icon icon="lucide:shopping-bag"></Icon>
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;

