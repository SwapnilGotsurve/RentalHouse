import React, { useState, useEffect } from 'react';
import { FaHeart, FaShare, FaUser, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [liked, setLiked] = useState(false);
  const [currentReview, setCurrentReview] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [rentalRequest, setRentalRequest] = useState({
    message: '',
    moveInDate: '',
    leaseDuration: '12',
    occupation: '',
    monthlyIncome: '',
    familySize: '',
    maxRentBudget: ''
  });

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
      if (user && user.role === 'tenant') {
        checkIfLiked();
      }
    }
  }, [id, user]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`/api/properties/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProperty(data.data.property);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfLiked = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/liked-properties/check/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setLiked(data.data.isLiked);
      }
    } catch (error) {
      console.error('Error checking liked status:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (!user || user.role !== 'tenant') {
      alert('Please login as a tenant to like properties');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = liked ? 'DELETE' : 'POST';
      const url = `/api/liked-properties/${id}`;
      
      const response = await fetch(`http://localhost:5000${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLiked(!liked);
      } else {
        alert(data.message || 'Error updating liked status');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Error updating liked status');
    }
  };

  const handleRentalRequest = async (e) => {
    e.preventDefault();
    
    if (!user || user.role !== 'tenant') {
      alert('Please login as a tenant to apply for rental');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/rental-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: id,
          message: rentalRequest.message,
          preferredStartDate: rentalRequest.moveInDate,
          preferredDuration: parseInt(rentalRequest.leaseDuration),
          occupation: rentalRequest.occupation,
          monthlyIncome: parseFloat(rentalRequest.monthlyIncome) || 0,
          familySize: parseInt(rentalRequest.familySize) || 1,
          maxRentBudget: parseFloat(rentalRequest.maxRentBudget) || 0
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowRentalForm(false);
        setRentalRequest({
          message: '',
          moveInDate: '',
          leaseDuration: '12',
          occupation: '',
          monthlyIncome: '',
          familySize: '',
          maxRentBudget: ''
        });
        alert('Rental application submitted successfully!');
      } else {
        alert(data.message || 'Error submitting rental application');
      }
    } catch (error) {
      console.error('Error submitting rental request:', error);
      alert('Error submitting rental application');
    }
  };

  if (loading) {
    return (
      <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center py-8">
          <p className="text-gray-600">Property not found</p>
        </div>
      </div>
    );
  }

  const propertyImages = [
    'https://plus.unsplash.com/premium_photo-1676823547752-1d24e8597047?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
    'https://plus.unsplash.com/premium_photo-1684338795288-097525d127f0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdXNlJTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600'
  ];

  const reviews = [
    {
      id: 1,
      user: 'SwapnilPercy',
      rating: 4,
      comment: 'A very nice property in a good location. The owner is very cooperative and helpful. The apartment is well maintained.'
    },
    {
      id: 2,
      user: 'JohnDoe',
      rating: 5,
      comment: 'Great property with all amenities. Location is perfect for families. Highly recommended!'
    },
    {
      id: 3,
      user: 'JaneSmith',
      rating: 4,
      comment: 'Clean and well-maintained property. Good value for money. Would definitely recommend.'
    }
  ];

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Add logic to submit review
    setCurrentReview('');
  };

  return (
    <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span className="hover:text-blue-600 cursor-pointer">Home</span>
        <span className="mx-2">{'>'}</span>
        <span className="hover:text-blue-600 cursor-pointer">Property</span>
        <span className="mx-2">{'>'}</span>
        <span>Solapur</span>
      </div>

      {/* Title Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">{property.title}</h1>
          <p className="text-gray-600">{property.location?.address}, {property.location?.city}</p>
        </div>
        <div className="flex gap-4">
          {user && user.role === 'tenant' && (
            <button 
              className={`flex items-center gap-2 p-2 hover:text-red-500 ${liked ? 'text-red-500' : ''}`}
              onClick={handleLikeToggle}
            >
              <FaHeart className={liked ? 'text-red-500' : ''} />
            </button>
          )}
          <button className="flex items-center gap-2 p-2 hover:text-blue-500">
            <FaShare />
          </button>
        </div>
      </div>

      {/* Image Gallery Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-2 mb-8 h-[400px]">
        {property.images && property.images.length > 0 ? (
          property.images.slice(0, 4).map((image, index) => (
            <div key={index} className={`${index === 0 ? 'row-span-2' : ''} relative overflow-hidden rounded-lg`}>
              <img
                src={image.url}
                alt={`Property view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-gray-200 rounded-lg flex items-center justify-center h-full">
            <FaHome className="text-gray-400 text-6xl" />
          </div>
        )}
      </div>

      {/* Property Details Grid */}
      <div className="relative z-0 grid md:grid-cols-3 gap-8">
        {/* Left Section - Overview */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Rent</p>
                <p className="font-semibold">₹{(property.rent?.amount || property.rentAmount || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Deposit</p>
                <p className="font-semibold">₹{(property.securityDeposit || property.depositAmount || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Bedrooms</p>
                <p className="font-semibold">{property.bedrooms}</p>
              </div>
              <div>
                <p className="text-gray-600">Bathrooms</p>
                <p className="font-semibold">{property.bathrooms}</p>
              </div>
              <div>
                <p className="text-gray-600">Furnishing Status</p>
                <p className="font-semibold capitalize">{property.furnishingStatus || property.furnishingType}</p>
              </div>
              <div>
                <p className="text-gray-600">Property Type</p>
                <p className="font-semibold capitalize">{property.propertyType || property.type}</p>
              </div>
              <div>
                <p className="text-gray-600">Area</p>
                <p className="font-semibold">{property.area?.value || property.areaValue || 0} {property.area?.unit || 'sq ft'}</p>
              </div>
              <div>
                <p className="text-gray-600">Available for</p>
                <p className="font-semibold capitalize">{property.preferences?.tenantType || property.tenantPreference || property.availableFor}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700">{property.description}</p>
            </div>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.amenities.map((amenity, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location Map */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">
              <FaMapMarkerAlt className="inline mr-2 text-red-500" />
              Location of property
            </h2>
            <div className="h-[300px] bg-gray-200 rounded-lg">
              {/* Add your map component here */}
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121656.36753497597!2d75.83621456198041!3d17.661452169622294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc5d082b54ac5d5%3A0x3c719de6c83710d0!2sSolapur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1762368350250!5m2!1sen!2sin" className='w-full h-full'  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            
            {/* Review Form */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Give your review</p>
              <form onSubmit={handleSubmitReview} className="flex gap-2">
                <input
                  type="text"
                  value={currentReview}
                  onChange={(e) => setCurrentReview(e.target.value)}
                  className="flex-1 border rounded-lg px-4 py-2"
                  placeholder="Write your review..."
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Submit
                </button>
              </form>
            </div>

            {/* Review List */}
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaUser className="text-gray-400" />
                    <span className="font-semibold">{review.user}</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Contact Owner */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Property Owner</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <FaUser className="text-gray-400 text-xl" />
              </div>
              <div>
                <p className="font-semibold">
                  {property.owner ? `${property.owner.firstName} ${property.owner.lastName}` : 'Property Owner'}
                </p>
                <p className="text-sm text-gray-600">Property Owner</p>
              </div>
            </div>
            
            {user && user.role === 'tenant' ? (
              <div className="space-y-3">
                <button
                  onClick={() => setShowRentalForm(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Apply to Rent
                </button>
                <button
                  onClick={handleLikeToggle}
                  className={`w-full py-3 rounded-lg font-semibold border-2 transition-colors ${
                    liked 
                      ? 'bg-red-50 border-red-500 text-red-600 hover:bg-red-100' 
                      : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600'
                  }`}
                >
                  {liked ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-3">Login as a tenant to apply for this property</p>
                <a 
                  href="/login" 
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Login
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rental Application Modal */}
      {showRentalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Apply for Rental</h3>
            <form onSubmit={handleRentalRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message to Owner</label>
                <textarea
                  value={rentalRequest.message}
                  onChange={(e) => setRentalRequest({...rentalRequest, message: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Tell the owner why you're interested in this property..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Move-in Date</label>
                <input
                  type="date"
                  value={rentalRequest.moveInDate}
                  onChange={(e) => setRentalRequest({...rentalRequest, moveInDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lease Duration (months)</label>
                <select
                  value={rentalRequest.leaseDuration}
                  onChange={(e) => setRentalRequest({...rentalRequest, leaseDuration: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation *</label>
                <input
                  type="text"
                  value={rentalRequest.occupation}
                  onChange={(e) => setRentalRequest({...rentalRequest, occupation: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Software Engineer, Teacher"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (₹) *</label>
                <input
                  type="number"
                  value={rentalRequest.monthlyIncome}
                  onChange={(e) => setRentalRequest({...rentalRequest, monthlyIncome: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 50000"
                  min="0"
                  step="1000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Family Size *</label>
                <input
                  type="number"
                  value={rentalRequest.familySize}
                  onChange={(e) => setRentalRequest({...rentalRequest, familySize: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Number of people"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Rent Budget (₹) *</label>
                <input
                  type="number"
                  value={rentalRequest.maxRentBudget}
                  onChange={(e) => setRentalRequest({...rentalRequest, maxRentBudget: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 20000"
                  min="0"
                  step="1000"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRentalForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;