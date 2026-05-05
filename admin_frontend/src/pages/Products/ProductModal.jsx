import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Calculator, Hash, AlertTriangle, Package, Sparkles, Star, Search } from "lucide-react";

const ProductModal = ({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onColorStockChange,
  onSave,
  submitting,
  editingProduct,
  categories,
  materials,
  varieties,
  colors,
  occasions,
}) => {
  const navigate = useNavigate();
  const [colorSearch, setColorSearch] = React.useState("");

  if (!isOpen) return null;

  const filteredVarieties = varieties.filter(v => v.category_id === parseInt(formData.category_id));
  const isSelectionComplete = formData.category_id && formData.variety_id;

  const inputClasses = (isDisabled) =>
    `w-full rounded-lg px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-1 ${
      isDisabled 
        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" 
        : "bg-white border border-gray-300 focus:border-[#800020] focus:ring-[#800020]/20 text-gray-700"
    }`;

  const labelClasses = (isDisabled) =>
    `block text-[11px] font-bold uppercase tracking-wider mb-1.5 transition-colors ${
      isDisabled ? "text-gray-300" : "text-gray-500"
    }`;

  const isFormValid = 
    formData.name && 
    formData.image_url && 
    formData.price && 
    formData.stock_quantity >= 0 && 
    formData.category_id && 
    formData.variety_id && 
    formData.material_id;

  // Profit Calculation
  const sellingPrice = parseFloat(formData.price) || 0;
  const buyingPrice = parseFloat(formData.cost_price) || 0;
  const profitAmount = sellingPrice - buyingPrice;
  const profitPercent = buyingPrice > 0 ? Math.round((profitAmount / buyingPrice) * 100) : 0;

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and decimal
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onInputChange(e);
    }
  };

  const filteredColors = colors.filter(c => 
    c.name.toLowerCase().includes(colorSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#800020] to-[#a0152d]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {editingProduct ? "Update Product Details" : "Create New Product"}
              </h2>
              <p className="text-[10px] text-white/70 uppercase tracking-widest font-medium">Banaras Kala Admin Console</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSave} className="flex-1 overflow-y-auto p-6 bg-gray-50/30 space-y-8">
          
          {/* SECTION 1: HIERARCHY (Category Selection) */}
          <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/30 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-[#800020]"></div>
             <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-[#800020]/5 rounded text-[#800020]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Step 1: Product Hierarchy</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses(false)}>Main Category *</label>
                  <select name="category_id" value={formData.category_id} onChange={onInputChange} required className={inputClasses(false)}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <label className={labelClasses(!formData.category_id)}>Variety / Weave Type *</label>
                  <select
                    name="variety_id"
                    value={formData.variety_id}
                    onChange={onInputChange}
                    required
                    disabled={!formData.category_id}
                    className={inputClasses(!formData.category_id)}
                  >
                    <option value="">Select Variety</option>
                    {filteredVarieties.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                  
                  {formData.category_id && filteredVarieties.length === 0 && (
                    <div className="absolute -bottom-10 left-0 right-0 p-2 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <p className="text-[10px] text-red-700 font-medium">
                        No varieties found! <button type="button" onClick={() => navigate("/varieties")} className="underline font-bold">Add Now</button>
                      </p>
                    </div>
                  )}
                </div>
             </div>
          </div>

          <div className={`space-y-8 transition-all duration-500 ${!isSelectionComplete ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
            
            {/* SECTION 2: BASIC INFO */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
              <div className="flex items-center gap-3 mb-6 text-blue-600">
                <Package className="w-4 h-4" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Step 2: Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClasses(!isSelectionComplete)}>Product Display Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={onInputChange} required placeholder="e.g., Royal Gold Katan Silk Saree" className={inputClasses(!isSelectionComplete)} />
                </div>
                
                <div>
                  <label className={labelClasses(!isSelectionComplete)}>Short Tagline</label>
                  <input type="text" name="short_description" value={formData.short_description} onChange={onInputChange} placeholder="Brief highlight for cards" className={inputClasses(!isSelectionComplete)} />
                </div>

                <div>
                  <label className={labelClasses(!isSelectionComplete)}>Product Image URL *</label>
                  <div className="flex gap-2">
                    <input type="url" name="image_url" value={formData.image_url} onChange={onInputChange} required placeholder="https://..." className={inputClasses(!isSelectionComplete)} />
                    {formData.image_url && (
                      <div className="w-10 h-10 rounded-lg border overflow-hidden shrink-0 shadow-sm">
                        <img src={formData.image_url} alt="P" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses(!isSelectionComplete)}>Full Description</label>
                  <textarea name="description" value={formData.description} onChange={onInputChange} rows={3} placeholder="Detailed product story..." className={inputClasses(!isSelectionComplete)} />
                </div>
              </div>
            </div>

            {/* SECTION 3: PRICING & PROFIT */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
              <div className="flex items-center gap-3 mb-6 text-green-600">
                <Calculator className="w-4 h-4" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Step 3: Pricing & Profit Analysis</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className={labelClasses(!isSelectionComplete)}>Selling Price (₹) *</label>
                  <div className="relative group">
                    <input type="text" name="price" value={formData.price} onChange={handleNumberInput} required placeholder="0.00" className={inputClasses(!isSelectionComplete)} />
                    <div className="absolute left-0 -top-12 scale-0 group-hover:scale-100 transition-all bg-gray-800 text-white text-[10px] p-2 rounded shadow-lg z-[60] w-48 pointer-events-none">
                      The final price at which the product is sold to customers.
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClasses(!isSelectionComplete)}>MRP Price (₹)</label>
                  <div className="relative group">
                    <input type="text" name="old_price" value={formData.old_price} onChange={handleNumberInput} placeholder="0.00" className={`${inputClasses(!isSelectionComplete)} ${formData.old_price && parseFloat(formData.old_price) <= parseFloat(formData.price) ? 'border-red-400 focus:border-red-500' : ''}`} />
                    <div className="absolute left-0 -top-12 scale-0 group-hover:scale-100 transition-all bg-gray-800 text-white text-[10px] p-2 rounded shadow-lg z-[60] w-48 pointer-events-none">
                      Maximum Retail Price. This should be higher than the Selling Price for discounts.
                    </div>
                    {formData.old_price && parseFloat(formData.old_price) <= parseFloat(formData.price) && (
                      <p className="text-[9px] text-red-500 mt-1 font-bold">MRP must be higher than Selling Price!</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClasses(!isSelectionComplete)}>Discount (%)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={
                        (() => {
                          const s = parseFloat(formData.price);
                          const m = parseFloat(formData.old_price);
                          if (m > s && m > 0) return Math.round(((m - s) / m) * 100);
                          return 0;
                        })()
                      } 
                      readOnly 
                      className={`${inputClasses(true)} bg-green-50 font-black text-green-700`} 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 font-bold">%</span>
                  </div>
                </div>

                <div>
                  <label className={labelClasses(!isSelectionComplete)}>Buying Price (Cost) (₹)</label>
                  <div className="relative group">
                    <input type="text" name="cost_price" value={formData.cost_price} onChange={handleNumberInput} placeholder="Purchase Cost" className={inputClasses(!isSelectionComplete)} />
                    <div className="absolute left-0 -top-12 scale-0 group-hover:scale-100 transition-all bg-gray-800 text-white text-[10px] p-2 rounded shadow-lg z-[60] w-48 pointer-events-none">
                      The actual cost incurred to manufacture or purchase this product.
                    </div>
                  </div>
                </div>
              </div>

              {/* Profit Indicator Card */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-around shadow-inner">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Your Net Profit</p>
                    <p className={`text-xl font-black ${profitAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{profitAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-gray-200"></div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Profit Margin</p>
                    <p className={`text-xl font-black ${profitPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profitPercent}%
                    </p>
                  </div>
                  <div className="hidden md:block text-[10px] text-gray-400 italic font-medium">
                    * Calculation: (Selling Price - Buying Price)
                  </div>
              </div>
            </div>

            {/* SECTION 4: INVENTORY & COLORS */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
              <div className="flex items-center gap-3 mb-6 text-orange-600">
                <Package className="w-4 h-4" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Step 4: Inventory & Color Variants</h3>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Stock per Color Variant</label>
                    <div className="relative w-48">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <input 
                        type="text"
                        placeholder="Search color..."
                        value={colorSearch}
                        onChange={(e) => setColorSearch(e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 text-[11px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#800020] shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar p-1">
                    {filteredColors.map((color) => {
                      const qty = formData.color_stocks?.[color.id] || 0;
                      return (
                        <div key={color.id} className={`p-2.5 rounded-xl border transition-all flex flex-col items-center gap-2 ${qty > 0 ? 'bg-[#800020]/5 border-[#800020]/30 shadow-md ring-1 ring-[#800020]/10' : 'bg-white border-gray-100 opacity-60 hover:opacity-100 shadow-sm'}`}>
                          <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: color.hex_code }} title={color.name} />
                          <span className="text-[9px] font-black text-gray-600 truncate w-full text-center uppercase tracking-tighter">{color.name}</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={formData.color_stocks?.[String(color.id)] || ""}
                            onChange={(e) => onColorStockChange(String(color.id), e.target.value)}
                            className="w-full text-center text-xs p-1.5 bg-white border border-gray-200 rounded-lg font-bold focus:border-[#800020] outline-none shadow-sm"
                          />
                        </div>
                      );
                    })}
                    {filteredColors.length === 0 && (
                      <div className="col-span-full py-12 text-center">
                        <AlertTriangle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">No colors found matching "{colorSearch}"</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                   <div className="p-4 bg-gradient-to-br from-[#800020] to-[#a0152d] rounded-2xl text-white flex flex-col items-center justify-center shadow-lg">
                      <p className="text-[10px] uppercase font-bold opacity-80 mb-1">Total Available Stock</p>
                      <p className="text-3xl font-black">{formData.stock_quantity || 0}</p>
                      <p className="text-[9px] uppercase font-medium opacity-60 mt-1">Total Pieces</p>
                   </div>
                   
                   <div>
                    <label className={labelClasses(!isSelectionComplete)}>Low Stock Alert Threshold</label>
                    <input type="text" name="low_stock_threshold" value={formData.low_stock_threshold} onChange={handleNumberInput} placeholder="5" className={inputClasses(!isSelectionComplete)} />
                    <p className="text-[9px] text-gray-400 mt-2 italic leading-relaxed">The system will alert you when inventory falls below this level.</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner">
                    <div>
                      <p className="text-xs font-black text-gray-700 uppercase tracking-tighter">Inventory Tracking</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Auto-update on sales</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="track_inventory" checked={formData.track_inventory} onChange={onInputChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#800020]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: CLASSIFICATION & STATUS */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
              <div className="flex items-center gap-3 mb-6 text-purple-600">
                <Star className="w-4 h-4" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Step 5: Classification & Attributes</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClasses(!isSelectionComplete)}>Fabric / Material *</label>
                  <select name="material_id" value={formData.material_id} onChange={onInputChange} required className={inputClasses(!isSelectionComplete)}>
                    <option value="">Select Material</option>
                    {materials.map((mat) => (
                      <option key={mat.id} value={mat.id}>{mat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClasses(!isSelectionComplete)}>Recommended Occasion</label>
                  <select name="occasion_id" value={formData.occasion_id} onChange={onInputChange} className={inputClasses(!isSelectionComplete)}>
                    <option value="">Select Occasion</option>
                    {occasions.map((occ) => (
                      <option key={occ.id} value={occ.id}>{occ.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner">
                   <input type="checkbox" name="blouse_piece" checked={formData.blouse_piece} onChange={onInputChange} className="w-5 h-5 text-[#800020] rounded-lg border-gray-300 focus:ring-[#800020]" />
                   <div>
                    <p className="text-[11px] font-black text-gray-700 uppercase leading-none">Blouse Piece</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Included with saree</p>
                   </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#800020]/30 transition-all shadow-sm group">
                    <div>
                      <p className="text-xs font-black text-gray-700 uppercase tracking-tighter">Storefront Visibility</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Show to customers</p>
                    </div>
                    <input type="checkbox" name="is_available" checked={formData.is_available} onChange={onInputChange} className="w-6 h-6 text-[#800020] rounded-lg cursor-pointer transition-transform group-hover:scale-110" />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#800020]/30 transition-all shadow-sm group">
                    <div>
                      <p className="text-xs font-black text-gray-700 uppercase tracking-tighter">Special Collection</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Featured section</p>
                    </div>
                    <input type="checkbox" name="is_special_collection" checked={formData.is_special_collection} onChange={onInputChange} className="w-6 h-6 text-[#800020] rounded-lg cursor-pointer transition-transform group-hover:scale-110" />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#800020]/30 transition-all shadow-sm group">
                    <div>
                      <p className="text-xs font-black text-gray-700 uppercase tracking-tighter">New Arrival Tag</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Latest collection</p>
                    </div>
                    <input type="checkbox" name="is_new_arrival" checked={formData.is_new_arrival} onChange={onInputChange} className="w-6 h-6 text-[#800020] rounded-lg cursor-pointer transition-transform group-hover:scale-110" />
                 </div>
              </div>
            </div>

            {/* SECTION 6: PHYSICAL MEASUREMENTS */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
              <div className="flex items-center gap-3 mb-6 text-yellow-600">
                <Hash className="w-4 h-4" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Step 6: Physical Measurements</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className={labelClasses(!isSelectionComplete)}>Weight (Grams)</label>
                  <input type="text" name="weight" value={formData.weight} onChange={handleNumberInput} placeholder="e.g., 450" className={inputClasses(!isSelectionComplete)} />
                </div>
                <div>
                  <label className={labelClasses(!isSelectionComplete)}>Length (Meters)</label>
                  <input type="text" name="length" value={formData.length} onChange={handleNumberInput} placeholder="6.5" className={inputClasses(!isSelectionComplete)} />
                </div>
                <div>
                  <label className={labelClasses(!isSelectionComplete)}>Width (Meters)</label>
                  <input type="text" name="width" value={formData.width} onChange={handleNumberInput} placeholder="1.1" className={inputClasses(!isSelectionComplete)} />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-between items-center shadow-2xl">
          <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest hidden md:block">
            * Complete all steps to enable product creation
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 md:flex-none px-8 py-3 border-2 border-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-50 hover:text-gray-700 transition-all uppercase tracking-wider text-xs active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={submitting || !isFormValid}
              className={`flex-1 md:flex-none px-10 py-3 font-black rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider text-xs ${
                submitting || !isFormValid 
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none" 
                  : "bg-gradient-to-r from-[#800020] to-[#a0152d] text-white hover:shadow-[#800020]/30"
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : editingProduct ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
