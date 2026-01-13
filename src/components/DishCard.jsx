"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react'; 
import Image from 'next/image';
import useStore from "../store/useStore";


const DishCard = ({ id, name, imageUrl, rating = 0, price = 0 }) => {
  const linkHref = `/dish/${id}`;
  const [imageSrc, setImgSrc] = useState(imageUrl);
  const isFavorite = useStore((state) => state.favorites.includes(id));
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const toggleCart = useStore((state) => state.toggleCart);
  const isInCart = useStore((state) => state.cart.some((item) => item.id === id));

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    toggleCart({ id, name, price, imageUrl });
  };

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col 
                 cursor-pointer border border-gray-100 h-full" // Added h-full to stretch properly
      whileHover={{ y: -4, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      
      {/* 1. Image Area */}
     <div className="relative"> 
        
        <Link href={linkHref} className="block w-full aspect-square bg-gray-100">
          <Image 
            src={imageUrl} 
            alt={name} 
            width={300} 
            height={300}
            onError={() => setImgSrc('/images/placeholder-food.png')}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
        </Link>
        
        {/* Favorite Button */}
        <button
          className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-white/80 backdrop-blur-sm 
                     text-gray-400 hover:text-red-500 transition-colors z-20 shadow-sm"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-red-500 ' : 'text-gray-400'} />
        </button>

      </div>

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
              className={`${isInCart ? 'bg-indigo-300' : 'bg-indigo-600'} text-white p-1.5 sm:p-2 rounded-full 
                  hover:bg-indigo-700 transition shadow-sm`}
              onClick={handleCartClick}
            >
              <ShoppingCart size={14} className="sm:w-4 sm:h-4" /> 
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DishCard;
