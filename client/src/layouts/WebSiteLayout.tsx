import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom"
import ScrollVideoScrub from "../components/user/ScrollVideoScrub"
import Navbar from "../components/user/Navbar"
import Footer from "../components/user/Footer"
import CartModal from "../pages/user/cart/CArtModel"
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WebSiteLayout = () => {

  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // Update ScrollTrigger on scroll
    lenis.on("scroll", ScrollTrigger.update);

    // Standard independent requestAnimationFrame loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      {/* WebSiteLayout */}
      <Navbar/>

      {/* Scroll-scrubbed hero video for the homepage */}
      {location.pathname === "/web" && <ScrollVideoScrub />}


      <div className="w-full">
        <Outlet /> {/* ✅ yahan child routes render honge */}
      </div>

      <Footer/>


      <CartModal />

    </div>
  )
}

export default WebSiteLayout
