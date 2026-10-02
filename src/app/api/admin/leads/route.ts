import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/models/Lead';

function checkAuth(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get('x-admin-key') === secret;
}

// GET /api/admin/leads
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page   = parseInt(searchParams.get('page')   || '1');
    const limit  = parseInt(searchParams.get('limit')  || '30');
    const q      = searchParams.get('q')      || '';
    const status = searchParams.get('status') || '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (q) query.$or = [
      { nombre:       { $regex: q, $options: 'i' } },
      { ciudad:       { $regex: q, $options: 'i' } },
      { propertySlug: { $regex: q, $options: 'i' } },
      { telefono:     { $regex: q, $options: 'i' } },
    ];
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Lead.countDocuments(query),
    ]);

    return NextResponse.json({ leads, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
