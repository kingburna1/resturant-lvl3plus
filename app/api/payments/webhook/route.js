import { NextResponse } from 'next/server';
import connectDB from '../../../src/config/db';
import Order from '../../../src/models/Order';

export async function POST(request) {
  try {
    const event = await request.json();
    // Example event: { type: 'payment.succeeded', data: { orderId } }
    const { type, data } = event;
    await connectDB();
    if (type === 'payment.succeeded' && data?.orderId) {
      await Order.findByIdAndUpdate(data.orderId, { status: 'in_preparation' });
    } else if (type === 'payment.failed' && data?.orderId) {
      await Order.findByIdAndUpdate(data.orderId, { status: 'canceled' });
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('payments webhook error', err);
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }
}
