import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import './Colors.css';

export default function Colors() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewColor, setPreviewColor] = useState('');
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/colors');
      const data = await response.json();
      setColors(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching colors:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <section className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <h2 className="brand-font text-xl font-bold text-[#800020]">Heritage Color Palette</h2>
          <button 
            onClick={toggleModal}
            className="px-6 py-2 bg-[#800020] text-white text-xs font-bold rounded-lg uppercase tracking-widest hover:bg-[#6b001a] transition-colors shadow-sm"
          >
            New Color
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <p className="text-xs text-gray-400">Loading palette...</p>
          ) : colors.length === 0 ? (
            <p className="text-xs text-gray-400">No colors defined yet.</p>
          ) : (
            colors.map((color) => (
              <div key={color.id} className="glass-card p-4 rounded-xl flex flex-col hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 shadow-inner" style={{ backgroundColor: color.hex_code || '#cccccc' }}></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#4A3F35]">{color.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">HEX: {color.hex_code || '#N/A'}</p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#D4AF37]/10">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase text-gray-400">Active</span>
                    <div className="w-8 h-4 bg-green-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 rounded transition-all"><Pencil className="w-4 h-4" /></button>
                    <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Add Color Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="modal-overlay absolute inset-0 bg-[#4A3F35]/40 backdrop-blur-sm" 
            onClick={toggleModal}
          ></div>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#D4AF37]/10 flex justify-between items-center bg-[#FDFCFB]">
              <h3 className="brand-font text-xl font-bold text-[#800020]">Define Heritage Color</h3>
              <button 
                onClick={toggleModal}
                className="text-gray-400 hover:text-[#800020] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5 bg-white">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Color Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Royal Maroon"
                  className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35] transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Hex Code</label>
                  <div className="flex items-center gap-2">
                    <span className="text-[#D4AF37] font-bold">#</span>
                    <input 
                      type="text" 
                      placeholder="FFFFFF" 
                      maxLength="6"
                      value={previewColor}
                      onChange={(e) => setPreviewColor(e.target.value)}
                      className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35] transition-colors font-mono uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Preview</label>
                  <div 
                    className="w-full h-[46px] rounded-lg border border-[#D4AF37]/20 shadow-inner transition-colors duration-300"
                    style={{ backgroundColor: previewColor.length === 6 ? `#${previewColor}` : '#f3f4f6' }}
                  ></div>
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
                Add Color
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
