import connectDB from "../../../src/config/db";
import Dish from "../../../src/models/Dish";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const q = url.searchParams.get('q') || '';
    const category = url.searchParams.get('category');
    const minPrice = parseFloat(url.searchParams.get('minPrice')) || 0;
    const maxPrice = parseFloat(url.searchParams.get('maxPrice')) || Number.MAX_SAFE_INTEGER;

    const filter = { price: { $gte: minPrice, $lte: maxPrice } };
    if (category) filter.category = category;
    if (q) filter.$text = { $search: q }; // requires text index; fallback below

    let results;
    try {
      results = await Dish.find(filter).limit(200);
    } catch (e) {
      // fallback if text index not present
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      const fallbackFilter = { ...filter };
      delete fallbackFilter.$text;
      if (q) fallbackFilter.$or = [{ name: regex }, { description: regex }];
      results = await Dish.find(fallbackFilter).limit(200);
    }

    return NextResponse.json(results, { status: 200 });
  } catch (err) {
    console.error('search GET error', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
