import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRulerCombined,
  FaRupeeSign,
  FaCalendarAlt,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaShare,
  FaHeart,
  FaWifi,
  FaCar,
  FaSwimmingPool,
  FaDumbbell,
  FaShieldAlt,
  FaLeaf,
  FaUtensils,
  FaTv,
  FaSnowflake,
  FaWater,
  FaBolt,
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
  FaHome
} from 'react-icons/fa';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setProperty(data.data.property);
      } else {
        setError(data.message || 'Property not found');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        navigate('/owner/properties');
      } else {
        setError(data.message || 'Failed to delete property');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error deleting property:', error);
    }
    setShowDeleteModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'wifi': FaWifi,
      'parking': FaCar,
      'pool': FaSwimmingPool,
      'gym': FaDumbbell,
      'security': FaShieldAlt,
      'garden': FaLeaf,
      'kitchen': FaUtensils,
      'tv': FaTv,
      'ac': FaSnowflake,
      'water': FaWater,
      'power': FaBolt
    };
    return icons[amenity.toLowerCase()] || FaLeaf;
  };

  const nextImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <FaHome className="text-3xl text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Property Not Found</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link
          to="/owner/properties"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaArrowLeft className="text-sm" />
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/owner/properties')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt className="text-sm" />
              <span>{property.location?.address}, {property.location?.city}, {property.location?.state}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.availability?.status || 'available')}`}>
            {(property.availability?.status || 'available').charAt(0).toUpperCase() + (property.availability?.status || 'available').slice(1)}
          </span>
          <Link
            to={`/owner/properties/${property._id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaEdit className="text-sm" />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <FaTrash className="text-sm" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Gallery */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {property.images && property.images.length > 0 ? (
              <div className="relative">
                <div className="aspect-video bg-gray-200">
                  <img
                    src={property.images[currentImageIndex].url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <FaChevronRight />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                    <FaCamera className="text-xs" />
                    {property.images.length}
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <FaCamera className="text-4xl text-gray-400" />
              </div>
            )}
            
            {/* Thumbnail Strip */}
            {property.images && property.images.length > 1 && (
              <div className="p-4 border-t">
                <div className="flex gap-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Property Info */}
        <div className="space-y-6">
          {/* Price & Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-2xl font-bold text-gray-900">
                <FaRupeeSign className="text-lg mr-1" />
                {(property.rent?.amount || property.rentAmount || 0).toLocaleString()}
                <span className="text-base font-normal text-gray-600 ml-1">/month</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaEye className="mr-1" />
                {property.views || 0} views
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center text-blue-600 mb-1">
                  <FaBed className="text-lg" />
                </div>
                <div className="text-sm font-medium">{property.bedrooms} Beds</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-blue-600 mb-1">
                  <FaBath className="text-lg" />
                </div>
                <div className="text-sm font-medium">{property.bathrooms} Baths</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-blue-600 mb-1">
                  <FaRulerCombined className="text-lg" />
                </div>
                <div className="text-sm font-medium">{property.area?.value || property.areaValue || 0} {property.area?.unit || 'sqft'}</div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Property Type:</span>
                <span className="font-medium capitalize">{property.propertyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Furnishing:</span>
                <span className="font-medium capitalize">{property.furnishingStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available From:</span>
                <span className="font-medium">
                  {new Date(property.availability?.availableFrom || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {property.owner?.firstName?.charAt(0)}{property.owner?.lastName?.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {property.owner?.firstName} {property.owner?.lastName}
                </p>
                <p className="text-sm text-gray-600">Property Owner</p>
              </div>
            </div>
            <div className="space-y-2">
              {property.owner?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <FaPhone className="text-gray-400" />
                  <span>{property.owner?.phone}</span>
                </div>
              )}
              {property.owner?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <FaEnvelope className="text-gray-400" />
                  <span>{property.owner?.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
        <p className="text-gray-700 leading-relaxed">{property.description}</p>
      </div>

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {property.amenities.map((amenity, index) => {
              const IconComponent = getAmenityIcon(amenity);
              return (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <IconComponent className="text-blue-600" />
                  <span className="capitalize">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preferences */}
      {property.preferences && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenant Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Preferred Tenant Type:</span>
              <p className="font-medium capitalize">{property.preferences.tenantType || 'Any'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Pets Allowed:</span>
              <p className="font-medium">{property.preferences.petsAllowed ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Smoking Allowed:</span>
              <p className="font-medium">{property.preferences.smokingAllowed ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Minimum Lease:</span>
              <p className="font-medium">{property.preferences.minimumLease || 'Not specified'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Property</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProperty}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;