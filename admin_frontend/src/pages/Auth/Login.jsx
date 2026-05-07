import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, AlertCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_ENDPOINTS.auth}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.customer?.role !== 'admin' && data.user?.role !== 'admin') {
          setError('Access denied. You do not have admin privileges.');
          return;
        }
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('admin_user', JSON.stringify(data.customer || data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#800020]/10 rounded-full blur-3xl"></div>

      <div className="glass-card w-full max-w-md p-8 md:p-10 rounded-3xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-700 bg-white/80 backdrop-blur-xl border border-white/50">
        <div className="text-center mb-8">
          <h1 className="brand-font text-4xl font-bold text-[#800020] mb-2 tracking-tight">Banaras Kala</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D4AF37]">Admin Console</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold animate-shake">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest pl-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A3F35] transition-all shadow-sm"
                placeholder="Phone Number"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A3F35] transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#800020] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#6b001a]'}`}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#D4AF37]/10 pt-6">
          <p className="text-[10px] text-gray-400 font-medium tracking-wider">© {new Date().getFullYear()} Banaras Kala. Secure Admin Portal.</p>
        </div>
      </div>
    </div>
  );
}
