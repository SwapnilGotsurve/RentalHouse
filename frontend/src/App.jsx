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
import OwnerPanel from "./pages/owner/OwnerPanel";
import Dashboard from "./pages/owner/Dashboard";
import MyProperties from "./pages/owner/MyProperties";
import Bookings from "./pages/owner/Bookings";
import Guests from "./pages/owner/Guests";
import Analytics from "./pages/owner/Analytics";
import Messages from "./pages/owner/Messages";
import Documents from "./pages/owner/Documents";
import Settings from "./pages/owner/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Owner Panel Routes - No Navbar/Footer */}
        <Route path="/owner-panel" element={<OwnerPanel />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<MyProperties />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="guests" element={<Guests />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="messages" element={<Messages />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Public Routes - With Navbar/Footer */}
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/rentalHouseInfo" element={
          <>
            <Navbar />
            <Rental />
            <Footer />
          </>
        } />
        <Route path="/property/:id" element={
          <>
            <Navbar />
            <PropertyDetails />
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
