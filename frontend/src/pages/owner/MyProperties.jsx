import React, { useState } from 'react';
import { FaMapMarkerAlt, FaDollarSign, FaUsers, FaEye, FaEdit, FaTrash, FaFilter, FaDownload } from 'react-icons/fa';

const MyProperties = () => {
  const [hoveredProperty, setHoveredProperty] = useState(null);

  const properties = [
    {
      id: 1,
      title: 'Beachfront Villa',
      location: 'Malibu, CA',
      price: '$350/night',
      status: 'Active',
      capacity: '6 guests max',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
    },
    {
      id: 2,
      title: 'Mountain Cabin',
      location: 'Aspen, CO',
      price: '$280/night',
      status: 'Active',
      capacity: '4 guests max',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    },
    {
      id: 3,
      title: 'Urban Apartment',
      location: 'New York, NY',
      price: '$200/night',
      status: 'Maintenance',
      capacity: '2 guests max',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    },
    {
      id: 4,
      title: 'Country Estate',
      location: 'Napa Valley, CA',
      price: '$450/night',
      status: 'Active',
      capacity: '8 guests max',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Properties</h1>
          <p className="text-gray-600">Manage and monitor all your {properties.length} rental properties</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FaFilter className="text-gray-600" />
            <span className="text-gray-700">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FaDownload className="text-gray-600" />
            <span className="text-gray-700">Export</span>
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors font-medium">
            + Add Property
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            onMouseEnter={() => setHoveredProperty(property.id)}
            onMouseLeave={() => setHoveredProperty(null)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {hoveredProperty === property.id && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-4">
                  <button className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors">
                    <FaEye className="text-gray-700" />
                  </button>
                  <button className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors">
                    <FaEdit className="text-gray-700" />
                  </button>
                  <button className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors">
                    <FaTrash className="text-red-600" />
                  </button>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{property.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-sm" />
                  <span className="text-sm">{property.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaDollarSign className="text-sm" />
                  <span className="text-sm">{property.price}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaUsers className="text-sm" />
                  <span className="text-sm">{property.capacity}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProperties;

