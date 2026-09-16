import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Server, Database, Briefcase, Terminal, 
  Layers, Zap, Sparkles, Activity, ShieldCheck, Eye
} from 'lucide-react';

const ORBITAL_STACK = [
  {
    id: 'react',
    name: 'React.js & Vite',
    short: 'React',
    category: 'Frontend Core',
    icon: Globe,
    ring: 1,
    speed: 0.014,
    angleOffset: 0,
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.6)',
    mastery: '98%',
    experience: '3+ Years',
    highlight: 'Architecting high-speed reactive UI platforms with micro-animations and zero latency.'
  },
  {
    id: 'nodejs',
    name: 'Node.js & Express',
    short: 'Node.js',
    category: 'Backend Core',
    icon: Server,
    ring: 1,
    speed: 0.014,
    angleOffset: Math.PI,
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.6)',
    mastery: '95%',
    experience: '3+ Years',
    highlight: 'Designing RESTful microservices, webhook listeners, and distributed queues.'
  },
  {
    id: 'paystack',
    name: 'Paystack & Fintech',
    short: 'Paystack',
    category: 'Payment Core',
    icon: Briefcase,
    ring: 2,
    speed: -0.011,
    angleOffset: Math.PI / 3,
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.6)',
    mastery: '96%',
    experience: '2+ Years',
    highlight: 'Automating African mobile money, card payments, webhook security, and wallet ledgers.'
  },
  {
    id: 'mongodb',
    name: 'MongoDB & Atlas',
    short: 'MongoDB',
    category: 'Database Cluster',
    icon: Database,
    ring: 2,
    speed: -0.011,
    angleOffset: (4 * Math.PI) / 3,
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.6)',
    mastery: '92%',
    experience: '2+ Years',
    highlight: 'High-availability document clusters, pipeline aggregations, and resilient indexing.'
  },
  {
    id: 'api',
    name: 'API Development',
    short: 'APIs',
    category: 'System Design',
    icon: Terminal,
    ring: 3,
    speed: 0.008,
    angleOffset: (2 * Math.PI) / 3,
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.6)',
    mastery: '94%',
    experience: '3+ Years',
    highlight: 'Telephony & SMS gateways (Twilio), third-party telecom APIs, and webhooks.'
  },
  {
    id: 'saas',
    name: 'SaaS Platforms',
    short: 'SaaS',
    category: 'Cloud Systems',
    icon: Layers,
    ring: 3,
    speed: 0.008,
    angleOffset: (5 * Math.PI) / 3,
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.6)',
    mastery: '90%',
    experience: '2+ Years',
    highlight: 'Multi-tenant infrastructure, analytics telemetry dashboards, and cloud deployment.'
  }
];

export default function HologramAvatar3D({ 
  avatarUrl = "/profile_cutout.png", 
  isDark = true, 
  onPlaySound, 
  onTriggerPulse 
}) {
  const containerRef = useRef(null);
  const rigRef = useRef(null);
  const nodeRefs = useRef({});
  const laserRef = useRef(null);

  const [selectedNode, setSelectedNode] = useState(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isScanning, setIsScanning] = useState(true);
  const [energyPulseActive, setEnergyPulseActive] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const speedRef = useRef(speedMultiplier);
  speedRef.current = speedMultiplier;

  const selectedNodeRef = useRef(selectedNode);
  selectedNodeRef.current = selectedNode;

  // Track window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const ringRadii = {
    1: { 
      rx: isMobile ? 115 : isTablet ? 150 : 180, 
      ry: isMobile ? 42 : isTablet ? 55 : 66 
    },
    2: { 
      rx: isMobile ? 155 : isTablet ? 200 : 240, 
      ry: isMobile ? 56 : isTablet ? 72 : 88 
    },
    3: { 
      rx: isMobile ? 190 : isTablet ? 248 : 300, 
      ry: isMobile ? 70 : isTablet ? 90 : 110 
    }
  };

  // --- 100% GPU COMPOSITED 120FPS ANIMATION LOOP (DIRECT DOM TRANSFORMS) ---
  useEffect(() => {
    let animationFrameId;
    let time = 0;

    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let hasGyro = false;

    // Desktop Mouse Move
    const handleMouseMove = (e) => {
      if (hasGyro || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      targetTiltX = ((e.clientX - centerX) / (rect.width / 2)) * 20;
      targetTiltY = -((e.clientY - centerY) / (rect.height / 2)) * 16;
    };

    // Mobile Phone Gyroscope (Device Orientation)
    const handleDeviceOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return;
      hasGyro = true;
      const gamma = Math.max(-40, Math.min(40, e.gamma || 0));
      const beta = Math.max(-40, Math.min(40, (e.beta || 0) - 45));
      targetTiltX = (gamma / 30) * 22;
      targetTiltY = -(beta / 30) * 18;
    };

    // Mobile Touch Dragging & Swiping
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
        const deltaX = (e.touches[0].clientX - touchStartX) / 12;
        const deltaY = (e.touches[0].clientY - touchStartY) / 12;
        targetTiltX = Math.max(-25, Math.min(25, deltaX));
        targetTiltY = Math.max(-20, Math.min(20, -deltaY));
      }
    };
    const handleTouchEnd = () => {
      targetTiltX = 0;
      targetTiltY = 0;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }

    // High performance frame ticker (NO React state re-renders)
    const renderLoop = () => {
      time += 0.016 * speedRef.current;

      // Smooth gyroscopic tilt damping
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltY += (targetTiltY - currentTiltY) * 0.08;

      if (rigRef.current) {
        rigRef.current.style.transform = `rotateX(${-currentTiltY}deg) rotateY(${currentTiltX}deg)`;
      }

      // Update every orbiting satellite in 3D space
      ORBITAL_STACK.forEach((node) => {
        const nodeEl = nodeRefs.current[node.id];
        if (!nodeEl) return;

        const currentAngle = time * (node.speed * 60) + node.angleOffset;
        const rx = ringRadii[node.ring].rx;
        const ry = ringRadii[node.ring].ry;

        const x = rx * Math.cos(currentAngle);
        const y = ry * Math.sin(currentAngle);
        const isFront = Math.sin(currentAngle) > 0;
        const zDepth = isFront ? 45 : -45;
        const scale = isFront ? (isMobile ? 0.95 : 1.08) : (isMobile ? 0.75 : 0.86);
        const opacity = isFront ? 1 : 0.65;

        nodeEl.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${zDepth}px) scale(${scale.toFixed(2)})`;
        nodeEl.style.zIndex = isFront ? 35 : 10;
        nodeEl.style.opacity = opacity;

        // If this node is selected, update laser line
        if (selectedNodeRef.current?.id === node.id && laserRef.current) {
          laserRef.current.setAttribute('x2', `${-x.toFixed(2)}`);
          laserRef.current.setAttribute('y2', `${-y.toFixed(2)}`);
        }
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  }, [isMobile, isTablet]);

  // Quantum Pulse Trigger
  const triggerQuantumDischarge = () => {
    setEnergyPulseActive(true);
    if (onPlaySound) onPlaySound('pulse');
    if (onTriggerPulse) onTriggerPulse();
    setTimeout(() => setEnergyPulseActive(false), 1200);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-[680px] h-[520px] sm:h-[600px] lg:h-[660px] flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D Spatial Gyroscopic Rig */}
      <div 
        ref={rigRef}
        className="relative w-full h-full flex items-center justify-center will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* ========================================================= */}
        {/* 1. HOLOGRAPHIC QUANTUM BASE PEDESTAL & ENERGY RING         */}
        {/* ========================================================= */}
        <div 
          className="absolute w-72 sm:w-96 lg:w-[450px] h-72 sm:h-96 lg:h-[450px] rounded-full pointer-events-none will-change-transform"
          style={{
            transform: `translateY(${isMobile ? '160px' : '200px'}) rotateX(75deg)`,
            background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(6,182,212,0.1) 45%, transparent 75%)',
            boxShadow: '0 0 60px rgba(16,185,129,0.3)'
          }}
        >
          <div className="absolute inset-4 rounded-full border border-dashed border-cyan-400/40 animate-[spin_24s_linear_infinite]" />
          <div className="absolute inset-10 rounded-full border border-emerald-400/50 animate-[spin_16s_linear_infinite_reverse]" />
          <div className="absolute inset-16 rounded-full border border-dotted border-purple-400/30 animate-[spin_30s_linear_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] sm:text-xs text-emerald-400/80 tracking-widest uppercase font-bold">
            JEFFREY PAPPOE // QUANTUM CORE
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. THREE INCLINED 3D CELESTIAL ORBITAL TRACKS             */}
        {/* ========================================================= */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(68deg) rotateZ(-16deg)' }}
        >
          {/* Ring 1 */}
          <div 
            className="absolute rounded-full border border-cyan-400/30 border-dashed"
            style={{
              width: `${ringRadii[1].rx * 2}px`,
              height: `${ringRadii[1].ry * 2.8}px`,
              boxShadow: '0 0 25px rgba(6,182,212,0.2)'
            }}
          />
          {/* Ring 2 */}
          <div 
            className="absolute rounded-full border border-emerald-400/30"
            style={{
              width: `${ringRadii[2].rx * 2}px`,
              height: `${ringRadii[2].ry * 2.8}px`,
              boxShadow: '0 0 30px rgba(16,185,129,0.2)'
            }}
          />
          {/* Ring 3 */}
          <div 
            className="absolute rounded-full border border-purple-400/25 border-dotted"
            style={{
              width: `${ringRadii[3].rx * 2}px`,
              height: `${ringRadii[3].ry * 2.8}px`,
              boxShadow: '0 0 35px rgba(168,85,247,0.18)'
            }}
          />
        </div>

        {/* ========================================================= */}
        {/* 3. SHOCKWAVE ENERGY DISCHARGE PULSE                       */}
        {/* ========================================================= */}
        {energyPulseActive && (
          <div 
            className="absolute z-30 rounded-full border-2 border-cyan-300 pointer-events-none animate-ping"
            style={{
              width: isMobile ? '280px' : '440px',
              height: isMobile ? '280px' : '440px',
              background: 'radial-gradient(circle, rgba(6,182,212,0.5) 0%, rgba(16,185,129,0.3) 50%, transparent 80%)'
            }}
          />
        )}

        {/* ========================================================= */}
        {/* 4. THE PROMINENT FIGURE-ONLY HOLOGRAPHIC AVATAR ("3D ME")  */}
        {/* ========================================================= */}
        <div 
          onClick={triggerQuantumDischarge}
          onMouseEnter={() => {
            setIsHoveringAvatar(true);
            if (onPlaySound) onPlaySound('hover');
          }}
          onMouseLeave={() => setIsHoveringAvatar(false)}
          className="relative z-20 cursor-pointer group flex items-end justify-center will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(25px)',
            width: isMobile ? '260px' : isTablet ? '330px' : '390px',
            height: isMobile ? '380px' : isTablet ? '480px' : '550px'
          }}
          title="Click to discharge Quantum Energy"
        >
          {/* Holographic Glowing Aura Silhouette behind Figure */}
          <div 
            className="absolute inset-0 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.6) 0%, rgba(6,182,212,0.4) 40%, rgba(59,130,246,0.2) 70%, transparent 85%)'
            }}
          />

          {/* THE 100% TRANSPARENT CUTOUT FIGURE (Pristine transparent PNG) */}
          <div className="relative w-full h-full flex items-end justify-center overflow-visible">
            <img 
              src={avatarUrl} 
              alt="Jeffrey N. K. Pappoe" 
              className="w-full h-full object-contain object-bottom filter drop-shadow-[0_0_35px_rgba(16,185,129,0.45)] drop-shadow-[0_0_60px_rgba(6,182,212,0.35)] transition-all duration-700 group-hover:scale-105 group-hover:drop-shadow-[0_0_50px_rgba(6,182,212,0.8)]"
              style={{
                maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)'
              }}
              onError={(e) => {
                e.target.src = "/profile_cutout.png";
              }}
            />

            {/* Vertical Laser Scanner sweeping directly across figure */}
            {isScanning && (
              <div 
                className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent pointer-events-none shadow-[0_0_20px_#06b6d4]"
                style={{
                  animation: 'laserScan 3.2s ease-in-out infinite'
                }}
              />
            )}

            {/* Reaching Quantum Pulse Indicator (Extends outward in 3D) */}
            <div 
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-opacity duration-300 ${isHoveringAvatar ? 'opacity-100' : 'opacity-0'} pointer-events-none`}
              style={{ transform: 'translate3d(-50%, -50%, 60px)' }}
            >
              <div className="p-3.5 rounded-full bg-emerald-500/40 border border-emerald-300 text-emerald-200 shadow-[0_0_35px_#10b981] animate-bounce">
                <Zap size={30} className="animate-pulse" />
              </div>
              <span className="mt-2 font-mono text-[10px] sm:text-xs text-cyan-300 font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-400/60 shadow-xl">
                ⚡ DISCHARGE QUANTUM PULSE
              </span>
            </div>
          </div>

          {/* Floating Live Telemetry Badge Beneath Avatar */}
          <div 
            className="absolute -bottom-2 px-4 py-1.5 rounded-full bg-slate-950/95 border border-emerald-500/60 backdrop-blur-xl flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] z-30 pointer-events-auto"
            style={{ transform: 'translateZ(50px)' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs font-bold text-white tracking-wider">
              JEFFREY // ARCHITECT ONLINE
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. REVOLVING CELESTIAL STACK NODES (ORBITING SATELLITES)  */}
        {/* ========================================================= */}
        {ORBITAL_STACK.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          const NodeIcon = node.icon;

          return (
            <div
              key={node.id}
              ref={(el) => { nodeRefs.current[node.id] = el; }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNode(isSelected ? null : node);
                if (onPlaySound) onPlaySound('click');
              }}
              onMouseEnter={() => {
                if (onPlaySound) onPlaySound('hover');
              }}
              className="absolute cursor-pointer group will-change-transform"
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              {/* Orbital Satellite Capsule */}
              <div 
                className={`relative p-2 sm:p-2.5 rounded-2xl backdrop-blur-2xl border transition-all duration-300 flex items-center gap-2 ${
                  isSelected 
                    ? 'ring-2 ring-cyan-300 scale-115 shadow-[0_0_35px_rgba(6,182,212,0.9)]' 
                    : 'hover:scale-120 hover:shadow-[0_0_30px_' + node.glow + ']'
                }`}
                style={{
                  backgroundColor: isDark ? 'rgba(10, 16, 31, 0.92)' : 'rgba(255, 255, 255, 0.95)',
                  borderColor: node.color,
                  boxShadow: `0 0 18px ${node.glow}`
                }}
              >
                {/* Node Icon */}
                <div 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-12 shadow-md"
                  style={{ backgroundColor: node.color }}
                >
                  <NodeIcon size={isMobile ? 14 : 16} />
                </div>

                {/* Node Label */}
                <div className="text-left pr-1">
                  <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    {node.short}
                  </div>
                  <div className={`font-bold text-[11px] sm:text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {node.mastery}
                  </div>
                </div>

                {/* Active Pulsing Indicator */}
                <span 
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: node.color }}
                />
              </div>

              {/* Laser Tether Line to Avatar Center */}
              {isSelected && (
                <svg 
                  className="absolute top-1/2 left-1/2 pointer-events-none overflow-visible -z-10"
                  style={{ transform: 'translate(-50%, -50%)' }}
                >
                  <line 
                    ref={laserRef}
                    x1="0" 
                    y1="0" 
                    x2="0" 
                    y2="0" 
                    stroke={node.color} 
                    strokeWidth="2.5" 
                    strokeDasharray="4 4"
                    className="animate-pulse"
                  />
                </svg>
              )}
            </div>
          );
        })}

        {/* ========================================================= */}
        {/* 6. SPATIAL HUD TELEMETRY POPUP (WHEN A NODE IS CLICKED)   */}
        {/* ========================================================= */}
        {selectedNode && (
          <div 
            className="absolute top-full mt-4 w-76 sm:w-96 p-4 rounded-2xl bg-slate-950/95 border border-cyan-400/70 shadow-[0_0_40px_rgba(6,182,212,0.4)] backdrop-blur-2xl z-40 text-left animate-fadeIn"
            style={{ transform: 'translateZ(70px)' }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  TELEMETRY // {selectedNode.category}
                </span>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white font-mono text-xs px-2 py-0.5 rounded bg-slate-800 cursor-pointer"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="flex items-start gap-3">
              <div 
                className="p-2.5 rounded-xl text-white mt-1 shadow-lg"
                style={{ backgroundColor: selectedNode.color }}
              >
                {React.createElement(selectedNode.icon, { size: 18 })}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm sm:text-base text-white">{selectedNode.name}</h4>
                <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400 mt-0.5 mb-2">
                  <span>⚡ Mastery: <strong className="text-emerald-400">{selectedNode.mastery}</strong></span>
                  <span>⌛ Exp: <strong className="text-cyan-400">{selectedNode.experience}</strong></span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  {selectedNode.highlight}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 7. HOLOGRAM CONTROLS HUD (BOTTOM ACTION BAR)             */}
      {/* ========================================================= */}
      <div className="absolute -bottom-10 sm:-bottom-12 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/90 border border-slate-800 backdrop-blur-xl text-slate-300 text-[11px] font-mono z-30">
        <button 
          onClick={() => {
            setSpeedMultiplier(prev => prev === 1 ? 2.5 : prev === 2.5 ? 0 : 1);
            if (onPlaySound) onPlaySound('click');
          }}
          className="px-2 py-0.5 rounded-md hover:bg-slate-800 hover:text-cyan-400 transition flex items-center gap-1.5 cursor-pointer"
        >
          <Activity size={12} className={speedMultiplier > 1 ? "text-emerald-400 animate-spin" : "text-cyan-400"} />
          <span>ORBIT: {speedMultiplier === 0 ? 'PAUSED' : speedMultiplier === 2.5 ? 'WARP' : 'NORMAL'}</span>
        </button>

        <span className="text-slate-700">|</span>

        <button 
          onClick={() => {
            setIsScanning(prev => !prev);
            if (onPlaySound) onPlaySound('click');
          }}
          className="px-2 py-0.5 rounded-md hover:bg-slate-800 hover:text-emerald-400 transition flex items-center gap-1.5 cursor-pointer"
        >
          <Eye size={12} className={isScanning ? "text-emerald-400" : "text-slate-500"} />
          <span>LASER: {isScanning ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Embedded Scanline Keyframes */}
      <style>{`
        @keyframes laserScan {
          0% { top: 0%; opacity: 0.9; }
          50% { top: 92%; opacity: 1; }
          100% { top: 0%; opacity: 0.9; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateZ(30px) translateY(10px); }
          to { opacity: 1; transform: translateZ(70px) translateY(0); }
        }
      `}</style>
    </div>
  );
}
