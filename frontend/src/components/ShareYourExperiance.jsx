import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const ShareYourExperiance = () => {
  return (
    <div className="flex items-center gap-8 justify-center mt-4">
      <p className="text-center text-2xl">Share Your Experience</p>

      <div className="flex gap-2 text-center justify-center text-3xl text-amber-400 ">
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
      </div>
    </div>
  );
};

export default ShareYourExperiance;
