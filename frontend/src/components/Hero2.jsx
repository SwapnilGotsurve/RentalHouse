import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const Hero2 = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Ready to Find Your Perfect Home?
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join thousands of happy tenants who found their dream rental with
          JoinRental. Start your search today and move into your perfect space
          tomorrow.
        </p>

<button
        onClick={() => window.location.href = '/tenant'}
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-4 text-lg font-semibold flex items-center gap-3 justify-center mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          Get Started Now
          <FaArrowRightLong />
        </button>
      </div>
    </div>
  );
};

export default Hero2;
