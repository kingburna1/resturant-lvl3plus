import connectDB from "../../../../../src/config/db";
import Review from "../../../../../src/models/Review";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    const reviews = await Review.find({ productId: id }).sort({ createdAt: -1 });
    return NextResponse.json(reviews, { status: 200 });
  } catch (err) {
    console.error('reviews/product GET error', err);
    return NextResponse.json({ error: 'Failed to fetch product reviews' }, { status: 500 });
  }
}
