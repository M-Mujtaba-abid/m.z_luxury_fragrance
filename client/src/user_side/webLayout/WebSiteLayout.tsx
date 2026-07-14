import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom"
import ScrollVideoScrub from "../component/ScrollVideoScrub"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import CartModal from "../pages/cart/CArtModel"
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
      {/* <Success/> */}
      <Navbar/>
      
      {/* Carousel for all pages */}
      {location.pathname === "/web" && <ScrollVideoScrub />}
      
      
      <div className="container mx-auto  ">
        <Outlet /> {/* ✅ yahan child routes render honge */}
      </div>
      
      <Footer/>
      
      
      <CartModal />
        
    </div>
  )
}

export default WebSiteLayout
