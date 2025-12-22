import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Rental from "./pages/Rental";
import PropertyDetails from "./pages/PropertyDetails";
import OwnerPanel from "./pages/owner/OwnerPanel";
import Dashboard from "./pages/owner/Dashboard";
import MyProperties from "./pages/owner/MyProperties";
import AddProperty from "./pages/owner/AddProperty";
import Bookings from "./pages/owner/Bookings";
import Guests from "./pages/owner/Guests";
import Analytics from "./pages/owner/Analytics";
import Messages from "./pages/owner/Messages";
import Documents from "./pages/owner/Documents";
import Settings from "./pages/owner/Settings";
import PropertyDetail from "./pages/owner/PropertyDetail";
import OwnerRentalRequests from "./pages/owner/RentalRequests";
import TenantPanel from "./pages/tenant/TenantPanel";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import MyLease from "./pages/tenant/MyLease";
import Maintenance from "./pages/tenant/Maintenance";
import LikedProperties from "./pages/tenant/LikedProperties";
import RentalRequests from "./pages/tenant/RentalRequests";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import PropertiesManagement from "./pages/admin/PropertiesManagement";
import RevenueAnalytics from "./pages/admin/RevenueAnalytics";
import SystemMonitoring from "./pages/admin/SystemMonitoring";

// Authentication components
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthTest from "./pages/AuthTest";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth-test" element={<AuthTest />} />

          {/* Owner Panel Routes - Protected for owners only */}
          <Route path="/owner/*" element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerPanel />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<MyProperties />} />
            <Route path="properties/:id" element={<PropertyDetail />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="rental-requests" element={<OwnerRentalRequests />} />
            <Route path="guests" element={<Guests />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="messages" element={<Messages />} />
            <Route path="documents" element={<Documents />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Legacy owner-panel route - redirect to /owner */}
          <Route path="/owner-panel/*" element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerPanel />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<MyProperties />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="rental-requests" element={<OwnerRentalRequests />} />
            <Route path="guests" element={<Guests />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="messages" element={<Messages />} />
            <Route path="documents" element={<Documents />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Tenant Panel Routes - Protected for tenants only */}
          <Route path="/tenant/*" element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <TenantPanel />
            </ProtectedRoute>
          }>
            <Route index element={<TenantDashboard />} />
            <Route path="my-lease" element={<MyLease />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="liked-properties" element={<LikedProperties />} />
            <Route path="rental-requests" element={<RentalRequests />} />
          </Route>

          {/* Legacy tenant-panel route - redirect to /tenant */}
          <Route path="/tenant-panel/*" element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <TenantPanel />
            </ProtectedRoute>
          }>
            <Route index element={<TenantDashboard />} />
            <Route path="my-lease" element={<MyLease />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="liked-properties" element={<LikedProperties />} />
            <Route path="rental-requests" element={<RentalRequests />} />
          </Route>

          {/* Admin Panel Routes - Protected for admins only */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="properties" element={<PropertiesManagement />} />
            <Route path="analytics" element={<RevenueAnalytics />} />
            <Route path="system-monitoring" element={<SystemMonitoring />} />
          </Route>

          {/* Legacy admin-panel route - redirect to /admin */}
          <Route path="/admin-panel/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }>
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
          <Route path="/search" element={
            <>
              <Search />
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
    </AuthProvider>
  );
}

export default App;
