import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Collection from "./Collection/Collection";
import ProductDetail from "./ProductDetail/ProductDetail";
import Cart from "./Cart/Cart";
import Checkout from "./Checkout/Checkout";
import OrderConfirmation from "./OrderConfirmation/OrderConfirmation";
import Auth from "./Auth/Auth";
import Dashboard from "./Dashboard/Dashboard";
import About from "./About/About";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
