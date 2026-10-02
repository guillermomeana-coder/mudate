'use client';
import { useEffect, useRef } from 'react';

export default function KineticGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', resize);

    const COLS = 20, ROWS = 11, RAD = 210;

    const loop = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cw = W / COLS, ch = H / ROWS;
      const pts: { x: number; y: number }[] = [];

      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const bx = c * cw, by = r * ch;
          const dx = mouse.x - bx, dy = mouse.y - by;
          const d = Math.sqrt(dx * dx + dy * dy);
          const s = Math.max(0, 1 - d / RAD) * 0.28;
          pts.push({ x: bx + dx * s, y: by + dy * s });
        }
      }

      const WC = COLS + 1;
      ctx.strokeStyle = 'rgba(79,255,176,0.09)';
      ctx.lineWidth = 0.75;

      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        for (let c = 0; c <= COLS; c++) {
          const p = pts[r * WC + c];
          c === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        for (let r = 0; r <= ROWS; r++) {
          const p = pts[r * WC + c];
          r === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      pts.forEach(p => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < RAD) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(79,255,176,${((1 - d / RAD) * 0.5).toFixed(2)})`;
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
}
