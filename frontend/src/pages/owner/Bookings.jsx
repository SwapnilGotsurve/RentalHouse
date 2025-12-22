import React from 'react';
import { FaFilter, FaDownload, FaEye, FaCheckCircle, FaClock } from 'react-icons/fa';

const Bookings = () => {
  const bookings = [
    {
      id: 1,
      guest: { name: 'Sarah Johnson', avatar: 'SJ' },
      property: 'Beachfront Villa',
      checkIn: '2024-12-10',
      checkOut: '2024-12-15',
      status: 'Confirmed',
      amount: '$1,750',
    },
    {
      id: 2,
      guest: { name: 'Michael Chen', avatar: 'MC' },
      property: 'Mountain Cabin',
      checkIn: '2024-12-12',
      checkOut: '2024-12-16',
      status: 'Pending',
      amount: '$1,120',
    },
    {
      id: 3,
      guest: { name: 'Emma Wilson', avatar: 'EW' },
      property: 'Urban Apartment',
      checkIn: '2024-12-18',
      checkOut: '2024-12-22',
      status: 'Confirmed',
      amount: '$800',
    },
    {
      id: 4,
      guest: { name: 'David Brown', avatar: 'DB' },
      property: 'Country Estate',
      checkIn: '2024-12-20',
      checkOut: '2024-12-28',
      status: 'Confirmed',
      amount: '$3,200',
    },
  ];

  const getStatusIcon = (status) => {
    return status === 'Confirmed' ? (
      <FaCheckCircle className="text-green-600" />
    ) : (
      <FaClock className="text-yellow-600" />
    );
  };

  const getStatusColor = (status) => {
    return status === 'Confirmed' ? 'text-green-600' : 'text-yellow-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Bookings</h1>
          <p className="text-gray-600">Track and manage {bookings.length} guest reservations.</p>
        </div>
   
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {booking.guest.avatar}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{booking.guest.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.property}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <span className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{booking.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                      <FaEye />
                      View
                    </button>
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

export default Bookings;

