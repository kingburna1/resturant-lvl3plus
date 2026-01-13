import connectDB from "../../../../src/config/db";
import User from "../../../../src/models/User";
import { NextResponse } from "next/server";

// DELETE /api/cart/clear with body { userId }
export async function DELETE(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId } = body;
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    user.cart = [];
    await user.save();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('cart clear error', err);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
