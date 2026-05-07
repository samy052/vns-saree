// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5003";

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  products: `${API_BASE_URL}/api/products`,
  categories: `${API_BASE_URL}/api/categories`,
  colors: `${API_BASE_URL}/api/colors`,
  materials: `${API_BASE_URL}/api/materials`,
  varieties: `${API_BASE_URL}/api/varieties`,
  occasions: `${API_BASE_URL}/api/occasions`,
  orders: `${API_BASE_URL}/api/orders`,
  coupons: `${API_BASE_URL}/api/coupons`,
  feedback: `${API_BASE_URL}/api/feedback`,
  auth: `${API_BASE_URL}/api/auth`,
};

export default API_ENDPOINTS;
