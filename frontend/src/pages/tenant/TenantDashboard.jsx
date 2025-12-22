import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaDollarSign, FaEnvelope, FaWrench, FaCheckCircle, FaClock, FaHeart, FaBell, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const TenantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    likedProperties: 0,
    rentalRequests: 0,
    maintenanceRequests: 0,
    pendingMaintenance: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch liked properties count
      const likedResponse = await fetch('http://localhost:5000/api/liked-properties', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const likedData = await likedResponse.json();
      
      // Fetch rental requests count
      const rentalResponse = await fetch('/api/rental-requests/tenant', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const rentalData = await rentalResponse.json();
      
      // Fetch maintenance requests stats
      const maintenanceResponse = await fetch('/api/maintenance/stats/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const maintenanceData = await maintenanceResponse.json();
      
      setStats({
        likedProperties: likedData.success ? likedData.data.likedProperties.length : 0,
        rentalRequests: rentalData.success ? rentalData.data.requests.length : 0,
        maintenanceRequests: maintenanceData.success ? maintenanceData.data.overview.totalRequests : 0,
        pendingMaintenance: maintenanceData.success ? maintenanceData.data.overview.pendingRequests : 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/me/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data.notifications.slice(0, 5)); // Show latest 5
        setUnreadCount(data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/users/me/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'rental_approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'rental_rejected':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaBell className="text-blue-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'rental_approved':
        return 'bg-green-50 border-green-200';
      case 'rental_rejected':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const dashboardStats = [
    { 
      label: 'Liked Properties', 
      value: loading ? '...' : stats.likedProperties, 
      sublabel: 'Properties saved', 
      icon: FaHeart, 
      color: 'bg-red-500' 
    },
    { 
      label: 'Rental Requests', 
      value: loading ? '...' : stats.rentalRequests, 
      sublabel: 'Applications sent', 
      icon: FaCalendarAlt, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Maintenance Requests', 
      value: loading ? '...' : stats.maintenanceRequests, 
      sublabel: 'Total requests', 
      icon: FaWrench, 
      color: 'bg-teal-500' 
    },
    { 
      label: 'Pending Issues', 
      value: loading ? '...' : stats.pendingMaintenance, 
      sublabel: 'Awaiting response', 
      icon: FaClock, 
      color: 'bg-orange-500' 
    },
  ];

  const quickActions = [
    { label: 'Browse Properties', sublabel: 'Find your next home', icon: FaCalendarAlt, link: '/search' },
    { label: 'Liked Properties', sublabel: 'View saved properties', icon: FaHeart, link: '/tenant/liked-properties' },
    { label: 'Rental Requests', sublabel: 'Check application status', icon: FaEnvelope, link: '/tenant/rental-requests' },
    { label: 'Maintenance', sublabel: 'Report issues', icon: FaWrench, link: '/tenant/maintenance' },
  ];

  const importantInfo = [
    { label: 'LIKED PROPERTIES', date: `${stats.likedProperties} saved`, color: 'bg-red-100 text-red-700' },
    { label: 'RENTAL APPLICATIONS', date: `${stats.rentalRequests} sent`, color: 'bg-blue-100 text-blue-700' },
    { label: 'MAINTENANCE ISSUES', date: `${stats.pendingMaintenance} pending`, color: 'bg-orange-100 text-orange-700' },
  ];

  const recentActivity = [
    { 
      title: 'Welcome to the platform!', 
      description: 'Start by browsing properties and saving your favorites', 
      time: 'Just now',
      icon: FaCheckCircle,
      iconColor: 'text-blue-500'
    },
    { 
      title: 'Profile created', 
      description: 'Your tenant profile is ready', 
      time: 'Today',
      icon: FaCheckCircle,
      iconColor: 'text-green-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back, {user?.firstName || 'Tenant'}</h1>
        <p className="text-gray-600">Find your perfect rental property</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
              <p className="text-xs text-gray-500">{stat.sublabel}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Important Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <a
                  key={index}
                  href={action.link}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all text-left no-underline"
                >
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Icon className="text-gray-600 text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{action.label}</p>
                    <p className="text-sm text-gray-500">{action.sublabel}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Important Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Important Info</h2>
          <div className="space-y-3">
            {importantInfo.map((info, index) => (
              <div key={index} className={`${info.color} rounded-lg p-4`}>
                <p className="text-xs font-semibold mb-1">{info.label}</p>
                <p className="font-bold">{info.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaBell />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
            <button
              onClick={() => navigate('/tenant/rental-requests')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${
                  !notification.read ? 'border-l-4' : ''
                } cursor-pointer hover:shadow-md transition-all`}
                onClick={() => {
                  markAsRead(notification._id);
                  if (notification.rentalRequest) {
                    navigate('/tenant/rental-requests');
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div className={`${activity.iconColor} mt-1`}>
                  <Icon className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
