import connectDB from "../../../../src/config/db";
import Order from "../../../../src/models/Order";
import { NextResponse } from "next/server";

// PUT /api/orders/:id/status to update status
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();
    const { status } = body;
    if (!status) return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    const allowed = ['in_preparation', 'served', 'completed', 'canceled'];
    if (!allowed.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ success: true, order: updated }, { status: 200 });
  } catch (err) {
    console.error('orders status PUT error', err);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
