import connectDB from "../../../src/config/db";
import Order from "../../../src/models/Order";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const orders = await Order.find({ 'customer._id': userId }).sort({ createdAt: -1 }).limit(200);
    // fallback: if customer._id not set, try orders referencing userId in metadata
    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error('orders history error', err);
    return NextResponse.json({ error: 'Failed to fetch order history' }, { status: 500 });
  }
}
