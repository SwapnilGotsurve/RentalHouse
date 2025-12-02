import React from 'react';
import { 
  FaDollarSign, 
  // FaTrendingUp, 
  FaChartLine,
  FaCalendarAlt 
} from 'react-icons/fa';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const RevenueAnalytics = () => {
  const stats = [
    { 
      label: 'Total Revenue', 
      value: '$847,392', 
      change: '+18.2%',
      icon: FaDollarSign, 
      color: 'bg-green-500'
    },
    { 
      label: 'Monthly Growth', 
      value: '+$124.5K', 
      change: '+15.3%',
      icon: FaDollarSign, 
      color: 'bg-blue-500'
    },
    { 
      label: 'Active Subscriptions', 
      value: '1,847', 
      change: '+12.8%',
      icon: FaChartLine, 
      color: 'bg-purple-500'
    },
    { 
      label: 'Avg. Transaction', 
      value: '$458', 
      change: '+5.2%',
      icon: FaCalendarAlt, 
      color: 'bg-orange-500'
    },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 65000, expenses: 45000 },
    { month: 'Feb', revenue: 72000, expenses: 48000 },
    { month: 'Mar', revenue: 78000, expenses: 52000 },
    { month: 'Apr', revenue: 85000, expenses: 55000 },
    { month: 'May', revenue: 92000, expenses: 58000 },
    { month: 'Jun', revenue: 98000, expenses: 60000 },
  ];

  const categoryData = [
    { name: 'Rent Payments', value: 450000, color: '#14b8a6' },
    { name: 'Service Fees', value: 250000, color: '#3b82f6' },
    { name: 'Premium Plans', value: 147392, color: '#8b5cf6' },
  ];

  const transactionData = [
    { month: 'Jan', transactions: 1200 },
    { month: 'Feb', transactions: 1350 },
    { month: 'Mar', transactions: 1450 },
    { month: 'Apr', transactions: 1600 },
    { month: 'May', transactions: 1750 },
    { month: 'Jun', transactions: 1847 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Revenue Analytics</h1>
        <p className="text-gray-600">Track and analyze platform revenue</p>
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

      {/* Revenue vs Expenses Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Revenue vs Expenses</h2>
            <p className="text-sm text-gray-600">Monthly comparison</p>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 6 months</option>
            <option>Last 12 months</option>
            <option>This year</option>
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
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
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#14b8a6" 
                strokeWidth={3}
                name="Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue by Category and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Revenue by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  ${item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Volume */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Transaction Volume</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionData}>
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
                <Bar dataKey="transactions" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
