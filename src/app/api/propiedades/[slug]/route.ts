import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const property = await Property.findOne({ slug, published: true }).lean();
    if (!property) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('GET /api/propiedades/[slug] error:', error);
    return NextResponse.json({ error: 'Error al obtener propiedad' }, { status: 500 });
  }
}
