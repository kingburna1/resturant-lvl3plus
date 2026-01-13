// src/app/api/dishes/route.js
import connectDB from "../../../src/config/db";
import Dish from "../../../src/models/Dish";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const idsParam = url.searchParams.get('ids'); // comma separated ids

    if (!idsParam) {
      const dishes = await Dish.find({});
      return NextResponse.json(dishes, { status: 200 });
    }

    const ids = idsParam.split(',').map(s => s.trim()).filter(Boolean);
    // Basic safety: limit number of ids
    if (ids.length === 0) return NextResponse.json([], { status: 200 });
    if (ids.length > 50) ids.length = 50;

    const dishes = await Dish.find({ _id: { $in: ids } });
    return NextResponse.json(dishes, { status: 200 });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch dishes" }, { status: 500 });
  }
}
