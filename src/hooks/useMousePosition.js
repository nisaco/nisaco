import { useState, useEffect } from 'react';

export function useMousePosition() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX;
      const y = e.clientY;
      // Normalized from -1 to 1 (center is 0, 0)
      const normalizedX = (x / innerWidth) * 2 - 1;
      const normalizedY = (y / innerHeight) * 2 - 1;

      setMousePos({ x, y, normalizedX, normalizedY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePos;
}

