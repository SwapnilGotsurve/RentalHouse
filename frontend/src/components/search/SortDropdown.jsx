import React, { useState } from 'react';
import { FaSort, FaChevronDown } from 'react-icons/fa';

const SortDropdown = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'area-large', label: 'Area: Largest First' },
    { value: 'area-small', label: 'Area: Smallest First' }
  ];

  const currentSort = sortOptions.find(option => option.value === sortBy);

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm'
      >
        <FaSort className='text-gray-600' />
        <span className='font-medium text-gray-700'>Sort by</span>
        <FaChevronDown className={`text-xs text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className='fixed inset-0 z-40'
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className='absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[220px] z-50'>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortBy(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors duration-150 ${
                  sortBy === option.value 
                    ? 'bg-blue-50 text-blue-600 font-semibold' 
                    : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;
