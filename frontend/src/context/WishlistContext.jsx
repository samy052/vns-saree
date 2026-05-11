import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import { useNotification } from './NotificationContext';
import { API_ENDPOINTS } from '../config/api';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        setLoading(true);
        try {
          const res = await api.get(API_ENDPOINTS.wishlist);
          const formattedWishlist = res.data
            .filter(item => item.Product)
            .map(item => {
              const product = item.Product;
              const allImages = [...(product.images || []), ...(product.productImages || [])];
              return {
                ...product,
                wishlistItemId: item.id,
                price: product.selling_price || product.mrp_price || 0,
                image_url: allImages.find(img => img.is_cover || img.is_primary)?.url || allImages[0]?.url || product.image_url
              };
            });
          setWishlist(formattedWishlist);
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setWishlist([]);
      }
    };

    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user || !product || processingIds.has(product.id)) return false;
    
    const pId = Number(product.id);
    const currentlyIn = wishlist.some(item => Number(item.id) === pId);
    
    // 1. Optimistic Update
    if (currentlyIn) {
      setWishlist(prev => prev.filter(item => Number(item.id) !== pId));
    } else {
      setWishlist(prev => [...prev, product]);
    }

    setProcessingIds(prev => new Set(prev).add(pId));

    try {
      const res = await api.post(`${API_ENDPOINTS.wishlist}/toggle`, { productId: pId });
      const isAdded = res.data.added === true;
      
      // Show notification directly from context based on backend response
      if (isAdded) {
        showNotification("Added to wishlist!");
      } else {
        showNotification("Removed from wishlist!");
      }

      // 2. Refresh fresh data
      const refreshRes = await api.get(API_ENDPOINTS.wishlist);
      const formattedWishlist = refreshRes.data
        .filter(item => item.Product)
        .map(item => {
          const p = item.Product;
          const allImages = [...(p.images || []), ...(p.productImages || [])];
          return {
            ...p,
            wishlistItemId: item.id,
            price: p.selling_price || p.mrp_price || 0,
            image_url: allImages.find(img => img.is_cover || img.is_primary)?.url || allImages[0]?.url || p.image_url
          };
        });
      
      setWishlist(formattedWishlist);
      return isAdded;
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showNotification("Failed to update wishlist", "error");
      return false;
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(pId);
        return next;
      });
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      await api.delete(`${API_ENDPOINTS.wishlist}/${productId}`);
      setWishlist(prev => prev.filter(item => item.id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => Number(item.id) === Number(productId));
  };
  
  const getWishlistCount = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
      getWishlistCount,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
