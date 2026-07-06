import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { translations } from '@/db/schema';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Interpret route is reachable' });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    console.log(`[Omi Webhook] Request received. Content-Type: ${contentType}`);
    
    // HANDLE BINARY AUDIO DATA
    if (contentType.includes('application/octet-stream') || contentType.includes('audio')) {
      console.log('[Omi Webhook] Detected binary audio stream. Ignoring for transcript demo.');
      // We save a marker but log a warning that this is NOT a transcript
      await db.insert(translations).values({
        transcript: `[AUDIO CHUNK] - Received audio but expected transcript. Check Omi trigger settings.`,
      });
      
      return NextResponse.json({ success: true, mode: 'audio' });
    }

    // HANDLE JSON TRANSCRIPTS (The original way)
    try {
      const body = await req.json();
      console.log('[Omi Webhook] Received JSON payload:', JSON.stringify(body, null, 2));
      
      let transcript = 
        body.transcript || 
        body.text || 
        body.segment?.text || 
        body.data?.transcript;

      if (!transcript) {
        await db.insert(translations).values({
          transcript: `DEBUG: JSON received but no text found.`,
        });
        return NextResponse.json({ error: 'Missing transcript' }, { status: 400 });
      }

      await db.insert(translations).values({
        transcript: String(transcript),
      });

      return NextResponse.json({ success: true });
    } catch (jsonError) {
      // If it's not JSON and not a known audio type, treat as generic binary
      await db.insert(translations).values({
        transcript: `[UNKNOWN BINARY DATA RECEIVED]`,
      });
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('[Omi Webhook Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
