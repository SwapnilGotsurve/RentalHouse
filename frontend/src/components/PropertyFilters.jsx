import React from 'react';
import { FaHome, FaBed, FaBath, FaRupeeSign } from 'react-icons/fa';

const PropertyFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handleFilterUpdate = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    handleFilterUpdate('amenities', newAmenities);
  };

  const priceRanges = [
    { label: 'Under ₹10,000', min: 0, max: 10000 },
    { label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
    { label: '₹20,000 - ₹30,000', min: 20000, max: 30000 },
    { label: '₹30,000 - ₹50,000', min: 30000, max: 50000 },
    { label: 'Above ₹50,000', min: 50000, max: 999999 }
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Studio' }
  ];

  const furnishingOptions = [
    { value: 'fully-furnished', label: 'Fully Furnished' },
    { value: 'semi-furnished', label: 'Semi Furnished' },
    { value: 'unfurnished', label: 'Unfurnished' }
  ];

  const availableForOptions = [
    { value: 'family', label: 'Family' },
    { value: 'bachelor', label: 'Bachelor' },
    { value: 'company', label: 'Company' },
    { value: 'any', label: 'Anyone' }
  ];

  const popularAmenities = [
    'parking', 'gym', 'swimming-pool', 'security', 'power-backup',
    'elevator', 'garden', 'wifi', 'ac', 'laundry'
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FaRupeeSign className="text-green-600" />
            Price Range
          </h4>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input
              type="number"
              placeholder="Min"
              value={filters.minRent}
              onChange={(e) => handleFilterUpdate('minRent', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxRent}
              onChange={(e) => handleFilterUpdate('maxRent', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <button
                key={index}
                onClick={() => {
                  handleFilterUpdate('minRent', range.min);
                  handleFilterUpdate('maxRent', range.max);
                }}
                className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FaBed className="text-blue-600" />
            Bedrooms
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => handleFilterUpdate('bedrooms', filters.bedrooms === num ? '' : num)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  filters.bedrooms === num
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FaBath className="text-teal-600" />
            Bathrooms
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => handleFilterUpdate('bathrooms', filters.bathrooms === num ? '' : num)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  filters.bathrooms === num
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-teal-500'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FaHome className="text-purple-600" />
            Property Type
          </h4>
          <div className="space-y-2">
            {propertyTypes.map((type) => (
              <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="propertyType"
                  value={type.value}
                  checked={filters.propertyType === type.value}
                  onChange={(e) => handleFilterUpdate('propertyType', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Furnishing */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Furnishing</h4>
          <div className="space-y-2">
            {furnishingOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="furnishing"
                  value={option.value}
                  checked={filters.furnishing === option.value}
                  onChange={(e) => handleFilterUpdate('furnishing', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Available For */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Available For</h4>
          <div className="space-y-2">
            {availableForOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="availableFor"
                  value={option.value}
                  checked={filters.availableFor === option.value}
                  onChange={(e) => handleFilterUpdate('availableFor', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Amenities</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {popularAmenities.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(filters.amenities || []).includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {amenity.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;