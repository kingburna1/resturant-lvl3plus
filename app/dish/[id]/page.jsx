"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Clock, Flame, ChefHat, Info, ArrowLeft, CreditCard } from 'lucide-react';

export default function DishDetailPage({ params }) {
    const resolvedParams = React.use(params);
    const id = resolvedParams.id;

    const [dish, setDish] = useState(null);
    const [relatedDishes, setRelatedDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/dishes/${id}`);
                if (!res.ok) throw new Error("Dish not found");
                const data = await res.json();
                setDish(data);

                const allRes = await fetch('/api/dishes');
                const allData = await allRes.json();
                const related = allData
                    .filter(d => d.category === data.category && d._id !== id)
                    .slice(0, 5); 
                setRelatedDishes(related);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">Loading details...</div>;
    if (!dish) return <div className="text-center py-20">Dish not found.</div>;

    return (
        <div className="min-h-screen bg-gray-100 pb-12 font-sans">
            
            {/* --- HERO BANNER --- */}
            <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 overflow-hidden">
                <Image 
                    src={dish.photoUrl || "/images/placeholder.jpg"} 
                    alt={dish.name} 
                    fill 
                    className="object-cover brightness-[0.6]"
                    priority
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-md tracking-tight">
                        {dish.name}
                    </h1>
                </div>
                <Link href="/" className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/40 transition">
                    <ArrowLeft size={22} />
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-10 space-y-4 sm:space-y-6">

                {/* --- MAIN INFO GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    
                    {/* LEFT CARD: Description & Actions */}
                    <div className="bg-white rounded-xl p-5 sm:p-8 shadow-sm flex flex-col justify-between order-2 lg:order-1">
                        <div>
                            <span className="text-xs sm:text-sm font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-md">
                                {dish.category}
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-3">
                                {dish.name}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6 sm:mb-8">
                                {dish.description}
                            </p>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-6">
                            <div className="mb-2 text-xs text-gray-400 font-bold uppercase tracking-wider">Total Price</div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                                    {dish.price.toLocaleString()} <span className="text-lg sm:text-xl text-gray-500 font-medium">CFA</span>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button 
                                        onClick={() => console.log("Added")}
                                        className="flex-1 sm:flex-none bg-gray-900 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <ShoppingCart size={18} /> Add to Cart
                                    </button>
                                    <button 
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`p-3.5 rounded-xl border-2 transition active:scale-95 ${isFavorite ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                                    >
                                        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CARD: Image, Rating & CHECKOUT */}
                    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center order-1 lg:order-2">
                         <div className="flex-1 space-y-4 sm:space-y-6 w-full">

                                
                                <div className="flex flex-wrap gap-2">
                                {dish.isVegetarian && (
                                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">Vegetarian</span>
                                )}
                                <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${dish.isAvailable ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {dish.isAvailable ? "Available" : "Not Available"}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{dish.name}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < Math.round(dish.averageRating || 0) ? "currentColor" : "none"} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">{dish.averageRating || 4.5}</span>
                                    <span className="text-xs text-gray-400">({dish.ratingCount || 120} reviews)</span>
                                </div>
                                
                                {/* Proceed to Checkout Button */}
                                <Link href="/checkout" className="block w-full">
                                    <button className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-bold shadow-md hover:bg-green-700 transition flex items-center justify-center gap-2 active:scale-95">
                                        <CreditCard size={18} /> Proceed to Checkout
                                    </button>
                                </Link>
                            </div>
                            
                            {/* Status Tags */}
                            {/* <div className="flex flex-wrap gap-2">
                                {dish.isVegetarian && (
                                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">Vegetarian</span>
                                )}
                                <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${dish.isAvailable ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {dish.isAvailable ? "Available" : "Not Available"}
                                </span>
                            </div> */}
                         </div>
                         
                         {/* Square Image Preview */}
                         <div className="w-full md:w-48 aspect-video md:aspect-square relative rounded-lg overflow-hidden shrink-0 border border-gray-100">
                            <Image src={dish.photoUrl} alt="Preview" fill className="object-cover" />
                         </div>
                    </div>
                </div>

                {/* --- SPECS GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    
                    {/* Ingredients & Allergens */}
                    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-3">Ingredients & Allergens</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Core Ingredients</h4>
                                <ul className="space-y-3">
                                    {dish.ingredients.map((ing, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-700 text-sm capitalize font-medium">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm"></div> {ing}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Allergens</h4>
                                <div className="flex flex-wrap gap-2">
                                    {dish.allergens.length > 0 ? dish.allergens.map((all, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold uppercase shadow-sm">
                                            {all}
                                        </span>
                                    )) : <span className="text-sm text-gray-400 italic">No allergens listed</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
                         <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-3">Dish Details</h3>
                         
                         <div className="grid grid-cols-2 gap-y-6 sm:gap-y-8 gap-x-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Clock size={20} /></div>
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase">Prep Time</div>
                                    <div className="text-gray-900 font-semibold">{dish.prepTime} Min</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Flame size={20} /></div>
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase">Calories</div>
                                    <div className="text-gray-900 font-semibold">{dish.calories} kcal</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><ChefHat size={20} /></div>
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase">Chef</div>
                                    <div className="text-gray-900 font-semibold">{dish.chefName || "House"}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Info size={20} /></div>
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase">Category</div>
                                    <div className="text-gray-900 font-semibold capitalize">{dish.category}</div>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>

                {/* --- RELATED DISHES --- */}
                {relatedDishes.length > 0 && (
                    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Related Dishes</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {relatedDishes.map((item) => (
                                <Link key={item._id} href={`/dish/${item._id}`} className="group block">
                                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3 border border-gray-100">
                                        <Image 
                                            src={item.photoUrl} 
                                            alt={item.name} 
                                            fill 
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <h4 className="font-bold text-gray-800 text-sm truncate group-hover:text-indigo-600 transition">
                                        {item.name}
                                    </h4>
                                    <p className="text-xs font-semibold text-gray-500 mt-1">{item.price.toLocaleString()} CFA</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
