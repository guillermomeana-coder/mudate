'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: '4px 6px',
        borderRadius: 8,
        background: 'rgba(15,118,110,0.08)',
        border: '1px solid rgba(15,118,110,0.15)',
      }}
      aria-label="Cambiar idioma / Switch language"
    >
      {(['es', 'en'] as const).map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          disabled={isPending}
          style={{
            padding: '3px 10px',
            borderRadius: 6,
            fontSize: '0.72rem',
            fontWeight: 700,
            fontFamily: 'Josefin Sans, sans-serif',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            border: 'none',
            transition: 'all 180ms ease',
            background: locale === loc ? 'var(--primary)' : 'transparent',
            color: locale === loc ? '#fff' : 'var(--primary)',
            opacity: isPending ? 0.6 : 1,
          }}
          aria-pressed={locale === loc}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
