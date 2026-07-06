import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { translations } from '@/db/schema';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Interpret route is reachable' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Omi Webhook] Received payload:', JSON.stringify(body, null, 2));
    
    // Try multiple possible paths for the transcription text
    let transcript = 
      body.transcript || 
      body.text || 
      body.segment?.text || 
      body.data?.transcript ||
      (Array.isArray(body) ? body[0]?.transcript : null) ||
      (Array.isArray(body) ? body[0]?.text : null);

    // If still not found, try to find ANY string field that looks like a sentence
    if (!transcript && typeof body === 'object' && body !== null) {
      const values = Object.values(body);
      const possibleText = values.find(v => typeof v === 'string' && v.length > 2);
      if (possibleText) transcript = possibleText;
    }

    if (!transcript) {
      console.error('[Omi Webhook] Could not find transcript in payload');
      // Save a "Debug" entry to the DB so we know the webhook was hit
      await db.insert(translations).values({
        transcript: `DEBUG: Received payload but no text found. Body: ${JSON.stringify(body).slice(0, 100)}`,
      });
      return NextResponse.json({ error: 'Missing transcript' }, { status: 400 });
    }

    console.log('[Omi Webhook] Successfully found transcript:', transcript);

    await db.insert(translations).values({
      transcript: String(transcript),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Omi Webhook Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
