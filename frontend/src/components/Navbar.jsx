import React from "react";
import { FaHome } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="fixed w-full flex justify-between items-center p-4 bg-[#005BCB] text-white px-7 z-50">
      <div className="flex justify-center items-center gap-4 h-13  ">
        <div className="text-4xl">
          <FaHome />
        </div>
        <p className="text-3xl ">JoinRental</p>
      </div>

      <div className="text-4xl">
        {" "}
        <FaUserCircle />{" "}
      </div>
    </div>
  );
};

export default Navbar;
