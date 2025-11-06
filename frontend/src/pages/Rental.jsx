import React, { useState } from 'react'
import RentalHouseInfo from '../components/RentalHouseInfo'
import { IoIosArrowDown } from 'react-icons/io'
import { FaFilter } from 'react-icons/fa'

function Rental() {
  const [activeFilters, setActiveFilters] = useState({
    bedrooms: '',
    price: '',
    furnishing: '',
    availability: '',
    availableFor: '',
    propertyType: '',
    postedBy: '',
    amenities: '',
  })

  return (
    <div className='min-h-screen'>
      {/* Filter Section */}
      <div className='bg-[#f8f9fa] w-full pt-20 pb-4 px-4 md:px-8'>
        {/* Breadcrumb */}
        <div className='text-sm text-gray-600 mb-4'>
          <span className='hover:text-blue-600 cursor-pointer'>Home</span>
          <span className='mx-2'>{'>'}</span>
          <span className='hover:text-blue-600 cursor-pointer'>Property in</span>
          <span className='mx-2'>Solapur</span>
        </div>

        {/* Filters Container */}
        <div className='flex flex-wrap gap-3 mb-4'>
          {/* Bedrooms Filter */}
          <div className='relative'>
            <select 
              className='appearance-none bg-white border rounded-md px-4 py-2 pr-8 cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500'
              value={activeFilters.bedrooms}
              onChange={(e) => setActiveFilters({...activeFilters, bedrooms: e.target.value})}
            >
              <option value="">No. of Bedrooms</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
            <IoIosArrowDown className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500' />
          </div>

          {/* Price Range Filter */}
          <div className='relative'>
            <select 
              className='appearance-none bg-white border rounded-md px-4 py-2 pr-8 cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500'
              value={activeFilters.price}
              onChange={(e) => setActiveFilters({...activeFilters, price: e.target.value})}
            >
              <option value="">$0 - 1000</option>
              <option value="1000-2000">$1000 - 2000</option>
              <option value="2000-3000">$2000 - 3000</option>
              <option value="3000+">$3000+</option>
            </select>
            <IoIosArrowDown className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500' />
          </div>

          {/* Furnishing Status */}
          <div className='relative'>
            <select 
              className='appearance-none bg-white border rounded-md px-4 py-2 pr-8 cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500'
              value={activeFilters.furnishing}
              onChange={(e) => setActiveFilters({...activeFilters, furnishing: e.target.value})}
            >
              <option value="">Furnishing status</option>
              <option value="furnished">Furnished</option>
              <option value="semifurnished">Semi-Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
            <IoIosArrowDown className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500' />
          </div>

          {/* Available */}
          <div className='relative'>
            <select 
              className='appearance-none bg-white border rounded-md px-4 py-2 pr-8 cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500'
              value={activeFilters.availability}
              onChange={(e) => setActiveFilters({...activeFilters, availability: e.target.value})}
            >
              <option value="">Available</option>
              <option value="immediate">Immediate</option>
              <option value="15days">Within 15 Days</option>
              <option value="30days">Within 30 Days</option>
            </select>
            <IoIosArrowDown className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500' />
          </div>

          {/* Property Type */}
          <div className='relative'>
            <select 
              className='appearance-none bg-white border rounded-md px-4 py-2 pr-8 cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500'
              value={activeFilters.propertyType}
              onChange={(e) => setActiveFilters({...activeFilters, propertyType: e.target.value})}
            >
              <option value="">Property type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
            </select>
            <IoIosArrowDown className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500' />
          </div>

          {/* More Filters Button */}
          <button className='flex items-center gap-2 bg-white border rounded-md px-4 py-2 hover:border-blue-500 focus:outline-none focus:border-blue-500'>
            <FaFilter />
            More filter
          </button>

          {/* Sort By */}
          <div className='ml-auto relative'>
            <select 
              className='appearance-none bg-white border rounded-md px-4 py-2 pr-8 cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500'
            >
              <option value="">Sort by</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            <IoIosArrowDown className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500' />
          </div>
        </div>
      </div>

      {/* Rental Houses List */}
      <div className='flex flex-col items-center justify-around gap-10 my-10 px-4 md:px-8'>
        <RentalHouseInfo />
        <RentalHouseInfo />
        <RentalHouseInfo />
        <RentalHouseInfo />
        <RentalHouseInfo />
      </div>
    </div>
  )
}

export default Rental