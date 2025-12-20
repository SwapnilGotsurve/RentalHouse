import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaUsers, 
  FaChartBar, 
  FaComments, 
  FaFileAlt, 
  FaCog,
  FaSearch,
  FaQuestionCircle,
  FaMoon,
  FaBell,
  FaSignOutAlt
} from 'react-icons/fa';
import { HiOutlineSquares2X2 } from 'react-icons/hi2';

const OwnerPanelLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/owner-panel', icon: HiOutlineSquares2X2, label: 'Dashboard' },
    { path: '/owner-panel/properties', icon: FaHome, label: 'My Properties' },
    { path: '/owner-panel/bookings', icon: FaCalendarAlt, label: 'Bookings' },
    { path: '/owner-panel/guests', icon: FaUsers, label: 'Guests' },
    { path: '/owner-panel/analytics', icon: FaChartBar, label: 'Analytics' },
    // { path: '/owner-panel/messages', icon: FaComments, label: 'Messages' },
    { path: '/owner-panel/documents', icon: FaFileAlt, label: 'Documents' },
    { path: '/owner-panel/settings', icon: FaCog, label: 'Settings' },
  ];

  const isActive = (path) => {
    if (path === '/owner-panel') {
      return location.pathname === '/owner-panel';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e3a5f] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white">
            RH
          </div>
          <span className="text-xl font-bold">RentalHub</span>
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
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:bg-[#2a4a6f] hover:text-white'
                }`}
              >
                <Icon className="text-lg" />
                <span>{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#2a4a6f]">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-orange-400 hover:bg-[#2a4a6f] w-full transition-colors"
          >
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">N</span>
            </div>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#e8f4f8] px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">
              <span className="text-[#1e3a5f]">RentalHub</span>{' '}
              <span className="text-orange-500">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <FaQuestionCircle className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <FaMoon className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors relative">
              <FaBell className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 ml-4">
              <div className="text-right">
                <p className="font-semibold text-gray-800">John Doe</p>
                <p className="text-sm text-gray-600">Property Owner</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#e8f4f8] p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OwnerPanelLayout;

