import React, { useState } from 'react';
import { FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { 
      id: 1,
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'Owner',
      status: 'Verified',
      joined: '2024-07-16',
      statusColor: 'bg-green-100 text-green-700'
    },
    { 
      id: 2,
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'Tenant',
      status: 'Verified',
      joined: '2024-07-22',
      statusColor: 'bg-green-100 text-green-700'
    },
    { 
      id: 3,
      name: 'Robert Johnson', 
      email: 'robert@example.com', 
      role: 'Owner',
      status: 'Pending',
      joined: '2023-02-01',
      statusColor: 'bg-yellow-100 text-yellow-700'
    },
    { 
      id: 4,
      name: 'Emily Davis', 
      email: 'emily@example.com', 
      role: 'Tenant',
      status: 'Verified',
      joined: '2023-03-15',
      statusColor: 'bg-green-100 text-green-700'
    },
    { 
      id: 5,
      name: 'Michael Wilson', 
      email: 'michael@example.com', 
      role: 'Owner',
      status: 'Verified',
      joined: '2024-02-10',
      statusColor: 'bg-green-100 text-green-700'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
          <p className="text-gray-600">Manage all platform users</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          + Add User
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FaFilter className="text-gray-600" />
            <span className="text-gray-700 font-medium">Filters</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 ${user.statusColor} text-xs font-semibold rounded-full`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <FaEdit className="text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <FaTrash className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
