import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/models/Lead';
import { leadEmailHtml } from '@/lib/emailTemplates';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, telefono, email, mensaje, propertySlug, propertyTitle, ciudad } = body;

    if (!nombre?.trim() || !telefono?.trim() || !propertySlug) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    await connectDB();
    const lead = await Lead.create({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: email?.trim() || undefined,
      mensaje: mensaje?.trim() || undefined,
      propertySlug,
      propertyTitle,
      ciudad,
      source: 'propiedades',
    });

    // Send email notification (non-blocking)
    if (!resend) {
      console.log('RESEND_API_KEY not configured, skipping email');
    } else {
      try {
        await resend.emails.send({
          from: 'leads@mudateargentina.com',
          to: 'inmocultural@gmail.com',
          subject: `🏠 Nuevo lead: ${propertyTitle ?? propertySlug} — ${ciudad ?? 'sin ciudad'}`,
          html: leadEmailHtml({
            nombre: lead.nombre,
            telefono: lead.telefono,
            email: lead.email,
            mensaje: lead.mensaje,
            propertySlug: lead.propertySlug,
            propertyTitle: lead.propertyTitle,
            ciudad: lead.ciudad,
            createdAt: lead.createdAt ?? new Date(),
          }),
        });
      } catch (emailErr) {
        console.error('Error sending lead email via Resend:', emailErr);
        // Do not re-throw — lead is already saved, email failure is non-critical
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Error saving lead:', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
