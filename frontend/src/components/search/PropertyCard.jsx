import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaBed, FaBath, FaRulerCombined, FaPhoneAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
  };

  return (
    <div 
      className='bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100'
      onClick={handleCardClick}
    >
      <div className='flex flex-col md:flex-row'>
        {/* Image Carousel */}
        <div className='relative w-full md:w-[380px] h-[280px] flex-shrink-0 group'>
          {/* New Badge */}
          {property.isNew && (
            <div className='absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg'>
              NEW
            </div>
          )}

          {/* Image */}
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className='w-full h-full object-cover'
          />

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className='absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'
          >
            <FaChevronLeft className='text-gray-700' />
          </button>
          <button
            onClick={nextImage}
            className='absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'
          >
            <FaChevronRight className='text-gray-700' />
          </button>

          {/* Image Indicators */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10'>
            {property.images.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'w-6 bg-white' 
                    : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className='flex-1 p-6 bg-gradient-to-br from-blue-50 to-white relative'>
          {/* Featured Badge */}
          {property.featured && (
            <div className='absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md'>
              Furnished
            </div>
          )}

          {/* Title */}
          <h3 className='text-xl font-bold text-gray-800 mb-2 pr-24'>
            {property.title}
          </h3>

          {/* Location */}
          <p className='text-sm text-gray-600 mb-4 line-clamp-1'>
            {property.location}
          </p>

          {/* Price and Details Grid */}
          <div className='grid grid-cols-3 gap-4 mb-4'>
            {/* Price */}
            <div className='bg-white rounded-lg p-3 shadow-sm border border-gray-100'>
              <p className='text-lg font-bold text-blue-600'>
                ₹{(property.price || property.rent?.amount || property.rentAmount || 0).toLocaleString()} / month
              </p>
              <p className='text-xs text-gray-500'>
                ₹{(property.deposit || property.securityDeposit || property.depositAmount || 0).toLocaleString()} deposit
              </p>
            </div>

            {/* Area */}
            <div className='bg-white rounded-lg p-3 shadow-sm border border-gray-100'>
              <p className='text-lg font-bold text-gray-800 flex items-center gap-1'>
                <FaRulerCombined className='text-blue-500' />
                {property.area?.value || property.areaValue || 0} {property.area?.unit || 'sqft'}
              </p>
              <p className='text-xs text-gray-500'>Buildup Area</p>
            </div>

            {/* Bedrooms */}
            <div className='bg-white rounded-lg p-3 shadow-sm border border-gray-100'>
              <p className='text-lg font-bold text-gray-800 flex items-center gap-1'>
                <FaBed className='text-blue-500' />
                {property.bedrooms} BHK
              </p>
              <p className='text-xs text-gray-500 flex items-center gap-1'>
                <FaBath className='text-gray-400' />
                {property.bathrooms} bath
              </p>
            </div>
          </div>

          {/* Description */}
          <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
            {property.description}
          </p>

          {/* Footer */}
          <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
            <div>
              <p className='text-sm font-semibold text-gray-700'>{property.owner}</p>
              <p className='text-xs text-gray-500'>{property.postedDate}</p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Handle contact action
              }}
              className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300'
            >
              <FaPhoneAlt />
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
