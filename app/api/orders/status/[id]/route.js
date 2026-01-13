import connectDB from "../../../../src/config/db";
import Order from "../../../../src/models/Order";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const order = await Order.findById(id).lean();
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ status: order.status }, { status: 200 });
  } catch (err) {
    console.error('orders status GET error', err);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
