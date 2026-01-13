import { NextResponse } from 'next/server';
import crypto from 'crypto';

// NOTE: Do NOT send raw card data to this endpoint. Integrate with a PCI-compliant provider.
export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, amount, provider = 'mock' } = body;
    if (!orderId || typeof amount !== 'number') return NextResponse.json({ error: 'Missing orderId or amount' }, { status: 400 });

    // Create a payment session id (mock)
    const paymentId = crypto.randomBytes(8).toString('hex');
    const clientToken = crypto.randomBytes(16).toString('hex');

    return NextResponse.json({ paymentId, clientToken, provider, amount, orderId }, { status: 200 });
  } catch (err) {
    console.error('payments initiate error', err);
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
  }
}
