import React, { useState, useEffect } from 'react';
import { Eye, Trash2, X } from 'lucide-react';
import './Coupons.css';

export default function Coupons() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('http://localhost:5003/api/coupons');
      const data = await response.json();
      setCoupons(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <section className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <h2 className="brand-font text-xl font-bold text-[#800020]">Promotions & Coupons</h2>
          <button 
            onClick={toggleModal}
            className="px-6 py-2 bg-[#800020] text-white text-xs font-bold rounded-lg uppercase tracking-widest hover:bg-[#6b001a] transition-colors shadow-sm"
          >
            Create Coupon
          </button>
        </div>
        
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#FAF8F6] text-[10px] uppercase font-bold text-gray-400 border-b border-[#D4AF37]/10">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Validity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#D4AF37]/5 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading coupons...</td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400">No coupons found.</td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-[#FAF8F6]/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#800020] uppercase tracking-widest font-mono">{coupon.code}</td>
                    <td className="px-6 py-4 font-medium text-[#4A3F35]">{coupon.discount_percent}% Off</td>
                    <td className="px-6 py-4 text-gray-500">{coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString() : 'No Expiry'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${coupon.is_active ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-gray-400 hover:text-[#D4AF37] transition-colors"><Eye className="w-4 h-4 inline" /></button>
                      <button className="text-gray-400 hover:text-[#800020] transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="modal-overlay absolute inset-0 bg-[#4A3F35]/40 backdrop-blur-sm" 
            onClick={toggleModal}
          ></div>
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#D4AF37]/10 flex justify-between items-center bg-[#FDFCFB]">
              <h3 className="brand-font text-xl font-bold text-[#800020]">New Promotion Offer</h3>
              <button 
                onClick={toggleModal}
                className="text-gray-400 hover:text-[#800020] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-2 gap-6 bg-white">
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Coupon Code</label>
                <input 
                  type="text" 
                  placeholder="FESTIVE50" 
                  className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm font-bold text-[#800020] outline-none transition-colors uppercase font-mono tracking-widest focus:border-[#800020]"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Discount (%)</label>
                <input 
                  type="number" 
                  className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35] transition-colors"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Min. Purchase (₹)</label>
                <input 
                  type="number" 
                  className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35] transition-colors"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Expiry Date</label>
                <input 
                  type="date" 
                  className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35] transition-colors"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Usage Limit</label>
                <input 
                  type="number" 
                  placeholder="Max uses" 
                  className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35] transition-colors"
                />
              </div>
            </div>
            
            <div className="p-6 bg-[#FAF8F6] border-t border-[#D4AF37]/10 flex justify-end gap-3">
              <button 
                onClick={toggleModal} 
                className="px-6 py-2 border border-[#800020]/20 text-[#800020] font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#800020]/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2 bg-[#800020] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#6b001a] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Launch Promo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
