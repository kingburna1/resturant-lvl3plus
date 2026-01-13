import connectDB from "../../../../src/config/db";
import Dish from "../../../../src/models/Dish";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { items = [], paymentMethod, fulfillment, address, table } = body;
    const issues = [];

    // Validate payment method
    const allowedPayments = ['card', 'momo', 'paypal', 'cash', 'bank'];
    if (!paymentMethod || !allowedPayments.includes(paymentMethod)) {
      issues.push({ field: 'paymentMethod', message: 'Invalid or missing payment method' });
    }

    // Validate fulfillment fields
    if (fulfillment === 'delivery' && !address) {
      issues.push({ field: 'address', message: 'Delivery requires an address' });
    }
    if (fulfillment === 'dine-in' && !table) {
      issues.push({ field: 'table', message: 'Dine-in requires a table number' });
    }

    // Validate items: existence, availability, price
    for (const it of items) {
      const dish = await Dish.findById(it.id);
      if (!dish) {
        issues.push({ item: it.id, message: 'Dish not found' });
        continue;
      }
      if (!dish.isAvailable) issues.push({ item: it.id, message: 'Dish not available' });
      // price check (if client sent price)
      if (typeof it.price === 'number' && it.price !== dish.price) {
        issues.push({ item: it.id, field: 'price', message: 'Price mismatch' });
      }
    }

    const valid = issues.length === 0;
    return NextResponse.json({ valid, issues }, { status: 200 });
  } catch (err) {
    console.error('checkout validate error', err);
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
  }
}
