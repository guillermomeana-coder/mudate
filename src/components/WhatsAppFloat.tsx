'use client';

import { MessageCircle } from 'lucide-react';

interface Props {
  waNumber: string;
  waText: string;
}

export default function WhatsAppFloat({ waNumber, waText }: Props) {
  return (
    <a
      href={`https://wa.me/${waNumber}?text=${waText}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 60,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
        transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms ease',
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.12)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 28px rgba(37,211,102,0.55)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(37,211,102,0.45)';
      }}
    >
      <MessageCircle size={26} color="#fff" fill="#fff" />
    </a>
  );
}
