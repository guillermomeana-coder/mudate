'use client';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const STORAGE_KEY = 'mudate_favorites';

function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function setFavorites(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

export function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    setFavs(getFavorites());
  }, []);

  const toggle = (slug: string) => {
    const current = getFavorites();
    const next = current.includes(slug)
      ? current.filter(s => s !== slug)
      : [...current, slug];
    setFavorites(next);
    setFavs(next);
  };

  return { favs, toggle, isFav: (slug: string) => favs.includes(slug) };
}

export default function FavoriteButton({ slug, size = 18 }: { slug: string; size?: number }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(getFavorites().includes(slug));
  }, [slug]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = getFavorites();
    if (current.includes(slug)) {
      setFavorites(current.filter(s => s !== slug));
      setIsFav(false);
    } else {
      setFavorites([...current, slug]);
      setIsFav(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: isFav ? 'rgba(220,38,38,0.85)' : 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1), background 200ms ease',
        transform: isFav ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      <Heart
        size={size}
        color="#fff"
        fill={isFav ? '#fff' : 'none'}
        strokeWidth={isFav ? 0 : 2}
      />
    </button>
  );
}
