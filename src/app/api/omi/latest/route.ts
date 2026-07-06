import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { translations } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Health check: if database is not connected, this will throw and go to catch
    const latest = await db.query.translations.findFirst({
      orderBy: [desc(translations.timestamp)],
    });

    if (!latest) {
      return NextResponse.json({ message: 'No translations yet' }, { status: 200 }); // Change 404 to 200 for demo
    }

    return NextResponse.json(latest);
  } catch (error) {
    console.error('[Latest Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
  }
}
