import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaDollarSign, FaHome, FaUsers, FaChartLine, FaEnvelope, FaClock, FaCheckCircle } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalRentalRequests: 0,
    pendingRequests: 0,
    totalRevenue: 0
  });
  const [rentalRequests, setRentalRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get current user info first
      const userResponse = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await userResponse.json();
      
      if (!userData.success) {
        console.error('Failed to get user info');
        return;
      }
      
      // Fetch properties
      const propertiesResponse = await fetch(`/api/properties/owner/${userData.user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const propertiesData = await propertiesResponse.json();
      
      // Fetch rental requests
      const rentalResponse = await fetch('/api/rental-requests/owner', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const rentalData = await rentalResponse.json();
      
      if (propertiesData.success) {
        setStats(prev => ({
          ...prev,
          totalProperties: propertiesData.data.properties.length
        }));
      }
      
      if (rentalData.success) {
        setRentalRequests(rentalData.data.requests.slice(0, 5)); // Show latest 5
        const pendingCount = rentalData.data.requests.filter(req => req.status === 'pending').length;
        setStats(prev => ({
          ...prev,
          totalRentalRequests: rentalData.data.requests.length,
          pendingRequests: pendingCount
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/rental-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: action === 'approve' ? 'approved' : 'rejected'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchDashboardData(); // Refresh data
      } else {
        alert(data.message || `Error ${action}ing request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Error ${action}ing request`);
    }
  };
  const revenueData = [
    { name: 'Jan', revenue: 8000, expenses: 3000 },
    { name: 'Feb', revenue: 9500, expenses: 4500 },
    { name: 'Mar', revenue: 6000, expenses: 9500 },
    { name: 'Apr', revenue: 8500, expenses: 5500 },
    { name: 'May', revenue: 10000, expenses: 6000 },
    { name: 'Jun', revenue: 12000, expenses: 7000 },
  ];

  const metrics = [
    {
      title: 'Total Properties',
      value: loading ? '...' : stats.totalProperties,
      change: 'Properties listed',
      icon: FaHome,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Rental Applications',
      value: loading ? '...' : stats.totalRentalRequests,
      change: 'Total applications',
      icon: FaEnvelope,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Requests',
      value: loading ? '...' : stats.pendingRequests,
      change: 'Awaiting response',
      icon: FaClock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Properties Revenue',
      value: '₹45,000',
      change: 'Monthly earnings',
      icon: FaDollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome back, John! 👋
        </h1>
        <p className="text-gray-600">
          Here's your rental property performance at a glance
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium">{metric.title}</h3>
                <div className={`${metric.bgColor} p-3 rounded-lg`}>
                  <Icon className={`${metric.color} text-xl`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-2">{metric.value}</p>
              <p className="text-sm text-blue-600 flex items-center gap-1">
                <span>{metric.change}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts and Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#9333ea" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">→ expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">→ revenue</span>
            </div>
          </div>
        </div>

        {/* Recent Rental Requests */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Rental Applications</h2>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading applications...</p>
            </div>
          ) : rentalRequests.length === 0 ? (
            <div className="text-center py-8">
              <FaEnvelope className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">No rental applications yet</p>
              <p className="text-sm text-gray-500">Applications will appear here when tenants apply</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rentalRequests.map((request) => (
                <div key={request._id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {request.tenant.firstName} {request.tenant.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {request.property ? request.property.title : 'Property information unavailable'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Applied: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      request.status === 'approved' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  {request.message && (
                    <p className="text-sm text-gray-600 mb-3">"{request.message}"</p>
                  )}
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRequestAction(request._id, 'approve')}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRequestAction(request._id, 'reject')}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <button 
            onClick={() => navigate('/owner/rental-requests')}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Applications →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

