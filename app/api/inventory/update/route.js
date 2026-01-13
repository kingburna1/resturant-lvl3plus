import connectDB from "../../../../src/config/db";
import Dish from "../../../../src/models/Dish";
import { NextResponse } from "next/server";

// PUT /api/inventory/update { productId, stock } (absolute) or { productId, delta }
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { productId, stock, delta } = body;
    if (!productId || (typeof stock !== 'number' && typeof delta !== 'number')) return NextResponse.json({ error: 'Missing productId and stock/delta' }, { status: 400 });

    const dish = await Dish.findById(productId);
    if (!dish) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    if (typeof stock === 'number') dish.stock = stock;
    if (typeof delta === 'number') dish.stock = (dish.stock || 0) + delta;
    dish.isAvailable = (dish.stock || 0) > 0;
    await dish.save();
    return NextResponse.json({ success: true, productId, stock: dish.stock }, { status: 200 });
  } catch (err) {
    console.error('inventory update error', err);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}
