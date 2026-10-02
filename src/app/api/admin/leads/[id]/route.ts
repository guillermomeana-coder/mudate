import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/models/Lead';
import { Setter } from '@/models/Setter';
import { assignmentEmailHtml } from '@/lib/emailTemplates';

function checkAuth(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get('x-admin-key') === secret;
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// PUT /api/admin/leads/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    // If assigning to a setter, enrich + send notification
    if (body.assignedTo) {
      const setter = await Setter.findById(body.assignedTo).lean();
      if (!setter) return NextResponse.json({ error: 'Setter no encontrado' }, { status: 404 });

      body.assignedName = setter.nombre;
      body.assignedAt   = new Date();

      // Increment setter counter (fire-and-forget)
      Setter.findByIdAndUpdate(body.assignedTo, { $inc: { assignedCount: 1 } }).exec();

      // Send email to setter
      const lead = await Lead.findById(id).lean();
      if (lead && resend && setter.email) {
        try {
          await resend.emails.send({
            from: 'leads@mudateargentina.com',
            to: setter.email,
            subject: `🏠 Nuevo lead asignado: ${lead.propertyTitle ?? lead.propertySlug}`,
            html: assignmentEmailHtml({
              setterNombre: setter.nombre,
              nombre:       lead.nombre,
              telefono:     lead.telefono,
              email:        lead.email,
              mensaje:      lead.mensaje,
              propertySlug: lead.propertySlug,
              propertyTitle: lead.propertyTitle,
              ciudad:       lead.ciudad,
              createdAt:    lead.createdAt ?? new Date(),
            }),
          });
        } catch (emailErr) {
          console.error('Assignment email error:', emailErr);
        }
      }
    }

    // If un-assigning, clear denormalized fields
    if (body.assignedTo === null || body.assignedTo === '') {
      body.assignedTo   = undefined;
      body.assignedName = undefined;
      body.assignedAt   = undefined;
    }

    const updated = await Lead.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE /api/admin/leads/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    await Lead.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
