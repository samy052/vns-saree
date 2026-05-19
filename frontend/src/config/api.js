// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003';

export const CATALOG_CATEGORY_SLUGS = {
  banarasiSaree: 'banarasi-saree',
  suit: 'suit',
};

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  products: `${API_BASE_URL}/api/products`,
  categories: `${API_BASE_URL}/api/categories`,
  colors: `${API_BASE_URL}/api/colors`,
  materials: `${API_BASE_URL}/api/materials`,
  occasions: `${API_BASE_URL}/api/occasions`,
  varieties: `${API_BASE_URL}/api/varieties`,
  orders: `${API_BASE_URL}/api/orders`,
  coupons: `${API_BASE_URL}/api/coupons`,
  auth: `${API_BASE_URL}/api/auth`,
  cart: `${API_BASE_URL}/api/cart`,
  wishlist: `${API_BASE_URL}/api/wishlist`,
  feedback: `${API_BASE_URL}/api/feedback`,
  feedbackSubmit: `${API_BASE_URL}/api/feedback/submit`,
  varietiesByCategory: (category) =>
    `${API_BASE_URL}/api/varieties?category=${encodeURIComponent(category)}`,
  myOrders: (email) => `${API_BASE_URL}/api/orders/my/${encodeURIComponent(email)}`,
  trackOrder: (orderId) => `${API_BASE_URL}/api/orders/track/${orderId}`,
  shiprocket: `${API_BASE_URL}/api/shiprocket`,

  razorpay: {
    createOrder: `${API_BASE_URL}/api/razorpay/create-order`,
    verifyPayment: `${API_BASE_URL}/api/razorpay/verify-payment`,
  },
};

export default API_ENDPOINTS;
