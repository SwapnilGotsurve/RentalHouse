import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const Hero2 = () => {
  return (
    <div className="h-150   flex flex-col justify-center items-center ">
      <h1 className="text-5xl mb-10">Ready to Find Your Perfect Home?</h1>
      <p className="text-2xl w-220 text-center mb-10">  
        Join thousands of happy tenants who found their dream rental with
        JoinRental. Start your search today and move into your perfect space
        tomorrow.
      </p>

      <a href="#" className="mt-6 "    >
        
        <button className=" bg-blue-100  rounded-xl border-2 p-3 px-8 text-xl flex items-center gap-3 justify-center">
          Get Started Now
          <div>
            <FaArrowRightLong />
          </div>
        </button>
      </a>
    </div>
  );
};

export default Hero2;
