import React, { useState, useEffect } from 'react';
import { FaTools, FaCheckCircle, FaClock, FaExclamationTriangle, FaPlus } from 'react-icons/fa';

const Maintenance = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    inProgress: 0,
    completed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: 'plumbing',
    priority: 'medium',
    property: ''
  });
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchMaintenanceData();
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      // For now, we'll fetch all properties. In a real app, this would be properties the tenant has access to
      const response = await fetch('/api/properties', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setProperties(data.data.properties.slice(0, 10)); // Limit to first 10 for demo
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchMaintenanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch maintenance requests
      const requestsResponse = await fetch('/api/maintenance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const requestsData = await requestsResponse.json();
      
      // Fetch stats
      const statsResponse = await fetch('/api/maintenance/stats/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsResponse.json();
      
      if (requestsData.success) {
        setMaintenanceRequests(requestsData.data.maintenance);
      }
      
      if (statsData.success) {
        setStats({
          totalRequests: statsData.data.overview.totalRequests,
          inProgress: statsData.data.overview.inProgressRequests,
          completed: statsData.data.overview.completedRequests,
          pending: statsData.data.overview.pendingRequests
        });
      }
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newRequest)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowCreateForm(false);
        setNewRequest({
          title: '',
          description: '',
          category: 'plumbing',
          priority: 'medium',
          property: ''
        });
        fetchMaintenanceData(); // Refresh data
      } else {
        alert(data.message || 'Error creating maintenance request');
      }
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      alert('Error creating maintenance request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: FaCheckCircle, color: 'text-green-500', bg: 'bg-green-50' };
      case 'in-progress':
        return { icon: FaClock, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'acknowledged':
        return { icon: FaClock, color: 'text-yellow-500', bg: 'bg-yellow-50' };
      case 'pending':
        return { icon: FaClock, color: 'text-gray-500', bg: 'bg-gray-50' };
      default:
        return { icon: FaClock, color: 'text-gray-500', bg: 'bg-gray-50' };
    }
  };

  const dynamicStats = [
    { label: 'Total Requests', value: loading ? '...' : stats.totalRequests, icon: FaTools, color: 'bg-blue-500' },
    { label: 'In Progress', value: loading ? '...' : stats.inProgress, icon: FaClock, color: 'bg-orange-500' },
    { label: 'Completed', value: loading ? '...' : stats.completed, icon: FaCheckCircle, color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Maintenance Requests</h1>
          <p className="text-gray-600">Report and track your maintenance issues</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
        >
          <FaPlus />
          New Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dynamicStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Request Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create Maintenance Request</h3>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newRequest.category}
                  onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="hvac">HVAC</option>
                  <option value="appliances">Appliances</option>
                  <option value="structural">Structural</option>
                  <option value="painting">Painting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                <select
                  value={newRequest.property}
                  onChange={(e) => setNewRequest({...newRequest, property: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a property</option>
                  {properties.map(property => (
                    <option key={property._id} value={property._id}>
                      {property.title} - {property.location?.city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newRequest.priority}
                  onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* All Requests */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">All Requests</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading maintenance requests...</p>
          </div>
        ) : maintenanceRequests.length === 0 ? (
          <div className="text-center py-8">
            <FaTools className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-600">No maintenance requests yet</p>
            <p className="text-sm text-gray-500">Create your first request to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {maintenanceRequests.map((request) => {
              const statusIcon = getStatusIcon(request.status);
              const Icon = statusIcon.icon;
              return (
                <div key={request._id} className="flex items-center justify-between p-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`${statusIcon.bg} p-3 rounded-lg`}>
                      <Icon className={`${statusIcon.color} text-xl`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">{request.title}</p>
                      <p className="text-sm text-gray-600">
                        Submitted: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">{request.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`px-3 py-1 ${getStatusColor(request.status)} text-xs font-semibold rounded-full capitalize`}>
                          {request.status}
                        </span>
                        <span className={`px-3 py-1 ${getPriorityColor(request.priority)} text-xs font-semibold rounded-full capitalize`}>
                          {request.priority}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full capitalize">
                          {request.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
