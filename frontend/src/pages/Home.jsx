import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Features from '../components/Features'
import TenantTestimonials from '../components/TenantTestimonials'
import Hero2 from '../components/Hero2'
import ShareYourExperiance from '../components/ShareYourExperiance'

const Home = () => {
  return (
    <div className='pt-16'>
      <Hero />  
      <Features />
      <Hero2 />
      <TenantTestimonials />
      <ShareYourExperiance />
      
      {/* Development Test Link - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Link
            to="/auth-test"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors text-sm"
          >
            🔐 Auth Test
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home
