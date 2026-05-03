import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, UploadCloud, Loader2 } from 'lucide-react';
import './Products.css';

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    color_id: '',
    material_id: '',
    variety_id: '',
    description: '',
    image_url: '',
    is_featured: false,
    is_available: true
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      // Reset form on open
      setFormData({
        name: '',
        price: '',
        category_id: '',
        color_id: '',
        material_id: '',
        variety_id: '',
        description: '',
        image_url: '',
        is_featured: false,
        is_available: true
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMetadata();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [catRes, colRes, matRes, varRes] = await Promise.all([
        fetch('http://localhost:5001/api/categories'),
        fetch('http://localhost:5001/api/colors'),
        fetch('http://localhost:5001/api/materials'),
        fetch('http://localhost:5001/api/varieties')
      ]);

      const [cats, cols, mats, vars] = await Promise.all([
        catRes.json(), colRes.json(), matRes.json(), varRes.json()
      ]);

      setCategories(cats);
      setColors(cols);
      setMaterials(mats);
      setVarieties(vars);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Generate slug from name
    const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const payload = {
      ...formData,
      slug,
      price: parseFloat(formData.price)
    };

    try {
      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchProducts();
        toggleModal();
        alert('Heritage piece uploaded successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to upload: ${error.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Network error while uploading.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to retire this piece from the collection?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

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
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select className="bg-white border border-[#D4AF37]/20 p-2 rounded-lg text-xs outline-none focus:border-[#D4AF37] text-gray-700">
            <option>Material: All</option>
            {materials.map(mat => (
              <option key={mat.id} value={mat.id}>{mat.name}</option>
            ))}
          </select>
          <select className="bg-white border border-[#D4AF37]/20 p-2 rounded-lg text-xs outline-none focus:border-[#D4AF37] text-gray-700">
            <option>Status: All</option>
            <option>Available</option>
            <option>Out of Stock</option>
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
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3 text-center">Image</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#D4AF37]/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">Loading heritage pieces...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">No products found.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#FAF8F6]/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500">#{product.id}</td>
                    <td className="px-6 py-4 font-bold text-[#4A3F35]">{product.name}</td>
                    <td className="px-6 py-4 text-gray-600">{product.Category?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-[#D4AF37] font-bold">₹{Number(product.price).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-center">
                      <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded shadow-sm mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-gray-400 hover:text-[#D4AF37] transition-colors"><Pencil className="w-4 h-4 inline" /></button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
              <form id="productForm" onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Product Name</label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    type="text" 
                    required
                    className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35]" 
                    placeholder="e.g. Royal Gold Katan Silk" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Price (₹)</label>
                  <input 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    type="number" 
                    required
                    className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35]" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Category</label>
                  <select 
                    name="category_id" 
                    value={formData.category_id} 
                    onChange={handleInputChange} 
                    required
                    className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35]"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Material</label>
                  <select 
                    name="material_id" 
                    value={formData.material_id} 
                    onChange={handleInputChange} 
                    required
                    className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35]"
                  >
                    <option value="">Select Material</option>
                    {materials.map(mat => (
                      <option key={mat.id} value={mat.id}>{mat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Variety / Weave</label>
                  <select 
                    name="variety_id" 
                    value={formData.variety_id} 
                    onChange={handleInputChange} 
                    required
                    className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35]"
                  >
                    <option value="">Select Variety</option>
                    {varieties.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Color</label>
                  <select 
                    name="color_id" 
                    value={formData.color_id} 
                    onChange={handleInputChange} 
                    required
                    className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35]"
                  >
                    <option value="">Select Color</option>
                    {colors.map(col => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Product Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    className="w-full bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none h-32 text-[#4A3F35]"
                  ></textarea>
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Image URL</label>
                  <div className="flex gap-4">
                    <input 
                      name="image_url" 
                      value={formData.image_url} 
                      onChange={handleInputChange} 
                      type="text" 
                      required
                      placeholder="Paste image URL from Cloudinary/Unsplash"
                      className="flex-1 bg-[#FAF8F6] border border-[#D4AF37]/20 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none text-[#4A3F35]" 
                    />
                    {formData.image_url && (
                      <div className="w-12 h-12 rounded border border-[#D4AF37]/20 overflow-hidden bg-gray-50">
                        <img src={formData.image_url} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-8 md:col-span-2 p-4 bg-[#FAF8F6] rounded-xl border border-[#D4AF37]/10">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="is_featured" 
                      name="is_featured" 
                      checked={formData.is_featured} 
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-[#800020] cursor-pointer" 
                    />
                    <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest cursor-pointer" htmlFor="is_featured">Featured Piece</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="is_available" 
                      name="is_available" 
                      checked={formData.is_available} 
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-[#800020] cursor-pointer" 
                    />
                    <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest cursor-pointer" htmlFor="is_available">Available for Sale</label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-[#D4AF37]/10 flex justify-end gap-4 bg-[#FDFCFB]">
              <button 
                onClick={toggleModal}
                disabled={submitting}
                className="px-6 py-2 border border-[#800020]/20 text-[#800020] font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#800020]/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                form="productForm"
                type="submit"
                disabled={submitting}
                className="px-8 py-2 bg-[#800020] text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg hover:bg-[#6b001a] transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
