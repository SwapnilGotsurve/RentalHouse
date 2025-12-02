import React from 'react';
import { 
  FaUsers, 
  FaBuilding, 
  FaDollarSign, 
  FaChartLine,
  FaHome,
  FaUserCheck,
  FaFileContract,
  FaCheckCircle
} from 'react-icons/fa';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

const AdminDashboard = () => {
  const stats = [
    { 
      label: 'Total Users', 
      value: '2,543', 
      change: '+12.5%',
      icon: FaUsers, 
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Active Properties', 
      value: '1,284', 
      change: '+8.2%',
      icon: FaBuilding, 
      color: 'bg-teal-500',
      bgLight: 'bg-teal-50',
      textColor: 'text-teal-600'
    },
    { 
      label: 'Monthly Revenue', 
      value: '$124.5K', 
      change: '+15.3%',
      icon: FaDollarSign, 
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      label: 'Platform Health', 
      value: '99.8%', 
      change: '+0.2%',
      icon: FaChartLine, 
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
  ];

  const userGrowthData = [
    { month: 'Jan', users: 1800 },
    { month: 'Feb', users: 1950 },
    { month: 'Mar', users: 2100 },
    { month: 'Apr', users: 2200 },
    { month: 'May', users: 2350 },
    { month: 'Jun', users: 2543 },
  ];

  const quickStats = [
    { label: 'New Users (Today)', value: '142', color: 'bg-blue-100 text-blue-700' },
    { label: 'Pending Verifications', value: '23', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Active Leases', value: '1,089', color: 'bg-pink-100 text-pink-700' },
  ];

  const recentActivity = [
    { 
      title: 'New property listed', 
      description: 'Luxury Apartment - Downtown', 
      time: '2 mins ago',
      icon: FaHome,
      iconColor: 'text-blue-500'
    },
    { 
      title: 'User verification', 
      description: 'John Doe verification pending review', 
      time: '5 mins ago',
      icon: FaUserCheck,
      iconColor: 'text-orange-500'
    },
    { 
      title: 'Payment received', 
      description: 'Monthly subscription renewal processed', 
      time: '12 mins ago',
      icon: FaCheckCircle,
      iconColor: 'text-green-500'
    },
    { 
      title: 'Lease agreement', 
      description: 'New lease signed between tenant & owner', 
      time: '1 hour ago',
      icon: FaFileContract,
      iconColor: 'text-purple-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Super Admin Dashboard</h1>
        <p className="text-gray-600">Monitor your entire rental platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                  <p className="text-xs text-green-600 font-semibold mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">User Growth</h2>
              <p className="text-sm text-gray-600">Last 6 months</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
              View Details
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#14b8a6" 
                  strokeWidth={2}
                  fill="url(#colorUsers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">Chart visualization here</p>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Quick Stats</h2>
          <div className="space-y-4">
            {quickStats.map((stat, index) => (
              <div key={index} className={`${stat.color} rounded-lg p-4`}>
                <p className="text-xs font-semibold mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h2>
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
                <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
