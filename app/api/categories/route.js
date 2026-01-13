import connectDB from "../../../src/config/db";
import Category from "../../../src/models/Category";
import Dish from "../../../src/models/Dish";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.error('categories GET error', err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, slug, description, imageUrl } = body;
    if (!name || !slug) return NextResponse.json({ error: 'Missing name or slug' }, { status: 400 });
    const cat = new Category({ name, slug, description, imageUrl });
    const saved = await cat.save();
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error('categories POST error', err);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
