import connectDB from "../../../src/config/db";
import User from "../../../src/models/User";
import Dish from "../../../src/models/Dish";
import { NextResponse } from "next/server";

// GET /api/cart?userId=...
export async function GET(request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const user = await User.findById(userId).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const dishIds = user.cart.map(i => i.dishId);
    const dishes = await Dish.find({ _id: { $in: dishIds } }).lean();
    const cart = user.cart.map(ci => {
      const dish = dishes.find(d => String(d._id) === String(ci.dishId));
      return { dish, quantity: ci.quantity };
    });

    return NextResponse.json({ cart }, { status: 200 });
  } catch (err) {
    console.error('cart GET error', err);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}
