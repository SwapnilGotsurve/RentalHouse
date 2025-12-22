import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaUsers, 
  FaChartBar, 
  FaCog,
  FaSearch,
  FaSignOutAlt,
  FaEnvelope
} from 'react-icons/fa';
import { HiOutlineSquares2X2 } from 'react-icons/hi2';

const OwnerPanelLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { path: '/owner', icon: HiOutlineSquares2X2, label: 'Dashboard' },
    { path: '/owner/properties', icon: FaHome, label: 'My Properties' },
    { path: '/owner/add-property', icon: FaHome, label: 'Add Property', isAddButton: true },
    { path: '/owner/bookings', icon: FaCalendarAlt, label: 'Bookings' },
    { path: '/owner/rental-requests', icon: FaEnvelope, label: 'Rental Requests' },
    { path: '/owner/guests', icon: FaUsers, label: 'My Tenants' },
    // { path: '/owner/analytics', icon: FaChartBar, label: 'Analytics' },
    { path: '/owner/settings', icon: FaCog, label: 'Settings' },
  ];

  const isActive = (path) => {
    if (path === '/owner') {
      return location.pathname === '/owner';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            JR
          </div>
          <span className="text-xl font-bold">JoinRental</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  item.isAddButton
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="text-lg" />
                <span>{item.label}</span>
                {item.isAddButton && (
                  <span className="ml-auto text-lg">+</span>
                )}
                {active && !item.isAddButton && (
                  <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 w-full transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">
              <span className="text-gray-800">Property</span>{' '}
              <span className="text-blue-600">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="flex items-center gap-3 ml-4">
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  {user ? `${user.firstName} ${user.lastName}` : 'Property Owner'}
                </p>
                <p className="text-sm text-gray-600">Property Owner</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` : 'PO'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OwnerPanelLayout;

