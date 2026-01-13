import connectDB from "../../../../src/config/db";
import Review from "../../../../src/models/Review";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'Missing review id' }, { status: 400 });
    const body = await request.json();
    const allowed = ['rating', 'comment', 'author'];
    const update = {};
    Object.keys(body).forEach(k => { if (allowed.includes(k)) update[k] = body[k]; });
    const updated = await Review.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error('reviews PUT error', err);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'Missing review id' }, { status: 400 });
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('reviews DELETE error', err);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
