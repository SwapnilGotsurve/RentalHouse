import { useState, useEffect, useRef } from 'react';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, onSuggestionSelect, showResults = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const searchInputRef = useRef(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (searchQuery.length >= 2) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(searchQuery);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const fetchSuggestions = async (query) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/suggestions?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.data.suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      setShowSuggestions(false);
      
      if (showResults && onSearch) {
        // If we're on the landing page, trigger search there
        onSearch(query.trim());
      } else {
        // Navigate to search page
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      searchInputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const query = suggestion.type === 'city' ? suggestion.text : suggestion.text;
    setSearchQuery(query);
    setShowSuggestions(false);
    
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    
    handleSearch(query);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
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
          ref={searchInputRef}
          type="text"
          placeholder="Search by location, property name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full py-3 px-4 text-gray-700 text-lg bg-transparent outline-none placeholder-gray-400"
        />
        {loading && (
          <div className="mx-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
        <button
          onClick={() => handleSearch()}
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-semibold mr-2"
        >
          Search
        </button>
      </div>
      
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-80 overflow-y-auto">
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    suggestion.type === 'city' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {suggestion.type === 'city' ? (
                      <CiSearch className="text-sm" />
                    ) : (
                      <span className="text-xs font-bold">P</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{suggestion.text}</p>
                    {suggestion.type === 'city' && suggestion.count && (
                      <p className="text-xs text-gray-500">{suggestion.count} properties</p>
                    )}
                    {suggestion.type === 'property' && suggestion.location && (
                      <p className="text-xs text-gray-500">in {suggestion.location}</p>
                    )}
                  </div>
                </div>
                {suggestion.type === 'city' && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    City
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
