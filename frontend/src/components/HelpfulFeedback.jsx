import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const HelpfulFeedback = () => {
  const [feedback, setFeedback] = useState(null);

  const handleFeedback = (type) => {
    setFeedback(type);
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <p className="text-gray-600 text-lg">Was this helpful?</p>
      <div className="flex gap-3">
        <button
          onClick={() => handleFeedback('yes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            feedback === 'yes'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-green-100'
          }`}
        >
          <FaThumbsUp />
          <span>Yes</span>
        </button>
        <button
          onClick={() => handleFeedback('no')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            feedback === 'no'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-red-100'
          }`}
        >
          <FaThumbsDown />
          <span>No</span>
        </button>
      </div>
      {feedback && (
        <p className="text-green-600 font-semibold animate-pulse">
          Thank you for your feedback!
        </p>
      )}
    </div>
  );
};

export default HelpfulFeedback;
