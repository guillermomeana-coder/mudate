import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Subscriber } from '@/models/Subscriber';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    await connectDB();

    await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { email: email.toLowerCase(), source: 'newsletter', active: true },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Newsletter signup error:', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
