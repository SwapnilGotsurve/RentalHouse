import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEnvelope, FaCalendar, FaUser, FaHome, FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RentalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRentalRequests();
  }, [statusFilter]);

  const fetchRentalRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to view rental requests');
        return;
      }
      
      const url = statusFilter === 'all' 
        ? '/api/rental-requests/owner'
        : `/api/rental-requests/owner?status=${statusFilter}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.data.requests || []);
      } else {
        console.error('API Error:', data.message);
        setRequests([]);
        // Don't show alert for empty results, just log it
        if (data.message && !data.message.includes('not found')) {
          alert(data.message || 'Error fetching rental requests');
        }
      }
    } catch (error) {
      console.error('Error fetching rental requests:', error);
      setRequests([]);
      alert('Error fetching rental requests. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, status, message = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/rental-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, message })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Request ${status} successfully!`);
        fetchRentalRequests();
        setSelectedRequest(null);
      } else {
        alert(data.message || `Error ${status}ing request`);
      }
    } catch (error) {
      console.error(`Error ${status}ing request:`, error);
      alert(`Error ${status}ing request`);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      approved: 'bg-green-100 text-green-700 border-green-300',
      rejected: 'bg-red-100 text-red-700 border-red-300',
      withdrawn: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[status] || badges.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredRequests = requests.filter(request => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const tenantName = `${request.tenant?.firstName || ''} ${request.tenant?.lastName || ''}`.toLowerCase();
    const propertyTitle = request.property?.title?.toLowerCase() || '';
    return tenantName.includes(searchLower) || propertyTitle.includes(searchLower);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Rental Applications</h1>
          <p className="text-gray-600">Review and manage rental applications from tenants</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by tenant name or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rental requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FaEnvelope className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">No rental requests found</p>
          <p className="text-sm text-gray-500">
            {statusFilter !== 'all' 
              ? `No ${statusFilter} requests at the moment`
              : 'Rental applications will appear here when tenants apply'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Left Section - Tenant & Property Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {request.tenant?.firstName?.charAt(0) || 'T'}
                      {request.tenant?.lastName?.charAt(0) || ''}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {request.tenant?.firstName} {request.tenant?.lastName}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400" />
                          {request.tenant?.email}
                        </p>
                        {request.tenant?.phone && (
                          <p className="flex items-center gap-2">
                            <FaUser className="text-gray-400" />
                            {request.tenant.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaHome className="text-blue-600" />
                      <h4 className="font-semibold text-gray-800">{request.property?.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {request.property?.location?.address}, {request.property?.location?.city}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-semibold text-blue-600">
                        ₹{request.property?.rent?.toLocaleString() || request.property?.rent?.amount?.toLocaleString()}/month
                      </span>
                      <span>•</span>
                      <span>{request.property?.bedrooms} BHK</span>
                    </div>
                  </div>

                  {/* Tenant Details */}
                  {request.tenantDetails && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500">Occupation</p>
                        <p className="font-medium text-gray-800">{request.tenantDetails.occupation || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Monthly Income</p>
                        <p className="font-medium text-gray-800">
                          ₹{request.tenantDetails.monthlyIncome?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Family Size</p>
                        <p className="font-medium text-gray-800">{request.tenantDetails.familySize || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Max Budget</p>
                        <p className="font-medium text-gray-800">
                          ₹{request.leasePreferences?.maxRentBudget?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Lease Preferences */}
                  {request.leasePreferences && (
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400" />
                        <span>
                          Move-in: {new Date(request.leasePreferences.preferredStartDate).toLocaleDateString()}
                        </span>
                      </div>
                      <span>•</span>
                      <span>Duration: {request.leasePreferences.preferredDuration} months</span>
                    </div>
                  )}

                  {/* Message */}
                  {request.message && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Message:</span> {request.message}
                    </p>
                  </div>
                  )}

                  {/* Applied Date */}
                  <p className="text-xs text-gray-500">
                    Applied on: {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Right Section - Actions */}
                {request.status === 'pending' && (
                  <div className="flex flex-col gap-2 md:min-w-[200px]">
                    <button
                      onClick={() => handleStatusChange(request._id, 'approved')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <FaCheckCircle />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const message = prompt('Please provide a reason for rejection (optional):');
                        if (message !== null) {
                          handleStatusChange(request._id, 'rejected', message);
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <FaTimesCircle />
                      Reject
                    </button>
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                )}

                {request.status !== 'pending' && (
                  <div className="flex flex-col gap-2 md:min-w-[200px]">
                    {request.ownerResponse?.message && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-2">
                        <p className="text-xs text-gray-500 mb-1">Your Response:</p>
                        <p className="text-sm text-gray-700">{request.ownerResponse.message}</p>
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Application Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Tenant Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Tenant Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedRequest.tenant?.firstName} {selectedRequest.tenant?.lastName}</p>
                  <p><span className="font-medium">Email:</span> {selectedRequest.tenant?.email}</p>
                  {selectedRequest.tenant?.phone && <p><span className="font-medium">Phone:</span> {selectedRequest.tenant.phone}</p>}
                  {selectedRequest.tenantDetails && (
                    <>
                      <p><span className="font-medium">Occupation:</span> {selectedRequest.tenantDetails.occupation}</p>
                      <p><span className="font-medium">Monthly Income:</span> ₹{selectedRequest.tenantDetails.monthlyIncome?.toLocaleString()}</p>
                      <p><span className="font-medium">Family Size:</span> {selectedRequest.tenantDetails.familySize}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Property Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Property Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{selectedRequest.property?.title}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.property?.location?.address}</p>
                </div>
              </div>

              {/* Lease Preferences */}
              {selectedRequest.leasePreferences && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Lease Preferences</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Preferred Start Date:</span> {new Date(selectedRequest.leasePreferences.preferredStartDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Duration:</span> {selectedRequest.leasePreferences.preferredDuration} months</p>
                    <p><span className="font-medium">Max Budget:</span> ₹{selectedRequest.leasePreferences.maxRentBudget?.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* Message */}
              {selectedRequest.message && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Message from Tenant</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p>{selectedRequest.message}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedRequest._id, 'approved');
                      setSelectedRequest(null);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={() => {
                      const message = prompt('Please provide a reason for rejection (optional):');
                      if (message !== null) {
                        handleStatusChange(selectedRequest._id, 'rejected', message);
                        setSelectedRequest(null);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalRequests;

