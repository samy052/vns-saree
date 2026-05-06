import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useNotification } from "../../context/NotificationContext";
import { API_ENDPOINTS } from "../../config/api";
import "./Collection.css";

const SECTION_SIZE = 20; // products shown per pagination page
const BATCH_SIZE = 4; // products loaded per scroll trigger
const BATCHES_PER_SECTION = SECTION_SIZE / BATCH_SIZE; // = 5

const Collection = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [batchIndex, setBatchIndex] = useState(1);
  const [sectionPage, setSectionPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sectionFullyLoaded, setSectionFullyLoaded] = useState(false);

  const [filters, setFilters] = useState({
    category: [],
    material: [],
    color: [],
    minPrice: 0,
    maxPrice: 200000,
    sortBy: "newest",
    search: searchParams.get("search") || "",
  });

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setFilters((prev) => ({ ...prev, search: urlSearch }));
  }, [searchParams]);

  const [activeDropdown, setActiveDropdown] = useState(null);

  const totalPaginationPages = Math.ceil(totalItems / SECTION_SIZE);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, matRes, colRes] = await Promise.all([
          fetch(API_ENDPOINTS.categories),
          fetch(API_ENDPOINTS.materials),
          fetch(API_ENDPOINTS.colors),
        ]);
        const [catData, matData, colData] = await Promise.all([
          catRes.json(),
          matRes.json(),
          colRes.json(),
        ]);
        setCategories(catData);
        setMaterials(matData);
        setColors(colData);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };
    fetchMetadata();
  }, []);

  const fetchBatch = async (sPage, bIndex, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const apiPage = (sPage - 1) * BATCHES_PER_SECTION + bIndex;
      const params = new URLSearchParams();
      params.append("paginated", "true");
      params.append("page", apiPage);
      params.append("pageSize", BATCH_SIZE);
      if (filters.category.length)
        params.append("category", filters.category.join(","));
      if (filters.material.length)
        params.append("material", filters.material.join(","));
      if (filters.color.length) params.append("color", filters.color.join(","));
      if (filters.minPrice > 0) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice < 200000)
        params.append("maxPrice", filters.maxPrice);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.search && filters.search.trim())
        params.append("search", filters.search.trim());

      const res = await fetch(`${API_ENDPOINTS.products}?${params.toString()}`);
      const data = await res.json();

      const newItems = data.items || [];
      const total = data.meta?.totalItems ?? 0;
      setTotalItems(total);

      if (isLoadMore) {
        setProducts((prev) => [...prev, ...newItems]);
      } else {
        setProducts(newItems);
      }

      const loadedSoFar = (bIndex - 1) * BATCH_SIZE + newItems.length;
      const sectionLimit = Math.min(
        SECTION_SIZE,
        total - (sPage - 1) * SECTION_SIZE,
      );
      const done =
        bIndex >= BATCHES_PER_SECTION ||
        loadedSoFar >= sectionLimit ||
        newItems.length < BATCH_SIZE;
      setSectionFullyLoaded(done);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setSectionPage(1);
    setBatchIndex(1);
    setSectionFullyLoaded(false);
    const timeoutId = setTimeout(() => {
      fetchBatch(1, 1, false);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || loadingMore || sectionFullyLoaded) return;
      if (
        window.innerHeight + document.documentElement.scrollTop + 800 >=
        document.documentElement.offsetHeight
      ) {
        const nextBatch = batchIndex + 1;
        setBatchIndex(nextBatch);
        fetchBatch(sectionPage, nextBatch, true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, loadingMore, sectionFullyLoaded, batchIndex, sectionPage]);

  const handlePaginationClick = (pageNum) => {
    if (pageNum === sectionPage) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSectionPage(pageNum);
    setBatchIndex(1);
    setSectionFullyLoaded(false);
    setProducts([]);
    setTimeout(() => fetchBatch(pageNum, 1, false), 400);
  };

  const handleCheckboxChange = (type, id) => {
    setFilters((prev) => {
      const current = prev[type];
      const updated = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      return { ...prev, [type]: updated };
    });
  };

  const handlePriceChange = (e) =>
    setFilters((prev) => ({ ...prev, maxPrice: e.target.value }));
  const handleSortChange = (e) =>
    setFilters((prev) => ({ ...prev, sortBy: e.target.value }));

  const getCoverImage = (product) => {
    const allImages = [
      ...(product.images || []),
      ...(product.productImages || []),
    ];
    if (allImages.length === 0) return product.image_url || "";
    const cover =
      allImages.find((img) => img.is_cover || img.is_primary) || allImages[0];
    return cover.url;
  };

  const toggleDropdown = (dropdown) =>
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));

  const handleWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showNotification("Please login first", "info");
      navigate("/login");
      return;
    }
    await toggleWishlist(product);
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#F5F1E8]"
      onClick={() => setActiveDropdown(null)}
    >
      <main className="w-full px-4 lg:px-12 py-8">
        <nav className="flex text-[10px] uppercase tracking-widest text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#800020]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#800020] font-bold">Collections</span>
        </nav>

        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D4AF37]/20 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D2817] mb-1 uppercase brand-font tracking-widest">
              Our Products
            </h1>
            <p className="text-gray-600 text-base">
              Beautiful sarees for every occasion.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest font-bold text-gray-400">
              Sort By:
            </span>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="bg-white border border-[#D4AF37]/30 rounded-full px-6 py-2 text-sm font-bold focus:outline-none focus:border-[#800020] appearance-none cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8 sticky top-4 z-40 bg-[#F5F1E8]/95 backdrop-blur-md p-3 rounded-xl shadow-sm border border-[#D4AF37]/20">
          <span className="text-xs uppercase tracking-widest font-bold text-[#800020] mr-2">
            Filters:
          </span>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => toggleDropdown("category")}
              className={`px-4 py-1.5 border rounded-full text-xs font-bold uppercase tracking-wider transition-all ${filters.category.length > 0 ? "bg-[#800020] text-white" : "bg-white text-gray-700 border-[#D4AF37]/30"}`}
            >
              Category ▾
            </button>
            {activeDropdown === "category" && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-2xl rounded-lg p-4 z-50 border border-[#D4AF37]/20 max-h-64 overflow-y-auto">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.category.includes(cat.id)}
                      onChange={() => handleCheckboxChange("category", cat.id)}
                      className="w-4 h-4 text-[#800020]"
                    />
                    <span className="ml-3 text-sm">{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => toggleDropdown("material")}
              className={`px-6 py-2 border rounded-full text-sm font-bold uppercase tracking-wider transition-all ${filters.material.length > 0 ? "bg-[#800020] text-white" : "bg-white text-gray-700 border-[#D4AF37]/30"}`}
            >
              Fabric ▾
            </button>
            {activeDropdown === "material" && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-2xl rounded-lg p-4 z-50 border border-[#D4AF37]/20 max-h-64 overflow-y-auto">
                {materials.map((mat) => (
                  <label
                    key={mat.id}
                    className="flex items-center mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.material.includes(mat.id)}
                      onChange={() => handleCheckboxChange("material", mat.id)}
                      className="w-4 h-4 text-[#800020]"
                    />
                    <span className="ml-3 text-sm">{mat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => toggleDropdown("color")}
              className={`px-6 py-2 border rounded-full text-sm font-bold uppercase tracking-wider transition-all ${filters.color.length > 0 ? "bg-[#800020] text-white" : "bg-white text-gray-700 border-[#D4AF37]/30"}`}
            >
              Color ▾
            </button>
            {activeDropdown === "color" && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-2xl rounded-lg p-4 z-50 border border-[#D4AF37]/20 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {colors.map((col) => (
                    <label
                      key={col.id}
                      className="flex items-center mb-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.color.includes(col.id)}
                        onChange={() => handleCheckboxChange("color", col.id)}
                        className="w-4 h-4 text-[#800020]"
                      />
                      <div
                        className="w-4 h-4 rounded-full ml-2 border border-gray-200"
                        style={{ backgroundColor: col.hex_code }}
                      ></div>
                      <span className="ml-2 text-xs">{col.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative flex items-center bg-white border border-[#D4AF37]/30 rounded-full px-4 py-1.5 gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Max Price: ₹{Number(filters.maxPrice).toLocaleString()}
            </span>
            <input
              type="range"
              min="0"
              max="200000"
              step="5000"
              value={filters.maxPrice}
              onChange={handlePriceChange}
              className="w-32 accent-[#800020]"
            />
          </div>

          {(filters.category.length > 0 ||
            filters.material.length > 0 ||
            filters.color.length > 0) && (
            <button
              onClick={() =>
                setFilters({
                  category: [],
                  material: [],
                  color: [],
                  minPrice: 0,
                  maxPrice: 200000,
                  sortBy: "newest",
                  search: "",
                })
              }
              className="text-[10px] font-bold uppercase tracking-widest text-[#800020] hover:underline underline-offset-4"
            >
              Reset All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton Loading Cards
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-4 bg-gradient-to-r from-[#f0e6d8] via-[#e8dcc8] to-[#f0e6d8] shimmer-bg"></div>
                  <div className="h-5 bg-gradient-to-r from-[#f0e6d8] via-[#e8dcc8] to-[#f0e6d8] shimmer-bg rounded mb-2 w-3/4 mx-auto"></div>
                  <div className="h-3 bg-gradient-to-r from-[#f0e6d8] via-[#e8dcc8] to-[#f0e6d8] shimmer-bg rounded mb-3 w-1/2 mx-auto"></div>
                  <div className="h-8 bg-gradient-to-r from-[#f0e6d8] via-[#e8dcc8] to-[#f0e6d8] shimmer-bg rounded w-1/3 mx-auto"></div>
                </div>
              ))}
            </>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-600 text-lg">No products found.</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="saree-card-3d h-full">
                <div className="saree-card-inner group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[#D4AF37]/10 overflow-hidden">
                  <Link
                    to={`/product/${product.slug}`}
                    className="block relative overflow-hidden aspect-[3/4]"
                  >
                    <img
                      src={getCoverImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Badges */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      {product.is_new_arrival && (
                        <span className="bg-[#800020] text-[#D4AF37] text-[10px] font-bold px-2 py-1 rounded-sm animate-pulse uppercase tracking-tighter">
                          New Arrival
                        </span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${isInWishlist(product.id) ? "bg-[#800020] text-white" : "bg-white/90 text-[#800020] hover:bg-[#800020] hover:text-white"}`}
                        onClick={(e) => handleWishlist(e, product)}
                      >
                        <iconify-icon
                          icon={
                            isInWishlist(product.id)
                              ? "mdi:heart"
                              : "lucide:heart"
                          }
                        ></iconify-icon>
                      </button>
                    </div>
                  </Link>
                  <div className="p-5 text-center flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-[#800020] mb-1 uppercase brand-font tracking-wider truncate">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">
                      {product.Material?.name || "Pure Silk"}
                    </p>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-1">
                      {product.short_description || ""}
                    </p>
                    <div className="mt-auto">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <span className="text-xl font-black text-[#3D2817]">
                          ₹
                          {Number(product.selling_price).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                        {Number(product.mrp_price || product.mrp) >
                          Number(product.selling_price) && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹
                            {Number(
                              product.mrp_price || product.mrp,
                            ).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/product/${product.slug}`}
                        className="block w-full py-3 bg-gray-50 border border-[#800020]/20 text-[#800020] font-bold text-xs uppercase tracking-[0.2em] group-hover:bg-[#800020] group-hover:text-[#D4AF37] transition-all rounded-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPaginationPages > 1 && (
          <div className="mt-20 flex justify-center items-center space-x-4">
            <button
              disabled={sectionPage === 1}
              onClick={() => handlePaginationClick(sectionPage - 1)}
              className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#800020] hover:bg-[#800020] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#800020]"
            >
              <iconify-icon icon="lucide:arrow-left"></iconify-icon>
            </button>
            <div className="flex items-center space-x-2">
              {[...Array(totalPaginationPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePaginationClick(i + 1)}
                  className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${sectionPage === i + 1 ? "bg-[#800020] text-[#D4AF37] shadow-lg" : "text-gray-400 hover:text-[#800020]"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={sectionPage === totalPaginationPages}
              onClick={() => handlePaginationClick(sectionPage + 1)}
              className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#800020] hover:bg-[#800020] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#800020]"
            >
              <iconify-icon icon="lucide:arrow-right"></iconify-icon>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Collection;
