import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { translations } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Get the most recent translation
    const latest = await db.query.translations.findFirst({
      orderBy: [desc(translations.timestamp)],
    });

    if (!latest) {
      return NextResponse.json({ message: 'No translations yet' }, { status: 404 });
    }

    return NextResponse.json(latest);
  } catch (error) {
    console.error('[Latest Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
