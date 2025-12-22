import React, { useState, useEffect } from 'react';
import { FaHome, FaMapMarkerAlt, FaBed, FaBath, FaDollarSign, FaSearch, FaFilter, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const PropertiesManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchProperties();
  }, [currentPage, statusFilter, propertyTypeFilter, searchTerm]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(statusFilter && { status: statusFilter }),
        ...(propertyTypeFilter && { propertyType: propertyTypeFilter }),
        ...(searchTerm && { city: searchTerm })
      });

      const response = await fetch(`http://localhost:5000/api/admin/properties?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setProperties(data.data.properties);
        setTotalPages(data.data.pagination.pages);
        setStatistics(data.data.statistics);
      } else {
        setError(data.message || 'Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updatePropertyStatus = async (propertyId, isActive, isVerified) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/properties/${propertyId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive, isVerified })
      });

      const data = await response.json();
      if (data.success) {
        fetchProperties(); // Refresh the list
      } else {
        setError(data.message || 'Failed to update property status');
      }
    } catch (error) {
      console.error('Error updating property status:', error);
      setError('Network error. Please try again.');
    }
  };

  const getStatusColor = (isActive, isVerified) => {
    if (!isActive) return 'bg-red-100 text-red-700';
    if (!isVerified) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (isActive, isVerified) => {
    if (!isActive) return 'Inactive';
    if (!isVerified) return 'Pending';
    return 'Active';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Properties Management</h1>
          <p className="text-gray-600">Manage all properties on the platform</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statistics).map(([type, stats]) => (
          <div key={type} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1 capitalize">{type.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total || 0}</p>
            <p className="text-xs text-green-600 mt-1">{stats.active || 0} active</p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
          <select
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Properties List */}
      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property._id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <FaHome className="text-blue-600 text-2xl" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{property.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <FaMapMarkerAlt className="text-sm" />
                    <span className="text-sm">{property.location?.city}, {property.location?.state}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-6">
                    <div className="flex items-center gap-2">
                      <FaBed className="text-gray-500" />
                      <span className="text-sm text-gray-700">{property.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBath className="text-gray-500" />
                      <span className="text-sm text-gray-700">{property.bathrooms} baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-gray-500" />
                      <span className="text-sm font-semibold text-green-600">₹{property.rent?.amount?.toLocaleString() || 0}/mo</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Owner: {property.owner?.firstName} {property.owner?.lastName}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`px-4 py-1.5 ${getStatusColor(property.isActive, property.isVerified)} text-sm font-semibold rounded-full`}>
                  {getStatusText(property.isActive, property.isVerified)}
                </span>
                <div className="flex items-center gap-2">
                  {!property.isVerified && (
                    <button
                      onClick={() => updatePropertyStatus(property._id, property.isActive, true)}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                      title="Verify Property"
                    >
                      <FaCheck className="text-green-600" />
                    </button>
                  )}
                  <button
                    onClick={() => updatePropertyStatus(property._id, !property.isActive, property.isVerified)}
                    className={`p-2 hover:bg-${property.isActive ? 'red' : 'green'}-50 rounded-lg transition-colors`}
                    title={property.isActive ? 'Deactivate Property' : 'Activate Property'}
                  >
                    {property.isActive ? (
                      <FaTimes className="text-red-600" />
                    ) : (
                      <FaCheck className="text-green-600" />
                    )}
                  </button>
                  <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <FaEye className="text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertiesManagement;
