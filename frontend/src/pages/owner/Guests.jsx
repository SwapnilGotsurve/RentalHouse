import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaHome, FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';

const Guests = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch approved rental requests to get tenants
      const response = await fetch('/api/rental-requests/owner?status=approved', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Group tenants by their ID and collect their properties
        const tenantsMap = new Map();
        
        data.data.requests.forEach(request => {
          const tenantId = request.tenant._id;
          
          if (!tenantsMap.has(tenantId)) {
            tenantsMap.set(tenantId, {
              tenant: request.tenant,
              tenantDetails: request.tenantDetails,
              leasePreferences: request.leasePreferences,
              properties: []
            });
          }
          
          tenantsMap.get(tenantId).properties.push({
            property: request.property,
            rentalRequest: request,
            status: request.status,
            approvedAt: request.approvedAt || request.reviewedAt,
            leasePreferences: request.leasePreferences
          });
        });
        
        setTenants(Array.from(tenantsMap.values()));
      } else {
        alert(data.message || 'Error fetching tenants');
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
      alert('Error fetching tenants');
    } finally {
      setLoading(false);
    }
  };

  const filteredTenants = tenants.filter(item => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const tenantName = `${item.tenant?.firstName || ''} ${item.tenant?.lastName || ''}`.toLowerCase();
    const tenantEmail = item.tenant?.email?.toLowerCase() || '';
    return tenantName.includes(searchLower) || tenantEmail.includes(searchLower);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Tenants</h1>
          <p className="text-gray-600">View all your approved tenants and their rented properties</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by tenant name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tenants List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tenants...</p>
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FaUser className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">No tenants found</p>
          <p className="text-sm text-gray-500">
            {searchTerm 
              ? 'No tenants match your search criteria'
              : 'Approved tenants will appear here once you approve rental applications'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTenants.map((item, index) => (
            <div key={item.tenant._id || index} className="bg-white rounded-lg shadow-sm p-6">
              {/* Tenant Header */}
              <div className="flex items-start gap-4 mb-6 pb-4 border-b">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {item.tenant.firstName?.charAt(0) || 'T'}
                  {item.tenant.lastName?.charAt(0) || ''}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.tenant.firstName} {item.tenant.lastName}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      {item.tenant.email}
                    </p>
                    {item.tenant.phone && (
                      <p className="flex items-center gap-2">
                        <FaPhone className="text-gray-400" />
                        {item.tenant.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Active Tenant
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {item.properties.length} {item.properties.length === 1 ? 'Property' : 'Properties'}
                  </p>
                </div>
              </div>

              {/* Tenant Details */}
              {item.tenantDetails && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Occupation</p>
                    <p className="font-medium text-gray-800">{item.tenantDetails.occupation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Monthly Income</p>
                    <p className="font-medium text-gray-800">
                      ₹{item.tenantDetails.monthlyIncome?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Family Size</p>
                    <p className="font-medium text-gray-800">{item.tenantDetails.familySize || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Max Budget</p>
                    <p className="font-medium text-gray-800">
                      ₹{item.leasePreferences?.maxRentBudget?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>
              )}

              {/* Properties */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaHome className="text-blue-600" />
                  Rented Properties ({item.properties.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.properties.map((propertyItem, propIndex) => (
                    <div
                      key={propertyItem.property._id || propIndex}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-semibold text-gray-800 flex-1">
                          {propertyItem.property.title}
                        </h5>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                          Rented
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <p className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" />
                          {propertyItem.property.location?.address}, {propertyItem.property.location?.city}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-blue-600">
                            ₹{propertyItem.property.rent?.toLocaleString() || propertyItem.property.rent?.amount?.toLocaleString()}/month
                          </span>
                          <span>•</span>
                          <span>{propertyItem.property.bedrooms} BHK</span>
                        </div>
                      </div>

                      {propertyItem.rentalRequest?.leasePreferences && (
                        <div className="pt-3 border-t border-gray-200 space-y-1 text-xs text-gray-500">
                          <p className="flex items-center gap-2">
                            <FaCalendar className="text-gray-400" />
                            Lease Start: {new Date(propertyItem.rentalRequest.leasePreferences.preferredStartDate).toLocaleDateString()}
                          </p>
                          <p>Duration: {propertyItem.rentalRequest.leasePreferences.preferredDuration} months</p>
                          {propertyItem.approvedAt && (
                            <p>Approved: {new Date(propertyItem.approvedAt).toLocaleDateString()}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Guests;
