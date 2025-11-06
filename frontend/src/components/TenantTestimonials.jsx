import React from 'react'
import ReviewCard from './ReviewCard'

const TenantTestimonials = () => {
  return (
    <div>
      <h1 className='text-center text-5xl'>Tenant Testimonials</h1>
      <div className='flex  overflow-x-scroll gap-9 p-4 max-w-7xl mx-auto items-center justify-around mt-10 '>
      <ReviewCard />
      <ReviewCard />
      <ReviewCard />
      <ReviewCard />
      <ReviewCard />
      </div>
      
    </div>
  )
}

export default TenantTestimonials
