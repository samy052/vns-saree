import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);

  const updateStrength = (val) => {
    setPassword(val);
    if (val.length === 0) {
      setStrength(0);
      return;
    }
    let s = 0;
    if (val.length >= 6) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  };

  const colors = ['#ef4444', '#f59e0b', '#10b981', '#059669'];
  const texts = ['Weak', 'Moderate', 'Strong', 'Impervious'];

  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden bg-[#F5F1E8]">


      <main className="flex-grow relative flex items-center justify-center py-12 lg:py-24 px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-pattern"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#800020]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Centered 3D Card */}
        <div className="max-w-3xl w-full bg-white rounded-[32px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col lg:flex-row-reverse animate-card-3d border border-[#D4AF37]/30 relative z-10">
          
          {/* Left Side: Brand Visual & Testimonial (45%) */}
          <div className="hidden lg:flex lg:w-1/2 relative bg-[#2D1B0E] p-12 flex-col justify-between overflow-hidden border-l border-[#D4AF37]/20">
            {/* Decorative Overlay */}
            <div className="absolute inset-0 opacity-20 grayscale pointer-events-none">
              <img src="https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?auto=format&fit=crop&q=80" className="w-full h-full object-contain" alt="pattern" />
            </div>

            {/* Brand Logo Overlay */}
            <div className="relative z-10">
              <div className="flex flex-col mb-12">
                <span className="brand-font text-4xl font-bold tracking-tighter text-[#D4AF37]">Banaras</span>
                <span className="text-xs tracking-[0.4em] uppercase text-white/70 -mt-1">Heritage</span>
              </div>
              <h2 className="text-4xl font-bold text-white leading-tight mb-6 brand-font uppercase tracking-wider">Witness the <br/><span className="text-[#D4AF37]">Art of Weave</span></h2>
            </div>

            {/* Testimonial */}
            <div className="relative z-10 mt-20">
              <div className="flex text-[#D4AF37] mb-4 space-x-1">
                <iconify-icon icon="mdi:star"></iconify-icon>
                <iconify-icon icon="mdi:star"></iconify-icon>
                <iconify-icon icon="mdi:star"></iconify-icon>
                <iconify-icon icon="mdi:star"></iconify-icon>
                <iconify-icon icon="mdi:star"></iconify-icon>
              </div>
              <p className="serif-text text-xl italic text-white/90 leading-relaxed mb-6">"Each saree is a piece of living history. The craftsmanship is so pure, it truly feels like royalty when draped."</p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=aish" alt="User" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-bold text-white tracking-wide">Aditi Varma</p>
                  <p className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold">Collector & Client</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Interaction Form (55%) */}
          <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col">
            
            {/* Tabs Toggle */}
            <div className="flex space-x-10 mb-8 border-b border-gray-100">
              <button 
                onClick={() => setActiveTab('login')} 
                className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'login' ? 'text-[#800020] border-b-2 border-[#800020]' : 'text-[#3D2817]/70'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setActiveTab('signup')} 
                className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'signup' ? 'text-[#800020] border-b-2 border-[#800020]' : 'text-[#3D2817]/70'}`}
              >
                Create Account
              </button>
            </div>

            {/* Login View Content */}
            {activeTab === 'login' && (
              <div className="form-content space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-2xl font-bold text-[#3D2817] mb-2 brand-font uppercase tracking-widest">Welcome Back</h3>
                  <p className="text-xs text-gray-500 tracking-[0.1em] font-semibold uppercase">Enter your details to manage your heirloom collection.</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#3D2817]/60 ml-1">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D2817]/70 flex items-center">
                        <iconify-icon icon="lucide:mail"></iconify-icon>
                      </span>
                      <input type="email" placeholder="heritage@example.com" className="w-full bg-[#FBF9F6] border border-[#D4AF37]/20 rounded-lg px-10 py-2.5 outline-none focus:border-[#800020] transition-all text-xs premium-input" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#3D2817]/60">Password</label>
                      <a href="#" className="text-[8px] font-bold text-[#800020] hover:underline uppercase tracking-widest">Forgot?</a>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D2817]/70 flex items-center">
                        <iconify-icon icon="lucide:lock"></iconify-icon>
                      </span>
                      <input type="password" placeholder="••••••••" className="w-full bg-[#FBF9F6] border border-[#D4AF37]/20 rounded-lg px-10 py-2.5 outline-none focus:border-[#800020] transition-all text-xs premium-input" />
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3D2817]/70 hover:text-[#800020] flex items-center">
                        <iconify-icon icon="lucide:eye"></iconify-icon>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input type="checkbox" id="remember" className="w-4 h-4 text-[#800020] border-[#D4AF37]/30 rounded focus:ring-[#800020] cursor-pointer" />
                    <label htmlFor="remember" className="ml-3 text-xs text-gray-600 uppercase tracking-widest font-bold cursor-pointer">Keep me logged in</label>
                  </div>

                  <Link to="/dashboard" className="w-full block text-center py-3.5 rounded-lg text-[#D4AF37] font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg gold-shimmer-btn transform transition-all active:scale-95">
                    Access Vault
                  </Link>
                </form>
              </div>
            )}

            {/* Signup View Content */}
            {activeTab === 'signup' && (
              <div className="form-content space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-2xl font-bold text-[#3D2817] mb-2 brand-font uppercase tracking-widest">Join the Circle</h3>
                  <p className="text-xs text-gray-500 tracking-[0.1em] font-semibold uppercase">Join our exclusive inner circle for first access to weaving stories.</p>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#3D2817]/60 ml-1">First Name</label>
                      <input type="text" placeholder="Ananya" className="w-full bg-[#FBF9F6] border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 outline-none focus:border-[#800020] transition-all text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#3D2817]/60 ml-1">Last Name</label>
                      <input type="text" placeholder="Verma" className="w-full bg-[#FBF9F6] border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 outline-none focus:border-[#800020] transition-all text-xs" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#3D2817]/60 ml-1">Email</label>
                    <input type="email" placeholder="vogue@heritage.com" className="w-full bg-[#FBF9F6] border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 outline-none focus:border-[#800020] transition-all text-xs" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#3D2817]/60 ml-1">Create Password</label>
                    <input 
                      type="password" 
                      placeholder="Strength" 
                      className="w-full bg-[#FBF9F6] border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 outline-none focus:border-[#800020] transition-all text-xs" 
                      onChange={(e) => updateStrength(e.target.value)} 
                    />
                    
                    {/* Password Strength Indicator */}
                    <div className="flex gap-1 mt-2 px-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i} 
                          className="strength-bar h-1 w-1/4 rounded-full transition-all duration-300" 
                          style={{ backgroundColor: i <= strength ? colors[strength - 1] : '#e5e7eb' }}
                        ></div>
                      ))}
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: strength > 0 ? colors[strength - 1] : '#3D281770' }}>
                      {strength > 0 ? texts[strength - 1] : 'Enter Password'}
                    </p>
                  </div>

                  <div className="flex items-start">
                    <input type="checkbox" id="news" className="mt-1 w-4 h-4 text-[#800020] border-[#D4AF37]/30 rounded focus:ring-[#800020] cursor-pointer" />
                    <label htmlFor="news" className="ml-3 text-[10px] text-gray-600 uppercase tracking-widest font-bold leading-relaxed cursor-pointer">Sign me up for the Heritage Newsletter (first access to collection drops)</label>
                  </div>

                  <Link to="/dashboard" className="w-full block text-center py-3.5 rounded-lg text-[#D4AF37] font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg gold-shimmer-btn transform transition-all active:scale-95">
                    Begin Journey
                  </Link>
                </form>
              </div>
            )}

            {/* Social Logins */}
            <div className="mt-6">
              <div className="relative flex items-center justify-center mb-6">
                <div className="w-full h-px bg-gray-100"></div>
                <span className="absolute bg-white px-4 text-[9px] font-bold text-[#3D2817]/70 uppercase tracking-[0.2em]">Or continue with</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="social-btn flex items-center justify-center space-x-3 py-3 border border-[#D4AF37]/20 rounded-xl bg-white transition-all hover:border-[#D4AF37] hover:-translate-y-0.5">
                  <iconify-icon icon="logos:google-icon" className="text-lg"></iconify-icon>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#3D2817]">Google</span>
                </button>
                <button className="social-btn flex items-center justify-center space-x-3 py-3 border border-[#D4AF37]/20 rounded-xl bg-white transition-all hover:border-[#D4AF37] hover:-translate-y-0.5">
                  <iconify-icon icon="logos:facebook" className="text-lg"></iconify-icon>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#3D2817]">Facebook</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-auto pt-6 flex justify-between items-center">
              <div className="flex items-center space-x-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                <iconify-icon icon="lucide:shield-check" className="text-2xl text-[#800020]"></iconify-icon>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">100% Secure</span>
              </div>
              <div className="flex items-center space-x-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                <iconify-icon icon="lucide:award" className="text-xl text-[#D4AF37]"></iconify-icon>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Authentic Silk</span>
              </div>
            </div>

            {/* Disclaimer moved inside */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-[9px] text-[#3D2817]/60 uppercase tracking-[0.2em] leading-relaxed font-bold text-center lg:text-left">
                By continuing, you agree to Banaras Heritage's <a href="#" className="text-[#800020] underline">Privacy Policy</a> and <a href="#" className="text-[#800020] underline">Terms of Service</a>. We protect your data as carefully as our weaves.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Auth;
