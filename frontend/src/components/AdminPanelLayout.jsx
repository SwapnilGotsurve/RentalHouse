import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaBuilding, 
  FaChartLine,
  FaSearch,
  FaBell,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';

const AdminPanelLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin-panel', icon: FaHome, label: 'Dashboard' },
    { path: '/admin-panel/users', icon: FaUsers, label: 'Users Management' },
    { path: '/admin-panel/properties', icon: FaBuilding, label: 'Properties' },
    { path: '/admin-panel/analytics', icon: FaChartLine, label: 'Revenue Analytics' },
    { path: '/admin-panel/system-monitoring', icon: FaChartLine, label: 'System Monitoring' },
  ];

  const isActive = (path) => {
    if (path === '/admin-panel') {
      return location.pathname === '/admin-panel';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-[#0a1929] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-700">
          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-white">
            RH
          </div>
          <div>
            <span className="text-xl font-bold block">RentalHub</span>
            <span className="text-xs text-gray-400">Super Admin</span>
          </div>
        </div>

        {/* Admin Info */}
        <div className="px-6 py-4 bg-[#0d2238] mx-4 mt-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              AU
            </div>
            <div>
              <p className="font-semibold text-sm">Admin User</p>
              <p className="text-xs text-gray-400">admin@rentalhub.com</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  active
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-300 hover:bg-[#0d2238] hover:text-white'
                }`}
              >
                <Icon className="text-lg" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#0d2238] w-full transition-colors">
            <FaCog className="text-lg" />
            <span className="text-sm">Settings</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#0d2238] w-full transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="text-sm">Logout</span>
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
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 w-64 bg-gray-50"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <FaBell className="text-gray-600 text-xl" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FaCog className="text-gray-600 text-xl" />
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

export default AdminPanelLayout;
