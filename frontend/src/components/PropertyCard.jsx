import React, { useState } from 'react';
import { FaHeart, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaUser, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const PropertyCard = ({ property, onFavorite, onApply }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(property.isLiked || false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCardClick = (e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('.action-button')) {
      return;
    }
    navigate(`/property/${property._id}`);
  };

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated || user?.role !== 'tenant') {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/liked-properties/${property._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsLiked(data.data.isLiked);
        if (onFavorite) {
          onFavorite(property, data.data.isLiked);
        }
      } else {
        console.error('Error toggling favorite:', data.message);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated || user?.role !== 'tenant') {
      navigate('/login');
      return;
    }

    if (onApply) {
      onApply(property);
    } else {
      navigate(`/property/${property._id}`);
    }
  };

  const formatPrice = (price) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(0)}K`;
    }
    return `₹${price}`;
  };

  const getPropertyImage = () => {
    if (property.images && property.images.length > 0) {
      return property.images[0].url || property.images[0];
    }
    return 'https://via.placeholder.com/400x300?text=No+Image';
  };

  const getOwnerName = () => {
    if (property.owner) {
      return `${property.owner.firstName} ${property.owner.lastName}`;
    }
    return 'Property Owner';
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-200"
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={getPropertyImage()}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          
          {/* Overlay Actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleLikeToggle}
              className={`action-button p-2 rounded-full transition-all duration-200 ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <FaHeart className="text-sm" />
            </button>
          </div>

          {/* Property Type Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
              {property.type || property.propertyType}
            </span>
          </div>

          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title and Location */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <FaMapMarkerAlt className="mr-1 text-red-500" />
              <span className="line-clamp-1">
                {property.location?.city}, {property.location?.state}
              </span>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FaBed className="text-blue-600" />
                <span>{property.bedrooms} Bed</span>
              </div>
              <div className="flex items-center gap-1">
                <FaBath className="text-teal-600" />
                <span>{property.bathrooms} Bath</span>
              </div>
              <div className="flex items-center gap-1">
                <FaRulerCombined className="text-purple-600" />
                <span>{property.area?.value || property.areaValue || 0} {property.area?.unit || 'sqft'}</span>
              </div>
            </div>
          </div>

          {/* Price and Deposit */}
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-800">
                  {formatPrice(property.rent?.amount || property.rentAmount || 0)}
                </span>
                <span className="text-gray-600 text-sm ml-1">/month</span>
              </div>
              {(property.securityDeposit || property.depositAmount) && (
                <div className="text-right">
                  <div className="text-xs text-gray-500">Deposit</div>
                  <div className="text-sm font-medium text-gray-700">
                    {formatPrice(property.securityDeposit || property.depositAmount || 0)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs capitalize"
                  >
                    {amenity.replace('-', ' ')}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Owner Info and Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <FaUser />
              <span>{getOwnerName()}</span>
            </div>
            {property.views && (
              <div className="flex items-center gap-1">
                <FaEye />
                <span>{property.views} views</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isAuthenticated && user?.role === 'tenant' ? (
              <>
                <button
                  onClick={handleApplyClick}
                  className="action-button flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Apply Now
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/property/${property._id}`);
                  }}
                  className="action-button px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors text-sm"
                >
                  View Details
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/login');
                  }}
                  className="action-button flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
                >
                  Login to Apply
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/property/${property._id}`);
                  }}
                  className="action-button px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors text-sm"
                >
                  View Details
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyCard;