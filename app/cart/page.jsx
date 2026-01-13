"use client";

import React, { useState } from 'react';
import { Minus, Plus, Trash2, ArrowLeft, Lock, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

// Mock Data - Using standard JavaScript objects
const INITIAL_ITEMS = [
  { id: 1, name: "Premium Business Course", price: 199.00, qty: 1, image: "📚", category: "Education" },
  { id: 2, name: "Minimalist Leather Backpack", price: 125.00, qty: 1, image: "🎒", category: "Travel" },
  { id: 3, name: "Noise Cancelling Headphones", price: 299.00, qty: 1, image: "🎧", category: "Accessories" },
];

export default function CartPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  // Logic to update quantities
  const updateQty = (id, delta) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  // Logic to remove items
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Financial calculations
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-slate-900">
      
      {/* --- PROGRESS INDICATOR --- */}
      <nav className="border-b border-slate-100 bg-white py-4">
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
      </nav>

      <main className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Your Cart</h1>
            <p className="mt-2 text-slate-500">You have {items.length} items in your bag.</p>
          </div>
          <Link href="/" className="group flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          
          {/* --- LEFT: CART ITEMS LIST --- */}
          <section className="lg:col-span-8">
            {items.length > 0 ? (
              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="flex py-8 gap-6">
                    <div className="h-32 w-32 flex-0 rounded-2xl bg-slate-50 flex items-center justify-center text-4xl">
                      {item.image}
                    </div>
                    
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.category}</p>
                          <h3 className="text-lg font-bold text-slate-900 mt-1">{item.name}</h3>
                        </div>
                        <p className="text-lg font-bold">${(item.price * item.qty).toFixed(2)}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center rounded-full border border-slate-200 p-1">
                          <button 
                            onClick={() => updateQty(item.id, -1)}
                            className="p-1 hover:text-indigo-600 transition-colors"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="w-10 text-center font-bold">{item.qty}</span>
                          <button 
                            onClick={() => updateQty(item.id, 1)}
                            className="p-1 hover:text-indigo-600 transition-colors"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item.id)}
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
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping Estimate</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax Estimate</span>
                  <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between py-6 text-xl font-bold">
                <span>Total</span>
                <span className="text-indigo-600">${total.toFixed(2)}</span>
              </div>

              {/* Dominant Checkout Button */}
              <button className="relative w-full group overflow-hidden rounded-2xl bg-indigo-600 py-5 text-lg font-bold text-white transition-all hover:bg-indigo-700 active:scale-[0.98] shadow-xl shadow-indigo-200">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Proceed to Checkout
                  <Lock size={18} />
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full transition-transform group-hover:translate-y-0" />
              </button>

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
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-square rounded-2xl bg-slate-100 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300">
                  ✨
                </div>
                <h4 className="mt-4 font-bold text-slate-800">Extra Feature {i}</h4>
                <p className="text-sm text-slate-500 font-medium">$25.00</p>
                <button className="mt-3 text-sm font-bold text-indigo-600 hover:text-indigo-800">
                  Add to Cart +
                </button>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}