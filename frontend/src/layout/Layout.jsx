import { Icon } from "@iconify/react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import "./Layout.css";

const WHATSAPP_NUMBER = "916307715455";
const WHATSAPP_TEXT = encodeURIComponent("Hi Banarasi Kala, I need quick help.");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;

const WhatsappFloatingSupport = ({ hidden = false }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!hidden) setIsVisible(true);
  }, [hidden]);

  useEffect(() => {
    if (hidden || isVisible) return undefined;

    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 60000);

    return () => window.clearTimeout(timer);
  }, [hidden, isVisible]);

  if (hidden || !isVisible) return null;

  return (
    <aside className="bk-whatsapp-float" aria-label="WhatsApp support">
      <button
        type="button"
        className="bk-whatsapp-close"
        onClick={() => setIsVisible(false)}
        aria-label="Close WhatsApp support"
      >
        <Icon icon="lucide:x" />
      </button>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="bk-whatsapp-link"
        aria-label="Chat with Banarasi Kala on WhatsApp"
      >
        <span className="bk-whatsapp-icon">
          <Icon icon="logos:whatsapp-icon" />
        </span>
        <span className="bk-whatsapp-copy">
          <strong>Need quick help?</strong>
          <small>Chat on WhatsApp</small>
        </span>
      </a>
    </aside>
  );
};

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const footerlessAuthPages = ["/cart", "/wishlist", "/contact", "/feedback"];
  const hideFooter =
    location.pathname === "/login" ||
    (!user && footerlessAuthPages.includes(location.pathname));
  const isHomePage = location.pathname === "/";
  const hideWhatsapp = location.pathname === "/contact";
  const routeRefreshKey = [
    location.pathname,
    location.search,
    location.hash,
    location.state?.refreshKey || "",
  ].join("|");

  return (
    <>
      <Header />
      <div
        className={`bk-layout-content ${
          isHomePage ? "bk-layout-content-home" : ""
        }`}
      >
        <Outlet key={routeRefreshKey} />
      </div>
      <WhatsappFloatingSupport hidden={hideWhatsapp} />
      {!hideFooter && <Footer />}
    </>
  );
};

export default Layout;
