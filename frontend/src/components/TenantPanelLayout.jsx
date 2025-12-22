import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaHome, 
  FaCreditCard, 
  FaTools, 
  FaUser,
  FaSearch,
  FaSignOutAlt,
  FaBell,
  FaCog,
  FaHeart
} from 'react-icons/fa';
import { HiOutlineSquares2X2 } from 'react-icons/hi2';

const TenantPanelLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { path: '/tenant', icon: HiOutlineSquares2X2, label: 'Dashboard' },
    { path: '/tenant/liked-properties', icon: FaHeart, label: 'Liked Properties' },
    { path: '/tenant/rental-requests', icon: FaHome, label: 'My Applications' },
    { path: '/tenant/maintenance', icon: FaTools, label: 'Maintenance' },
  ];

  const isActive = (path) => {
    if (path === '/tenant') {
      return location.pathname === '/tenant';
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

        {/* User Info */}
        <div className="px-6 py-4 bg-gray-800 mx-4 rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` : 'TU'}
            </div>
            <div>
              <p className="font-semibold text-sm">
                {user ? `${user.firstName} ${user.lastName}` : 'Tenant User'}
              </p>
              <p className="text-xs text-gray-400">Tenant</p>
            </div>
          </div>
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
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="text-lg" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 w-full transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">
                  {user?.firstName?.charAt(0) || 'T'}
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
        <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm border-b">
          <div className="flex items-center gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-gray-50"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <FaBell className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FaCog className="text-gray-600" />
            </button>
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

export default TenantPanelLayout;
