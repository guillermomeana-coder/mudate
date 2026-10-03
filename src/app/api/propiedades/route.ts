import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const operation = searchParams.get('operation');
    const type = searchParams.get('type');
    const ciudad = searchParams.get('ciudad');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { published: true };

    if (operation) query.operation = operation;
    if (type) query.type = type;
    if (ciudad) query.ciudad = { $regex: ciudad, $options: 'i' };
    if (featured === 'true') query.featured = true;
    const categoria = searchParams.get('categoria');
    if (categoria) query.categoria = categoria;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(query),
    ]);

    return NextResponse.json({
      properties,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/propiedades error:', error);
    return NextResponse.json({ error: 'Error al obtener propiedades' }, { status: 500 });
  }
}
