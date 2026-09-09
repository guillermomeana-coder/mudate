export interface LeadEmailData {
  nombre: string;
  telefono: string;
  email?: string;
  mensaje?: string;
  propertySlug: string;
  propertyTitle?: string;
  ciudad?: string;
  createdAt: Date;
}

export function leadEmailHtml(data: LeadEmailData): string {
  const {
    nombre,
    telefono,
    email,
    mensaje,
    propertySlug,
    propertyTitle,
    ciudad,
    createdAt,
  } = data;

  // Argentina time (GMT-3)
  const fecha = createdAt.toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const propertyUrl = `https://mudateargentina.com/propiedades/${propertySlug}`;
  const waNumber = telefono.replace(/\D/g, '');
  const waUrl = `https://wa.me/${waNumber}`;

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 16px;background:#f8fafc;font-weight:600;color:#374151;white-space:nowrap;width:140px;border-bottom:1px solid #e5e7eb;vertical-align:top;">
        ${label}
      </td>
      <td style="padding:10px 16px;color:#111827;border-bottom:1px solid #e5e7eb;vertical-align:top;">
        ${value}
      </td>
    </tr>`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nuevo lead — Mudate</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0F766E;padding:24px 32px;">
              <p style="margin:0;font-size:13px;color:#99f6e4;letter-spacing:0.05em;text-transform:uppercase;">Mudate.com</p>
              <h1 style="margin:4px 0 0;font-size:22px;color:#ffffff;font-weight:700;">
                Nuevo lead recibido
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 32px 8px;">
              <p style="margin:0;font-size:14px;color:#6b7280;">
                Alguien consultó por una propiedad el <strong>${fecha}</strong>.
              </p>
            </td>
          </tr>

          <!-- Data table -->
          <tr>
            <td style="padding:16px 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;border-collapse:collapse;">
                ${row('Nombre', nombre)}
                ${row(
                  'Teléfono',
                  `<a href="tel:${telefono}" style="color:#0F766E;text-decoration:none;">${telefono}</a>
                   &nbsp;·&nbsp;
                   <a href="${waUrl}" style="color:#0F766E;text-decoration:none;">Abrir WhatsApp</a>`
                )}
                ${email ? row('Email', `<a href="mailto:${email}" style="color:#0F766E;text-decoration:none;">${email}</a>`) : ''}
                ${row('Ciudad', ciudad ?? 'N/D')}
                ${row(
                  'Propiedad',
                  `<a href="${propertyUrl}" style="color:#0F766E;text-decoration:none;">${propertyTitle ?? propertySlug}</a>`
                )}
                ${mensaje ? row('Mensaje', `<span style="white-space:pre-wrap;">${mensaje}</span>`) : ''}
                ${row('Fecha / hora', fecha)}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 32px 32px;">
              <a href="${propertyUrl}"
                 style="display:inline-block;background:#0F766E;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
                Ver propiedad en Mudate
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Este email fue generado automáticamente por Mudate.com. No responder a este mensaje.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
