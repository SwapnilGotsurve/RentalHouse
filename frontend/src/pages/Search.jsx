import React, { useState } from 'react';
import SearchHeader from '../components/search/SearchHeader';
import FilterBar from '../components/search/FilterBar';
import PropertyCard from '../components/search/PropertyCard';
import Breadcrumb from '../components/search/Breadcrumb';
import SortDropdown from '../components/search/SortDropdown';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('Solapur');
  const [filters, setFilters] = useState({
    bedrooms: '',
    priceRange: '',
    furnishingStatus: '',
    availability: '',
    availableFor: '',
    propertyType: '',
    postedBy: '',
    amenities: []
  });
  const [sortBy, setSortBy] = useState('relevance');

  // Sample property data
  const properties = [
    {
      id: 1,
      title: '3 BHK Flat for rent in Solapur',
      location: 'Biradar Complex, Rupa Bhawani Rd, near Garud Banglow, South Sasar Bazar, North, Solapur',
      price: 15000,
      deposit: 20000,
      area: 1500,
      bedrooms: 3,
      bathrooms: 3,
      description: 'It is an open apartment property is located in main city. Railway station is 5 min walking...',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
      ],
      owner: 'Owner',
      postedDate: '7 days ago',
      featured: true,
      isNew: true
    },
    {
      id: 2,
      title: '3 BHK Flat for rent in Solapur',
      location: 'Biradar Complex, Rupa Bhawani Rd, near Garud Banglow, South Sasar Bazar, North, Solapur',
      price: 15000,
      deposit: 20000,
      area: 1500,
      bedrooms: 3,
      bathrooms: 3,
      description: 'It is an open apartment property is located in main city. Railway station is 5 min walking...',
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
      ],
      owner: 'Owner',
      postedDate: '7 days ago',
      featured: true,
      isNew: true
    },
    {
      id: 3,
      title: '3 BHK Flat for rent in Solapur',
      location: 'Biradar Complex, Rupa Bhawani Rd, near Garud Banglow, South Sasar Bazar, North, Solapur',
      price: 15000,
      deposit: 20000,
      area: 1500,
      bedrooms: 3,
      bathrooms: 3,
      description: 'It is an open apartment property is located in main city. Railway station is 5 min walking...',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
      ],
      owner: 'Owner',
      postedDate: '7 days ago',
      featured: true,
      isNew: true
    }
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      {/* Search Header */}
      <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* Filter Bar */}
      <FilterBar filters={filters} setFilters={setFilters} />
      
      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-6'>
        {/* Breadcrumb and Sort */}
        <div className='flex justify-between items-center mb-6'>
          <Breadcrumb location={searchQuery} />
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        </div>
        
        {/* Property Listings */}
        <div className='space-y-6'>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
