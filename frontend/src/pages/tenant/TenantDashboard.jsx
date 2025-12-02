import React from 'react';
import { FaCalendarAlt, FaDollarSign, FaEnvelope, FaWrench, FaCheckCircle, FaClock } from 'react-icons/fa';

const TenantDashboard = () => {
  const stats = [
    { label: 'Rent Status', value: 'Paid', sublabel: 'Next due: January 1', icon: FaDollarSign, color: 'bg-green-500' },
    { label: 'Lease Duration', value: '8 months', sublabel: 'Started: May 1, 2024', icon: FaCalendarAlt, color: 'bg-blue-500' },
    { label: 'Open Requests', value: '0 Open', sublabel: 'All requests resolved', icon: FaWrench, color: 'bg-teal-500' },
    { label: 'Messages', value: '2 New', sublabel: 'From landlord', icon: FaEnvelope, color: 'bg-purple-500' },
  ];

  const quickActions = [
    { label: 'Pay Rent', sublabel: 'Make rent payment', icon: FaDollarSign },
    { label: 'View Lease', sublabel: 'See lease agreement', icon: FaCalendarAlt },
    { label: 'Contact Landlord', sublabel: 'Send a message', icon: FaEnvelope },
  ];

  const importantInfo = [
    { label: 'RENT PAYMENT', date: 'December 1, 2024', color: 'bg-green-100 text-green-700' },
    { label: 'LEASE END', date: 'August 15, 2025', color: 'bg-blue-100 text-blue-700' },
    { label: 'PROPERTY INSPECTION', date: 'Jan 30/26', color: 'bg-orange-100 text-orange-700' },
  ];

  const recentActivity = [
    { 
      title: 'Lease updated', 
      description: 'Lease renewal processed', 
      time: '2 hrs ago',
      icon: FaCheckCircle,
      iconColor: 'text-blue-500'
    },
    { 
      title: 'Payment processed', 
      description: 'Rent for $1,750 paid', 
      time: '1 day ago',
      icon: FaCheckCircle,
      iconColor: 'text-green-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Alex</h1>
        <p className="text-gray-600">Apartment 5B - Downtown Complex</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
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
                <button
                  key={index}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
                >
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Icon className="text-gray-600 text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{action.label}</p>
                    <p className="text-sm text-gray-500">{action.sublabel}</p>
                  </div>
                </button>
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
