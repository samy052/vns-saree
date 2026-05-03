import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, X, Upload } from 'lucide-react';
import './Categories.css';

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/categories');
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <section className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <h2 className="brand-font text-xl font-bold text-[#800020]">Categories & Hierarchy</h2>
          <button 
            onClick={toggleModal}
            className="px-6 py-2 bg-[#800020] text-white text-xs font-bold rounded-lg uppercase tracking-widest hover:bg-[#6b001a] transition-colors shadow-sm"
          >
            New Category
          </button>
        </div>
        
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#FAF8F6] text-[10px] uppercase font-bold text-gray-400 border-b border-[#D4AF37]/10">
              <tr>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#D4AF37]/5 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400">Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400">No categories found.</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-[#FAF8F6]/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#4A3F35]">{category.name}</td>
                    <td className="px-6 py-4 text-gray-500">{category.slug}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[9px] font-bold uppercase tracking-wider border border-green-100">Active</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-gray-400 hover:text-[#D4AF37] transition-colors"><Pencil className="w-4 h-4 inline" /></button>
                      <button className="text-gray-400 hover:text-[#800020] transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="modal-overlay absolute inset-0 bg-[#4A3F35]/40 backdrop-blur-sm" 
            onClick={toggleModal}
          ></div>
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#D4AF37]/10 flex justify-between items-center bg-[#FDFCFB]">
              <h3 className="brand-font text-xl font-bold text-[#800020]">New Collection Category</h3>
              <button 
                onClick={toggleModal}
                className="text-gray-400 hover:text-[#800020] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5 bg-white">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Category Name</label>
                <input 
                  type="text" 
                  className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35] transition-colors"
                  placeholder="e.g. Occasion Wear"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Description</label>
                <textarea 
                  className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none h-24 text-[#4A3F35] transition-colors"
                  placeholder="Describe this category..."
                ></textarea>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Category Icon</label>
                <div className="border-2 border-dashed border-[#D4AF37]/20 bg-[#FAF8F6] p-6 rounded-lg text-center cursor-pointer hover:bg-[#D4AF37]/5 transition-colors group">
                  <Upload className="w-6 h-6 text-[#D4AF37] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-gray-500 font-medium">Click to upload icon</p>
                </div>
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
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
