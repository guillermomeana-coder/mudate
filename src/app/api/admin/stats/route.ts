import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import { Lead } from '@/models/Lead';

function checkAuth(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get('x-admin-key') === secret;
}

// GET /api/admin/stats
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    const now = new Date();
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now); startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalProps, publishedProps, featuredProps,
      totalLeads, leadsHoy, leadsSemana, leadsMes,
      leadsByStatus, leadsByCiudad, recentLeads,
    ] = await Promise.all([
      Property.countDocuments({}),
      Property.countDocuments({ published: true }),
      Property.countDocuments({ featured: true }),

      Lead.countDocuments({}),
      Lead.countDocuments({ createdAt: { $gte: startOfDay } }),
      Lead.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Lead.countDocuments({ createdAt: { $gte: startOfMonth } }),

      Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Lead.aggregate([
        { $group: { _id: '$ciudad', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Lead.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      props: { total: totalProps, published: publishedProps, featured: featuredProps },
      leads: {
        total: totalLeads,
        hoy: leadsHoy,
        semana: leadsSemana,
        mes: leadsMes,
        byStatus: leadsByStatus,
        byCiudad: leadsByCiudad,
      },
      recentLeads,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
