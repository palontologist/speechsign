import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { translations } from '@/db/schema';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Interpret route is reachable' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Omi webhook usually sends a payload with 'transcript' or 'text'
    const transcript = body.transcript || body.text || body.segment?.text;

    if (!transcript) {
      console.warn('[Webhook] Received payload without transcript:', body);
      return NextResponse.json({ error: 'Missing transcript' }, { status: 400 });
    }

    // Save the transcript to TursoDB
    // The frontend will then use this transcript to trigger the animation
    await db.insert(translations).values({
      transcript,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Webhook Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
