import { useRef, useState } from 'react'
import ReviewCard from './ReviewCard'
import { gsap } from 'gsap'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const TenantTestimonials = () => {
  const carouselRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: 'Swapnil Gotsurve',
      initials: 'SG',
      rating: 5,
      text: "I've lived in this rental home for 2 years and had a comfortable experience overall. The location is convenient, and the...",
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      name: 'Priya Sharma',
      initials: 'PS',
      rating: 5,
      text: "Excellent service! Found my dream apartment within a week. The verification process was smooth and the support team was...",
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    {
      name: 'Rahul Mehta',
      initials: 'RM',
      rating: 4,
      text: "Great platform for finding rental properties. The search filters are very useful and the listings are genuine. Highly re...",
      profileImage: null
    },
    {
      name: 'Anjali Desai',
      initials: 'AD',
      rating: 5,
      text: "Best rental experience ever! The property matched exactly what was shown in the listing. The owner was professional and the...",
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    {
      name: 'Vikram Singh',
      initials: 'VS',
      rating: 5,
      text: "I appreciate the transparency and ease of use. Found a perfect home for my family. The customer support is outstanding!...",
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    }
  ]

  const cardsToShow = 3
  const cardWidth = 320 // card width (300) + gap (20)
  const maxIndex = Math.max(0, testimonials.length - cardsToShow)

  const scrollLeft = () => {
    const newIndex = Math.max(0, currentIndex - 1)
    setCurrentIndex(newIndex)
    
    gsap.to(carouselRef.current, {
      x: -newIndex * cardWidth,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  const scrollRight = () => {
    const newIndex = Math.min(maxIndex, currentIndex + 1)
    setCurrentIndex(newIndex)
    
    gsap.to(carouselRef.current, {
      x: -newIndex * cardWidth,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  return (
    <div className='py-16 px-4 bg-gray-50'>
      <h1 className='text-center text-4xl font-bold text-gray-800 mb-12'>
        Tenant Testimonials
      </h1>
      
      <div className='relative max-w-6xl mx-auto'>
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            currentIndex === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-xl'
          }`}
          aria-label='Previous testimonial'
        >
          <FaChevronLeft className='text-xl' />
        </button>

        {/* Carousel Container */}
        <div className='overflow-hidden mx-16'>
          <div 
            ref={carouselRef} 
            className='flex gap-5'
            style={{ width: `${testimonials.length * cardWidth}px` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className='flex-shrink-0'>
                <ReviewCard {...testimonial} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          disabled={currentIndex === maxIndex}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            currentIndex === maxIndex 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-xl'
          }`}
          aria-label='Next testimonial'
        >
          <FaChevronRight className='text-xl' />
        </button>
      </div>
    </div>
  )
}

export default TenantTestimonials