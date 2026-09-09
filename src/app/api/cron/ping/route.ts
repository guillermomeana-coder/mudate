import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (e) {
    console.error('Cron ping failed:', e);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
