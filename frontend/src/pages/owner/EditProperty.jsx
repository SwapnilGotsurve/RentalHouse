import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaSave, 
  FaTimes, 
  FaUpload, 
  FaTrash,
  FaImage,
  FaMapMarkerAlt,
  FaHome,
  FaRupeeSign
} from 'react-icons/fa';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: { value: 0, unit: 'sqft' },
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    rent: { amount: 0, currency: 'INR', period: 'monthly' },
    securityDeposit: 0,
    maintenanceCharges: 0,
    furnishingStatus: 'unfurnished',
    amenities: [],
    availability: {
      status: 'available',
      availableFrom: new Date().toISOString().split('T')[0]
    },
    preferences: {
      tenantType: 'any',
      petPolicy: 'not-allowed',
      smokingPolicy: 'not-allowed'
    }
  });
  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        const prop = data.data.property;
        setProperty(prop);
        setFormData({
          title: prop.title || '',
          description: prop.description || '',
          propertyType: prop.propertyType || 'apartment',
          bedrooms: prop.bedrooms || 1,
          bathrooms: prop.bathrooms || 1,
          area: prop.area || { value: 0, unit: 'sqft' },
          location: prop.location || {
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'India'
          },
          rent: prop.rent || { amount: 0, currency: 'INR', period: 'monthly' },
          securityDeposit: prop.securityDeposit || 0,
          maintenanceCharges: prop.maintenanceCharges || 0,
          furnishingStatus: prop.furnishingStatus || 'unfurnished',
          amenities: prop.amenities || [],
          availability: {
            status: prop.availability?.status || 'available',
            availableFrom: prop.availability?.availableFrom 
              ? new Date(prop.availability.availableFrom).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0]
          },
          preferences: prop.preferences || {
            tenantType: 'any',
            petPolicy: 'not-allowed',
            smokingPolicy: 'not-allowed'
          }
        });
      } else {
        setError(data.message || 'Failed to fetch property');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const markImageForRemoval = (imageIndex) => {
    setImagesToRemove(prev => [...prev, imageIndex]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object' && formData[key] !== null) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add new images
      newImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      // Add images to remove
      if (imagesToRemove.length > 0) {
        formDataToSend.append('removeImages', JSON.stringify(imagesToRemove));
      }

      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      if (data.success) {
        navigate('/owner/properties');
      } else {
        setError(data.message || 'Failed to update property');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error updating property:', error);
    } finally {
      setSaving(false);
    }
  };

  const amenityOptions = [
    'parking', 'gym', 'swimming-pool', 'security', 'power-backup',
    'elevator', 'garden', 'balcony', 'terrace', 'club-house',
    'playground', 'wifi', 'ac', 'heating', 'laundry'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Property not found</h3>
        <button
          onClick={() => navigate('/owner/properties')}
          className="text-blue-600 hover:text-blue-700"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-600">Update your property information</p>
        </div>
        <button
          onClick={() => navigate('/owner/properties')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <FaTimes />
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Furnishing Status
              </label>
              <select
                name="furnishingStatus"
                value={formData.furnishingStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fully-furnished">Fully Furnished</option>
                <option value="semi-furnished">Semi Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                min="0"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                min="0"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area (sq ft)
              </label>
              <input
                type="number"
                name="area.value"
                value={formData.area.value}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                name="location.zipCode"
                value={formData.location.zipCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rent (₹)
              </label>
              <input
                type="number"
                name="rent.amount"
                value={formData.rent.amount}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Charges (₹)
              </label>
              <input
                type="number"
                name="maintenanceCharges"
                value={formData.maintenanceCharges}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenityOptions.map(amenity => (
              <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {amenity.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
          
          {/* Current Images */}
          {property.images && property.images.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    {!imagesToRemove.includes(index) && (
                      <button
                        type="button"
                        onClick={() => markImageForRemoval(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700"
                      >
                        <FaTimes />
                      </button>
                    )}
                    {imagesToRemove.includes(index) && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Will be removed</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          {newImages.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">New Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {newImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/owner/properties')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;