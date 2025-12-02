import React from 'react';
import { FaHome, FaMapMarkerAlt, FaBed, FaBath, FaDollarSign } from 'react-icons/fa';

const PropertiesManagement = () => {
  const properties = [
    {
      id: 1,
      name: 'Downtown Apartment',
      location: 'Downtown District',
      address: '123 Main St',
      bedrooms: 2,
      bathrooms: 2,
      rent: '$2,500',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      id: 2,
      name: 'Suburban House',
      location: 'Suburban Area',
      address: '456 Oak Ave',
      bedrooms: 3,
      bathrooms: 2,
      rent: '$3,400',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      id: 3,
      name: 'Lakefront Villa',
      location: 'Lakefront District',
      address: '789 Lake Rd',
      bedrooms: 4,
      bathrooms: 3,
      rent: '$5,600',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-700'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Properties</h1>
          <p className="text-gray-600">Manage all properties on the platform</p>
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaHome className="text-blue-600 text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{property.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <FaMapMarkerAlt className="text-sm" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex items-center gap-2">
                      <FaBed className="text-gray-500" />
                      <span className="text-sm text-gray-700">{property.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBath className="text-gray-500" />
                      <span className="text-sm text-gray-700">{property.bathrooms} baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-gray-500" />
                      <span className="text-sm font-semibold text-green-600">{property.rent}/mo</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`px-4 py-1.5 ${property.statusColor} text-sm font-semibold rounded-full`}>
                  {property.status}
                </span>
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
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

export default PropertiesManagement;
