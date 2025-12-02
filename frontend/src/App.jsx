import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import TenantPanel from "./pages/tenant/TenantPanel";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import MyLease from "./pages/tenant/MyLease";
import RentPayment from "./pages/tenant/RentPayment";
import Maintenance from "./pages/tenant/Maintenance";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import PropertiesManagement from "./pages/admin/PropertiesManagement";
import RevenueAnalytics from "./pages/admin/RevenueAnalytics";
import SystemMonitoring from "./pages/admin/SystemMonitoring";

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

        {/* Tenant Panel Routes - No Navbar/Footer */}
        <Route path="/tenant-panel" element={<TenantPanel />}>
          <Route index element={<TenantDashboard />} />
          <Route path="my-lease" element={<MyLease />} />
          <Route path="rent-payment" element={<RentPayment />} />
          <Route path="maintenance" element={<Maintenance />} />
        </Route>

        {/* Admin Panel Routes - No Navbar/Footer */}
        <Route path="/admin-panel" element={<AdminPanel />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="properties" element={<PropertiesManagement />} />
          <Route path="analytics" element={<RevenueAnalytics />} />
          <Route path="system-monitoring" element={<SystemMonitoring />} />
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
