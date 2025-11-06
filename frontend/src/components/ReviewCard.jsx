import React from 'react'

const ReviewCard = () => {
  return (
    <div className=' border-2 rounded-2xl  pb-5 px-12'>
      <div className=' flex items-center justify-between w-92 h-20 '> 
        <div className='flex items-center justify-center gap-2'>
        <div className='text-xl flex items-center justify-center h-12 w-12 bg-black text-white rounded-full'>
            <p>SG</p>
        </div>
        <p className="text-xl" > Swapnil Gotsurve</p>
        </div>
        <p>⭐⭐⭐⭐⭐</p>
      </div>
      <p className='text-justify'>
        I’ve lived in this rental home for 2 years and had a comfortable experience overall. The location is convenient, and the neighborhood is peaceful. The landlord is responsive, and maintenance issues were handled quickly.
      </p>
    </div>
  )
}

export default ReviewCard
