import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { CiSearch } from "react-icons/ci";

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="static w-full max-w-2xl mx-auto mt-16    ">
      <div
        className={`border-2 border-gray-400 flex items-center p-2 bg-white rounded-full shadow-lg transition-all duration-300 ${
          isFocused ? 'shadow-xl ring-1 ring-blue-400' : ''
        }`}
      >
      <CiSearch className='text-4xl mx-3 text-gray-500'/>
        <input
          type="text"
          placeholder="Enter Locality......"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full py-2 px-4 text-gray-00 text-lg bg-transparent outline-none placeholder-gray-400"
        />
      </div>
      {searchQuery && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg p-4 transform transition-all duration-300 opacity-100 scale-100 origin-top">
          {/* Add search results here */}
          <div className="py-2 hover:bg-gray-100 rounded cursor-pointer transition-colors duration-200">
            Sample Result 1
          </div>
          <div className="py-2 hover:bg-gray-100 rounded cursor-pointer transition-colors duration-200">
            Sample Result 2
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
