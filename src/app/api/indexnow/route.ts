import { NextResponse } from 'next/server';

const INDEXNOW_KEY = 'b010134ebc3e6ede48122257a7f502b1';
const HOST = 'https://mudateargentina.com';

export async function POST(req: Request) {
  try {
    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'urls array required' }, { status: 400 });
    }

    const fullUrls = urls.map((u: string) => u.startsWith('http') ? u : `${HOST}${u}`);

    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'mudateargentina.com',
        key: INDEXNOW_KEY,
        keyLocation: `${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: fullUrls.slice(0, 10000),
      }),
    });

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      submitted: fullUrls.length,
    });
  } catch (e) {
    console.error('IndexNow error:', e);
    return NextResponse.json({ error: 'IndexNow submission failed' }, { status: 500 });
  }
}
