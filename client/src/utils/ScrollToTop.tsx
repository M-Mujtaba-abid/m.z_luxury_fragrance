import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);  // ✅ har route change pe page upar le jao
  }, [pathname]);

  return null;
};

export default ScrollToTop;
