import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useNotification } from "../../context/NotificationContext";
import { API_ENDPOINTS } from "../../config/api";
import "./Collection.css";

const PAGE_SIZE = 40;

const getIdListParam = (params, key) =>
  (params.get(key) || "")
    .split(",")
    .map((value) => Number(value))
    .filter(Number.isFinite);

const Collection = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);



  const [filters, setFilters] = useState({
    variety: [],
    occasion: [],
    material: [],
    color: [],
    specialCollection: false,
    minPrice: 0,
    maxPrice: 200000,
    sortBy: "newest",
    search: searchParams.get("search") || "",
  });

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlVarieties = getIdListParam(searchParams, "variety");
    setFilters((prev) => ({
      ...prev,
      search: urlSearch,
      variety: urlVarieties,
    }));
    setCurrentPage(1);
  }, [searchParams]);

  const totalPaginationPages = Math.ceil(totalItems / PAGE_SIZE);


  // Fetch Metadata (Categories, Materials, Colors, Varieties)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [occRes, matRes, colRes, varRes] = await Promise.all([
          fetch(API_ENDPOINTS.occasions),
          fetch(API_ENDPOINTS.materials),
          fetch(API_ENDPOINTS.colors),
          fetch(API_ENDPOINTS.varieties),
        ]);
        const [occData, matData, colData, varData] = await Promise.all([
          occRes.json(),
          matRes.json(),
          colRes.json(),
          varRes.json(),
        ]);
        setOccasions(occData);
        setMaterials(matData);
        setColors(colData);
        setVarieties(varData);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products
  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("paginated", "true");
      params.append("page", page);
      params.append("pageSize", PAGE_SIZE);
      
      if (filters.variety.length) params.append("variety", filters.variety.join(","));
      if (filters.occasion.length) params.append("occasion", filters.occasion.join(","));
      if (filters.material.length) params.append("material", filters.material.join(","));
      if (filters.color.length) params.append("color", filters.color.join(","));
      if (filters.specialCollection) params.append("specialCollection", "true");
      if (filters.minPrice > 0) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice < 200000) params.append("maxPrice", filters.maxPrice);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.search && filters.search.trim()) params.append("search", filters.search.trim());

      const res = await fetch(`${API_ENDPOINTS.products}?${params.toString()}`);
      const data = await res.json();

      setProducts(data.items || []);
      setTotalItems(data.meta?.totalItems ?? 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reveal Observer for Fade-in Animation
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll(".reveal-card:not(.visible)");
    cards.forEach((card) => revealObserver.observe(card));

    return () => revealObserver.disconnect();
  }, [products, loading]);


  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1);
  }, [filters]);

  useEffect(() => {
    fetchProducts(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);



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

  const calculateDiscount = (mrp, selling) => {
    const m = Number(mrp);
    const s = Number(selling);
    if (!m || !s || m <= s) return 0;
    return Math.round(((m - s) / m) * 100);
  };

  const clearAllFilters = () => {
    setFilters({
      variety: [],
      occasion: [],
      material: [],
      color: [],
      specialCollection: false,
      minPrice: 0,
      maxPrice: 200000,
      sortBy: "newest",
      search: "",
    });
  };

  const getCoverImage = (product) => {
    const allImages = [...(product.images || []), ...(product.productImages || [])];
    if (allImages.length === 0) return product.image_url || "https://via.placeholder.com/400x600?text=VNS+Saree";
    const cover = allImages.find((img) => img && (img.is_cover || img.is_primary)) || allImages[0];
    if (typeof cover === 'string') return cover;
    return cover?.url || "https://via.placeholder.com/400x600?text=VNS+Saree";
  };

  const handleWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showNotification("Please login first", "info");
      navigate("/wishlist");
      return;
    }
    await toggleWishlist(product);
  };

  return (
    <div className="collection-container">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="mx-2">/</span>
        <span>Clothing</span>
        <span className="mx-2">/</span>
        <span className="font-bold">Sarees</span>
      </nav>

      <div className="page-header">
        <h1 className="page-title">Sarees For Women</h1>
        <span className="item-count">- {totalItems} items</span>
      </div>

      <div className="main-content">
        <aside className="filters-sidebar">
          <div className="sidebar-header">
            <h2>FILTERS</h2>
            {(filters.variety.length > 0 ||
              filters.occasion.length > 0 ||
              filters.material.length > 0 ||
              filters.color.length > 0 ||
              filters.specialCollection) && (
                <button className="clear-btn" onClick={clearAllFilters}>
                  Clear All
                </button>
              )}
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Variety</h3>
            <div className="filter-list">
              {varieties.map((v) => (
                <label key={v.id} className="filter-item">
                  <input
                    type="checkbox"
                    checked={filters.variety.includes(v.id)}
                    onChange={() => handleCheckboxChange("variety", v.id)}
                  />
                  {v.name}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Collections</h3>
            <div className="filter-list">
              <label className="filter-item">
                <input
                  type="checkbox"
                  checked={filters.specialCollection}
                  onChange={() => setFilters(prev => ({ ...prev, specialCollection: !prev.specialCollection }))}
                />
                Special Collection
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Occasions</h3>
            <div className="filter-list">
              {occasions.map((occ) => (
                <label key={occ.id} className="filter-item">
                  <input
                    type="checkbox"
                    checked={filters.occasion.includes(occ.id)}
                    onChange={() => handleCheckboxChange("occasion", occ.id)}
                  />
                  {occ.name}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Fabric</h3>
            <div className="filter-list">
              {materials.map((mat) => (
                <label key={mat.id} className="filter-item">
                  <input
                    type="checkbox"
                    checked={filters.material.includes(mat.id)}
                    onChange={() => handleCheckboxChange("material", mat.id)}
                  />
                  {mat.name}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Color</h3>
            <div className="filter-list">
              {colors.map((col) => (
                <label key={col.id} className="filter-item">
                  <input
                    type="checkbox"
                    checked={filters.color.includes(col.id)}
                    onChange={() => handleCheckboxChange("color", col.id)}
                  />
                  <svg className="color-swatch" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="7.5" fill={col.hex_code || "#cccccc"} />
                  </svg>
                  {col.name}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Price</h3>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="200000"
                step="1000"
                value={filters.maxPrice}
                onChange={handlePriceChange}
                className="w-full accent-[#800020]"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500 font-bold">
                <span>₹0</span>
                <span>₹{Number(filters.maxPrice).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="product-listing">
          <div className="listing-controls">
            <div className="sort-container">
              <select value={filters.sortBy} onChange={handleSortChange}>
                <option value="newest">Sort by: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>

          <div className="product-grid">
            {loading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="product-card">
                  <div className="card-img-container skeleton"></div>
                  <div className="card-details">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-description"></div>
                    <div className="skeleton skeleton-price"></div>
                  </div>
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-500">
                No products found matching your filters.
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="product-card reveal-card">

                  <Link
                    to={`/product/${product.slug}`}
                    className="card-img-container"
                  >
                    <img
                      src={getCoverImage(product)}
                      alt={product.name}
                      className="card-img"
                    />
                    <div className="wishlist-overlay">
                      <button
                        className={`wishlist-btn ${isInWishlist(product.id) ? "active" : ""}`}
                        onClick={(e) => handleWishlist(e, product)}
                      >
                        <Icon
                          className="wishlist-icon"
                          icon={
                            isInWishlist(product.id)
                              ? "mdi:heart"
                              : "lucide:heart"
                          }
                        ></Icon>
                        {isInWishlist(product.id) ? "WISHLISTED" : "WISHLIST"}
                      </button>
                    </div>
                  </Link>

                  <div className="card-details">
                    {product.occasion?.name && (
                      <span className="product-occasion-badge">
                        {product.occasion.name}
                      </span>
                    )}
                    <p className="product-title" title={product.name || "Premium Saree"}>
                      {product.name || "Handcrafted Banarasi Saree"}
                    </p>
                    {product.short_description && (
                      <p className="product-short-desc">
                        {product.short_description}
                      </p>
                    )}
                    <div className="price-container">
                      <span className="selling-price">
                        ₹{Number(product.selling_price || 0).toLocaleString("en-IN")}
                      </span>
                      {Number(product.mrp_price || product.mrp || 0) > Number(product.selling_price || 0) && (
                        <>
                          <span className="mrp-price">
                            ₹{Number(product.mrp_price || product.mrp).toLocaleString("en-IN")}
                          </span>
                          <span className="discount-text">
                            ({calculateDiscount(product.mrp_price || product.mrp, product.selling_price)}% OFF)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPaginationPages > 1 && (
            <div className="pagination">

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="page-btn"
              >
                <Icon icon="lucide:chevron-left" className="mr-1"></Icon>
                Prev
              </button>
              {[...Array(totalPaginationPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPaginationPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="page-btn"
              >
                Next
                <Icon icon="lucide:chevron-right" className="ml-1"></Icon>
              </button>
            </div>
          )}
          {/* End of product listing */}
        </section>
      </div>

    </div>
  );
};

export default Collection;

