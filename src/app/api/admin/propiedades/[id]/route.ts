import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

function checkAuth(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get('x-admin-key') === secret;
}

// PUT /api/admin/propiedades/[id] — update
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    // Prevent slug collision
    delete body._id;
    delete body.__v;

    const updated = await Property.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean();
    if (!updated) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE /api/admin/propiedades/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    await Property.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
