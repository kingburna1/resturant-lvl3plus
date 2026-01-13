import connectDB from "../../../src/config/db";
import AnalyticsEvent from "../../../src/models/AnalyticsEvent";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    if (!body.type) return NextResponse.json({ error: 'Missing event type' }, { status: 400 });
    const ev = new AnalyticsEvent(body);
    const saved = await ev.save();
    return NextResponse.json({ success: true, id: saved._id }, { status: 201 });
  } catch (err) {
    console.error('analytics event POST error', err);
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
  }
}
