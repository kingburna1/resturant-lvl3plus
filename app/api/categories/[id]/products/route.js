import connectDB from "../../../../src/config/db";
import Category from "../../../../src/models/Category";
import Dish from "../../../../src/models/Dish";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const category = await Category.findById(id).lean();
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    // Find dishes where Dish.category matches category.name
    const products = await Dish.find({ category: category.name });
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error('categories products GET error', err);
    return NextResponse.json({ error: 'Failed to fetch category products' }, { status: 500 });
  }
}
