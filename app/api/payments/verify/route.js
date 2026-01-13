import { NextResponse } from 'next/server';
import connectDB from '../../../src/config/db';
import Order from '../../../src/models/Order';

export async function POST(request) {
  try {
    const body = await request.json();
    const { paymentId, orderId, success = true } = body;
    if (!paymentId || !orderId) return NextResponse.json({ error: 'Missing paymentId or orderId' }, { status: 400 });

    // In a real integration, verify payment with provider here.
    if (success) {
      await connectDB();
      await Order.findByIdAndUpdate(orderId, { status: 'in_preparation' });
      return NextResponse.json({ verified: true }, { status: 200 });
    }
    return NextResponse.json({ verified: false }, { status: 200 });
  } catch (err) {
    console.error('payments verify error', err);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
