"use client";

import React, { useState, useEffect } from 'react';
import { 
  Lock, ChevronRight, 
  CreditCard, Smartphone, Banknote, Building2, 
  Clock, CheckCircle2, ChevronDown, 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useStore from '../../src/store/useStore';

export default function CheckoutPage() {
  // --- STATE MANAGEMENT ---
  const [fulfillment, setFulfillment] = useState('delivery'); // pickup, delivery, dine-in
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', table: '' });

  // --- REAL CART DATA ---
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const addOrder = useStore((state) => state.addOrder);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const showToast = (message, ms = 1400) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), ms);
  };
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    async function fetchCartDishes() {
      setLoadingCart(true);
      try {
        const ids = cart.map(item => item.id);
        if (ids.length === 0) {
          setCartItems([]);
          setLoadingCart(false);
          return;
        }
        const idsParam = ids.map(String).join(',');
        const res = await fetch(`/api/dishes?ids=${encodeURIComponent(idsParam)}`);
        const allDishes = await res.json();
        // Merge cart quantities with dish info
        const merged = allDishes.filter(dish => ids.includes(dish._id)).map(dish => {
          const cartItem = cart.find(item => item.id === dish._id);
          return { ...dish, qty: cartItem?.quantity || 1 };
        });
        setCartItems(merged);
      } catch (e) {
        setCartItems([]);
      }
      setLoadingCart(false);
    }
    fetchCartDishes();
  }, [cart]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  // Tax is fixed 5 per dish unit
  const tax = cartItems.reduce((acc, item) => acc + (item.qty * 5), 0);
  const shipping = fulfillment === 'delivery' ? 500 : 0;
  const total = subtotal + tax + shipping;

  // --- LOGIC ---
  const isFormValid = formData.name && formData.phone && paymentMethod && isConfirmed;

  const handlePlaceOrder = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      const estPrep = cartItems.length ? Math.max(...cartItems.map(i => i.prepTime || 25)) : 25;
      const payload = {
        // userId optional; anonymous orders allowed
        userId: null,
        items: cartItems.map(i => ({ id: i._id, qty: i.qty })),
        customer: { ...formData },
        payment: { method: paymentMethod },
        fulfillment,
        table: formData.table || null,
      };

      const res = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('Checkout confirm failed', data);
        showToast(data?.error || 'Failed to place order');
        setIsLoading(false);
        return;
      }

      // saved order from backend
      const savedOrder = data.order;
      try { addOrder(savedOrder); } catch (e) { console.warn('store addOrder failed', e); }
      clearCart();
      showToast('Order placed successfully');
      setTimeout(() => router.push('/orders'), 900);
    } catch (err) {
      console.error('Place order error', err);
      showToast('Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Processing...";
    if (paymentMethod === 'cash') return "Confirm Order";
    return "Pay Now";
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-900">
      
      {/* --- PROGRESS INDICATOR --- */}
      <nav className="border-b border-slate-100 bg-white py-4 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 flex justify-center items-center gap-4 text-sm font-medium">
          <span className="flex items-center gap-2 text-slate-400">Cart</span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="flex items-center gap-2 text-indigo-600">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white font-bold">2</span>
            Checkout
          </span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-400">Confirmation</span>
        </div>
      </nav>

      {/* --- MOBILE STICKY SUMMARY (Top of Mobile) --- */}
      <div className="block lg:hidden bg-indigo-900 text-white p-4 sticky top-0 z-40 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs opacity-70 uppercase font-bold tracking-tighter">Current Total</p>
            <p className="text-xl font-bold">{total.toLocaleString()} FCFA</p>
          </div>
          <button className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">View Items</button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          
          {/* --- LEFT COLUMN: DETAILS --- */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. CUSTOMER INFO */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-sm">1</span>
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-indigo-600 transition-colors"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+237 ..."
                    className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-indigo-600 transition-colors"
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </section>

            {/* 2. FULFILLMENT INFORMATION */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-sm">2</span>
                Fulfillment Method
              </h2>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {['delivery', 'pickup', 'dine-in'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setFulfillment(method)}
                    className={`flex-1 min-w-25 py-3 px-4 rounded-2xl border-2 text-sm font-bold capitalize transition-all ${
                      fulfillment === method 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                      : 'border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {method.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* Conditional Fulfillment Fields */}
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                {fulfillment === 'delivery' && (
                  <div className="space-y-4">
                    <input type="text" placeholder="Delivery Address" className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-600/20" />
                    <textarea placeholder="Special Instructions (e.g. Leave at the gate)" className="w-full rounded-xl border border-slate-200 p-3 h-24 outline-none" />
                  </div>
                )}
                {fulfillment === 'pickup' && (
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Clock className="text-indigo-600" />
                    <div>
                      <p className="font-bold text-sm">Estimated Pickup Time</p>
                      <p className="text-xs text-slate-500">Ready in approx. 25-30 minutes</p>
                    </div>
                  </div>
                )}
                {fulfillment === 'dine-in' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Table / Counter Number</label>
                    <input type="number" placeholder="e.g. 12" className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-indigo-600" />
                  </div>
                )}
              </div>
            </section>

            {/* 3. PAYMENT METHOD (DROPDOWN) */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-sm">3</span>
                Payment Method
              </h2>
              
              <div className="relative mb-6">
                <select 
                  className="w-full appearance-none rounded-2xl border-2 border-slate-100 p-4 font-bold outline-none focus:border-indigo-600 transition-all cursor-pointer"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  value={paymentMethod}
                >
                  <option value="" disabled>Select Payment Method</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="momo">Mobile Money (OM/MoMo)</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash">Cash on Delivery</option>
                  <option value="bank">Bank Transfer</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>

              {/* Conditional Payment Inputs */}
              <div className="bg-slate-50 rounded-2xl transition-all overflow-hidden">
                {paymentMethod === 'card' && (
                  <div className="p-6 space-y-4 animate-in zoom-in-95 duration-200">
                    <input type="text" placeholder="Card Number" className="w-full rounded-xl border border-slate-200 p-3" />
                    <div className="flex gap-4">
                      <input type="text" placeholder="MM/YY" className="w-1/2 rounded-xl border border-slate-200 p-3" />
                      <input type="password" placeholder="CVV" className="w-1/2 rounded-xl border border-slate-200 p-3" />
                    </div>
                  </div>
                )}
                {paymentMethod === 'momo' && (
                  <div className="p-6 space-y-2 animate-in zoom-in-95 duration-200">
                    <label className="text-xs font-bold text-slate-500">MOBILE MONEY NUMBER</label>
                    <input type="tel" placeholder="6xx xxx xxx" className="w-full rounded-xl border border-slate-200 p-3 font-mono" />
                    <p className="text-[10px] text-slate-400">You will receive a prompt to enter your PIN</p>
                  </div>
                )}
                {paymentMethod === 'cash' && (
                  <div className="p-6 flex items-center gap-3 text-slate-600 animate-in zoom-in-95 duration-200">
                    <Banknote size={20} />
                    <p className="text-sm font-medium">Please have the exact change ready for our rider.</p>
                  </div>
                )}
              </div>
            </section>

            {/* 5. CONFIRMATION */}
            <section className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-1 relative">
                  <input 
                    type="checkbox" 
                    className="peer h-5 w-5 rounded border-2 border-slate-300 checked:bg-indigo-600 checked:border-indigo-600 transition-all appearance-none"
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                  />
                  <CheckCircle2 className="absolute top-0 left-0 h-5 w-5 text-white scale-0 peer-checked:scale-100 transition-transform p-0.5" />
                </div>
                <span className="text-sm font-medium text-slate-600">
                  I confirm that my order details and fulfillment info are correct. 
                  <Link href="#" className="text-indigo-600 ml-1 underline">Terms & Conditions</Link>
                </span>
              </label>

              <button 
                disabled={!isFormValid || isLoading}
                onClick={handlePlaceOrder}
                className={`w-full py-5 rounded-2xl text-lg font-bold shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                  isFormValid && !isLoading 
                  ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isLoading && <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {getButtonText()}
              </button>
              
              <div className="flex flex-col items-center gap-4 pt-4">
                <div className="flex gap-4 opacity-40 grayscale">
                  {/* Payment Icons Placeholder */}
                  <CreditCard size={24} /> <Smartphone size={24} /> <Building2 size={24} />
                </div>
                <p className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Lock size={12} /> Secure encrypted checkout
                </p>
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN: ORDER SUMMARY (Sticky) --- */}
          <aside className="lg:col-span-5 sticky top-24">
            <div className="bg-slate-500 text-white rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <Link href="/cart" className="text-xs text-indigo-400 font-bold uppercase hover:text-indigo-300">Edit Cart</Link>
              </div>

              {/* Items List */}
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {loadingCart ? (
                  <div className="text-center text-white/60">Loading cart...</div>
                ) : cartItems.length === 0 ? (
                  <div className="text-center text-white/60">Your cart is empty.</div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-xs text-white/50 font-medium">Quantity: x{item.qty}</p>
                      </div>
                      <p className="font-mono font-bold">{item.price.toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm text-white/60 font-medium">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-white/60 font-medium">
                  <span>Tax (VAT)</span>
                  <span>{tax.toLocaleString()}</span>
                </div>
                {fulfillment === 'delivery' && (
                  <div className="flex justify-between text-sm text-white/60 font-medium">
                    <span>Shipping Fee</span>
                    <span>{shipping.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 py-2">
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm w-full outline-none focus:border-indigo-500"
                  />
                  <button className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-black uppercase">Apply</button>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Total Amount</p>
                    <p className="text-3xl font-black">{total.toLocaleString()} <span className="text-xs">FCFA</span></p>
                  </div>
                  <div className="text-right pb-1">
                    <p className="text-[10px] text-white/40 uppercase font-bold">Est. Preparation</p>
                    <p className="text-xs font-bold">~25 Mins</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                <p className="text-[10px] text-white/40 font-bold uppercase mb-1">Need help with your order?</p>
                <p className="text-xs font-bold text-white tracking-wide">+237 600 000 000</p>
              </div>
            </div>
          </aside>

        </div>
      </main>
      {toast.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg pointer-events-auto max-w-xs text-center">
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}