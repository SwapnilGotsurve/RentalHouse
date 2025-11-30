import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaDollarSign, FaHome, FaUsers, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const revenueData = [
    { name: '0', revenue: 8000, expenses: 3000 },
    { name: '1', revenue: 9500, expenses: 4500 },
    { name: '2', revenue: 6000, expenses: 9500 },
    { name: '3', revenue: 8500, expenses: 5500 },
    { name: '4', revenue: 10000, expenses: 6000 },
    { name: '5', revenue: 12000, expenses: 7000 },
  ];

  const recentBookings = [
    { guest: 'Sarah Johnson', property: 'Beachfront Villa', dates: 'Dec 10-15' },
    { guest: 'Michael Chen', property: 'Mountain Cabin', dates: 'Dec 12-16' },
    { guest: 'Emma Wilson', property: 'Urban Apartment', dates: 'Dec 18-22' },
  ];

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+12.5% from last month',
      icon: FaDollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Bookings',
      value: '8',
      change: '+2 from last month',
      icon: FaHome,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Guests',
      value: '247',
      change: '+34 from last month',
      icon: FaUsers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Occupancy Rate',
      value: '87%',
      change: '+5.2% from last month',
      icon: FaChartLine,
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
              <p className="text-sm text-green-600 flex items-center gap-1">
                <span>↑</span> {metric.change}
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

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Bookings</h2>
          <div className="space-y-4">
            {recentBookings.map((booking, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <p className="font-semibold text-gray-800">{booking.guest}</p>
                <p className="text-sm text-gray-600">{booking.property}</p>
                <p className="text-sm text-gray-500">{booking.dates}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
            View All Bookings →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

