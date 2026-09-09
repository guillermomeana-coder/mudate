import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

function checkAuth(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const key = req.headers.get('x-admin-key');
  return key === secret;
}

// GET /api/admin/propiedades — all properties (including unpublished)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    const search = searchParams.get('q') || '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { ciudad: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } },
    ];

    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
      Property.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Property.countDocuments(query),
    ]);

    return NextResponse.json({ properties, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST /api/admin/propiedades — create property
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();

    if (!body.title || !body.price || !body.operation || !body.type || !body.ciudad) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Auto-generate slug if not provided
    if (!body.slug) {
      const { slugify } = await import('@/lib/slugify');
      body.slug = slugify(`${body.title}-${body.ciudad}-${Date.now()}`);
    }

    // Auto-generate description if not provided
    if (!body.description) {
      body.description = `${body.type === 'departamento' ? 'Departamento' : body.type === 'casa' ? 'Casa' : body.type} en ${body.ciudad}.${body.superficie_cubierta ? ` ${body.superficie_cubierta} m² cubiertos.` : ''}${body.dormitorios ? ` ${body.dormitorios} dormitorios.` : ''}`;
    }

    const prop = await Property.create({ source: 'manual', ...body });
    return NextResponse.json(prop, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
