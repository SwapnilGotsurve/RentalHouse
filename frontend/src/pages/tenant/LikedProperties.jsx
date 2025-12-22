import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaHeart, 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRulerCombined,
  FaRupeeSign,
  FaEye,
  FaTrash,
  FaSearch,
  FaFilter,
  FaHome
} from 'react-icons/fa';

const LikedProperties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likedProperties, setLikedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLikedProperties();
  }, []);

  const fetchLikedProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/liked-properties', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setLikedProperties(data.data.likedProperties);
      } else {
        setError(data.message || 'Failed to fetch liked properties');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error fetching liked properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (propertyId) => {
    if (!window.confirm('Remove this property from your favorites?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/liked-properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setLikedProperties(prev => prev.filter(item => item.property._id !== propertyId));
      } else {
        setError(data.message || 'Failed to remove property');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error removing property:', error);
    }
  };

  const filteredProperties = likedProperties.filter(item => {
    if (!item.property) return false;
    const property = item.property;
    return property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           property.location?.city.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Liked Properties</h1>
          <p className="text-gray-600">Properties you've saved for later</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaHeart className="text-red-500" />
          <span>{likedProperties.length} saved properties</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search saved properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FaHeart className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {likedProperties.length === 0 ? 'No saved properties' : 'No properties match your search'}
          </h3>
          <p className="text-gray-600 mb-4">
            {likedProperties.length === 0 
              ? "You haven't saved any properties yet. Browse properties and click the heart icon to save them here." 
              : "Try adjusting your search terms."}
          </p>
          {likedProperties.length === 0 && (
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaSearch className="text-sm" />
              Browse Properties
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((item) => {
            const property = item.property;
            if (!property) return null;
            
            return (
              <div key={property._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaHome className="text-4xl text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.availability?.status || 'available')}`}>
                      {(property.availability?.status || 'available').charAt(0).toUpperCase() + (property.availability?.status || 'available').slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <div className="bg-red-500 text-white p-2 rounded-full">
                      <FaHeart className="text-sm" />
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="text-sm mr-1" />
                    <span className="text-sm line-clamp-1">
                      {property.location?.city}, {property.location?.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <FaBed className="text-xs" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaBath className="text-xs" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaRulerCombined className="text-xs" />
                      <span>{property.area?.value} {property.area?.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-lg font-bold text-gray-900">
                      <FaRupeeSign className="text-sm mr-1" />
                      {property.rent?.amount?.toLocaleString()}
                      <span className="text-sm font-normal text-gray-600 ml-1">/month</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaEye className="mr-1" />
                      {property.views || 0}
                    </div>
                  </div>

                  {/* Saved Date */}
                  <div className="text-xs text-gray-500 mb-3">
                    Saved on {new Date(item.createdAt).toLocaleDateString()}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/property/${property._id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemoveFromFavorites(property._id)}
                      className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors"
                      title="Remove from favorites"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {likedProperties.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Favorites Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {likedProperties.length}
              </div>
              <div className="text-sm text-gray-600">Total Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {likedProperties.filter(item => item.property?.availability?.status === 'available').length}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(likedProperties.reduce((sum, item) => sum + (item.property?.rent?.amount || 0), 0) / likedProperties.length).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Avg. Rent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(likedProperties.map(item => item.property?.location?.city)).size}
              </div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikedProperties;