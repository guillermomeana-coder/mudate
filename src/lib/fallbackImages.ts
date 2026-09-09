// Imágenes de alta calidad de Unsplash por tipo de propiedad
// Determinísticas por slug (mismo slug = mismas fotos siempre)

const IMAGES_BY_TYPE: Record<string, string[][]> = {
  casa: [
    [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200&q=80',
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
      'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    ],
  ],
  departamento: [
    [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80',
      'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    ],
  ],
  terreno: [
    [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800&q=80',
      'https://images.unsplash.com/photo-1558522195-e1201b090344?w=800&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
    ],
  ],
  local: [
    [
      'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
    ],
  ],
  oficina: [
    [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
      'https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=800&q=80',
    ],
  ],
};

const DEFAULT_IMAGES = IMAGES_BY_TYPE.casa;

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getFallbackImages(slug: string, type: string): string[] {
  const normalizedType = type.toLowerCase();
  const pool = IMAGES_BY_TYPE[normalizedType] ?? DEFAULT_IMAGES;
  const idx = hashCode(slug) % pool.length;
  return pool[idx];
}
