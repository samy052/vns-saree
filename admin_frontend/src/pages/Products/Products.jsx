import React, { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, Package, AlertCircle, Star, Sparkles } from "lucide-react";
import { API_ENDPOINTS } from "../../config/api";
import ProductModal from "./ProductModal";
import "./Products.css";

const INITIAL_FORM_STATE = {
  name: "", sku: "", description: "", short_description: "",
  price: "", old_price: "", cost_price: "", discount_percent: "",
  image_url: "", stock_quantity: "", low_stock_threshold: 5, track_inventory: true,
  weight: "", length: "6.5", width: "1.1",
  category_id: "", material_id: "", variety_id: "", color_id: "", occasion_id: "",
  is_special_collection: false, is_new_arrival: false, is_available: true,
  weave_type: "Handloom", zari_type: "", blouse_piece: true,
  meta_title: "", meta_description: "",
};

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ category: "", material: "", occasion: "", stockStatus: "", isNewArrival: "", isFeatured: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, colRes, matRes, varRes, occRes] = await Promise.all([
        fetch(API_ENDPOINTS.products), fetch(API_ENDPOINTS.categories),
        fetch(API_ENDPOINTS.colors), fetch(API_ENDPOINTS.materials),
        fetch(API_ENDPOINTS.varieties), fetch(API_ENDPOINTS.occasions),
      ]);
      const [products, cats, cols, mats, vars, occs] = await Promise.all([
        prodRes.json(), catRes.json(), colRes.json(),
        matRes.json(), varRes.json(), occRes.json(),
      ]);
      setProducts(products); setCategories(cats); setColors(cols);
      setMaterials(mats); setVarieties(vars); setOccasions(occs);
    } catch (error) { console.error("Error:", error); }
    finally { setLoading(false); }
  };

  const getFilteredProducts = useCallback(() => {
    return products.filter((p) => {
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        if (!p.name?.toLowerCase().includes(s) && !p.sku?.toLowerCase().includes(s)) return false;
      }
      if (filters.category && p.category_id !== parseInt(filters.category)) return false;
      if (filters.material && p.material_id !== parseInt(filters.material)) return false;
      if (filters.occasion && p.occasion_id !== parseInt(filters.occasion)) return false;
      if (filters.stockStatus === "in_stock" && p.stock_quantity <= 0) return false;
      if (filters.stockStatus === "out_of_stock" && p.stock_quantity > 0) return false;
      if (filters.stockStatus === "low_stock" && (p.stock_quantity > (p.low_stock_threshold || 5) || p.stock_quantity <= 0)) return false;
      if (filters.isNewArrival && p.is_new_arrival !== (filters.isNewArrival === "true")) return false;
      if (filters.isSpecialCollection && p.is_special_collection !== (filters.isSpecialCollection === "true")) return false;
      return true;
    });
  }, [products, searchTerm, filters]);

  const filtered = getFilteredProducts();
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...INITIAL_FORM_STATE, ...product, price: product.price?.toString() || "", old_price: product.old_price?.toString() || "" });
    } else { setEditingProduct(null); setFormData(INITIAL_FORM_STATE); }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const generateSKU = () => {
    if (!formData.name) return;
    const prefix = formData.name.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, sku: `${prefix}-${random}` }));
  };

  const calculateDiscount = () => {
    const price = parseFloat(formData.price);
    const old = parseFloat(formData.old_price);
    if (old > price) {
      setFormData((prev) => ({ ...prev, discount_percent: Math.round(((old - price) / old) * 100) }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...formData,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      price: parseFloat(formData.price) || 0, old_price: formData.old_price ? parseFloat(formData.old_price) : null,
      cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      category_id: formData.category_id || null, material_id: formData.material_id || null,
      variety_id: formData.variety_id || null, color_id: formData.color_id || null,
      occasion_id: formData.occasion_id || null,
    };
    try {
      const url = editingProduct ? `${API_ENDPOINTS.products}/${editingProduct.id}` : API_ENDPOINTS.products;
      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { await fetchAllData(); setIsModalOpen(false); alert(editingProduct ? "Updated!" : "Created!"); }
      else { const err = await res.json(); alert(`Error: ${err.message}`); }
    } catch (err) { alert("Network error"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.products}/${id}`, { method: "DELETE" });
      if (res.ok) await fetchAllData();
    } catch (err) { console.error(err); }
  };

  const getStockBadge = (p) => {
    if (p.stock_quantity <= 0) return <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">OUT OF STOCK</span>;
    if (p.stock_quantity <= (p.low_stock_threshold || 5)) return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" />LOW ({p.stock_quantity})</span>;
    return <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">IN STOCK ({p.stock_quantity})</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#800020]">Products</h1><p className="text-sm text-gray-500 mt-1">Manage Banarasi saree collection</p></div>
        <button onClick={() => openModal()} className="px-6 py-2.5 bg-[#800020] text-white text-sm font-bold rounded-lg uppercase tracking-wider flex items-center gap-2 hover:bg-[#6b001a] transition-colors shadow-lg">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 shadow-sm"><div className="flex items-center gap-3"><div className="p-2 bg-[#800020]/10 rounded-lg"><Package className="w-5 h-5 text-[#800020]" /></div><div><p className="text-[10px] text-gray-500 uppercase font-bold">Total</p><p className="text-xl font-bold text-[#4A3F35]">{products.length}</p></div></div></div>
        <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 shadow-sm"><div className="flex items-center gap-3"><div className="p-2 bg-green-50 rounded-lg"><Sparkles className="w-5 h-5 text-green-600" /></div><div><p className="text-[10px] text-gray-500 uppercase font-bold">New</p><p className="text-xl font-bold text-[#4A3F35]">{products.filter(p => p.is_new_arrival).length}</p></div></div></div>
        <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 shadow-sm"><div className="flex items-center gap-3"><div className="p-2 bg-amber-50 rounded-lg"><Star className="w-5 h-5 text-amber-600" /></div><div><p className="text-[10px] text-gray-500 uppercase font-bold">Special Collection</p><p className="text-xl font-bold text-[#4A3F35]">{products.filter(p => p.is_special_collection).length}</p></div></div></div>
        <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 shadow-sm"><div className="flex items-center gap-3"><div className="p-2 bg-red-50 rounded-lg"><AlertCircle className="w-5 h-5 text-red-600" /></div><div><p className="text-[10px] text-gray-500 uppercase font-bold">Low Stock</p><p className="text-xl font-bold text-[#4A3F35]">{products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= (p.low_stock_threshold || 5)).length}</p></div></div></div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 shadow-sm space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search by name or SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#800020]" /></div>
          <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${showFilters ? "bg-[#800020] text-white border-[#800020]" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}><Filter className="w-4 h-4" /> Filters</button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-gray-100">
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"><option value="">All Categories</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <select value={filters.material} onChange={(e) => setFilters({ ...filters, material: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"><option value="">All Materials</option>{materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
            <select value={filters.occasion} onChange={(e) => setFilters({ ...filters, occasion: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"><option value="">All Occasions</option>{occasions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
            <select value={filters.stockStatus} onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"><option value="">Stock Status</option><option value="in_stock">In Stock</option><option value="low_stock">Low Stock</option><option value="out_of_stock">Out</option></select>
            <select value={filters.isNewArrival} onChange={(e) => setFilters({ ...filters, isNewArrival: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"><option value="">New Arrival?</option><option value="true">Yes</option><option value="false">No</option></select>
            <select value={filters.isFeatured} onChange={(e) => setFilters({ ...filters, isFeatured: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"><option value="">Featured?</option><option value="true">Yes</option><option value="false">No</option></select>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#D4AF37]/20 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#800020] rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-500">Loading...</p></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAF8F6]"><tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">SKU</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Occasion</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.length === 0 ? (
                    <tr><td colSpan="8" className="px-4 py-12 text-center"><Package className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No products found</p></td></tr>
                  ) : paginated.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded-lg" /><div><p className="font-medium text-[#4A3F35] text-sm">{p.name}</p><div className="flex gap-1 mt-1">{p.is_new_arrival && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded">NEW</span>}{p.is_special_collection && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded">SPECIAL COLLECTION</span>}</div></div></div></td>
                      <td className="px-4 py-3"><span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{p.sku || "-"}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.Category?.name || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.Occasion?.name || "-"}</td>
                      <td className="px-4 py-3"><span className="font-bold text-[#800020]">₹{parseFloat(p.price).toLocaleString()}</span>{p.old_price && <span className="text-xs text-gray-400 line-through block">₹{parseFloat(p.old_price).toLocaleString()}</span>}</td>
                      <td className="px-4 py-3">{getStockBadge(p)}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 text-[10px] font-bold rounded-full ${p.is_available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{p.is_available ? "Active" : "Inactive"}</span></td>
                      <td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><button onClick={() => openModal(p)} className="p-1.5 text-gray-400 hover:text-[#D4AF37] hover:bg-amber-50 rounded"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}</p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-2 rounded-lg text-sm font-medium ${currentPage === page ? "bg-[#800020] text-white" : "border border-gray-200"}`}>{page}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </>
        )}
      </div>

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} formData={formData} onInputChange={handleInputChange} onSave={handleSave} onGenerateSKU={generateSKU} onCalculateDiscount={calculateDiscount} submitting={submitting} editingProduct={editingProduct} categories={categories} materials={materials} varieties={varieties} colors={colors} occasions={occasions} />
    </div>
  );
}
