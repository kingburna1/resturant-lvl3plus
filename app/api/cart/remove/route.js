import connectDB from "../../../../src/config/db";
import User from "../../../../src/models/User";
import { NextResponse } from "next/server";

// DELETE /api/cart/remove with body { userId, dishId }
export async function DELETE(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, dishId } = body;
    if (!userId || !dishId) return NextResponse.json({ error: 'Missing userId or dishId' }, { status: 400 });

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    user.cart = user.cart.filter(i => String(i.dishId) !== String(dishId));
    await user.save();
    return NextResponse.json({ success: true, cart: user.cart }, { status: 200 });
  } catch (err) {
    console.error('cart remove error', err);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}
