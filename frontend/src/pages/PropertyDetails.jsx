import React, { useState } from 'react';
import { FaHeart, FaShare, FaUser, FaMapMarkerAlt } from 'react-icons/fa';

const PropertyDetails = () => {
  const [liked, setLiked] = useState(false);
  const [currentReview, setCurrentReview] = useState('');

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
          <h1 className="text-2xl font-semibold mb-2">3 BHK Flat for rent in Solapur</h1>
          <p className="text-gray-600">Birajdar Complex, Rupa Bhavani Rd, near Garud Bunglow, South Sadar Bazar</p>
        </div>
        <div className="flex gap-4">
          <button 
            className="flex items-center gap-2 p-2 hover:text-red-500"
            onClick={() => setLiked(!liked)}
          >
            <FaHeart className={liked ? 'text-red-500' : ''} />
          </button>
          <button className="flex items-center gap-2 p-2 hover:text-blue-500">
            <FaShare />
          </button>
        </div>
      </div>

      {/* Image Gallery Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-2 mb-8 h-[400px]">
        {propertyImages.map((image, index) => (
          <div key={index} className={`${index === 0 ? 'row-span-2' : ''} relative overflow-hidden rounded-lg`}>
            <img
              src={image}
              alt={`Property view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
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
                <p className="font-semibold">₹15,000</p>
              </div>
              <div>
                <p className="text-gray-600">Deposit</p>
                <p className="font-semibold">₹20,000</p>
              </div>
              <div>
                <p className="text-gray-600">No. of Bedrooms & Bath</p>
                <p className="font-semibold">3</p>
              </div>
              <div>
                <p className="text-gray-600">Furnishing Status</p>
                <p className="font-semibold">furnished</p>
              </div>
              <div>
                <p className="text-gray-600">Available for</p>
                <p className="font-semibold">Family</p>
              </div>
              <div>
                <p className="text-gray-600">Property Type</p>
                <p className="font-semibold">Owner</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <p>Parking, Lift, Park, Gym, ...</p>
          </div>

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
            <h2 className="text-xl font-semibold mb-4">Contact Owner</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <FaUser className="text-gray-400 text-xl" />
              </div>
              <div>
                <p className="font-semibold">Please input your contact info here</p>
              </div>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Mobile No.</label>
                <input
                  type="tel"
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Enter your mobile number"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="agree" />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  I agree to receive communications via WhatsApp
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;