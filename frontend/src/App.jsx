import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { NotificationProvider } from "./context/NotificationContext";
import PreLoader from "./components/PreLoader/PreLoader";
import headerBackground from "./assets/header_backgroung.png";
import "./App.css";

const Home = lazy(() => import("./pages/Home/Home"));
const Collection = lazy(() => import("./pages/Collection/Collection"));
const ProductDetail = lazy(() => import("./pages/ProductDetail/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation/OrderConfirmation"));
const Auth = lazy(() => import("./pages/Auth/Auth"));
const About = lazy(() => import("./pages/About/About"));
const Testimonials = lazy(() => import("./pages/Testimonials/Testimonials"));
const Wishlist = lazy(() => import("./pages/Wishlist/Wishlist"));
const MyOrders = lazy(() => import("./pages/MyOrders/MyOrders"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Feedback = lazy(() => import("./pages/Feedback/Feedback"));



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
              <div
                className="App"
                style={{
                  "--bk-section-bg": `url(${headerBackground})`,
                  "--bk-header-bg": `url(${headerBackground})`,
                }}
              >
                <Suspense fallback={<PreLoader />}>
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
                      <Route path="/login" element={<Auth />} />
                    </Route>
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
