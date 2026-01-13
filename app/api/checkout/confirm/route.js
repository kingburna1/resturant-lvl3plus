import connectDB from "../../../../src/config/db";
import Order from "../../../../src/models/Order";
import User from "../../../../src/models/User";
import Dish from "../../../../src/models/Dish";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, items = [], customer = {}, payment = {}, fulfillment = 'delivery', address, table } = body;

    // basic validation
    // userId is optional (anonymous checkout allowed)
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'Empty items' }, { status: 400 });

    // compute total server-side and snapshot prices
    let subtotal = 0;
    const snapshotItems = [];
    for (const it of items) {
      const dish = await Dish.findById(it.id);
      if (!dish) return NextResponse.json({ error: `Dish ${it.id} not found` }, { status: 400 });
      if (!dish.isAvailable) return NextResponse.json({ error: `Dish ${dish.name} unavailable` }, { status: 400 });
      const qty = it.qty || it.quantity || 1;
      subtotal += dish.price * qty;
      snapshotItems.push({ dishId: dish._id, name: dish.name, price: dish.price, quantity: qty });
    }

    const tax = items.reduce((acc, it) => acc + (5 * (it.qty || it.quantity || 1)), 0);
    const shipping = fulfillment === 'delivery' ? 500 : 0;
    const total = subtotal + tax + shipping;

    // create order document
    const orderNumber = `ORD-${Date.now()}`;
    const orderDoc = new Order({
      orderNumber,
      tableNumber: table || 0,
      customer: {
        firstName: customer.name || customer.firstName || '',
        lastName: customer.lastName || '',
        phone: customer.phone || ''
      },
      items: snapshotItems.map(i => ({ dishId: i.dishId, name: i.name, price: i.price, quantity: i.quantity })),
      totalAmount: total,
      status: 'in_preparation',
      payment: payment || {}
    });

    const saved = await orderDoc.save();

    // attach order to user and clear user's server-side cart (if userId provided)
    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.orders = user.orders || [];
          user.orders.push(saved._id);
          user.cart = [];
          await user.save();
        }
      } catch (e) {
        console.warn('Could not attach order to user', e);
      }
    }

    // Normalize returned order for the client (include subtotal/tax/total and qty)
    const out = saved.toObject ? saved.toObject() : { ...saved };
    out.subtotal = subtotal;
    out.tax = tax;
    out.shipping = shipping;
    out.total = total;
    out.id = out._id || out.id || orderNumber;
    out.items = (out.items || []).map(i => ({
      dishId: i.dishId,
      name: i.name,
      price: i.price,
      qty: i.quantity || i.qty || 1,
    }));
    out.paymentMethod = (payment && payment.method) || out.payment?.method || out.paymentMethod || 'unknown';
    out.customer = out.customer || {};
    // Provide a friendly customer.name for receipts
    out.customer.name = out.customer.name || `${out.customer.firstName || ''} ${out.customer.lastName || ''}`.trim();

    return NextResponse.json({ success: true, order: out }, { status: 201 });
  } catch (err) {
    console.error('checkout confirm error', err);
    const message = err && err.message ? err.message : 'Failed to confirm order';
    const payload = { error: message };
    if (process.env.NODE_ENV !== 'production') payload.stack = err.stack ? String(err.stack) : undefined;
    return NextResponse.json(payload, { status: 500 });
  }
}
