"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Search, ShoppingCart, Trash2, Image as ImageIcon, Sparkles, Plane, ChevronRight } from 'lucide-react';
import useStore from '../../src/store/useStore';
import DishCard from '../../src/components/DishCard';

export default function Page() {
  const favoriteIds = useStore((state) => state.favorites);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/dishes');
        const data = await res.json();
        setDishes(data);
      } catch (err) {
        setDishes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);

  // Filter dishes to only those in favorites
  const favoriteDishes = dishes.filter((dish) => favoriteIds.includes(dish._id));

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
      
      {/* --- HEADER --- */}
      {/* <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Favorites</h1>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  type="search" 
                  placeholder="Search favorites..." 
                  className="rounded-full border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                <option>All Categories</option>
                <option>Business</option>
                <option>Travel</option>
              </select>
            </div>
          </div>
        </div>
      </header> */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* --- EMPTY STATE --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-blue-50 p-10">
              <Heart className="h-16 w-16 text-blue-200 animate-pulse" />
            </div>
            <h2 className="text-2xl font-semibold">Loading your favorites...</h2>
          </div>
        ) : favoriteDishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-blue-50 p-10">
              <Heart className="h-16 w-16 text-blue-200" />
            </div>
            <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
            <p className="mt-2 text-slate-500">Save items you love to find them easily later.</p>
            <button className="mt-6 rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg">
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* --- FAVORITES GRID --- */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {favoriteDishes.map((dish) => (
                <DishCard
                  key={dish._id}
                  id={dish._id}
                  name={dish.name}
                  imageUrl={dish.photoUrl || '/images/placeholder-food.png'}
                  rating={dish.averageRating}
                  price={dish.price}
                />
              ))}
            </div>

            {/* --- RECOMMENDATIONS --- */}
            <section className="mt-20">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold">You might also like</h2>
                <button className="flex items-center text-sm font-semibold text-blue-600 hover:underline">
                  View all recommendations <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {(() => {
                  // Get all categories from favorite dishes
                  const favCategories = Array.from(new Set(favoriteDishes.map(d => d.category)));
                  // Recommend dishes in same categories, not already in favorites
                  const recommended = dishes.filter(dish =>
                    favCategories.includes(dish.category) && !favoriteIds.includes(dish._id)
                  ).slice(0, 4);
                  if (recommended.length === 0) {
                    return <div className="col-span-full text-slate-500">No recommendations found.</div>;
                  }
                  return recommended.map((dish) => (
                    <DishCard
                      key={dish._id}
                      id={dish._id}
                      name={dish.name}
                      imageUrl={dish.photoUrl || '/images/placeholder-food.png'}
                      rating={dish.averageRating}
                      price={dish.price}
                    />
                  ));
                })()}
              </div>
            </section>
          </>
        )}
      </main>

      {/* --- BULK ACTIONS (FIXED BAR) --- */}
      {/* Selection logic removed: selectedIds is no longer used. */}
    </div>
  );
}