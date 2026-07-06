import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { translations } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Interpret route is reachable' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Expecting Omi payload
    const { gloss, poseUrl, swr } = body;

    if (!gloss) {
      return NextResponse.json({ error: 'Missing gloss' }, { status: 400 });
    }

    // Save to TursoDB
    await db.insert(translations).values({
      gloss,
      poseUrl,
      swr,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Webhook Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
