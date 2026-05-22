import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { firebaseAuth, isFirebaseConfigured } from "../config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

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
      const data = error.response?.data;
      const err = new Error(data?.message || "Login failed");
      err.code = data?.code;
      err.phone = data?.phone;
      throw err;
    }
  };

  const verifyPhoneAndLogin = async ({ email, password, keepLoggedIn, firebaseIdToken }) => {
    const response = await axios.post(`${API_ENDPOINTS.auth}/verify-phone-login`, {
      email,
      password,
      firebase_id_token: firebaseIdToken,
    });

    const customer = response.data.customer || response.data.user;
    const { accessToken, refreshToken } = response.data;

    setUser(customer);

    const storage = keepLoggedIn ? localStorage : sessionStorage;
    storage.setItem('customer', JSON.stringify(customer));
    storage.setItem('accessToken', accessToken);
    storage.setItem('refreshToken', refreshToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    return customer;
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

  const sendPhoneOtp = async (phoneNumber) => {
    if (!phoneNumber) throw new Error("Phone number is required");
    if (!isFirebaseConfigured || !firebaseAuth) {
      throw new Error(
        "Phone OTP is not configured. Please set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID.",
      );
    }

    // Ensure a single verifier instance.
    if (!window.__vnsRecaptchaVerifier) {
      window.__vnsRecaptchaVerifier = new RecaptchaVerifier(
        firebaseAuth,
        "firebase-recaptcha",
        { size: "invisible" },
      );
    }

    const verifier = window.__vnsRecaptchaVerifier;
    const confirmation = await signInWithPhoneNumber(firebaseAuth, phoneNumber, verifier);
    return confirmation;
  };

  const verifyPhoneOtpAndGetIdToken = async ({ confirmation, otp }) => {
    if (!confirmation) throw new Error("OTP session missing");
    if (!otp) throw new Error("OTP is required");
    const result = await confirmation.confirm(otp);
    const idToken = await result.user.getIdToken();
    return idToken;
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
    <AuthContext.Provider value={{ user, login, signup, logout, loading, sendPhoneOtp, verifyPhoneOtpAndGetIdToken, verifyPhoneAndLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
