import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/features";
import Hero2 from "./components/Hero2";
import TenantTestimonials from "./components/TenantTestimonials";
import Footer from "./components/Footer";
import ShareYourExperiance from "./components/ShareYourExperiance";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RentalHouseInfo from "./components/RentalHouseInfo";
import Rental from "./pages/Rental";
import PropertyDetails from "./pages/PropertyDetails";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rentalHouseInfo" element={<Rental />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
