"use client";

import React, { useState, useEffect } from 'react';
import StickyCategoryChips from './StickyCategoryChips';
import DishCard from './DishCard';

const CATEGORIES = [
  { name: 'Main Course', icon: '🍲' },
  { name: 'Starter', icon: '🥗' },
  { name: 'Dessert', icon: '🍰' },
  { name: 'Drink', icon: '🍹' },
];

const MenuStateProvider = () => {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].name);
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch data from your API
    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const res = await fetch('/api/dishes');
                const data = await res.json();
                setDishes(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching menu:", error);
                setLoading(false);
            }
        };

        fetchDishes();
    }, []);

    // 2. Filter logic: Match "Main Course" (UI) to "main course" (DB)
    const filteredDishes = dishes.filter(dish => 
        dish.category.toLowerCase() === activeCategory.toLowerCase()
    );

    return (
        <div className="relative z-30 min-h-screen bg-gray-50 pb-20">
            <StickyCategoryChips 
                categories={CATEGORIES} 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-6">
                    {activeCategory} Menu ({filteredDishes.length})
                </h2>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">
                        Loading yummy food... ⏳
                    </div>
                ) : (
                    /* 3. The Real Product Grid */
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
    {filteredDishes.length > 0 ? (
        filteredDishes.map((dish) => (
            <DishCard 
                key={dish._id}
                id={dish._id}
                name={dish.name}
                imageUrl={dish.photoUrl || '/images/placeholder-food.jpg'}
                rating={dish.averageRating} // Pass the rating here
                isFavorite={false} 
            />
        ))
    ) : (
        <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
            <p>No {activeCategory} items found.</p>
        </div>
    )}
</div>
                )}
            </div>
        </div>
    );
};

export default MenuStateProvider;
