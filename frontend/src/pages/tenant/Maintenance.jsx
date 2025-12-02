import React from 'react';
import { FaTools, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const Maintenance = () => {
  const stats = [
    { label: 'Total Requests', value: '2', icon: FaTools, color: 'bg-blue-500' },
    { label: 'In Progress', value: '1', icon: FaClock, color: 'bg-orange-500' },
    { label: 'Completed', value: '0', icon: FaCheckCircle, color: 'bg-teal-500' },
  ];

  const requests = [
    {
      id: 1,
      title: 'Leaky Faucet',
      date: 'Submitted: Nov 12, 2024',
      status: 'Completed',
      priority: 'Medium',
      statusColor: 'bg-green-100 text-green-700',
      priorityColor: 'bg-orange-100 text-orange-700',
      icon: FaCheckCircle,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-50'
    },
    {
      id: 2,
      title: 'Air Conditioner Not Working',
      date: 'Submitted: Oct 23, 2024',
      status: 'Completed',
      priority: 'High',
      statusColor: 'bg-green-100 text-green-700',
      priorityColor: 'bg-red-100 text-red-700',
      icon: FaCheckCircle,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-50'
    },
    {
      id: 3,
      title: 'Painting Touch up Needed',
      date: 'Submitted: Oct 15, 2024',
      status: 'Pending',
      priority: 'Low',
      statusColor: 'bg-yellow-100 text-yellow-700',
      priorityColor: 'bg-gray-100 text-gray-700',
      icon: FaClock,
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-50'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Maintenance Requests</h1>
          <p className="text-gray-600">Report and track your maintenance issues</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          New Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
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

      {/* All Requests */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">All Requests</h2>
        <div className="space-y-4">
          {requests.map((request) => {
            const Icon = request.icon;
            return (
              <div key={request.id} className="flex items-center justify-between p-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`${request.iconBg} p-3 rounded-lg`}>
                    <Icon className={`${request.iconColor} text-xl`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{request.title}</p>
                    <p className="text-sm text-gray-600">{request.date}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-3 py-1 ${request.statusColor} text-xs font-semibold rounded-full`}>
                        {request.status}
                      </span>
                      <span className={`px-3 py-1 ${request.priorityColor} text-xs font-semibold rounded-full`}>
                        {request.priority}
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
      </div>
    </div>
  );
};

export default Maintenance;
