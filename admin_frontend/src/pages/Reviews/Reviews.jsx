import React from 'react';
import { Trash2 } from 'lucide-react';
import './Reviews.css';

export default function Reviews() {
  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="brand-font text-xl font-bold text-[#800020]">Customer Testimonials</h2>
      </div>
      
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#FAF8F6] text-[10px] uppercase font-bold text-gray-400 border-b border-[#D4AF37]/10">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Review</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-[#D4AF37]/5 bg-white">
            <tr className="hover:bg-[#FAF8F6]/50 transition-colors">
              <td className="px-6 py-4 font-bold text-[#4A3F35]">Priya K.</td>
              <td className="px-6 py-4 text-[#4A3F35] font-medium">Crimson Bridal Silk</td>
              <td className="px-6 py-4 text-[#D4AF37] text-sm tracking-widest">★★★★★</td>
              <td className="px-6 py-4 text-gray-500 max-w-xs truncate italic">
                "Absolutely stunning craftsmanship. Wore it for my wedding..."
              </td>
              <td className="px-6 py-4 text-right space-x-3">
                <button className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 font-bold rounded text-[9px] uppercase tracking-wider hover:bg-green-100 transition-colors shadow-sm">
                  Approve
                </button>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4 inline" />
                </button>
              </td>
            </tr>
            <tr className="hover:bg-[#FAF8F6]/50 transition-colors">
              <td className="px-6 py-4 font-bold text-[#4A3F35]">Neha S.</td>
              <td className="px-6 py-4 text-[#4A3F35] font-medium">Emerald Organza</td>
              <td className="px-6 py-4 text-[#D4AF37] text-sm tracking-widest">★★★★☆</td>
              <td className="px-6 py-4 text-gray-500 max-w-xs truncate italic">
                "Loved the color and the feel of the fabric. Delivery was slightly late."
              </td>
              <td className="px-6 py-4 text-right space-x-3">
                <button className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 font-bold rounded text-[9px] uppercase tracking-wider hover:bg-green-100 transition-colors shadow-sm">
                  Approve
                </button>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4 inline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
