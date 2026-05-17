import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Collection from "./pages/Collection/Collection";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";
import Auth from "./pages/Auth/Auth";
import About from "./pages/About/About";
import Testimonials from "./pages/Testimonials/Testimonials";
import Wishlist from "./pages/Wishlist/Wishlist";
import MyOrders from "./pages/MyOrders/MyOrders";
import Contact from "./pages/Contact/Contact";
import Feedback from "./pages/Feedback/Feedback";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy/RefundPolicy";
import ReturnExchange from "./pages/ReturnExchange/ReturnExchange";
import ShippingPolicy from "./pages/ShippingPolicy/ShippingPolicy";
import TermsConditions from "./pages/TermsConditions/TermsConditions";
import Profile from "./pages/Profile/Profile";
import Layout from "./layout/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { NotificationProvider } from "./context/NotificationContext";
import PreLoader from "./components/PreLoader/PreLoader";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PreLoader />;
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <div className="App">
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/collection" element={<Collection />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/wishlist"
                      element={
                        <ProtectedRoute>
                          <Wishlist />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-orders"
                      element={
                        <ProtectedRoute>
                          <MyOrders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/order-confirmation"
                      element={
                        <ProtectedRoute>
                          <OrderConfirmation />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/about" element={<About />} />
                    <Route
                      path="/contact"
                      element={
                        <ProtectedRoute>
                          <Contact />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/feedback"
                      element={
                        <ProtectedRoute>
                          <Feedback />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route
                      path="/return-exchange"
                      element={<ReturnExchange />}
                    />
                    <Route
                      path="/shipping-policy"
                      element={<ShippingPolicy />}
                    />
                    <Route
                      path="/terms-conditions"
                      element={<TermsConditions />}
                    />
                    <Route path="/login" element={<Auth />} />
                  </Route>
                </Routes>
              </div>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
