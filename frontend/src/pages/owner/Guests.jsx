import React from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Guests = () => {
  const guests = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 (555) 123-4567', bookings: 3, avatar: 'SJ' },
    { id: 2, name: 'Michael Chen', email: 'michael@example.com', phone: '+1 (555) 234-5678', bookings: 2, avatar: 'MC' },
    { id: 3, name: 'Emma Wilson', email: 'emma@example.com', phone: '+1 (555) 345-6789', bookings: 5, avatar: 'EW' },
    { id: 4, name: 'David Brown', email: 'david@example.com', phone: '+1 (555) 456-7890', bookings: 1, avatar: 'DB' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Guests</h1>
          <p className="text-gray-600">Manage your guest information and booking history</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FaFilter className="text-gray-600" />
            <span className="text-gray-700">Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guests.map((guest) => (
            <div key={guest.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {guest.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{guest.name}</h3>
                  <p className="text-sm text-gray-600">{guest.bookings} bookings</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">{guest.email}</p>
                <p className="text-gray-600">{guest.phone}</p>
              </div>
              <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guests;

