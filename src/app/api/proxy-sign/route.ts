import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  const spoken = searchParams.get('spoken') || 'en';
  const signed = searchParams.get('signed') || 'ase';

  if (!text) {
    return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
  }

  const targetUrl = `https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose?text=${encodeURIComponent(text)}&spoken=${spoken}&signed=${signed}`;

  try {
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `External API responded with ${response.status}` }, 
        { status: response.status }
      );
    }

    const data = await response.text(); // Use text() as pose-viewer might expect a specific format
    
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow pose-viewer to read it
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
