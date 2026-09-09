import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed', // ES: /propiedades | EN: /en/propiedades
});

export type Locale = (typeof routing.locales)[number];
