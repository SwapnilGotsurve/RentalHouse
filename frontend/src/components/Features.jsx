import React from 'react'
import { CiSearch } from "react-icons/ci";
import { FaHome } from 'react-icons/fa';
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

const Features = () => {
  const features = [
    { Icon: CiSearch, title: 'Easy Search', color: 'bg-blue-200' },
    { Icon: IoShieldCheckmarkSharp, title: 'Verified Listings', color: 'bg-blue-200' },
    { Icon: FaHome, title: 'Wide Selection', color: 'bg-blue-200' },
    { Icon: TfiHeadphoneAlt, title: '24/7 Support', color: 'bg-blue-200' }
  ]

  return (
    <div className='bg-white py-20 px-4'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-center text-4xl md:text-5xl font-bold text-gray-800'>
          Why Choose <span className='text-blue-600'>JOINRENTAL</span>
        </h1>
        <p className='text-center mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto'>
          We make finding and renting your perfect property simple, secure, and stress-free.
        </p>

        {/* Features Grid */}
        <div className='mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12'>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className='flex flex-col justify-center items-center transform transition-transform hover:scale-105 duration-300'
            >
              <div className={`text-6xl h-28 w-28 ${feature.color} flex items-center justify-center rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                <feature.Icon className='text-blue-600' />
              </div>
              <p className='text-xl font-semibold mt-4 text-gray-700'>{feature.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features
