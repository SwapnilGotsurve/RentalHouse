import React, { useState } from 'react';
import { FaTimes, FaHome, FaCalendar, FaClock, FaBriefcase, FaRupeeSign, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

const RentalApplicationModal = ({ isOpen, onClose, property, onSubmit }) => {
  const [formData, setFormData] = useState({
    message: '',
    preferredStartDate: '',
    preferredDuration: '12',
    occupation: '',
    monthlyIncome: '',
    familySize: '',
    maxRentBudget: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/rental-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property._id,
          message: formData.message,
          preferredStartDate: formData.preferredStartDate,
          preferredDuration: parseInt(formData.preferredDuration),
          occupation: formData.occupation,
          monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
          familySize: parseInt(formData.familySize) || 1,
          maxRentBudget: parseFloat(formData.maxRentBudget) || 0
        })
      });

      const data = await response.json();

      if (data.success) {
        if (onSubmit) {
          onSubmit(data.data.rentalRequest);
        }
        // Reset form
        setFormData({
          message: '',
          preferredStartDate: '',
          preferredDuration: '12',
          occupation: '',
          monthlyIncome: '',
          familySize: '',
          maxRentBudget: ''
        });
        onClose();
        alert('Rental application submitted successfully!');
      } else {
        setError(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('An error occurred while submitting your application');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Apply for Rental</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Property Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-4">
            {property.images && property.images.length > 0 && (
              <img
                src={property.images[0].url || property.images[0]}
                alt={property.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800 mb-1">{property.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {property.location?.address}, {property.location?.city}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-semibold text-blue-600">
                  ₹{property.rent?.toLocaleString() || property.rent?.amount?.toLocaleString()}/month
                </span>
                <span>•</span>
                <span>{property.bedrooms} BHK</span>
                <span>•</span>
                <span>{property.area?.value || property.areaValue || 0} {property.area?.unit || 'sqft'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to Owner *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Tell the owner why you're interested in this property..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Introduce yourself and explain why you'd be a great tenant
              </p>
            </div>

            {/* Preferred Move-in Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaCalendar className="text-blue-600" />
                Preferred Move-in Date *
              </label>
              <input
                type="date"
                name="preferredStartDate"
                value={formData.preferredStartDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Lease Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaClock className="text-green-600" />
                Lease Duration *
              </label>
              <select
                name="preferredDuration"
                value={formData.preferredDuration}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="18">18 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaBriefcase className="text-purple-600" />
                Occupation *
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
                placeholder="e.g., Software Engineer, Teacher, Business Owner"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Monthly Income */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaRupeeSign className="text-green-600" />
                Monthly Income (₹) *
              </label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                required
                min="0"
                step="1000"
                placeholder="e.g., 50000"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Family Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaUsers className="text-blue-600" />
                Family Size *
              </label>
              <input
                type="number"
                name="familySize"
                value={formData.familySize}
                onChange={handleChange}
                required
                min="1"
                placeholder="Number of people"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Max Rent Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaMoneyBillWave className="text-orange-600" />
                Maximum Rent Budget (₹) *
              </label>
              <input
                type="number"
                name="maxRentBudget"
                value={formData.maxRentBudget}
                onChange={handleChange}
                required
                min="0"
                step="1000"
                placeholder="e.g., 20000"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your application will be sent to the property owner</li>
                <li>• The owner will review your application</li>
                <li>• You'll be notified once the owner responds</li>
                <li>• You can track your application status in your dashboard</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RentalApplicationModal;