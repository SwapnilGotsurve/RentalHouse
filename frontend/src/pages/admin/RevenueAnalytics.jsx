import React, { useState, useEffect } from 'react';
import { 
  FaDollarSign, 
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
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('6months');

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/analytics/revenue?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data.data);
      } else {
        setError(data.message || 'Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `₹${((analyticsData?.overview?.totalRevenue || 0) / 1000).toFixed(1)}K`, 
      change: '+18.2%',
      icon: FaDollarSign, 
      color: 'bg-green-500'
    },
    { 
      label: 'Total Transactions', 
      value: analyticsData?.overview?.totalTransactions || 0, 
      change: '+15.3%',
      icon: FaDollarSign, 
      color: 'bg-blue-500'
    },
    { 
      label: 'Avg. Transaction', 
      value: `₹${analyticsData?.overview?.averageTransactionValue || 0}`, 
      change: '+5.2%',
      icon: FaCalendarAlt, 
      color: 'bg-orange-500'
    },
    { 
      label: 'Top Properties', 
      value: analyticsData?.topProperties?.length || 0, 
      change: '+12.8%',
      icon: FaChartLine, 
      color: 'bg-purple-500'
    },
  ];

  // Transform revenue data for chart
  const revenueData = analyticsData?.charts?.revenueOverTime?.map(item => ({
    month: `${item._id.month}/${item._id.year}`,
    revenue: item.revenue,
    transactions: item.transactions
  })) || [];

  // Transform revenue by type data for pie chart
  const categoryData = analyticsData?.charts?.revenueByType?.map((item, index) => ({
    name: item._id || 'Unknown',
    value: item.revenue,
    color: ['#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b'][index % 4]
  })) || [];

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
              <h2 className="text-lg font-bold text-gray-800">Revenue Over Time</h2>
              <p className="text-sm text-gray-600">Revenue and transaction trends</p>
            </div>
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1month">Last month</option>
              <option value="3months">Last 3 months</option>
              <option value="6months">Last 6 months</option>
              <option value="1year">Last year</option>
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
                  name="Revenue (₹)"
                />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Transactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Category and Top Properties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Category */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Revenue by Payment Type</h2>
            {categoryData.length > 0 ? (
              <>
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
                        <span className="text-sm text-gray-700 capitalize">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        ₹{item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No payment data available
              </div>
            )}
          </div>

          {/* Top Properties */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Top Performing Properties</h2>
            <div className="space-y-4">
              {analyticsData?.topProperties?.slice(0, 5).map((property, index) => (
                <div key={property._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{property.title}</p>
                      <p className="text-sm text-gray-600">{property.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">₹{property.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{property.transactions} transactions</p>
                  </div>
                </div>
              )) || (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  No property data available
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default RevenueAnalytics;
