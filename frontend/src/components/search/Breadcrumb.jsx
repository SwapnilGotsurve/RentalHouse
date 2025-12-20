import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Breadcrumb = ({ location }) => {
  const navigate = useNavigate();

  return (
    <div className='flex items-center gap-2 text-sm text-gray-600'>
      <button 
        onClick={() => navigate('/')}
        className='hover:text-blue-600 transition-colors font-medium'
      >
        Home
      </button>
      <FaChevronRight className='text-xs text-gray-400' />
      <span className='text-gray-500'>Property in</span>
      <FaChevronRight className='text-xs text-gray-400' />
      <span className='text-blue-600 font-semibold'>{location}</span>
    </div>
  );
};

export default Breadcrumb;
