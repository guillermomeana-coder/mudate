'use client';
import { useEffect, useRef } from 'react';

interface Props {
  text: string;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function ScrambleText({ text, delay = 0, style, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?@#';
    let frame = 0;
    const FRAMES = 24;

    const t = setTimeout(() => {
      const iv = setInterval(() => {
        if (!el) { clearInterval(iv); return; }
        el.textContent = text.split('').map((c, i) => {
          if (c === ' ') return ' ';
          if (i < Math.floor((frame / FRAMES) * text.length)) return c;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        frame++;
        if (frame > FRAMES) { el.textContent = text; clearInterval(iv); }
      }, 28);
    }, delay);

    return () => clearTimeout(t);
  }, [text, delay]);

  return (
    <span ref={ref} style={style} className={className}>
      {text}
    </span>
  );
}
