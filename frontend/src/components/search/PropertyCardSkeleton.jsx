import React from 'react';

const PropertyCardSkeleton = () => {
  return (
    <div className='bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 animate-pulse'>
      <div className='flex flex-col md:flex-row'>
        {/* Image Skeleton */}
        <div className='w-full md:w-[380px] h-[280px] bg-gray-200 flex-shrink-0' />

        {/* Details Skeleton */}
        <div className='flex-1 p-6 space-y-4'>
          {/* Title */}
          <div className='h-6 bg-gray-200 rounded w-3/4' />
          
          {/* Location */}
          <div className='h-4 bg-gray-200 rounded w-full' />
          
          {/* Price Grid */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='h-20 bg-gray-200 rounded-lg' />
            <div className='h-20 bg-gray-200 rounded-lg' />
            <div className='h-20 bg-gray-200 rounded-lg' />
          </div>
          
          {/* Description */}
          <div className='space-y-2'>
            <div className='h-4 bg-gray-200 rounded w-full' />
            <div className='h-4 bg-gray-200 rounded w-5/6' />
          </div>
          
          {/* Footer */}
          <div className='flex justify-between items-center pt-4'>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 rounded w-20' />
              <div className='h-3 bg-gray-200 rounded w-16' />
            </div>
            <div className='h-10 bg-gray-200 rounded-lg w-28' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
