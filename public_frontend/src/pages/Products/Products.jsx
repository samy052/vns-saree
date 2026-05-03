import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, UploadCloud } from 'lucide-react';
import './Products.css';

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <section className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <h2 className="brand-font text-xl font-bold text-[#800020]">Product Management</h2>
          <button 
            onClick={toggleModal}
            className="px-6 py-2 bg-[#800020] text-white text-xs font-bold rounded-lg uppercase tracking-widest flex items-center gap-2 hover:bg-[#6b001a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select className="bg-white border border-[#D4AF37]/20 p-2 rounded-lg text-xs outline-none focus:border-[#D4AF37] text-gray-700">
            <option>Category: All</option>
            <option>Bridal Wear</option>
            <option>Festival Collection</option>
          </select>
          <select className="bg-white border border-[#D4AF37]/20 p-2 rounded-lg text-xs outline-none focus:border-[#D4AF37] text-gray-700">
            <option>Fabric: All</option>
            <option>Katan Silk</option>
            <option>Organza</option>
          </select>
          <select className="bg-white border border-[#D4AF37]/20 p-2 rounded-lg text-xs outline-none focus:border-[#D4AF37] text-gray-700">
            <option>Status: All</option>
            <option>In Stock</option>
            <option>Low Stock</option>
          </select>
          <input 
            type="text" 
            placeholder="Search pieces..." 
            className="bg-white border border-[#D4AF37]/20 p-2 rounded-lg text-xs outline-none focus:border-[#D4AF37] text-gray-700" 
          />
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#FAF8F6] text-[10px] uppercase font-bold text-gray-400">
              <tr>
                <th className="px-6 py-3">Product ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3 text-center">Stock</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#D4AF37]/5">
              <tr className="hover:bg-[#FAF8F6]/50 transition-colors">
                <td className="px-6 py-4 font-mono text-gray-500">#PRD-KATAN-01</td>
                <td className="px-6 py-4 font-bold text-[#4A3F35]">Royal Crimson Katan Silk</td>
                <td className="px-6 py-4 text-gray-600">Bridal Edit</td>
                <td className="px-6 py-4 text-[#D4AF37] font-bold">₹45,999</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-[9px] font-bold tracking-wider">12 Available</span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-gray-400 hover:text-[#D4AF37] transition-colors"><Pencil className="w-4 h-4 inline" /></button>
                  <button className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
              <tr className="hover:bg-[#FAF8F6]/50 transition-colors">
                <td className="px-6 py-4 font-mono text-gray-500">#PRD-ORG-02</td>
                <td className="px-6 py-4 font-bold text-[#4A3F35]">Ivory Moon Organza</td>
                <td className="px-6 py-4 text-gray-600">Festival Collection</td>
                <td className="px-6 py-4 text-[#D4AF37] font-bold">₹28,500</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded text-[9px] font-bold tracking-wider">3 Low Stock</span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-gray-400 hover:text-[#D4AF37] transition-colors"><Pencil className="w-4 h-4 inline" /></button>
                  <button className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="modal-overlay absolute inset-0 bg-[#4A3F35]/40 backdrop-blur-sm" 
            onClick={toggleModal}
          ></div>
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#D4AF37]/10 flex justify-between items-center bg-[#FDFCFB]">
              <h3 className="brand-font text-xl font-bold text-[#800020]">Add New Heritage Piece</h3>
              <button 
                onClick={toggleModal}
                className="text-gray-400 hover:text-[#800020] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Product Name</label>
                  <input type="text" className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35]" placeholder="e.g. Royal Gold Katan Silk" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Price (₹)</label>
                  <input type="number" className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35]" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Category</label>
                  <select className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35]">
                    <option>Select Category</option>
                    <option>Bridal Edit</option>
                    <option>Festival Collection</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Fabric Type</label>
                  <select className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35]">
                    <option>Katan Silk</option>
                    <option>Organza</option>
                    <option>Georgette</option>
                  </select>
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Product Description</label>
                  <textarea className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none h-32 text-[#4A3F35]"></textarea>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Upload Images</label>
                  <div className="border-2 border-dashed border-[#D4AF37]/30 bg-[#FAF8F6] p-8 rounded-xl text-center cursor-pointer hover:bg-[#D4AF37]/5 transition-colors">
                    <UploadCloud className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-medium">Drop images here or browse</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#FAF8F6] border border-[#D4AF37]/10 rounded-lg">
                    <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest cursor-pointer" htmlFor="activeListing">Active Listing</label>
                    <input type="checkbox" id="activeListing" defaultChecked className="w-4 h-4 accent-[#800020] cursor-pointer" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Initial Stock Qty</label>
                    <input type="number" className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35]" />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-[#D4AF37]/10 flex justify-end gap-4 bg-[#FDFCFB]">
              <button 
                onClick={toggleModal}
                className="px-6 py-2 border border-[#800020]/20 text-[#800020] font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#800020]/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                className="px-8 py-2 bg-[#800020] text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg hover:bg-[#6b001a] transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
