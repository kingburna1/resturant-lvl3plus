import connectDB from "../../../src/config/db";
import Review from "../../../src/models/Review";
import { NextResponse } from "next/server";

// POST /api/reviews -> create a review
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { productId, orderId, author, rating, comment } = body;
    if (!productId || !rating) return NextResponse.json({ error: 'Missing productId or rating' }, { status: 400 });

    const review = new Review({ productId, orderId, author: author || {}, rating, comment: comment || '' });
    const saved = await review.save();
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error('reviews POST error', err);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

// GET /api/reviews -> list all reviews (optional query params)
export async function GET(request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');
    const orderId = url.searchParams.get('orderId');

    const filter = {};
    if (productId) filter.productId = productId;
    if (orderId) filter.orderId = orderId;

    const reviews = await Review.find(filter).sort({ createdAt: -1 }).limit(200);
    return NextResponse.json(reviews, { status: 200 });
  } catch (err) {
    console.error('reviews GET error', err);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
