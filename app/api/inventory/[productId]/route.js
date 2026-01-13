import connectDB from "../../../src/config/db";
import Dish from "../../../src/models/Dish";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { productId } = params;
    const dish = await Dish.findById(productId).select('stock isAvailable name').lean();
    if (!dish) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ productId, stock: dish.stock || 0, isAvailable: dish.isAvailable, name: dish.name }, { status: 200 });
  } catch (err) {
    console.error('inventory GET error', err);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}
