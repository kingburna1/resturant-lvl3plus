import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { deviceToken, userId, title, message, data } = body;

    if ((!deviceToken && !userId) || !message) {
      return NextResponse.json({ error: 'Missing required fields: deviceToken/userId and message' }, { status: 400 });
    }

    // Placeholder: integrate with push provider (FCM, APNs) here.
    console.log('[notifications/push] send', { deviceToken, userId, title, message, data });

    return NextResponse.json({ success: true, provider: 'mock-push', deviceToken, userId }, { status: 200 });
  } catch (err) {
    console.error('[notifications/push] error', err);
    return NextResponse.json({ error: 'Failed to send push' }, { status: 500 });
  }
}
