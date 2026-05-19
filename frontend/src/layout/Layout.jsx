import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const isEmptyWishlistPage =
    location.pathname === "/wishlist" && wishlist.length === 0;
  const isUnauthedCartPage = location.pathname === "/cart" && !user;
  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/contact" ||
    isEmptyWishlistPage ||
    isUnauthedCartPage;
  const isHomePage = location.pathname === "/";

  return (
    <>
      <Header />
      <div
        className={`bk-layout-content ${
          isHomePage ? "bk-layout-content-home" : ""
        }`}
      >
        <Outlet />
      </div>
      {!hideFooter && <Footer />}
    </>
  );
};

export default Layout;
