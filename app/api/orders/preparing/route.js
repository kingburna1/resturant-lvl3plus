import connectDB from "../../../src/config/db";
import Order from "../../../src/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({ status: 'in_preparation' }).sort({ createdAt: 1 }).limit(200);
    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error('orders preparing GET error', err);
    return NextResponse.json({ error: 'Failed to fetch preparing orders' }, { status: 500 });
  }
}
