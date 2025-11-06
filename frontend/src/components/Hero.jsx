import React from 'react'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='   h-180 flex flex-col justify-center  items-center   ' >

      <h1 className='text-center text-5xl font-medium  mb-8    '>Find Your Perfect , Rental Property</h1>
      <p className='text-center mt-4 text-2xl' >Discover thousands of verified rental listings.        </p>
      <p  className='text-center text-2xl' >From cozy apartments to luxury homes, your dream space is just a search away.  </p>

    <SearchBar   />      
    </div>
  )
}

export default Hero
