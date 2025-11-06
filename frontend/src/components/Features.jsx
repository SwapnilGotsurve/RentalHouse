import React from 'react'
import { CiSearch } from "react-icons/ci";
import { FaHome } from 'react-icons/fa';
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

const Features = () => {
  return (
    <div className='bg-amber-200
     h-160 flex flex-col justify-center  items-center'>
      <h1 className='text-center text-5xl font-medium '>Why Choose <span>RENTALJOIN  </span></h1>
      <p className='text-center mt-5 text-2xl'    > We make finding and renting your perfect property simple, secure, and stress-free. </p>

      {/* icons  */}
      <div className='  mt-16   grid grid-cols-4 gap-18    '>
        {/* 1 */}
                <div className='flex flex-col justify-center items-center'>
                    <div className='text-6xl h-29 w-29 bg-blue-300 flex items-center justify-center p-3 rounded-xl'> <CiSearch /> </div>
                    <p className='text-2xl mt-3 '>Easy Search</p>
                </div>
        {/* 2 */}   
        <div className='flex flex-col justify-center items-center'>
                    <div className='text-6xl h-29 w-29 bg-blue-300 flex items-center justify-center p-3 rounded-xl'> <IoShieldCheckmarkSharp /></div>
                    <p className='text-2xl mt-3 '>Verified Listings</p>
                </div>
        {/* 3 */}   
        <div className='flex flex-col justify-center items-center'>
                    <div className='text-6xl h-29 w-29 bg-blue-300 flex items-center justify-center p-3 rounded-xl'> <FaHome /></div>
                    <p className='text-2xl mt-3 '>Wide Selection</p>
                </div>
                {/* 4 */}
                <div className='flex flex-col justify-center items-center'>
                    <div className='text-6xl h-29 w-29 bg-blue-300 flex items-center justify-center p-3 rounded-xl'> <TfiHeadphoneAlt /> </div>
                    <p className='text-2xl mt-3 '>24/7 Support</p>
                </div>  
      </div>
      <div>

      </div>
    </div>
  )
}

export default Features
