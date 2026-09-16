import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SpatialBackground({ isDark }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- 3D PARTICLE FIELD (Cosmic Constellation) ---
    const particleCount = window.innerWidth < 768 ? 550 : 950; // Optimized for mobile
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const primaryColor = isDark ? new THREE.Color('#10b981') : new THREE.Color('#2563eb');
    const secondaryColor = isDark ? new THREE.Color('#06b6d4') : new THREE.Color('#8b5cf6');
    const whiteColor = isDark ? new THREE.Color('#e2e8f0') : new THREE.Color('#64748b');

    for (let i = 0; i < particleCount; i++) {
      const radius = 55 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mix = Math.random();
      let c = whiteColor;
      if (mix < 0.4) c = primaryColor;
      else if (mix < 0.7) c = secondaryColor;

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      scales[i] = Math.random() * 2.5 + 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 2.4 : 1.9,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: isDark ? 0.75 : 0.45,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating 3D Wireframe Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(24, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x10b981 : 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.08 : 0.04
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(25, -10, -20);
    scene.add(icoMesh);

    // --- SPATIAL TILT TRACKING (Desktop Mouse + Mobile Gyroscope + Touch) ---
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetX = ((e.clientX - halfW) / halfW) * 12;
      targetY = -((e.clientY - halfH) / halfH) * 12;
    };

    // Mobile Gyroscope Parallax
    const handleDeviceOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return;
      // gamma: [-90, 90] left-to-right tilt
      // beta: [-180, 180] front-to-back tilt
      const gamma = Math.max(-45, Math.min(45, e.gamma || 0));
      const beta = Math.max(-45, Math.min(45, (e.beta || 0) - 45));
      
      targetX = (gamma / 35) * 14;
      targetY = -(beta / 35) * 14;
    };

    // Mobile Touch Drag Parallax
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
        const deltaX = (e.touches[0].clientX - touchStartX) / (window.innerWidth / 2);
        const deltaY = (e.touches[0].clientY - touchStartY) / (window.innerHeight / 2);
        targetX = deltaX * 16;
        targetY = -deltaY * 16;
      }
    };
    const handleTouchEnd = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }

    const handleResize = () => {
      if (!container) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Fluid spring damping
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      camera.position.x = currentX;
      camera.position.y = currentY;
      camera.lookAt(scene.position);

      // Slow cosmic particle drift
      particles.rotation.y = elapsedTime * 0.03 + currentX * 0.02;
      particles.rotation.x = elapsedTime * 0.015 - currentY * 0.02;

      // Icosahedron rotation
      icoMesh.rotation.x = elapsedTime * 0.04;
      icoMesh.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.9 }}
    />
  );
}
