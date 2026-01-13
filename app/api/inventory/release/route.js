import connectDB from "../../../../src/config/db";
import Dish from "../../../../src/models/Dish";
import { NextResponse } from "next/server";

// POST /api/inventory/release { productId, quantity }
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { productId, quantity = 1 } = body;
    if (!productId || typeof quantity !== 'number' || quantity <= 0) return NextResponse.json({ error: 'Missing productId or invalid quantity' }, { status: 400 });

    const dish = await Dish.findById(productId);
    if (!dish) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    dish.stock = (dish.stock || 0) + quantity;
    dish.isAvailable = dish.stock > 0;
    await dish.save();
    return NextResponse.json({ success: true, productId, restored: quantity, stock: dish.stock }, { status: 200 });
  } catch (err) {
    console.error('inventory release error', err);
    return NextResponse.json({ error: 'Failed to release' }, { status: 500 });
  }
}
