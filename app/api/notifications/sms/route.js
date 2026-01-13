import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, message } = body;

    if (!to || !message) {
      return NextResponse.json({ error: 'Missing required fields: to and message' }, { status: 400 });
    }

    // Placeholder: integrate with SMS provider (Twilio, Nexmo, etc.) here.
    console.log('[notifications/sms] send', { to, message });

    return NextResponse.json({ success: true, provider: 'mock-sms', to }, { status: 200 });
  } catch (err) {
    console.error('[notifications/sms] error', err);
    return NextResponse.json({ error: 'Failed to send sms' }, { status: 500 });
  }
}
