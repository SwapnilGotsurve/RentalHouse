import React from 'react';
import { 
  FaServer, 
  FaDatabase, 
  FaNetworkWired,
  FaCheckCircle,
  FaExclamationTriangle 
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
  ResponsiveContainer 
} from 'recharts';

const SystemMonitoring = () => {
  const systemStats = [
    { 
      label: 'Server Uptime', 
      value: '99.98%', 
      status: 'Healthy',
      icon: FaServer, 
      color: 'bg-green-500',
      statusColor: 'text-green-600'
    },
    { 
      label: 'Database Status', 
      value: 'Optimal', 
      status: 'Running',
      icon: FaDatabase, 
      color: 'bg-blue-500',
      statusColor: 'text-blue-600'
    },
    { 
      label: 'API Response', 
      value: '124ms', 
      status: 'Fast',
      icon: FaNetworkWired, 
      color: 'bg-purple-500',
      statusColor: 'text-purple-600'
    },
    { 
      label: 'Active Users', 
      value: '1,247', 
      status: 'Online',
      icon: FaCheckCircle, 
      color: 'bg-teal-500',
      statusColor: 'text-teal-600'
    },
  ];

  const cpuData = [
    { time: '00:00', usage: 45 },
    { time: '04:00', usage: 38 },
    { time: '08:00', usage: 62 },
    { time: '12:00', usage: 75 },
    { time: '16:00', usage: 68 },
    { time: '20:00', usage: 52 },
  ];

  const memoryData = [
    { time: '00:00', usage: 4.2 },
    { time: '04:00', usage: 3.8 },
    { time: '08:00', usage: 5.1 },
    { time: '12:00', usage: 6.3 },
    { time: '16:00', usage: 5.8 },
    { time: '20:00', usage: 4.9 },
  ];

  const apiData = [
    { time: '00:00', requests: 1200 },
    { time: '04:00', requests: 800 },
    { time: '08:00', requests: 2400 },
    { time: '12:00', requests: 3200 },
    { time: '16:00', requests: 2800 },
    { time: '20:00', requests: 1900 },
  ];

  const systemLogs = [
    { 
      type: 'success',
      message: 'Database backup completed successfully',
      time: '2 mins ago',
      icon: FaCheckCircle,
      iconColor: 'text-green-500'
    },
    { 
      type: 'warning',
      message: 'High memory usage detected on server-02',
      time: '15 mins ago',
      icon: FaExclamationTriangle,
      iconColor: 'text-yellow-500'
    },
    { 
      type: 'success',
      message: 'SSL certificate renewed',
      time: '1 hour ago',
      icon: FaCheckCircle,
      iconColor: 'text-green-500'
    },
    { 
      type: 'success',
      message: 'System update completed',
      time: '3 hours ago',
      icon: FaCheckCircle,
      iconColor: 'text-green-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">System Monitoring</h1>
        <p className="text-gray-600">Monitor system health and performance</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                  <p className={`text-xs font-semibold mt-1 ${stat.statusColor}`}>{stat.status}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Usage */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">CPU Usage</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#9ca3af" />
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
                  dataKey="usage" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#colorCpu)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Memory Usage (GB)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memoryData}>
                <defs>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#9ca3af" />
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
                  dataKey="usage" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fill="url(#colorMemory)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* API Requests */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-6">API Requests (per hour)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={apiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="#14b8a6" 
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Logs */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-6">System Logs</h2>
        <div className="space-y-4">
          {systemLogs.map((log, index) => {
            const Icon = log.icon;
            return (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div className={`${log.iconColor} mt-1`}>
                  <Icon className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{log.message}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{log.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoring;
