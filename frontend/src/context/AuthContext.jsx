import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem('customer') ||
      sessionStorage.getItem('customer') ||
      localStorage.getItem('user') ||
      sessionStorage.getItem('user');
    const token =
      localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password, keepLoggedIn) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.auth}/login`, { email, password });
      const customer = response.data.customer || response.data.user;
      const { accessToken, refreshToken } = response.data;

      setUser(customer);
      
      const storage = keepLoggedIn ? localStorage : sessionStorage;
      storage.setItem('customer', JSON.stringify(customer));
      storage.setItem('accessToken', accessToken);
      storage.setItem('refreshToken', refreshToken);
      
      // Also set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      return customer;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.auth}/register`, userData);
      const customer = response.data.customer || response.data.user;
      const { accessToken, refreshToken } = response.data;

      setUser(customer);
      localStorage.setItem('customer', JSON.stringify(customer));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      return customer;
    } catch (error) {
      throw error.response?.data?.message || 'Signup failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('customer');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('customer');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
