import React, { useState } from "react";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user = null }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Example user object structure:
  // user = { name: 'John Doe', profileImage: 'url', email: 'john@example.com' }

  return (
    <div className="fixed w-full flex justify-between items-center p-4 bg-[#005BCB] text-white px-7 z-50">
      {/* Logo */}
      <div 
        className="flex justify-center items-center gap-4 h-13 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => navigate('/')}
      >
        <div className="text-4xl">
          <FaHome />
        </div>
        <p className="text-3xl font-bold">JoinRental</p>
      </div>

      {/* User Profile */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="focus:outline-none hover:opacity-90 transition-opacity"
        >
          {user && user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <FaUserCircle className="text-4xl" />
          )}
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />

            {/* Menu */}
            <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-50 text-gray-700">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors">
                    My Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors">
                    My Bookings
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors">
                    Saved Properties
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors">
                    Settings
                  </button>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors">
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigate('/signup')}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
