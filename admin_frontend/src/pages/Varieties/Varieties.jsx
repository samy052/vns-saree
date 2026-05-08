import React, { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  GitBranch,
  Loader2,
  Layers,
  AlertCircle,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Search,
} from "lucide-react";
import { API_ENDPOINTS } from "../../config/api";
import { useNavigate } from "react-router-dom";
import "./Varieties.css";

const INITIAL_FORM = { name: "", description: "", category_id: "" };

export default function Varieties() {
  const navigate = useNavigate();
  const [varieties, setVarieties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariety, setEditingVariety] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Single modal system for all messages
  const [modal, setModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [varRes, catRes, prodRes] = await Promise.all([
        fetch(API_ENDPOINTS.varieties),
        fetch(API_ENDPOINTS.categories),
        fetch(API_ENDPOINTS.products),
      ]);

      let vars = await varRes.json();
      let cats = await catRes.json();
      let prods = await prodRes.json();

      // Ensure arrays and sort by id descending (newest first)
      if (!Array.isArray(vars)) vars = vars.data || [];
      if (!Array.isArray(cats)) cats = cats.data || [];
      if (!Array.isArray(prods)) prods = prods.data || [];

      // Sort by id descending - last added shows first
      vars.sort((a, b) => b.id - a.id);

      setVarieties(vars);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      showModal(
        "error",
        "Error",
        "Failed to load data from server",
        closeModal,
      );
    } finally {
      setLoading(false);
    }
  };

  // Check if variety is linked to any products
  const getLinkedProducts = (varietyId) => {
    return products.filter((p) => p.variety_id === varietyId);
  };

  // Check if no categories - show redirect modal
  const showNoCategoryModal = categories.length === 0 && !loading;

  const showModal = (
    type,
    title,
    message,
    onConfirm = null,
    onCancel = null,
  ) => {
    setModal({ show: true, type, title, message, onConfirm, onCancel });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, show: false }));
    setTimeout(() => {
      setModal({
        show: false,
        type: "info",
        title: "",
        message: "",
        onConfirm: null,
        onCancel: null,
      });
    }, 200);
  };

  const openFormModal = (variety = null) => {
    // Check if categories exist before opening modal for new variety
    if (!variety && categories.length === 0) {
      showModal(
        "error",
        "No Categories Found",
        "Please create at least one category before adding varieties.",
        () => {
          closeModal();
          navigate("/categories");
        },
      );
      return;
    }

    if (variety) {
      setEditingVariety(variety);
      setFormData({
        name: variety.name,
        description: variety.description || "",
        category_id: variety.category_id,
      });
    } else {
      setEditingVariety(null);
      // Pre-select category if filtered
      const preSelectedCategory =
        selectedCategory || (categories.length > 0 ? categories[0].id : "");
      setFormData({ ...INITIAL_FORM, category_id: preSelectedCategory });
    }
    setIsModalOpen(true);
  };

  const generateSlug = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.category_id) {
      showModal(
        "error",
        "Select Category",
        "Please select a category first!",
        closeModal,
      );
      return;
    }

    const itemName = formData.name;
    const slug = editingVariety ? editingVariety.slug : generateSlug(itemName);

    showModal(
      "confirm",
      editingVariety ? "Update Variety?" : "Create Variety?",
      editingVariety
        ? `Are you sure you want to update "${itemName}"?`
        : `Are you sure you want to create variety "${itemName}"?`,
      async () => {
        setSubmitting(true);
        closeModal();

        const payload = {
          name: formData.name,
          description: formData.description,
          category_id: parseInt(formData.category_id),
          slug: slug,
        };

        try {
          const url = editingVariety
            ? `${API_ENDPOINTS.varieties}/${editingVariety.id}`
            : API_ENDPOINTS.varieties;
          const method = editingVariety ? "PUT" : "POST";
          const token = localStorage.getItem("accessToken");
          const res = await fetch(url, {
            method,
            headers: { 
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            await fetchData();
            setIsModalOpen(false);
            showModal(
              "success",
              "Success",
              editingVariety
                ? `Variety "${itemName}" updated successfully!`
                : `Variety "${itemName}" created successfully!`,
            );
          } else {
            const err = await res.json();
            showModal(
              "error",
              "Error",
              err.message || "Failed to save variety",
            );
          }
        } catch (err) {
          showModal("error", "Error", "Network error. Please try again.");
        } finally {
          setSubmitting(false);
        }
      },
      closeModal,
    );
  };

  const checkAndConfirmDelete = (variety) => {
    console.log("Delete clicked for variety:", variety);
    // Check if variety is linked to any products
    const linkedProducts = getLinkedProducts(variety.id);

    if (linkedProducts.length > 0) {
      // Show error modal - cannot delete
      const productNames = linkedProducts
        .slice(0, 3)
        .map((p) => `• ${p.name}`)
        .join("\n");
      const moreCount =
        linkedProducts.length > 3
          ? `\n... and ${linkedProducts.length - 3} more products`
          : "";

      showModal(
        "error",
        "Cannot Delete Variety",
        `"${variety.name}" is linked to ${linkedProducts.length} product(s):\n\n${productNames}${moreCount}\n\nPlease remove these products or change their variety before deleting.`,
        closeModal,
      );
      return;
    }

    // No linked products - show confirmation, inline closure captures `variety` directly
    showModal(
      "danger",
      "Delete Variety?",
      `Are you sure you want to delete "${variety.name}"?\n\nThis action cannot be undone.`,
      async () => {
        closeModal();
        try {
          const token = localStorage.getItem("accessToken");
          const res = await fetch(`${API_ENDPOINTS.varieties}/${variety.id}`, {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            await fetchData();
            showModal(
              "success",
              "Success",
              `Variety "${variety.name}" deleted successfully!`,
            );
          } else {
            const err = await res.json();
            showModal("error", "Error", err.message || "Failed to delete variety");
          }
        } catch (err) {
          showModal("error", "Error", "Network error. Please try again.");
        }
      },
      closeModal,
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "danger":
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
    }
  };

  // Filter varieties based on search and selected category
  const filteredVarieties = varieties.filter((v) => {
    const matchesCategory = selectedCategory
      ? v.category_id === parseInt(selectedCategory)
      : true;
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.description &&
        v.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Loading overlay - only covers content area
  if (loading) {
    return (
      <div className="relative min-h-[calc(100vh-120px)]">
        <div className="space-y-6 opacity-50 pointer-events-none">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#800020]">Varieties</h1>
              <p className="text-sm text-gray-500 mt-1">
                Sub-types within each category
              </p>
            </div>
            <button className="px-6 py-2.5 bg-[#800020] text-white font-bold rounded-lg opacity-50">
              Add Variety
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 h-20"></div>
            <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 h-20 md:col-span-2"></div>
          </div>
          <div className="bg-white rounded-xl border border-[#D4AF37]/20 h-96"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-[#D4AF37]/20 flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#800020] animate-spin mb-4" />
            <p className="text-[#4A3F35] font-medium">Loading varieties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#800020]">Varieties</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sub-types within each category (Katan, Kadhwa, etc.)
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search varieties..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] outline-none text-sm w-full sm:w-64"
            />
          </div>
          <button
            onClick={() => openFormModal()}
            disabled={categories.length === 0}
            className="px-6 py-2.5 bg-[#800020] text-white font-bold rounded-lg flex items-center gap-2 hover:bg-[#6b001a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Variety
          </button>
        </div>
      </div>

      {/* Stats & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#800020]/10 rounded-xl">
              <GitBranch className="w-6 h-6 text-[#800020]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Varieties</p>
              <p className="text-2xl font-bold text-[#4A3F35]">
                {varieties.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/20 shadow-sm md:col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full mt-1.5 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] outline-none transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#D4AF37]/20 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#FAF8F6]">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider w-16">
                S.No
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Variety
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredVarieties.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-16 text-center">
                  <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {categories.length === 0
                      ? "No categories found. Add categories first!"
                      : "No varieties found. Add your first variety!"}
                  </p>
                </td>
              </tr>
            ) : (
              filteredVarieties.map((v, index) => (
                <tr
                  key={v.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <span className="font-bold text-gray-400">{index + 1}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs text-[#800020] bg-[#800020]/10 px-2 py-1 rounded font-bold">
                      #{v.id}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-bold text-[#4A3F35]">{v.name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {v.slug}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 bg-[#800020]/10 text-[#800020] text-xs font-bold rounded-full">
                      {v.Category?.name ||
                        categories.find((c) => c.id === v.category_id)?.name ||
                        "-"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-md">
                    {v.description || "-"}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openFormModal(v)}
                        className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          checkAndConfirmDelete(v);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

      {/* No Category Modal - Forces redirect */}
      {showNoCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <h2 className="text-lg font-bold">Category Required!</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600">
                Varieties are sub-types of Categories. You need to add at least
                one <strong>Category</strong> first before creating varieties.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                <strong>Example:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Category: "Banarasi Sarees"</li>
                  <li>• Varieties: "Katan", "Kadhwa", "Tissue"</li>
                </ul>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => navigate("/categories")}
                className="px-6 py-2.5 bg-[#800020] text-white font-bold rounded-lg flex items-center gap-2 hover:bg-[#6b001a] transition-colors"
              >
                Go to Categories
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-[#800020] to-[#a0152d] text-white rounded-t-2xl">
              <h2 className="text-lg font-bold">
                {editingVariety ? "Edit Variety" : "New Variety"}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {editingVariety
                  ? "Update variety details"
                  : "Add a new variety to a category"}
              </p>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  required
                  disabled={categories.length === 0}
                  className="w-full mt-1.5 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] outline-none transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {categories.length === 0
                      ? "No categories available"
                      : "Select a category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-red-500 mt-1.5">
                    Please create a category first before adding varieties.
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Variety Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full mt-1.5 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] outline-none transition-all"
                  placeholder="e.g., Katan, Kadhwa, Tissue"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full mt-1.5 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] outline-none transition-all resize-none"
                  placeholder="Describe this variety..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    submitting || !formData.name.trim() || !formData.category_id
                  }
                  className="px-5 py-2 bg-[#800020] text-white font-bold rounded-lg flex items-center gap-2 hover:bg-[#6b001a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingVariety ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unified Modal - Success/Error/Confirm */}
      {modal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={
              modal.type === "success" || modal.type === "error"
                ? closeModal
                : undefined
            }
          />
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div
              className={`px-6 py-4 border-b rounded-t-2xl ${
                modal.type === "success"
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : modal.type === "error"
                    ? "bg-gradient-to-r from-red-600 to-red-700"
                    : modal.type === "danger"
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : "bg-gradient-to-r from-[#800020] to-[#a0152d]"
              } text-white`}
            >
              <div className="flex items-center gap-3">
                {getIcon(modal.type === "confirm" ? "warning" : modal.type)}
                <h2 className="text-lg font-bold">{modal.title}</h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {modal.message}
              </p>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end gap-3 rounded-b-2xl">
              {(modal.type === "success" || modal.type === "error") && (
                <button
                  onClick={closeModal}
                  className={`px-6 py-2 font-bold rounded-lg transition-colors ${
                    modal.type === "success"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  OK
                </button>
              )}

              {modal.type === "confirm" && (
                <>
                  <button
                    onClick={modal.onCancel || closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      console.log(
                        "Confirm clicked, onConfirm:",
                        modal.onConfirm,
                      );
                      modal.onConfirm && modal.onConfirm();
                    }}
                    className="px-6 py-2 bg-[#800020] hover:bg-[#6b001a] text-white font-bold rounded-lg transition-colors"
                  >
                    Confirm
                  </button>
                </>
              )}

              {modal.type === "danger" && (
                <>
                  <button
                    onClick={() => {
                      console.log("Cancel clicked, onCancel:", modal.onCancel);
                      (modal.onCancel || closeModal)();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      console.log(
                        "Delete confirmed, onConfirm:",
                        modal.onConfirm,
                      );
                      modal.onConfirm && modal.onConfirm();
                    }}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
