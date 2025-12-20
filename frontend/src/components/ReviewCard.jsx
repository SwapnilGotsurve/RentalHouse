import React from 'react'
import { FaStar } from 'react-icons/fa'

const ReviewCard = ({ 
  name = 'Swapnil Gotsurve', 
  initials = 'SG', 
  rating = 5, 
  text = "I've lived in this rental home for 2 years and had a comfortable experience overall. The location is convenient, and the...",
  profileImage = null 
}) => {
  return (
    <div className='bg-white rounded-xl border border-gray-200 p-6 w-[300px] h-[200px] shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col'>
      {/* Header with Profile and Rating */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          {/* Profile Image or Initials */}
          {profileImage ? (
            <img 
              src={profileImage} 
              alt={name}
              className='w-12 h-12 rounded-full object-cover border-2 border-gray-200'
            />
          ) : (
            <div className='w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg'>
              {initials}
            </div>
          )}
          <div>
            <p className='font-semibold text-gray-800 text-sm'>{name}</p>
          </div>
        </div>
        
        {/* Star Rating */}
        <div className='flex gap-1'>
          {[...Array(5)].map((_, i) => (
            <FaStar 
              key={i} 
              className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>

      {/* Review Text */}
      <div className='flex-1'>
        <p className='text-gray-600 text-sm leading-relaxed'>
          {text}
        </p>
      </div>

      {/* Hover to read more link */}
      <div className='mt-3'>
        <button className='text-blue-500 text-xs font-medium hover:text-blue-600 transition-colors'>
          Hover to read more
        </button>
      </div>
    </div>
  )
}

export default ReviewCard