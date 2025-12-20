import { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('/search');
    }
  };

  const handleResultClick = (result) => {
    navigate('/search');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8">
      <div
        className={`flex items-center p-2 bg-white rounded-full shadow-lg transition-all duration-300 ${
          isFocused ? 'shadow-2xl ring-2 ring-blue-300' : ''
        }`}
      >
        <CiSearch className='text-4xl mx-3 text-gray-500'/>
        <input
          type="text"
          placeholder="Enter Locality......"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full py-3 px-4 text-gray-700 text-lg bg-transparent outline-none placeholder-gray-400"
        />
      </div>
      {searchQuery && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg p-4 transform transition-all duration-300 opacity-100 scale-100 origin-top z-10">
          <div 
            onClick={() => handleResultClick('Solapur')}
            className="py-2 px-3 hover:bg-gray-100 rounded cursor-pointer transition-colors duration-200"
          >
            Solapur
          </div>
          <div 
            onClick={() => handleResultClick('Mumbai')}
            className="py-2 px-3 hover:bg-gray-100 rounded cursor-pointer transition-colors duration-200"
          >
            Mumbai
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
