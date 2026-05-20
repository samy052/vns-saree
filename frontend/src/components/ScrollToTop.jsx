import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search, hash, key, state } = useLocation();

  useEffect(() => {
    if (hash) return undefined;

    // Try immediate scroll
    window.scrollTo(0, 0);
    
    // Also try with a small delay to override browser scroll restoration
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [pathname, search, hash, key, state?.refreshKey]);

  return null;
};

export default ScrollToTop;
