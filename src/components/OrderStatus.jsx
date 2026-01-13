"use client";

import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { 
  CheckCircle2, Clock, UtensilsCrossed, Check, 
  MessageSquare, Star, Phone, XCircle, 
  Download, RefreshCw, AlertCircle, Info,
  Building2
} from 'lucide-react';
import Link from 'next/link';

export default function OrderStatusPage() {
  // --- STATE ---
  // status states: 'pending', 'preparing', 'served', 'completed'
  const [status, setStatus] = useState('preparing'); 
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  // --- Real order data from store ---
  const orders = useStore((s) => s.orders || []);
  const latestOrder = orders.length ? orders[orders.length - 1] : null;

  const orderInfo = latestOrder ? {
    id: latestOrder.id,
    time: new Date(latestOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date(latestOrder.createdAt).toLocaleDateString(),
    table: latestOrder.customer?.table || '-',
    eta: latestOrder.estPrep ? `${latestOrder.estPrep} mins` : '25 mins',
    paymentMethod: latestOrder.paymentMethod || 'Unknown',
    notes: latestOrder.notes || ''
  } : null;

  const items = latestOrder ? (latestOrder.items || []) : [];
  const subtotal = latestOrder && (latestOrder.subtotal !== undefined) ? latestOrder.subtotal : 0;
  const tax = latestOrder && (latestOrder.tax !== undefined) ? latestOrder.tax : 0;
  const total = latestOrder && (latestOrder.total !== undefined) ? latestOrder.total : 0;

  const fmt = (v) => {
    const n = (typeof v === 'number') ? v : (Number(v) || 0);
    try { return n.toLocaleString(); } catch (e) { return String(n); }
  };

  // --- UI HELPERS ---
  const steps = [
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'preparing', label: 'Getting Ready', icon: UtensilsCrossed },
    { key: 'served', label: 'Served', icon: CheckCircle2 },
    { key: 'completed', label: 'Completed', icon: Check },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === status);

  useEffect(() => {
    if (latestOrder) setStatus(latestOrder.status || 'preparing');
  }, [latestOrder]);

  // --- Receipt download & support actions ---
  const downloadReceipt = () => {
    if (!latestOrder) return;
    const origin = window.location.origin;
    const logo = `${origin}/images/starter1.jpg`;
    const created = new Date(latestOrder.createdAt);
    const itemsHtml = (latestOrder.items || []).map(i => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee">${i.name}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${i.qty || i.quantity || 1}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">${fmt(i.price)}</td>
      </tr>
    `).join('');

    const html = `<!doctype html>
    <html><head><meta charset="utf-8"><title>Receipt ${latestOrder.id}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>body{font-family:Inter,system-ui,Arial,Helvetica,sans-serif;color:#111} .wrap{max-width:700px;margin:24px auto;padding:20px;border:1px solid #f0f0f0;border-radius:8px} .header{display:flex;align-items:center;gap:16px} .logo{width:72px;height:72px;object-fit:cover;border-radius:8px} table{width:100%;border-collapse:collapse;margin-top:12px} td{font-size:14px}</style>
    </head><body>
      <div class="wrap">
        <div class="header">
          <img class="logo" src="${logo}" alt="Restaurant logo" />
          <div>
            <h2 style="margin:0">Resturant</h2>
            <div style="color:#666;font-size:13px">Receipt: ${latestOrder.id}</div>
            <div style="color:#666;font-size:12px;margin-top:6px">${created.toLocaleDateString()} ${created.toLocaleTimeString()}</div>
          </div>
        </div>
        <hr style="margin:16px 0;border:none;border-top:1px solid #eee" />
        <div style="display:flex;justify-content:space-between;gap:12px">
          <div>
            <div style="font-size:12px;color:#666">Customer</div>
            <div style="font-weight:700">${latestOrder.customer?.name || '-'} </div>
            <div style="font-size:13px;color:#666">${latestOrder.customer?.phone || ''}</div>
            <div style="font-size:13px;color:#666">${latestOrder.customer?.address || ''}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:12px;color:#666">Payment</div>
            <div style="font-weight:700">${latestOrder.paymentMethod || ''}</div>
            <div style="font-size:12px;color:#666;margin-top:8px">Est prep: ${latestOrder.estPrep || '-'} mins</div>
          </div>
        </div>

        <table>
          <thead>
          <tr>
            <th style="text-align:left;padding:6px 8px;border-bottom:1px solid #eee">Item</th>
            <th style="text-align:center;padding:6px 8px;border-bottom:1px solid #eee">Qty</th>
            <th style="text-align:right;padding:6px 8px;border-bottom:1px solid #eee">Price</th>
          </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top:16px;display:flex;justify-content:flex-end;gap:12px;flex-direction:column;align-items:flex-end">
          <div style="font-size:14px;color:#666">Subtotal: ${fmt(latestOrder.subtotal)}</div>
          <div style="font-size:14px;color:#666">Tax: ${fmt(latestOrder.tax)}</div>
          <div style="font-weight:800;font-size:18px">Total: ${fmt(latestOrder.total)} FCFA</div>
        </div>

        <p style="font-size:12px;color:#888;margin-top:18px">Thank you for ordering with Resturant.</p>
      </div>
    </body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${latestOrder.id}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const callSupport = () => {
    const phone = '+237600000000';
    // attempt to open dialer / VoIP handler
    window.location.href = `tel:${phone}`;
  };

  if (!latestOrder) {
    return (
      <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-900 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
          <h2 className="text-xl font-bold">No recent orders</h2>
          <p className="text-sm text-slate-500 mt-2">You have no placed orders yet. Complete checkout to see order status here.</p>
          <div className="mt-4">
            <Link href="/" className="text-indigo-600 font-bold">Browse menu</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-900">
      
      {/* 1. CORE CONFIRMATION HEADER */}
      <header className="bg-white border-b border-slate-100 py-8 px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Order Confirmed</h1>
          <p className="mt-2 font-medium text-slate-500">Your order has been received and is being prepared.</p>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-bold uppercase tracking-widest text-slate-400">
            <span>Order {orderInfo.id}</span>
            <span className="hidden sm:inline">•</span>
            <span>{orderInfo.date} at {orderInfo.time}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* LEFT COLUMN: STATUS & DETAILS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 2. LIVE ORDER STATUS TRACKER */}
            <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-black uppercase tracking-wider text-sm text-slate-400">Live Status</h2>
                <div className="flex items-center gap-2 text-indigo-600 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                  <span className="text-xs font-bold uppercase">Updating Live</span>
                </div>
              </div>

              <div className="relative flex justify-between">
                {/* Connecting Lines */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 z-0" />
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-indigo-600 transition-all duration-1000 z-0" 
                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                        isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-300'
                      } ${isCurrent ? 'ring-4 ring-indigo-100 shadow-lg' : ''}`}>
                        <Icon size={18} />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${
                        isCompleted ? 'text-indigo-600' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* ETA & Fulfillment Mini-Bar */}
              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-slate-50 p-3 text-slate-600">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Table</p>
                    <p className="text-lg font-black">{orderInfo.table}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Est. Served In</p>
                    <p className="text-lg font-black text-indigo-600">{orderInfo.eta}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. ORDER ITEMS SECTION */}
            <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
              <h2 className="font-black uppercase tracking-wider text-sm text-slate-400 mb-6">Order Items</h2>
              <div className="space-y-6">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 font-black text-slate-600">
                        x{item.qty}
                      </div>
                      <span className="font-bold text-slate-800">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-500">{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              {orderInfo.notes && (
                <div className="mt-8 rounded-2xl bg-amber-50 p-4 flex gap-3 border border-amber-100">
                  <Info size={18} className="text-amber-600 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-amber-700">Kitchen Notes</p>
                    <p className="text-sm font-medium text-amber-800">{orderInfo.notes}</p>
                  </div>
                </div>
              )}
            </section>

            {/* 6. LIVE REVIEW & RATING (Enabled during Prep/Served) */}
            <section className="rounded-3xl bg-indigo-900 p-8 shadow-xl text-white overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-xl font-black mb-2">How is your experience?</h2>
                <p className="text-indigo-200 text-sm mb-6 font-medium">Rate the service while you wait or eat!</p>
                
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        size={32} 
                        className={`${
                          star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-indigo-700'
                        } transition-colors`} 
                      />
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <textarea 
                    placeholder="Write a live review..."
                    className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:bg-white/20 transition-all placeholder:text-indigo-300"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                  <button className="absolute right-3 bottom-3 bg-white text-indigo-900 px-4 py-1.5 rounded-xl text-xs font-black uppercase">Send</button>
                </div>
              </div>
              <MessageSquare className="absolute -right-8 -bottom-8 h-48 w-48 text-white/5 -rotate-12" />
            </section>
          </div>

          {/* RIGHT COLUMN: SUMMARY & ACTIONS */}
          <aside className="lg:col-span-5 space-y-6">
            
            {/* 4. SUMMARY BOX */}
            <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
              <h2 className="font-black uppercase tracking-wider text-sm text-slate-400 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax Amount</span>
                  <span className="text-slate-900 font-bold">{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-50">
                  <span className="font-black uppercase tracking-widest text-xs">Total Paid</span>
                  <span className="text-2xl font-black text-indigo-600">{total.toLocaleString()} <small className="text-[10px]">FCFA</small></span>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-[10px] font-black uppercase text-green-700 tracking-tighter">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  Paid via {orderInfo.paymentMethod}
                </div>
              </div>
            </section>

            {/* 7. ACTIONS SECTION */}
            <section className="space-y-3">
              {status === 'pending' && (
                <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white border-2 border-red-50 py-4 font-bold text-red-500 hover:bg-red-50 transition-colors">
                  <XCircle size={18} />
                  Cancel Order
                </button>
              )}
              
              <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-bold text-white shadow-xl hover:bg-black transition-all">
                <RefreshCw size={18} />
                Order Again
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button onClick={downloadReceipt} className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  <Download size={16} />
                  Receipt
                </button>
                <button onClick={callSupport} className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  <Phone size={16} />
                  Support
                </button>
              </div>
            </section>

            {/* 8. ERROR/OFFLINE ALERT (Conditional) */}
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 flex gap-3 animate-in fade-in zoom-in duration-500">
              <AlertCircle size={20} className="text-amber-600 shrink-0" />
              <p className="text-xs font-medium text-amber-700 leading-relaxed">
                <strong>Kitchen is busy:</strong> Your order might take 5 extra minutes. We apologize for the delay!
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}