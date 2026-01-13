import connectDB from "../../../../src/config/db";
import User from "../../../../src/models/User";
import { NextResponse } from "next/server";

// PUT /api/cart/update with { userId, dishId, quantity }
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, dishId, quantity } = body;
    if (!userId || !dishId || typeof quantity !== 'number') return NextResponse.json({ error: 'Missing userId/dishId/quantity' }, { status: 400 });

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const item = user.cart.find(i => String(i.dishId) === String(dishId));
    if (!item) return NextResponse.json({ error: 'Item not in cart' }, { status: 404 });
    if (quantity <= 0) {
      user.cart = user.cart.filter(i => String(i.dishId) !== String(dishId));
    } else {
      item.quantity = quantity;
    }
    await user.save();
    return NextResponse.json({ success: true, cart: user.cart }, { status: 200 });
  } catch (err) {
    console.error('cart update error', err);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
