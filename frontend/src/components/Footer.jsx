import React from 'react'
import { FaFacebook, FaFacebookF, FaHome, FaInstagram, FaYoutube } from 'react-icons/fa'
import { BsTwitterX } from "react-icons/bs";

const Footer = () => {
  return (
    <div className=' bg-blue-600 text-white pb-10 mt-10'>

     <div className='h-30  gap-20 flex justify-center items-center'>
           <div className='flex gap-2 items-center justify-center'> 
             <div className="text-4xl "           >
                  <FaHome /> 
                </div>
                <h2 className='text-2xl'>JOINRENTAL</h2>
           </div>
           {/* contact section */}
           <div className='flex  text-3xl gap-8'>
                <FaFacebookF />

                <FaInstagram />
                <FaYoutube />
                <BsTwitterX />

           </div>
    </div>
        <p className='text-center'>© 2025 JoinRental | Owner: Swapnil Gotsurve | All Rights Are Reserved. Built with care for property seekers everywhere.</p>
    </div>
  )
}

export default Footer
