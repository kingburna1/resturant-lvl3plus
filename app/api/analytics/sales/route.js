import connectDB from "../../../src/config/db";
import Order from "../../../src/models/Order";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const match = { status: 'completed' };
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }
    const agg = await Order.aggregate([
      { $match: match },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    return NextResponse.json(agg, { status: 200 });
  } catch (err) {
    console.error('analytics sales GET error', err);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}
