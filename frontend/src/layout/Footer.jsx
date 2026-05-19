import { Link } from "react-router-dom";
import {
  ChevronRight,
  Mail,
  MapPin,
  Send,
  Phone,
} from "lucide-react";
import logo from "../assets/vertical_logo.png";
import footerBackground from "../assets/header_backgroung.png";
import "./Footer.css";

const quickLinks = [
  ["Home", "/"],
  ["Sarees", "/collection"],
  ["Collections", "/collection"],
  ["New Arrivals", "/collection?sort=new"],
  ["Best Sellers", "/collection?sort=popular"],
  ["About Us", "/about"],
  ["Contact Us", "/contact"],
];

const supportLinks = [
  ["FAQs", "/contact"],
  ["Track Order", "/my-orders"],
  ["Shipping Policy", "/shipping-policy"],
  ["Return & Exchange", "/return-exchange"],
  ["Cancellation Policy", "/refund-policy"],
  ["Size Guide", "/collection"],
  ["Care Instructions", "/about"],
];

const policyLinks = [
  ["Terms & Conditions", "/terms-conditions"],
  ["Privacy Policy", "/privacy-policy"],
  ["Refund Policy", "/refund-policy"],
  ["Secure Payments", "/terms-conditions"],
  ["Disclaimer", "/privacy-policy"],
];

const payments = [
  ["logos:visa", "Visa"],
  ["logos:mastercard", "Mastercard"],
  ["simple-icons:upi", "UPI"],
  ["simple-icons:paytm", "Paytm"],
];

const marketplaces = [
  ["logos:amazon", "Amazon"],
  ["simple-icons:flipkart", "Flipkart"],
  ["simple-icons:myntra", "Myntra"],
];

const Footer = () => {
  return (
    <footer
      className="bk-footer"
      style={{ "--bk-footer-bg": `url(${footerBackground})` }}
    >
      <div className="bk-footer-main">
        <div className="bk-footer-brand">
          <Link to="/" className="bk-footer-logo" aria-label="Banarasi Kala home">
            <img src={logo} alt="Banarasi Kala" />
          </Link>
          <p>
            Timeless weaves. Unmatched quality.
            <span>Pure Banarasi.</span>
          </p>
          <div className="bk-footer-socials" aria-label="Social links">
            <a href="#" aria-label="Instagram">
              <iconify-icon icon="mdi:instagram"></iconify-icon>
            </a>
            <a href="#" aria-label="Facebook">
              <iconify-icon icon="mdi:facebook"></iconify-icon>
            </a>
            <a href="#" aria-label="Pinterest">
              <iconify-icon icon="mdi:pinterest"></iconify-icon>
            </a>
            <a href="#" aria-label="YouTube">
              <iconify-icon icon="mdi:youtube"></iconify-icon>
            </a>
          </div>
        </div>

        <nav className="bk-footer-column" aria-label="Quick links">
          <h3>Quick Links</h3>
          <span className="bk-footer-rule" aria-hidden="true" />
          <ul>
            {quickLinks.map(([label, path]) => (
              <li key={label}>
                <Link to={path}>
                  {label}
                  {label === "Sarees" && <ChevronRight size={12} />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="bk-footer-column" aria-label="Help and support">
          <h3>Help &amp; Support</h3>
          <span className="bk-footer-rule" aria-hidden="true" />
          <ul>
            {supportLinks.map(([label, path]) => (
              <li key={label}>
                <Link to={path}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="bk-footer-column" aria-label="Policies">
          <h3>Policies</h3>
          <span className="bk-footer-rule" aria-hidden="true" />
          <ul>
            {policyLinks.map(([label, path]) => (
              <li key={label}>
                <Link to={path}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="bk-footer-updates">
          <h3>Stay Updated</h3>
          <form className="bk-footer-subscribe">
            <input type="email" placeholder="Enter your email" aria-label="Email" />
            <button type="submit" aria-label="Subscribe">
              <Send size={20} />
            </button>
          </form>
          <div className="bk-footer-ornament" aria-hidden="true" />
        </div>
      </div>

      <div className="bk-footer-info">
        <div className="bk-footer-contact">
          <h3>Contact Us</h3>
          <span className="bk-footer-rule" aria-hidden="true" />
          <p>
            <Phone size={15} />
            +91 98765 43210
          </p>
          <p>
            <Mail size={15} />
            support@banarasikala.com
          </p>
          <p>
            <MapPin size={15} />
            Bhadohi, Varanasi, Uttar Pradesh, India
          </p>
        </div>

        <div className="bk-footer-payments">
          <h3>We Accept</h3>
          <span className="bk-footer-rule" aria-hidden="true" />
          <div className="bk-footer-payment-row" aria-label="Accepted payments">
            {payments.map(([icon, label]) => (
              <span key={label} title={label}>
                <iconify-icon icon={icon}></iconify-icon>
              </span>
            ))}
          </div>
        </div>

        <div className="bk-footer-marketplaces">
          <h3>Also Available On</h3>
          <span className="bk-footer-rule" aria-hidden="true" />
          <p>We are also available on Amazon, Flipkart &amp; Myntra.</p>
          <div className="bk-footer-market-row">
            {marketplaces.map(([icon, label]) => (
              <span key={label} className={`bk-footer-market-${label.toLowerCase()}`} title={label}>
                <iconify-icon icon={icon}></iconify-icon>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bk-footer-bottom">
        <p>© 2026 Banarasi Kala. All Rights Reserved.</p>
        <span aria-hidden="true" />
      </div>
    </footer>
  );
};

export default Footer;
