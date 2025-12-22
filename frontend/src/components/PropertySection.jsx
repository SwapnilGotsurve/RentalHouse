import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import { FaFilter, FaSort, FaSpinner } from 'react-icons/fa';

const PropertySection = ({ 
  searchQuery, 
  properties = [], 
  loading = false, 
  onFilterChange, 
  onSortChange,
  showFilters = true,
  title = "Featured Properties"
}) => {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    minRent: '',
    maxRent: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    furnishing: '',
    availableFor: '',
    amenities: []
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    if (onSortChange) {
      onSortChange(newSort);
    }
  };

  const clearFilters = () => {
    const emptyFilters = {
      minRent: '',
      maxRent: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      furnishing: '',
      availableFor: '',
      amenities: []
    };
    setFilters(emptyFilters);
    handleFilterChange(emptyFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      Array.isArray(value) ? value.length > 0 : value !== ''
    ).length;
  };

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'date_desc', label: 'Newest First' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : title}
          </h2>
          <p className="text-gray-600">
            {loading ? 'Searching...' : `${properties.length} properties found`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FaSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilterPanel 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
              }`}
            >
              <FaFilter />
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {Object.entries(filters).map(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              return value.map((item, index) => (
                <span
                  key={`${key}-${index}`}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {item}
                  <button
                    onClick={() => {
                      const newValue = value.filter(v => v !== item);
                      handleFilterChange({ ...filters, [key]: newValue });
                    }}
                    className="ml-1 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ));
            } else if (value !== '') {
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {key}: {value}
                  <button
                    onClick={() => handleFilterChange({ ...filters, [key]: '' })}
                    className="ml-1 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              );
            }
            return null;
          })}
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Filter Panel */}
        {showFilters && showFilterPanel && (
          <div className="w-80 flex-shrink-0">
            <PropertyFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>
        )}

        {/* Properties Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-4xl text-blue-600 mr-4" />
              <span className="text-lg text-gray-600">Loading properties...</span>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery ? 'No properties found' : 'No properties available'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search criteria or filters'
                  : 'Check back later for new listings'
                }
              </p>
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                />
              ))}
            </div>
          )}

          {/* Load More / Pagination */}
          {properties.length > 0 && properties.length % 12 === 0 && (
            <div className="text-center mt-8">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Load More Properties
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySection;