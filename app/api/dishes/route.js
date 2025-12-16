// src/app/api/dishes/route.js
import connectDB from "../../../src/config/db";
import Dish from "../../../src/models/Dish";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const dishes = await Dish.find({});
    return NextResponse.json(dishes, { status: 200 });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch dishes" }, { status: 500 });
  }
}
