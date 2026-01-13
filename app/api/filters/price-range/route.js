import connectDB from "../../../../src/config/db";
import Dish from "../../../../src/models/Dish";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const prices = await Dish.aggregate([{ $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } }]);
    const priceRange = prices[0] || { min: 0, max: 0 };
    return NextResponse.json(priceRange, { status: 200 });
  } catch (err) {
    console.error('price-range GET error', err);
    return NextResponse.json({ error: 'Failed to fetch price range' }, { status: 500 });
  }
}
