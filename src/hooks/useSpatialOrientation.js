import { useState, useEffect, useRef } from 'react';

export function useSpatialOrientation() {
  const [coords, setCoords] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0, isGyro: false });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let hasGyro = false;

    // --- 1. MOUSE MOVE (Desktop) ---
    const handleMouseMove = (e) => {
      if (hasGyro) return;
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth) * 2 - 1;
      const normY = (e.clientY / innerHeight) * 2 - 1;
      targetRef.current = { x: normX, y: normY };
    };

    // --- 2. GYROSCOPE / DEVICE ORIENTATION (Mobile) ---
    const handleDeviceOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return;
      hasGyro = true;

      // gamma is left-to-right tilt [-90, 90]
      // beta is front-to-back tilt [-180, 180]
      const gamma = Math.max(-45, Math.min(45, e.gamma || 0));
      const beta = Math.max(-45, Math.min(45, (e.beta || 0) - 45)); // assume holding at ~45deg angle

      const normX = gamma / 35; // Normalized ~ -1 to 1
      const normY = beta / 35;

      targetRef.current = { x: normX, y: normY };
    };

    // --- 3. TOUCH DRAG (Mobile fallback / interactive swipe) ---
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        const normX = Math.max(-1, Math.min(1, deltaX / 120));
        const normY = Math.max(-1, Math.min(1, deltaY / 120));
        targetRef.current = { x: normX, y: normY };
      }
    };

    const handleTouchEnd = () => {
      targetRef.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }

    // Smooth spring interpolation loop (60fps)
    let animationFrame;
    const updateInterpolation = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.1;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.1;

      setCoords({
        x: currentRef.current.x * (window.innerWidth / 2),
        y: currentRef.current.y * (window.innerHeight / 2),
        normalizedX: currentRef.current.x,
        normalizedY: currentRef.current.y,
        isGyro: hasGyro
      });

      animationFrame = requestAnimationFrame(updateInterpolation);
    };

    animationFrame = requestAnimationFrame(updateInterpolation);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  }, []);

  return coords;
}
