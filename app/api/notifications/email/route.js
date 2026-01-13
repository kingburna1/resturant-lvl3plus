import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, subject, html, text } = body;

    if (!to || (!html && !text)) {
      return NextResponse.json({ error: 'Missing required fields: to and html/text' }, { status: 400 });
    }

    // Placeholder: integrate with email provider (SendGrid, Mailgun, SES, etc.) here.
    console.log('[notifications/email] send', { to, subject });

    // Simulate async send
    return NextResponse.json({ success: true, provider: 'mock-email', to, subject }, { status: 200 });
  } catch (err) {
    console.error('[notifications/email] error', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
