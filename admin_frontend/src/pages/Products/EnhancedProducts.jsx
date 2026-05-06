import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
  Star,
  Sparkles,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api";
import "./Products.css";

// Initial form state with all fields
const INITIAL_FORM_STATE = {
  // Basic Info
  name: "",
  sku: "",
  description: "",
  short_description: "",

  // Pricing
  price: "",
  old_price: "",
  cost_price: "",
  discount_percent: "",

  // Primary Image
  image_url: "",

  // Inventory
  stock_quantity: 0,
  color_stocks: {}, // { color_id: quantity }
  low_stock_threshold: 5,
  track_inventory: true,

  // Physical Attributes
  weight: "",
  length: "6.5",
  width: "1.1",

  // Relationships
  category_id: "",
  material_id: "",
  variety_id: "",
  color_id: "",
  occasion_id: "",

  // Status Flags
  is_special_collection: false,
  is_new_arrival: false,
  is_available: true,
  store_front_visibility: false,

  // Additional Info
  blouse_piece: true,

  // SEO
  meta_title: "",
  meta_description: "",
};

export default function EnhancedProducts() {
  // State Management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    material: "",
    occasion: "",
    stockStatus: "",
    isNewArrival: "",
    isSpecialCollection: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [messageModal, setMessageModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const showMessageModal = (type, title, message) => {
    setMessageModal({ show: true, type, title, message });
  };

  // Fetch Data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, colRes, matRes, varRes, occRes] =
        await Promise.all([
          fetch(API_ENDPOINTS.products),
          fetch(API_ENDPOINTS.categories),
          fetch(API_ENDPOINTS.colors),
          fetch(API_ENDPOINTS.materials),
          fetch(API_ENDPOINTS.varieties),
          fetch(API_ENDPOINTS.occasions),
        ]);

      const [products, cats, cols, mats, vars, occs] = await Promise.all([
        prodRes.json(),
        catRes.json(),
        colRes.json(),
        matRes.json(),
        varRes.json(),
        occRes.json(),
      ]);

      setProducts(products);
      setCategories(cats);
      setColors(cols);
      setMaterials(mats);
      setVarieties(vars);
      setOccasions(occs);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Products
  const filteredProducts = useCallback(() => {
    return products.filter((product) => {
      // Search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          product.name?.toLowerCase().includes(searchLower) ||
          product.sku?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category Filter
      if (filters.category && product.category_id !== parseInt(filters.category))
        return false;

      // Material Filter
      if (filters.material && product.material_id !== parseInt(filters.material))
        return false;

      // Occasion Filter
      if (filters.occasion && product.occasion_id !== parseInt(filters.occasion))
        return false;

      // Stock Status
      if (filters.stockStatus) {
        if (filters.stockStatus === "in_stock" && product.stock_quantity <= 0)
          return false;
        if (filters.stockStatus === "out_of_stock" && product.stock_quantity > 0)
          return false;
        if (
          filters.stockStatus === "low_stock" &&
          (product.stock_quantity > product.low_stock_threshold ||
            product.stock_quantity <= 0)
        )
          return false;
      }

      // New Arrival
      if (filters.isNewArrival !== "") {
        const isNew = filters.isNewArrival === "true";
        if (product.is_new_arrival !== isNew) return false;
      }

      // Special Collection
      if (filters.isSpecialCollection !== "") {
        const isSpecial = filters.isSpecialCollection === "true";
        if (product.is_special_collection !== isSpecial) return false;
      }

      return true;
    });
  }, [products, searchTerm, filters]);

  // Pagination
  const getPaginatedProducts = () => {
    const filtered = filteredProducts();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredProducts().length / itemsPerPage);

  const navigate = useNavigate();

  // Form Handlers
  const openModal = (product = null) => {
    // Validation: Check if categories exist
    if (!product && categories.length === 0) {
      showMessageModal("warning", "Category required", "No categories found! Please add a category first.");
      navigate("/categories");
      return;
    }

    if (product) {
      setEditingProduct(product);
      setFormData({
        ...INITIAL_FORM_STATE,
        ...product,
        price: product.price?.toString() || "",
        old_price: product.old_price?.toString() || "",
        cost_price: product.cost_price?.toString() || "",
        weight: product.weight?.toString() || "",
        length: product.length?.toString() || "6.5",
        width: product.width?.toString() || "1.1",
        category_id: product.category_id?.toString() || "",
        variety_id: product.variety_id?.toString() || "",
        material_id: product.material_id?.toString() || "",
        occasion_id: product.occasion_id?.toString() || "",
        store_front_visibility: !!product.store_front_visibility,
      });
    } else {
      setEditingProduct(null);
      setFormData(INITIAL_FORM_STATE);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(INITIAL_FORM_STATE);
  };

  const handleColorStockChange = (colorId, value) => {
    setFormData((prev) => {
      const newColorStocks = { ...prev.color_stocks };
      
      // Store the value as a string to allow the user to type freely (including '0')
      newColorStocks[colorId] = value;

      // Calculate total stock based on current numeric values
      const totalStock = Object.values(newColorStocks).reduce((sum, q) => {
        const val = parseInt(q) || 0;
        return sum + val;
      }, 0);

      return {
        ...prev,
        color_stocks: newColorStocks,
        stock_quantity: totalStock,
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => {
      const newState = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Reset variety if category changes
      if (name === "category_id") {
        newState.variety_id = "";
      }

      // Auto-calculate discount
      if (name === "price" || name === "old_price") {
        const sPrice = name === "price" ? value : (prev.price || "0");
        const mPrice = name === "old_price" ? value : (prev.old_price || "0");
        
        const sp = parseFloat(sPrice) || 0;
        const mp = parseFloat(mPrice) || 0;
        
        if (mp > sp && mp > 0) {
          newState.discount_percent = Math.round(((mp - sp) / mp) * 100);
        } else {
          newState.discount_percent = 0;
        }
      }

      return newState;
    });
  };

  const generateSKU = () => {
    if (!formData.name) return;
    const prefix = formData.name.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    const sku = `${prefix}-${random}`;
    setFormData((prev) => ({ ...prev, sku }));
  };

  const calculateDiscount = () => {
    if (formData.price && formData.old_price) {
      const price = parseFloat(formData.price);
      const oldPrice = parseFloat(formData.old_price);
      if (oldPrice > price) {
        const discount = Math.round(((oldPrice - price) / oldPrice) * 100);
        setFormData((prev) => ({ ...prev, discount_percent: discount }));
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Auto-generate SKU if not editing or if missing
      let currentSku = formData.sku;
      if (!currentSku) {
        const cat = categories.find(c => c.id === parseInt(formData.category_id))?.name?.substring(0, 3).toUpperCase() || "CAT";
        const var_name = varieties.find(v => v.id === parseInt(formData.variety_id))?.name?.substring(0, 3).toUpperCase() || "VAR";
        const random = Math.floor(1000 + Math.random() * 9000);
        currentSku = `${cat}-${var_name}-${random}`;
      }

      const selling = parseFloat(formData.price) || 0;
      const mrp = parseFloat(formData.old_price) || 0;
      const disc = (mrp > selling && mrp > 0) ? Math.round(((mrp - selling) / mrp) * 100) : 0;

      const payload = {
        ...formData,
        sku: currentSku,
        price: selling,
        old_price: mrp || null,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        discount_percent: disc,
        stock_quantity: Object.values(formData.color_stocks || {}).reduce((sum, q) => sum + (parseInt(q) || 0), 0),
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        length: formData.length ? parseFloat(formData.length) : null,
        width: formData.width ? parseFloat(formData.width) : null,
        category_id: parseInt(formData.category_id) || null,
        material_id: parseInt(formData.material_id) || null,
        variety_id: parseInt(formData.variety_id) || null,
        occasion_id: parseInt(formData.occasion_id) || null,
        store_front_visibility: !!formData.store_front_visibility,
        // color_id is no longer used for primary classification in multi-color mode
      };

      // Remove obsolete fields
      delete payload.weave_type;
      delete payload.zari_type;
      delete payload.color_id;

      const url = editingProduct
        ? `${API_ENDPOINTS.products}/${editingProduct.id}`
        : API_ENDPOINTS.products;
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchAllData();
        closeModal();
        showMessageModal("success", "Success", editingProduct ? "Product updated successfully!" : "Product created successfully!");
      } else {
        const error = await response.json();
        showMessageModal("error", "Save failed", error.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Save error:", error);
      showMessageModal("error", "Network error", "Network error while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch(`${API_ENDPOINTS.products}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Stock Status Badge
  const getStockBadge = (product) => {
    if (product.stock_quantity <= 0) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
          OUT OF STOCK
        </span>
      );
    }
    if (product.stock_quantity <= (product.low_stock_threshold || 5)) {
      return (
        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          LOW STOCK ({product.stock_quantity})
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
        IN STOCK ({product.stock_quantity})
      </span>
    );
  };

  const paginatedProducts = getPaginatedProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#800020] brand-font">
            Product Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your Banarasi saree collection
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-6 py-2.5 bg-[#800020] text-white text-sm font-bold rounded-lg uppercase tracking-wider flex items-center gap-2 hover:bg-[#6b001a] transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#800020]/10 rounded-lg">
              <Package className="w-5 h-5 text-[#800020]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Total Products
              </p>
              <p className="text-xl font-bold text-[#4A3F35]">
                {products.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                New Arrivals
              </p>
              <p className="text-xl font-bold text-[#4A3F35]">
                {products.filter((p) => p.is_new_arrival).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Special Collection
              </p>
              <p className="text-xl font-bold text-[#4A3F35]">
                {products.filter((p) => p.is_special_collection).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Low Stock
              </p>
              <p className="text-xl font-bold text-[#4A3F35]">
                {
                  products.filter(
                    (p) =>
                      p.stock_quantity > 0 &&
                      p.stock_quantity <= (p.low_stock_threshold || 5)
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 shadow-sm space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, SKU, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#800020]"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              showFilters
                ? "bg-[#800020] text-white border-[#800020]"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-gray-100">
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#800020]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={filters.material}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, material: e.target.value }))
              }
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#800020]"
            >
              <option value="">All Materials</option>
              {materials.map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.name}
                </option>
              ))}
            </select>

            <select
              value={filters.occasion}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, occasion: e.target.value }))
              }
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#800020]"
            >
              <option value="">All Occasions</option>
              {occasions.map((occ) => (
                <option key={occ.id} value={occ.id}>
                  {occ.name}
                </option>
              ))}
            </select>

            <select
              value={filters.stockStatus}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, stockStatus: e.target.value }))
              }
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#800020]"
            >
              <option value="">Stock Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <select
              value={filters.isNewArrival}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  isNewArrival: e.target.value,
                }))
              }
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#800020]"
            >
              <option value="">New Arrival?</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>

            <select
              value={filters.isSpecialCollection}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  isSpecialCollection: e.target.value,
                }))
              }
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#800020]"
            >
              <option value="">Special Collection?</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#D4AF37]/20 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#800020] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAF8F6]">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Occasion
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-12 text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No products found</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium text-[#4A3F35] text-sm">
                                {product.name}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {product.is_new_arrival && (
                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded">
                                    NEW
                                  </span>
                                )}
                                {product.is_special_collection && (
                                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded">
                                    SPECIAL COLLECTION
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {product.sku || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {product.Category?.name || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {product.Occasion?.name || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <span className="font-bold text-[#800020]">
                              ₹{parseFloat(product.price).toLocaleString()}
                            </span>
                            {product.old_price && (
                              <span className="text-xs text-gray-400 line-through block">
                                ₹
                                {parseFloat(product.old_price).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {getStockBadge(product)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                              product.is_available
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {product.is_available ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openModal(product)}
                              className="p-1.5 text-gray-400 hover:text-[#D4AF37] hover:bg-amber-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredProducts().length)}{" "}
                of {filteredProducts().length} products
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? "bg-[#800020] text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        formData={formData}
        onInputChange={handleInputChange}
        onColorStockChange={handleColorStockChange}
        onSave={handleSave}
        onGenerateSKU={generateSKU}
        onCalculateDiscount={calculateDiscount}
        submitting={submitting}
        editingProduct={editingProduct}
        categories={categories}
        materials={materials}
        varieties={varieties}
        colors={colors}
        occasions={occasions}
      />

      {messageModal.show && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMessageModal((prev) => ({ ...prev, show: false }))}
          ></div>
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-[#4A3F35]">{messageModal.title}</h3>
            <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{messageModal.message}</p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setMessageModal((prev) => ({ ...prev, show: false }))}
                className="px-4 py-2 rounded-lg bg-[#800020] text-white font-semibold"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
