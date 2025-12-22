import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaFileAlt, 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRulerCombined,
  FaRupeeSign,
  FaCalendarAlt,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaSearch,
  FaFilter,
  FaHome,
  FaUser,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

const RentalRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRentalRequests();
  }, []);

  const fetchRentalRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/rental-requests/tenant', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setRequests(data.data.requests);
      } else {
        setError(data.message || 'Failed to fetch rental requests');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error fetching rental requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/rental-requests/${requestId}/withdraw`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setRequests(prev => prev.map(req => 
          req._id === requestId ? { ...req, status: 'withdrawn' } : req
        ));
      } else {
        setError(data.message || 'Failed to withdraw request');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error withdrawing request:', error);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return FaClock;
      case 'approved': return FaCheckCircle;
      case 'rejected': return FaTimesCircle;
      case 'withdrawn': return FaExclamationCircle;
      default: return FaClock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openRequestModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
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
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600">Track your rental applications</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaFileAlt className="text-blue-500" />
          <span>{requests.length} total applications</span>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Applications List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FaFileAlt className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {requests.length === 0 ? 'No applications yet' : 'No applications match your filter'}
          </h3>
          <p className="text-gray-600 mb-4">
            {requests.length === 0 
              ? "You haven't submitted any rental applications yet. Browse properties and apply to rent them." 
              : "Try changing your filter to see more applications."}
          </p>
          {requests.length === 0 && (
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
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const StatusIcon = getStatusIcon(request.status);
            const property = request.property;
            
            return (
              <div key={request._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Property Image */}
                  <div className="lg:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {property?.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0].url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaHome className="text-2xl text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Application Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {property?.title || 'Property Title'}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <FaMapMarkerAlt className="text-sm mr-1" />
                          <span className="text-sm">
                            {property?.location?.city}, {property?.location?.state}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          <StatusIcon className="inline mr-1" />
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Property Info */}
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <FaBed className="text-xs" />
                        <span>{property?.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaBath className="text-xs" />
                        <span>{property?.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaRulerCombined className="text-xs" />
                        <span>{property?.area?.value} {property?.area?.unit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaRupeeSign className="text-xs" />
                        <span>{property?.rent?.amount?.toLocaleString()}/month</span>
                      </div>
                    </div>

                    {/* Application Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Application #:</span>
                        <div className="font-medium">{request.applicationNumber}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Submitted:</span>
                        <div className="font-medium">{new Date(request.submittedAt).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Preferred Start:</span>
                        <div className="font-medium">{new Date(request.leasePreferences.preferredStartDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <div className="font-medium">{request.leasePreferences.preferredDuration} months</div>
                      </div>
                    </div>

                    {/* Owner Response */}
                    {request.ownerResponse?.message && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">Owner Response:</div>
                        <div className="text-sm text-gray-600">{request.ownerResponse.message}</div>
                        {request.ownerResponse.responseDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(request.ownerResponse.responseDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => openRequestModal(request)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleWithdrawRequest(request._id)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          Withdraw
                        </button>
                      )}
                      <Link
                        to={`/property/${property?._id}`}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        View Property
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Summary */}
      {requests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {requests.length}
              </div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {requests.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {requests.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Application Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Application Info */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Application Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Application Number:</span>
                      <div className="font-medium">{selectedRequest.applicationNumber}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Submitted Date:</span>
                      <div className="font-medium">{new Date(selectedRequest.submittedAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Days Since Application:</span>
                      <div className="font-medium">{selectedRequest.daysSinceApplication || 0} days</div>
                    </div>
                  </div>
                </div>

                {/* Tenant Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Your Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Occupation:</span>
                      <div className="font-medium">{selectedRequest.tenantDetails.occupation}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Monthly Income:</span>
                      <div className="font-medium">₹{selectedRequest.tenantDetails.monthlyIncome?.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Family Size:</span>
                      <div className="font-medium">{selectedRequest.tenantDetails.familySize}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Pets:</span>
                      <div className="font-medium">{selectedRequest.tenantDetails.hasPets ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>

                {/* Lease Preferences */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Lease Preferences</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Preferred Start Date:</span>
                      <div className="font-medium">{new Date(selectedRequest.leasePreferences.preferredStartDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <div className="font-medium">{selectedRequest.leasePreferences.preferredDuration} months</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Budget:</span>
                      <div className="font-medium">₹{selectedRequest.leasePreferences.maxRentBudget?.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {selectedRequest.message && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Your Message</h4>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      {selectedRequest.message}
                    </div>
                  </div>
                )}

                {/* Owner Response */}
                {selectedRequest.ownerResponse?.message && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Owner Response</h4>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm">
                      {selectedRequest.ownerResponse.message}
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(selectedRequest.ownerResponse.responseDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalRequests;