import connectDB from "../../../../src/config/db";
import Category from "../../../../src/models/Category";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();
    const allowed = ['name', 'slug', 'description', 'imageUrl'];
    const update = {};
    Object.keys(body).forEach(k => { if (allowed.includes(k)) update[k] = body[k]; });
    const updated = await Category.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error('categories PUT error', err);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('categories DELETE error', err);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
