import React from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaCalendarAlt,
  FaCheckCircle 
} from 'react-icons/fa';

const MyLease = () => {
  const profileInfo = [
    { label: 'Email', value: 'tenant@example.com', icon: FaEnvelope },
    { label: 'Phone', value: '+1 (555) 456-7890', icon: FaPhone },
    { label: 'Current Address', value: '456 Oak Street, Apt 101', icon: FaMapMarkerAlt },
    { label: 'Occupation', value: 'Software Engineer', icon: FaBriefcase },
    { label: 'Lease Start', value: 'January 1, 2024', icon: FaCalendarAlt },
    { label: 'Account Status', value: 'Active', icon: FaCheckCircle, valueColor: 'text-green-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600">View and manage your profile</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-24 h-24 bg-teal-500 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
            TU
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Tenant User</h2>
            <p className="text-gray-600 mb-4">Active Tenant</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profileInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <Icon className="text-gray-600 text-lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{info.label}</p>
                  <p className={`font-semibold ${info.valueColor || 'text-gray-800'}`}>
                    {info.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lease Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Lease Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold mb-1">LEASE START</p>
            <p className="text-xl font-bold text-gray-800">January 1, 2024</p>
          </div>
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-600 font-semibold mb-1">LEASE END</p>
            <p className="text-xl font-bold text-gray-800">December 31, 2024</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <p className="text-sm text-purple-600 font-semibold mb-1">MONTHLY RENT</p>
            <p className="text-xl font-bold text-gray-800">$1,750</p>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Property Details</h2>
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Property Address</span>
            <span className="font-semibold text-gray-800">456 Oak Street, Apt 101</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Property Type</span>
            <span className="font-semibold text-gray-800">Apartment</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Bedrooms</span>
            <span className="font-semibold text-gray-800">2</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Bathrooms</span>
            <span className="font-semibold text-gray-800">1</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600">Square Footage</span>
            <span className="font-semibold text-gray-800">850 sq ft</span>
          </div>
        </div>
      </div>

      {/* Landlord Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Landlord Information</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            JD
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">John Doe</p>
            <p className="text-gray-600">Property Owner</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <FaEnvelope className="text-gray-500" />
            <span>landlord@example.com</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaPhone className="text-gray-500" />
            <span>+1 (555) 123-4567</span>
          </div>
        </div>
        <button className="mt-6 w-full bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors font-semibold">
          Contact Landlord
        </button>
      </div>
    </div>
  );
};

export default MyLease;
