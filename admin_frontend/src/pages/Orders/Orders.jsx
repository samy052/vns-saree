import { CreditCard, Smartphone } from 'lucide-react';
import './Orders.css';

export default function Orders() {
  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="brand-font text-xl font-bold text-[#800020]">Orders Database</h2>
        <div className="flex gap-4">
          <select className="bg-white border border-[#D4AF37]/20 p-2 rounded-lg text-xs outline-none text-[#4A3F35] focus:border-[#D4AF37] transition-colors shadow-sm cursor-pointer">
            <option>Status: All</option>
            <option>Pending</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
      </div>
      
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#FAF8F6] text-[10px] uppercase font-bold text-gray-400 border-b border-[#D4AF37]/10">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-[#D4AF37]/5 bg-white">
            <tr className="hover:bg-[#FAF8F6]/50 transition-colors">
              <td className="px-6 py-4 font-mono font-bold text-[#4A3F35]">#ORD-2024-001</td>
              <td className="px-6 py-4 text-[#4A3F35] font-medium">Aditi Sharma</td>
              <td className="px-6 py-4 font-bold text-[#D4AF37]">₹45,999</td>
              <td className="px-6 py-4 text-gray-500">14 Oct, 2024</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded text-[9px] font-bold uppercase tracking-wider border border-yellow-100">Pending</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit border border-gray-100">
                  <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[10px] font-bold uppercase">UPI</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button className="px-3 py-1.5 bg-[#800020] text-white rounded text-[9px] font-bold uppercase tracking-wider hover:bg-[#6b001a] transition-colors shadow-sm">View</button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-[9px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-sm">Ship</button>
              </td>
            </tr>
            
            <tr className="hover:bg-[#FAF8F6]/50 transition-colors">
              <td className="px-6 py-4 font-mono font-bold text-[#4A3F35]">#ORD-2024-002</td>
              <td className="px-6 py-4 text-[#4A3F35] font-medium">Vikram Singh</td>
              <td className="px-6 py-4 font-bold text-[#D4AF37]">₹28,200</td>
              <td className="px-6 py-4 text-gray-500">13 Oct, 2024</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-[9px] font-bold uppercase tracking-wider border border-blue-100">Processing</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit border border-gray-100">
                  <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[10px] font-bold uppercase">Visa</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button className="px-3 py-1.5 bg-[#800020] text-white rounded text-[9px] font-bold uppercase tracking-wider hover:bg-[#6b001a] transition-colors shadow-sm">View</button>
                <button className="px-3 py-1.5 bg-green-600 text-white rounded text-[9px] font-bold uppercase tracking-wider hover:bg-green-700 transition-colors shadow-sm">Done</button>
              </td>
            </tr>
            
            <tr className="hover:bg-[#FAF8F6]/50 transition-colors">
              <td className="px-6 py-4 font-mono font-bold text-[#4A3F35]">#ORD-2024-003</td>
              <td className="px-6 py-4 text-[#4A3F35] font-medium">Megha Rao</td>
              <td className="px-6 py-4 font-bold text-[#D4AF37]">₹52,400</td>
              <td className="px-6 py-4 text-gray-500">12 Oct, 2024</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded text-[9px] font-bold uppercase tracking-wider border border-green-100">Delivered</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit border border-gray-100">
                  <CreditCard className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-[10px] font-bold uppercase">Mastercard</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button className="px-3 py-1.5 bg-white border border-[#800020] text-[#800020] rounded text-[9px] font-bold uppercase tracking-wider hover:bg-[#800020] hover:text-white transition-all shadow-sm">Receipt</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
