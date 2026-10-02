import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

export const dynamic = 'force-dynamic';

const INDEXNOW_KEY = 'b010134ebc3e6ede48122257a7f502b1';
const HOST = 'https://mudateargentina.com';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    // Find properties updated in last 24h for IndexNow submission
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentProps = await Property.find({
      published: true,
      updatedAt: { $gte: oneDayAgo },
    }).select('slug').limit(500).lean();

    let indexNowResult = null;
    if (recentProps.length > 0) {
      const urls = recentProps.map(p => `${HOST}/propiedades/${p.slug}`);
      // Add homepage and main listing pages
      urls.unshift(`${HOST}/`, `${HOST}/propiedades`);

      try {
        const res = await fetch('https://api.indexnow.org/IndexNow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            host: 'mudateargentina.com',
            key: INDEXNOW_KEY,
            keyLocation: `${HOST}/${INDEXNOW_KEY}.txt`,
            urlList: urls,
          }),
        });
        indexNowResult = { status: res.status, urls: urls.length };
      } catch (e) {
        indexNowResult = { error: String(e) };
      }
    }

    return NextResponse.json({
      ok: true,
      ts: new Date().toISOString(),
      recentProperties: recentProps.length,
      indexNow: indexNowResult,
    });
  } catch (e) {
    console.error('Cron ping failed:', e);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
