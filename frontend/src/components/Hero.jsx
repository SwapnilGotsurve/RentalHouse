import React, { useEffect, useRef } from 'react'
import SearchBar from './SearchBar'
import { FaHome, FaKey, FaBuilding, FaHeart, FaShieldAlt, FaUsers } from 'react-icons/fa'
import { gsap } from 'gsap'

const Hero = () => {
  const iconsRef = useRef([])

  useEffect(() => {
    // Animate floating icons
    iconsRef.current.forEach((icon, index) => {
      gsap.to(icon, {
        y: '+=20',
        rotation: '+=10',
        duration: 2 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: index * 0.2
      })
    })
  }, [])

  const floatingIcons = [
    { Icon: FaHome, position: 'top-20 left-10' },
    { Icon: FaKey, position: 'top-40 right-20' },
    { Icon: FaBuilding, position: 'top-60 left-32' },
    { Icon: FaHeart, position: 'bottom-40 left-20' },
    { Icon: FaShieldAlt, position: 'bottom-32 right-32' },
    { Icon: FaUsers, position: 'top-32 right-40' },
    { Icon: FaHome, position: 'bottom-60 right-16' },
    { Icon: FaKey, position: 'top-72 left-48' }
  ]

  return (
    <div className='relative h-[500px] flex flex-col justify-center items-center bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 overflow-hidden pt-20'>
      {/* Animated Background Icons */}
      {floatingIcons.map((item, index) => (
        <div
          key={index}
          ref={el => iconsRef.current[index] = el}
          className={`absolute ${item.position} text-white/20 text-4xl`}
        >
          <item.Icon />
        </div>
      ))}

      {/* Content */}
      <div className='relative z-10'>
        <h1 className='text-center text-5xl font-bold text-white mb-4'>
          Find Your Perfect, Rental Property
        </h1>
        <p className='text-center text-xl text-white/90'>
          Discover thousands of verified rental listings.
        </p>
        <p className='text-center text-xl text-white/90 mb-8'>
          From cozy apartments to luxury homes, your dream space is just a search away.
        </p>
        <SearchBar />
      </div>
    </div>
  )
}

export default Hero
