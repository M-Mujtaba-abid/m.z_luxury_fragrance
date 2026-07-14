// import React from 'react'

import { Outlet, useLocation } from "react-router-dom"
import Carousel from "../components/user/Carosel"
import Navbar from "../components/user/Navbar"
import Footer from "../components/user/Footer"
import CartModal from "../pages/user/cart/CArtModel"
// import Success from "../../payment/Success"

const WebSiteLayout = () => {
  
  const location = useLocation();
  // console.log('WebSiteLayout rendering, current location:', location.pathname);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* WebSiteLayout */}
      {/* <Success/> */}
      <Navbar/>
      
      {/* Carousel for all pages */}
      {location.pathname === "/web" && <Carousel />}
      
      
      <div className="container mx-auto  ">
        <Outlet /> {/* ✅ yahan child routes render honge */}
      </div>
      
      <Footer/>
      
      
      <CartModal />
        
    </div>
  )
}

export default WebSiteLayout
