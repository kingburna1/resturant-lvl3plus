import connectDB from "../../../../src/config/db";
import User from "../../../../src/models/User";
import { NextResponse } from "next/server";

// POST /api/cart/add with { userId, dishId, quantity }
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, dishId, quantity = 1 } = body;
    if (!userId || !dishId) return NextResponse.json({ error: 'Missing userId or dishId' }, { status: 400 });

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const existing = user.cart.find(i => String(i.dishId) === String(dishId));
    if (existing) {
      existing.quantity = existing.quantity + quantity;
    } else {
      user.cart.push({ dishId, quantity });
    }
    await user.save();
    return NextResponse.json({ success: true, cart: user.cart }, { status: 200 });
  } catch (err) {
    console.error('cart add error', err);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}
