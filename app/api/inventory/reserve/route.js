import connectDB from "../../../../src/config/db";
import Dish from "../../../../src/models/Dish";
import { NextResponse } from "next/server";

// POST /api/inventory/reserve { productId, quantity }
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { productId, quantity = 1 } = body;
    if (!productId || typeof quantity !== 'number' || quantity <= 0) return NextResponse.json({ error: 'Missing productId or invalid quantity' }, { status: 400 });

    const dish = await Dish.findById(productId);
    if (!dish) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    const available = dish.stock || 0;
    if (available < quantity) return NextResponse.json({ error: 'Insufficient stock', available }, { status: 409 });
    dish.stock = available - quantity;
    dish.isAvailable = dish.stock > 0;
    await dish.save();
    return NextResponse.json({ success: true, productId, reserved: quantity, remaining: dish.stock }, { status: 200 });
  } catch (err) {
    console.error('inventory reserve error', err);
    return NextResponse.json({ error: 'Failed to reserve' }, { status: 500 });
  }
}
