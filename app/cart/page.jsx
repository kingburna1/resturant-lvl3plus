"use client";

import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ArrowLeft, Lock, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

import useStore from '../../src/store/useStore';
import DishCard from '../../src/components/DishCard';



export default function CartPage() {
  // Get cart from zustand store
  const cart = useStore((state) => state.cart);
  const removeItem = useStore((state) => state.toggleCart);
  const updateQty = useStore((state) => state.addToCart); // We'll use addToCart for increment, and custom for decrement

  const [cartDishes, setCartDishes] = useState([]);
  const [relatedDishes, setRelatedDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dishes in cart
  useEffect(() => {
    async function fetchCartDishes() {
      setLoading(true);
      try {
        // Get all dish IDs in cart
        const ids = cart.map(item => item.id);
        if (ids.length === 0) {
          setCartDishes([]);
          setRelatedDishes([]);
          setLoading(false);
          return;
        }
        // Fetch only dishes in cart via ids query
        const idsParam = ids.map(String).join(',');
        const res = await fetch(`/api/dishes?ids=${encodeURIComponent(idsParam)}`);
        const allDishes = await res.json();
        // Filter for cart dishes
        const cartDishes = allDishes.filter(dish => ids.includes(dish._id));
        setCartDishes(cartDishes.map(dish => {
          const cartItem = cart.find(item => item.id === dish._id);
          return { ...dish, qty: cartItem?.quantity || 1 };
        }));
        // Find related categories
        const cartCategories = [...new Set(cartDishes.map(d => d.category))];
        // Related: not in cart, but in same categories
        const related = allDishes.filter(dish => !ids.includes(dish._id) && cartCategories.includes(dish.category));
        setRelatedDishes(related);
      } catch (e) {
        setCartDishes([]);
        setRelatedDishes([]);
      }
      setLoading(false);
    }
    fetchCartDishes();
  }, [cart]);


  // Financial calculations
  const subtotal = cartDishes.reduce((acc, item) => acc + (item.price * item.qty), 0);
  // Tax is fixed 5 per dish unit
  const tax = cartDishes.reduce((acc, item) => acc + (item.qty * 5), 0);
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-slate-900">
      
      {/* --- PROGRESS INDICATOR --- */}
      {/* <nav className="border-b border-slate-100 bg-white py-4">
        <div className="mx-auto max-w-7xl px-4 flex justify-center items-center gap-4 text-sm font-medium">
          <span className="flex items-center gap-2 text-indigo-600">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">1</span>
            Cart
          </span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="flex items-center gap-2 text-slate-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-[10px]">2</span>
            Checkout
          </span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="flex items-center gap-2 text-slate-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-[10px]">3</span>
            Confirmation
          </span>
        </div>
      </nav> */}

      <main className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Your Cart</h1>
            <p className="mt-2 text-slate-500">You have {cartDishes.length} items in your bag.</p>
          </div>
          <Link href="/" className="group flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          
          {/* --- LEFT: CART ITEMS LIST --- */}
          <section className="lg:col-span-8">
            {loading ? (
              <div className="py-20 text-center">Loading...</div>
            ) : cartDishes.length > 0 ? (
              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {cartDishes.map((item) => (
                  <div key={item._id} className="flex py-8 gap-6">
                    <div className="h-32 w-32 flex-0 rounded-2xl bg-slate-50 flex items-center justify-center text-4xl">
                      <img src={item.photoUrl || '/images/placeholder-food.jpg'} alt={item.name} className="h-24 w-24 object-cover rounded-xl" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.category}</p>
                          <h3 className="text-lg font-bold text-slate-900 mt-1">{item.name}</h3>
                        </div>
                        <p className="text-lg font-bold">{(item.price * item.qty).toLocaleString()} XAF</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center rounded-full border border-slate-200 p-1">
                          <button 
                            onClick={() => {
                              // Decrement: remove if qty 1, else custom logic
                              if (item.qty <= 1) removeItem({ id: item._id, name: item.name, price: item.price });
                              else {
                                // Remove one: remove then add (simulate decrement)
                                removeItem({ id: item._id, name: item.name, price: item.price });
                                for (let i = 0; i < item.qty - 1; i++) updateQty({ id: item._id, name: item.name, price: item.price });
                              }
                            }}
                            className="p-1 hover:text-indigo-600 transition-colors"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="w-10 text-center font-bold">{item.qty}</span>
                          <button 
                            onClick={() => updateQty({ id: item._id, name: item.name, price: item.price })}
                            className="p-1 hover:text-indigo-600 transition-colors"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem({ id: item._id, name: item.name, price: item.price })}
                          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                <ShoppingBag className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                <p className="text-slate-500 font-medium">Your cart is currently empty.</p>
              </div>
            )}
          </section>

          {/* --- RIGHT: STICKY ORDER SUMMARY --- */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl bg-slate-50 p-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 border-b border-slate-200 pb-6 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{subtotal.toLocaleString()} XAF</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping Estimate</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax Estimate</span>
                  <span className="font-semibold text-slate-900">{tax.toLocaleString()} XAF</span>
                </div>
              </div>

              <div className="flex justify-between py-6 text-xl font-bold">
                <span>Total</span>
                <span className="text-indigo-600">{total.toLocaleString()} XAF</span>
              </div>

              {/* Dominant Checkout Button */}
              <Link href="/checkout"  >
              <button  className="relative w-full group overflow-hidden rounded-2xl bg-indigo-600 py-5 text-lg font-bold text-white transition-all hover:bg-indigo-700 active:scale-[0.98] shadow-xl shadow-indigo-200">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Proceed to Checkout
                  <Lock size={18} />
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full transition-transform group-hover:translate-y-0" />
              </button>
              </Link>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-widest">
                <Lock size={12} />
                Secure 256-bit SSL Checkout
              </div>
            </div>
          </aside>
        </div>

        {/* --- CROSS-SELL SECTION --- */}
        <section className="mt-32">
          <h2 className="text-2xl font-bold mb-8 text-slate-900">Recommended for you</h2>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {relatedDishes.length === 0 ? (
              <div className="col-span-full text-center text-slate-400">No related products found.</div>
            ) : (
              relatedDishes.slice(0, 4).map((dish) => (
                <DishCard
                  key={dish._id}
                  id={dish._id}
                  name={dish.name}
                  imageUrl={dish.photoUrl || '/images/placeholder-food.jpg'}
                  rating={dish.averageRating}
                  price={dish.price}
                />
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}