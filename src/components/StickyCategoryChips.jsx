"use client";

import React from 'react';

/**
 * Renders a horizontally scrollable row of sticky category chips.
 */
const StickyCategoryChips = ({ categories, activeCategory, setActiveCategory }) => {
  
  if (!categories || categories.length === 0) {
    return null; 
  }
  
  return (
    <div 
      // Adjusted top to be relative to the viewport, still needs to clear the navbar
      className="sticky top-18 z-40  
                 bg-white shadow-inner border-t border-gray-100 
                 overflow-x-auto whitespace-nowrap py-2 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium flex-0 
                transition-all duration-200 ease-in-out
                ${activeCategory === cat.name 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StickyCategoryChips;