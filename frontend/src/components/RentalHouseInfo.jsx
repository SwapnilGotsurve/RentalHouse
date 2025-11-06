import React from 'react'
import { FaHeart, FaBath, FaPhoneAlt } from 'react-icons/fa'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'

const RentalHouseInfo = () => {
  return (
    <div className=''>
      
      <div className='container mx-auto px-4'>        
        {/* Property Card */}
        <div className='bg-white rounded-lg shadow-lg flex gap-2 overflow-hidden max-w-6xl'>
          {/* Image Section with Navigation */}
          <div className='relative h-[400px]'>
            <img 
              src="https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" 
              alt="Apartment Interior" 
              className='w-full h-full object-cover'
            />
            {/* Navigation Arrows */}
            <button className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full'>
              <IoMdArrowBack className='text-xl' />
            </button>
            <button className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full'>
              <IoMdArrowForward className='text-xl' />
            </button>
            
            {/* NEW Tag */}
            <span className='absolute top-4 left-4 bg-[#333] text-white px-3 py-1 text-sm font-medium'>
              NEW
            </span>
            
            {/* Heart Icon */}
            <button className='absolute top-4 right-4 text-white'>
              <FaHeart className='text-2xl' />
            </button>
            
            {/* Image Indicators */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className='p-6'>
            {/* Furnished Tag */}
            <div className='flex justify-between items-start mb-2'>
              <span className='bg-orange-500 text-white px-3 py-1 rounded text-sm'>
                Furnished
              </span>
            </div>

            {/* Title and Location */}
            <h2 className='text-2xl font-semibold mb-2'>3 BHK Flat for rent in Solapur</h2>
            <p className='text-gray-600 mb-4'>Birajdar Complex, Rupa Bhavani Rd, near Garud Bunglow, South Sadar Bazar, North, Solapur</p>

            {/* Price and Details */}
            <div className='flex justify-between items-center mb-4'>
              <div>
                <p className='text-xl font-bold'>₹15,000<span className='text-sm font-normal'>/month</span></p>
                <p className='text-sm text-gray-600'>20,000 deposit</p>
              </div>
              <div className='text-right'>
                <p className='font-semibold'>1,500 sqft</p>
                <p className='text-sm text-gray-600'>Buildup Area</p>
              </div>
              <div className='text-right'>
                <p className='font-semibold'>3 BHK</p>
                <p className='text-sm text-gray-600'>3 bath</p>
              </div>
            </div>

            {/* Description */}
            <p className='text-gray-600 mb-4'>
              Its an clam apartment property is located in main city. Railway station is 5 min walking.....
            </p>

            {/* Footer */}
            <div className='flex justify-between items-center pt-4 border-t'>
              <div>
                <p className='font-semibold'>Owner</p>
                <p className='text-sm text-gray-600'>7 days ago</p>
              </div>
              <button className='bg-[#0047AB] text-white px-6 py-2 rounded flex items-center gap-2'>
                <FaPhoneAlt /> Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>  
  )
}

export default RentalHouseInfo
