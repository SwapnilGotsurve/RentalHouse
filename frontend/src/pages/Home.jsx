import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Features from '../components/Features'
import TenantTestimonials from '../components/TenantTestimonials'
import Hero2 from '../components/Hero2'
import ShareYourExperiance from '../components/ShareYourExperiance'
import PropertySection from '../components/PropertySection'
import RentalApplicationModal from '../components/RentalApplicationModal'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
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
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    // Load featured properties on initial load
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties/featured?limit=8');
      const data = await response.json();
      
      if (data.success) {
        setProperties(data.data.properties);
      }
    } catch (error) {
      console.error('Error fetching featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);

    try {
      const params = new URLSearchParams({
        q: query,
        sortBy,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => 
            Array.isArray(value) ? value.length > 0 : value !== ''
          )
        )
      });

      // Handle amenities array
      if (filters.amenities && filters.amenities.length > 0) {
        params.delete('amenities');
        filters.amenities.forEach(amenity => {
          params.append('amenities', amenity);
        });
      }

      const url = `/api/properties/search?${params}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setProperties(data.data.properties);
      } else {
        console.error('API returned error:', data.message);
        setProperties([]);
      }
    } catch (error) {
      console.error('Error searching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    
    // If there's a search query, re-run the search with new filters
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      // Otherwise, fetch filtered featured properties
      fetchFilteredProperties(newFilters);
    }
  };

  const fetchFilteredProperties = async (currentFilters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sortBy,
        ...Object.fromEntries(
          Object.entries(currentFilters).filter(([_, value]) => 
            Array.isArray(value) ? value.length > 0 : value !== ''
          )
        )
      });

      // Handle amenities array
      if (currentFilters.amenities && currentFilters.amenities.length > 0) {
        params.delete('amenities');
        currentFilters.amenities.forEach(amenity => {
          params.append('amenities', amenity);
        });
      }

      const response = await fetch(`/api/properties/search?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setProperties(data.data.properties);
      }
    } catch (error) {
      console.error('Error fetching filtered properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      fetchFilteredProperties(filters);
    }
  };

  const handlePropertyApply = (property) => {
    if (!isAuthenticated || user?.role !== 'tenant') {
      // This should not happen as the button should redirect to login
      return;
    }
    
    setSelectedProperty(property);
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = (application) => {
    // Optionally refresh properties or show success message
    // Application submitted successfully
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilters({
      minRent: '',
      maxRent: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      furnishing: '',
      availableFor: '',
      amenities: []
    });
    fetchFeaturedProperties();
  };

  return (
    <div className='pt-16'>
      <Hero onSearch={handleSearch} />
      
      {/* Property Section */}
      <PropertySection
        searchQuery={searchQuery}
        properties={properties}
        loading={loading}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        title={searchQuery ? `Search Results for "${searchQuery}"` : "Featured Properties"}
      />
      
      {/* Clear Search Button */}
      {searchQuery && (
        <div className="text-center py-4">
          <button
            onClick={clearSearch}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Featured Properties
          </button>
        </div>
      )}
      
      <Features />
      <Hero2 />
      <TenantTestimonials />
      <ShareYourExperiance />
      
      {/* Rental Application Modal */}
      {showApplicationModal && selectedProperty && (
        <RentalApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          property={selectedProperty}
          onSubmit={handleApplicationSubmit}
        />
      )}
      
      {/* Development Test Link - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Link
            to="/auth-test"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors text-sm"
          >
            🔐 Auth Test
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home
