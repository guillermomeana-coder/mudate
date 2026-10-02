import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Setter } from '@/models/Setter';

function checkAuth(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get('x-admin-key') === secret;
}

// GET /api/admin/setters
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const setters = await Setter.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ setters });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST /api/admin/setters
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();

    if (!body.nombre?.trim() || !body.email?.trim()) {
      return NextResponse.json({ error: 'Nombre y email son requeridos' }, { status: 400 });
    }

    const setter = await Setter.create({
      nombre:   body.nombre.trim(),
      email:    body.email.trim().toLowerCase(),
      telefono: body.telefono?.trim() || undefined,
      active:   body.active !== false,
    });
    return NextResponse.json(setter, { status: 201 });
  } catch (e) {
    if (String(e).includes('duplicate key')) {
      return NextResponse.json({ error: 'Ya existe un setter con ese email' }, { status: 409 });
    }
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
