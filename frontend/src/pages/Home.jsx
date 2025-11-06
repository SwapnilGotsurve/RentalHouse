import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/features'
import TenantTestimonials from '../components/TenantTestimonials'
import Hero2 from '../components/Hero2'
import ShareYourExperiance from '../components/ShareYourExperiance'

const Home = () => {
  return (
    <div>
      <Hero />  
      <Features  />
      <Hero2 />
      <TenantTestimonials />
      <ShareYourExperiance />
    </div>
  )
}

export default Home
