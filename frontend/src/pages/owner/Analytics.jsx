import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const revenueData = [
    { month: 'Jan', revenue: 8000, bookings: 12 },
    { month: 'Feb', revenue: 9500, bookings: 15 },
    { month: 'Mar', revenue: 11000, bookings: 18 },
    { month: 'Apr', revenue: 12000, bookings: 20 },
    { month: 'May', revenue: 13500, bookings: 22 },
    { month: 'Jun', revenue: 15000, bookings: 25 },
  ];

  const propertyData = [
    { name: 'Beachfront Villa', value: 35, color: '#3b82f6' },
    { name: 'Mountain Cabin', value: 25, color: '#8b5cf6' },
    { name: 'Urban Apartment', value: 20, color: '#10b981' },
    { name: 'Country Estate', value: 20, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics</h1>
        <p className="text-gray-600">Comprehensive insights into your rental business</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Revenue & Bookings Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
              <Bar dataKey="bookings" fill="#8b5cf6" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Revenue by Property</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {propertyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border rounded-lg">
            <p className="text-3xl font-bold text-blue-600 mb-2">87%</p>
            <p className="text-gray-600">Average Occupancy Rate</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-3xl font-bold text-green-600 mb-2">4.8/5</p>
            <p className="text-gray-600">Average Guest Rating</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-3xl font-bold text-purple-600 mb-2">$2,450</p>
            <p className="text-gray-600">Average Revenue per Booking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

