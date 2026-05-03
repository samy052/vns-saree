import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#800020]/10 rounded-full blur-3xl"></div>

      <div className="glass-card w-full max-w-md p-8 md:p-10 rounded-3xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-700 bg-white/80 backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="brand-font text-4xl font-bold text-[#800020] mb-2 tracking-tight">Banaras Kala</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D4AF37]">Admin Console</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest pl-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                required
                className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A3F35] transition-all shadow-sm"
                placeholder="admin@banaraskala.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest pl-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A3F35] transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 text-[#800020] focus:ring-[#800020] border-[#D4AF37]/30 rounded cursor-pointer" />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-600 cursor-pointer">
                Remember me
              </label>
            </div>
            <div className="text-xs">
              <a href="#" className="font-bold text-[#800020] hover:text-[#6b001a] transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#800020] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#6b001a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Secure Login
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-[#D4AF37]/10 pt-6">
          <p className="text-[10px] text-gray-400 font-medium tracking-wider">© {new Date().getFullYear()} Banaras Kala. Secure Admin Portal.</p>
        </div>
      </div>
    </div>
  );
}
