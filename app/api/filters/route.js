import connectDB from "../../../src/config/db";
import Dish from "../../../src/models/Dish";
import Category from "../../../src/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).select('name slug').lean();
    const prices = await Dish.aggregate([{ $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } }]);
    const priceRange = prices[0] || { min: 0, max: 0 };
    return NextResponse.json({ categories, priceRange }, { status: 200 });
  } catch (err) {
    console.error('filters GET error', err);
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
  }
}
