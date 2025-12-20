import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const FilterBar = ({ filters, setFilters }) => {
  const filterOptions = [
    {
      label: 'No. of Bedrooms',
      key: 'bedrooms',
      options: ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK']
    },
    {
      label: '₹0 - 1000',
      key: 'priceRange',
      options: ['₹0 - 5000', '₹5000 - 10000', '₹10000 - 20000', '₹20000 - 50000', '₹50000+']
    },
    {
      label: 'Furnishing status',
      key: 'furnishingStatus',
      options: ['Fully Furnished', 'Semi Furnished', 'Unfurnished']
    },
    {
      label: 'Available',
      key: 'availability',
      options: ['Immediately', 'Within 15 days', 'Within 30 days', 'After 30 days']
    },
    {
      label: 'Available for',
      key: 'availableFor',
      options: ['Family', 'Bachelor', 'Company']
    },
    {
      label: 'Property type',
      key: 'propertyType',
      options: ['Apartment', 'Independent House', 'Villa', 'Studio']
    },
    {
      label: 'Posted by',
      key: 'postedBy',
      options: ['Owner', 'Agent', 'Builder']
    },
    {
      label: 'Amenities',
      key: 'amenities',
      options: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Power Backup']
    },
    {
      label: 'More filter',
      key: 'moreFilter',
      options: ['Pet Friendly', 'Balcony', 'Garden', 'Lift']
    }
  ];

  return (
    <div className='bg-white border-b border-gray-200 shadow-sm sticky top-[72px] z-40'>
      <div className='max-w-7xl mx-auto px-4 py-3'>
        <div className='flex items-center gap-3 overflow-x-auto scrollbar-hide'>
          {filterOptions.map((filter, index) => (
            <div key={index} className='relative group'>
              <button className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium text-sm whitespace-nowrap transition-colors duration-200 border border-gray-300'>
                <span>{filter.label}</span>
                <FaChevronDown className='text-xs' />
              </button>
              
              {/* Dropdown Menu */}
              <div className='absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50'>
                {filter.options.map((option, optIndex) => (
                  <button
                    key={optIndex}
                    onClick={() => setFilters({ ...filters, [filter.key]: option })}
                    className='w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 text-sm transition-colors duration-150'
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
