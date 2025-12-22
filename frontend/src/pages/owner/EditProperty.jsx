import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaSave, 
  FaTimes, 
  FaUpload, 
  FaTrash,
  FaHome,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBed,
  FaBath,
  FaRulerCombined
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
    area: { value: '', unit: 'sqft' },
    rent: { amount: '', deposit: '' },
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    amenities: [],
    furnishingStatus: 'unfurnished',
    availability: {
      status: 'available',
      availableFrom: ''
    },
    preferences: {
      tenantType: 'any',
      petPolicy: 'not-allowed'
    }
  });

  const amenitiesList = [
    'WiFi', 'Parking', 'Gym', 'Swimming Pool', 'Security', 'Elevator',
    'Power Backup', 'Water Supply', 'Garden', 'Balcony', 'AC', 'Heating'
  ];

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
        
        // Populate form data
        setFormData({
          title: prop.title || '',
          description: prop.description || '',
          propertyType: prop.propertyType || 'apartment',
          bedrooms: prop.bedrooms || 1,
          bathrooms: prop.bathrooms || 1,
          area: {
            value: prop.area?.value || prop.areaValue || '',
            unit: prop.area?.unit || 'sqft'
          },
          rent: {
            amount: prop.rent?.amount || prop.rentAmount || '',
            deposit: prop.rent?.deposit || prop.depositAmount || ''
          },
          location: {
            address: prop.location?.address || '',
            city: prop.location?.city || '',
            state: prop.location?.state || '',
            pincode: prop.location?.pincode || ''
          },
          amenities: prop.amenities || [],
          furnishingStatus: prop.furnishingStatus || 'unfurnished',
          availability: {
            status: prop.availability?.status || 'available',
            availableFrom: prop.availability?.availableFrom ? 
              new Date(prop.availability.availableFrom).toISOString().split('T')[0] : ''
          },
          preferences: {
            tenantType: prop.preferences?.tenantType || 'any',
            petPolicy: prop.preferences?.petPolicy || 'not-allowed'
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
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
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
        <FaHome className="text-4xl text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Property not found</h3>
        <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or you don't have permission to edit it.</p>
        <button
          onClick={() => navigate('/owner/properties')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
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
                <option value="room">Room</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Furnishing St