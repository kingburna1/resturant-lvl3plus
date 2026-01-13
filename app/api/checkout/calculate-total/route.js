import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items = [], fulfillment = 'delivery' } = body;

    const subtotal = items.reduce((acc, it) => acc + ((it.price || 0) * (it.qty || it.quantity || 1)), 0);
    // Tax fixed 5 per dish unit
    const tax = items.reduce((acc, it) => acc + (5 * (it.qty || it.quantity || 1)), 0);
    const shipping = fulfillment === 'delivery' ? 500 : 0;
    const total = subtotal + tax + shipping;

    return NextResponse.json({ subtotal, tax, shipping, total }, { status: 200 });
  } catch (err) {
    console.error('checkout calculate error', err);
    return NextResponse.json({ error: 'Failed to calculate total' }, { status: 500 });
  }
}
