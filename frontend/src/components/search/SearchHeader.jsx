import React, { useState } from 'react';
import { FaSearch, FaTimes, FaHome, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SearchHeader = ({ searchQuery, setSearchQuery, user = null }) => {
  const [tags, setTags] = useState(['Solapur']);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTag();
    }
  };

  return (
    <div className='bg-[#005BCB] text-white py-4 px-6 shadow-lg sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto flex items-center gap-4'>
        {/* Logo */}
        <div 
          className='flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity'
          onClick={() => navigate('/')}
        >
          <FaHome className='text-3xl' />
          <h1 className='text-2xl font-bold'>JOINRENTAL</h1>
        </div>

        {/* Search Bar */}
        <div className='flex-1 max-w-3xl'>
          <div className='bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-md'>
            <FaSearch className='text-gray-400 text-xl' />
            
            {/* Tags */}
            <div className='flex items-center gap-2 flex-wrap flex-1'>
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium'
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className='hover:bg-blue-200 rounded-full p-0.5 transition-colors'
                  >
                    <FaTimes className='text-xs' />
                  </button>
                </div>
              ))}
              
              {/* Input */}
              <input
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Add more...'
                className='flex-1 outline-none text-gray-700 min-w-[150px] text-base'
              />
            </div>
          </div>
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
    </div>
  );
};

export default SearchHeader;
