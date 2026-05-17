import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import { API_ENDPOINTS } from '../config/api';
import { useNotification } from './NotificationContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const { showNotification } = useNotification();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Coupon States shared across Bag and Checkout
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [useWallet, setUseWallet] = useState(false);

  // Load cart from backend when user changes
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        setLoading(true);
        try {
          const profileRes = await api.get(`${API_ENDPOINTS.auth}/me`);
          if (profileRes.data && profileRes.data.user) {
            const latestUser = profileRes.data.user;
            setUser(latestUser);
            if (localStorage.getItem("customer")) {
              localStorage.setItem("customer", JSON.stringify(latestUser));
            } else if (sessionStorage.getItem("customer")) {
              sessionStorage.setItem("customer", JSON.stringify(latestUser));
            }
            if (localStorage.getItem("user")) {
              localStorage.setItem("user", JSON.stringify(latestUser));
            } else if (sessionStorage.getItem("user")) {
              sessionStorage.setItem("user", JSON.stringify(latestUser));
            }
          }
        } catch (error) {
          console.error("Error fetching latest profile:", error);
        }

        try {
          const res = await api.get(API_ENDPOINTS.cart);
          const formattedCart = res.data.map(item => {
            const product = item.Product;
            if (!product) return null;
            const price = product.selling_price || product.mrp_price || 0;
            const allImages = [...(product.images || []), ...(product.productImages || [])];
            const colorImage = allImages.find(img => img.color_id === item.colorId);
            const image_url = colorImage?.url || allImages.find(img => img.is_cover || img.is_primary)?.url || allImages[0]?.url || product.image_url;
            return {
              ...product,
              cartItemId: item.id,
              quantity: item.quantity,
              colorId: item.colorId,
              price,
              image_url
            };
          }).filter(i => i);
          setCart(formattedCart);
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setCart([]);
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setUseWallet(false);
      }
    };

    fetchCart();
  }, [user]);

  const addToCart = async (product, quantity = 1, colorId = null) => {
    if (!user || !product) return false;
    try {
      await api.post(API_ENDPOINTS.cart, { productId: product.id, quantity, colorId });
      const res = await api.get(API_ENDPOINTS.cart);
      const formattedCart = res.data.map(item => {
        const p = item.Product;
        if (!p) return null;
        const allImages = [...(p.images || []), ...(p.productImages || [])];
        const colorImage = allImages.find(img => img.color_id === item.colorId);
        return {
          ...p,
          cartItemId: item.id,
          quantity: item.quantity,
          colorId: item.colorId,
          price: p.selling_price || p.mrp_price || 0,
          image_url: colorImage?.url || allImages.find(img => img.is_cover || img.is_primary)?.url || allImages[0]?.url || p.image_url
        };
      }).filter(i => i);
      setCart(formattedCart);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add to bag";
      return { success: false, message: msg };
    }
  };

  const removeFromCart = async (productId, colorId = null) => {
    if (!user) return;
    try {
      setCart(prev => prev.filter(item => !(item.id === productId && item.colorId === colorId)));
      await api.delete(`${API_ENDPOINTS.cart}/${productId}`, { params: { colorId } });
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (productId, quantity, colorId = null) => {
    if (!user || quantity < 1) return;
    try {
      await api.put(`${API_ENDPOINTS.cart}/quantity`, { productId, quantity, colorId });
      const res = await api.get(API_ENDPOINTS.cart);
      const formattedCart = res.data.map(item => {
        const p = item.Product;
        if (!p) return null;
        const allImages = [...(p.images || []), ...(p.productImages || [])];
        const colorImage = allImages.find(img => img.color_id === item.colorId);
        return {
          ...p,
          cartItemId: item.id,
          quantity: item.quantity,
          colorId: item.colorId,
          price: p.selling_price || p.mrp_price || 0,
          image_url: colorImage?.url || allImages.find(img => img.is_cover || img.is_primary)?.url || allImages[0]?.url || p.image_url
        };
      }).filter(i => i);
      setCart(formattedCart);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Update failed";
      return { success: false, message: msg };
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      setCart([]);
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setUseWallet(false);
      await api.delete(API_ENDPOINTS.cart);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getSubtotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  // Coupon Validation Logic moved to Context
  const applyCoupon = useCallback((coupon) => {
    const currentSubtotal = getSubtotal();
    
    // 1. Min Purchase Check
    if (currentSubtotal < Number(coupon.min_purchase_amount)) {
      showNotification(`Add ₹${(Number(coupon.min_purchase_amount) - currentSubtotal).toLocaleString()} more to use this coupon`, "info");
      return false;
    }

    // 2. Applicability Check
    let applicableSubtotal = 0;
    const hasRestrictions = coupon.applicable_product_id?.length || 
                           coupon.applicable_variety_id?.length || 
                           coupon.applicable_category_id?.length;

    if (!hasRestrictions) {
      applicableSubtotal = currentSubtotal;
    } else {
      cart.forEach(item => {
        let isMatch = false;
        if (coupon.applicable_product_id?.includes(item.id)) isMatch = true;
        if (coupon.applicable_variety_id?.includes(item.variety_id)) isMatch = true;
        if (coupon.applicable_category_id?.includes(item.category_id)) isMatch = true;
        
        if (isMatch) applicableSubtotal += (item.price * item.quantity);
      });
    }

    if (applicableSubtotal === 0 && hasRestrictions) {
      showNotification("This coupon is not valid for the items in your bag.", "warning");
      return false;
    }

    // 3. Calculate Discount
    let discount;
    if (coupon.discount_type === "percentage") {
      discount = (applicableSubtotal * Number(coupon.discount_percent)) / 100;
      if (coupon.max_discount_amount && discount > Number(coupon.max_discount_amount)) {
        discount = Number(coupon.max_discount_amount);
      }
    } else {
      discount = Number(coupon.discount_amount);
    }

    setDiscountAmount(discount);
    setAppliedCoupon(coupon);
    showNotification(`✨ Hurray! Coupon ${coupon.code} applied. You saved ₹${discount.toLocaleString()}! 🎉`, "success");
    return true;
  }, [cart, getSubtotal, showNotification]);

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    showNotification("Coupon removed", "info");
  };

  const getCartCount = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const subtotal = getSubtotal();
  const walletDiscountAmount = useWallet && user
    ? Math.min(parseFloat(user.wallet_balance) || 0, subtotal - discountAmount)
    : 0;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getSubtotal,
      getCartCount,
      appliedCoupon,
      discountAmount,
      applyCoupon,
      removeCoupon,
      useWallet,
      setUseWallet,
      walletDiscountAmount,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};
