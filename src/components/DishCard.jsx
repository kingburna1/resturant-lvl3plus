"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Heart, Star } from 'lucide-react'; // Added Star icon
import Image from 'next/image';

/**
 * Dish Card Component - Optimized for Mobile Grid (2 columns)
 */
const DishCard = ({ id, name, imageUrl, rating = 0, isFavorite = false }) => {
  
  const linkHref = `/dish/${id}`; 

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col 
                 cursor-pointer border border-gray-100 h-full" // Added h-full to stretch properly
      whileHover={{ y: -4, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      
      {/* 1. Image Area */}
      <Link href={linkHref} className="relative block w-full aspect-square bg-gray-100">
        <Image 
          src={imageUrl} 
          alt={name} 
          width={300} 
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
        />
        
        {/* Favorite Button */}
        <button
          className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-white/80 backdrop-blur-sm 
                     text-gray-400 hover:text-red-500 transition-colors z-10 shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            console.log(`Toggling favorite for ${id}`);
          }}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-red-500' : 'text-gray-400'} />
        </button>
      </Link>

      {/* 2. Content */}
      <div className="p-2 sm:p-3 flex flex-col grow">
        
        {/* Rating Badge */}
        <div className="flex items-center gap-1 mb-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium text-gray-500">{rating || 4.5}</span>
        </div>

        {/* Dish Name - Very compact on mobile */}
        <Link href={linkHref} className="text-gray-800 font-semibold text-sm sm:text-base leading-tight hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
          {name}
        </Link>

        {/* Action Bar */}
        <div className="flex justify-between items-end mt-auto pt-2">
            {/* Price placeholder or "View" text could go here if needed, keeping it empty for minimal look */}
            <span className="text-[10px] text-green-600 sm:text-xs">Available</span>

            <button
                className="bg-indigo-600 text-white p-1.5 sm:p-2 rounded-full 
                        hover:bg-indigo-700 transition shadow-sm"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Added ${id} to cart`);
                }}
            >
                <ShoppingCart size={14} className="sm:w-4 sm:h-4" /> 
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DishCard;
