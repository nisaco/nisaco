import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Server, Database, Briefcase, Terminal, 
  Layers, Zap, Sparkles, Activity, ShieldCheck, Compass, Eye
} from 'lucide-react';

const ORBITAL_STACK = [
  {
    id: 'react',
    name: 'React & Modern UI',
    short: 'React',
    category: 'Frontend Core',
    icon: Globe,
    ring: 1,
    speed: 0.018,
    angleOffset: 0,
    color: '#06b6d4', // Cyan
    glow: 'rgba(6, 182, 212, 0.5)',
    mastery: '98%',
    experience: '3+ Years',
    highlight: 'Built AJEnterprise & Logistics UI with high-speed rendering and responsive micro-interactions.'
  },
  {
    id: 'nodejs',
    name: 'Node.js & Express',
    short: 'Node.js',
    category: 'Backend Core',
    icon: Server,
    ring: 1,
    speed: 0.018,
    angleOffset: Math.PI,
    color: '#10b981', // Emerald
    glow: 'rgba(16, 185, 129, 0.5)',
    mastery: '95%',
    experience: '3+ Years',
    highlight: 'Architected robust REST APIs, webhook listeners, and background task queue systems.'
  },
  {
    id: 'paystack',
    name: 'Paystack & Fintech',
    short: 'Fintech API',
    category: 'Payment Architecture',
    icon: Briefcase,
    ring: 2,
    speed: -0.014,
    angleOffset: Math.PI / 3,
    color: '#3b82f6', // Blue
    glow: 'rgba(59, 130, 246, 0.5)',
    mastery: '96%',
    experience: '2+ Years',
    highlight: 'Integrated automated mobile money, card payments, webhook verification, and instant wallet funding.'
  },
  {
    id: 'mongodb',
    name: 'MongoDB & Atlas',
    short: 'MongoDB',
    category: 'Database Cluster',
    icon: Database,
    ring: 2,
    speed: -0.014,
    angleOffset: (4 * Math.PI) / 3,
    color: '#10b981', // Emerald
    glow: 'rgba(16, 185, 129, 0.5)',
    mastery: '92%',
    experience: '2+ Years',
    highlight: 'Designed schema pipelines, indexing, aggregation pipelines, and secure cloud cluster migrations.'
  },
  {
    id: 'api',
    name: 'API Development',
    short: 'API System',
    category: 'Microservices',
    icon: Terminal,
    ring: 3,
    speed: 0.01,
    angleOffset: (2 * Math.PI) / 3,
    color: '#a855f7', // Purple
    glow: 'rgba(168, 85, 247, 0.5)',
    mastery: '94%',
    experience: '3+ Years',
    highlight: 'Crafted resilient data pipelines connecting SMS, WhatsApp, Telecom data providers & custom CMS.'
  },
  {
    id: 'saas',
    name: 'SaaS Architecture',
    short: 'SaaS Cloud',
    category: 'System Design',
    icon: Layers,
    ring: 3,
    speed: 0.01,
    angleOffset: (5 * Math.PI) / 3,
    color: '#f59e0b', // Amber
    glow: 'rgba(245, 158, 11, 0.5)',
    mastery: '90%',
    experience: '2+ Years',
    highlight: 'Scalable multi-tenant infrastructure with role-based access control and live telemetry.'
  }
];

export default function HologramAvatar3D({ 
  avatarUrl, 
  isDark, 
  onPlaySound, 
  onTriggerPulse 
}) {
  const containerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [time, setTime] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isScanning, setIsScanning] = useState(true);
  const [energyPulseActive, setEnergyPulseActive] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  // --- ORBIT ROTATION TICKER ---
  useEffect(() => {
    let animationFrame;
    const updateOrbit = () => {
      setTime((prev) => prev + 0.02 * speedMultiplier);
      animationFrame = requestAnimationFrame(updateOrbit);
    };
    animationFrame = requestAnimationFrame(updateOrbit);
    return () => cancelAnimationFrame(animationFrame);
  }, [speedMultiplier]);

  // --- 3D TILT WITH SMOOTH INERTIA ---
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    setMouseOffset({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    setIsHoveringAvatar(false);
  };

  // --- QUANTUM PULSE DISCHARGE ---
  const triggerQuantumDischarge = () => {
    setEnergyPulseActive(true);
    if (onPlaySound) onPlaySound('pulse');
    if (onTriggerPulse) onTriggerPulse();
    setTimeout(() => setEnergyPulseActive(false), 1200);
  };

  // Orbit Dimensions (scaled for high responsiveness)
  const ringRadii = {
    1: { rx: 145, ry: 55 },
    2: { rx: 195, ry: 75 },
    3: { rx: 245, ry: 95 }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[540px] h-[520px] md:h-[580px] flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* --- 3D GYROSCOPIC TILT RIG --- */}
      <div 
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${-mouseOffset.y * 18}deg) rotateY(${mouseOffset.x * 22}deg)`
        }}
      >
        {/* ========================================================= */}
        {/* 1. HOLOGRAPHIC QUANTUM FLOOR & SCAN RINGS                */}
        {/* ========================================================= */}
        <div 
          className="absolute w-80 h-80 rounded-full border border-emerald-500/20 pointer-events-none"
          style={{
            transform: 'translateY(180px) rotateX(75deg)',
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.05) 50%, transparent 80%)',
            boxShadow: '0 0 40px rgba(16,185,129,0.2)'
          }}
        >
          {/* Animated concentric rings on the hologram base */}
          <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/30 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-10 rounded-full border border-emerald-400/40 animate-[spin_12s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-emerald-400/60 tracking-widest">
            QUANTUM // CORE 5.60°N
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. THREE 3D INCLINED ORBITAL TRACKS                       */}
        {/* ========================================================= */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(68deg) rotateZ(-18deg)' }}
        >
          {/* Ring 1 */}
          <div 
            className="absolute rounded-full border border-cyan-500/25 border-dashed"
            style={{
              width: `${ringRadii[1].rx * 2}px`,
              height: `${ringRadii[1].ry * 2.8}px`,
              boxShadow: '0 0 20px rgba(6,182,212,0.15)'
            }}
          />
          {/* Ring 2 */}
          <div 
            className="absolute rounded-full border border-emerald-500/25"
            style={{
              width: `${ringRadii[2].rx * 2}px`,
              height: `${ringRadii[2].ry * 2.8}px`,
              boxShadow: '0 0 25px rgba(16,185,129,0.15)'
            }}
          />
          {/* Ring 3 */}
          <div 
            className="absolute rounded-full border border-purple-500/20 border-dotted"
            style={{
              width: `${ringRadii[3].rx * 2}px`,
              height: `${ringRadii[3].ry * 2.8}px`,
              boxShadow: '0 0 30px rgba(168,85,247,0.12)'
            }}
          />
        </div>

        {/* ========================================================= */}
        {/* 3. SHOCKWAVE / ENERGY PULSE BURST                         */}
        {/* ========================================================= */}
        {energyPulseActive && (
          <div 
            className="absolute z-30 rounded-full border-2 border-cyan-400 pointer-events-none animate-ping"
            style={{
              width: '320px',
              height: '320px',
              background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(16,185,129,0.2) 60%, transparent 80%)'
            }}
          />
        )}

        {/* ========================================================= */}
        {/* 4. CENTRAL HOLOGRAPHIC AVATAR POD ("3D ME")               */}
        {/* ========================================================= */}
        <div 
          onClick={triggerQuantumDischarge}
          onMouseEnter={() => {
            setIsHoveringAvatar(true);
            if (onPlaySound) onPlaySound('hover');
          }}
          className="relative z-20 w-64 h-64 md:w-76 md:h-76 cursor-pointer group flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(20px)'
          }}
          title="Click to discharge Quantum Energy"
        >
          {/* Multi-layered Glass Hologram Shield */}
          <div 
            className="absolute inset-0 rounded-3xl p-1 transition-all duration-500"
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, rgba(16,185,129,0.6) 0%, rgba(6,182,212,0.3) 50%, rgba(168,85,247,0.4) 100%)' 
                : 'linear-gradient(135deg, rgba(37,99,235,0.7) 0%, rgba(6,182,212,0.4) 50%, rgba(99,102,241,0.5) 100%)',
              boxShadow: isDark 
                ? '0 0 50px rgba(16,185,129,0.3), inset 0 0 30px rgba(6,182,212,0.2)' 
                : '0 0 50px rgba(37,99,235,0.25), inset 0 0 30px rgba(6,182,212,0.15)'
            }}
          >
            {/* Inner Frame */}
            <div className={`w-full h-full rounded-[22px] overflow-hidden relative ${isDark ? 'bg-slate-950' : 'bg-slate-900'}`}>
              
              {/* Avatar Portrait */}
              <img 
                src={avatarUrl || "/profile.jpg"} 
                alt="Jeffrey N. K. Pappoe" 
                className="w-full h-full object-cover object-top filter brightness-105 contrast-110 transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = "/profile.jpg.jpg";
                }}
              />

              {/* Holographic Cyan & Emerald Color Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-color opacity-30"
                style={{
                  background: 'linear-gradient(180deg, rgba(6,182,212,0.4) 0%, rgba(16,185,129,0.5) 100%)'
                }}
              />

              {/* Hologram Cyber Grid Scanlines */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,180,0.25) 2px, rgba(0,255,180,0.25) 4px)'
                }}
              />

              {/* Vertical Laser Scanner Beam */}
              {isScanning && (
                <div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent pointer-events-none shadow-[0_0_15px_#06b6d4]"
                  style={{
                    animation: 'laserScan 3.5s ease-in-out infinite'
                  }}
                />
              )}

              {/* Corner HUD Reticles */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />

              {/* Interactive Holographic Hand / Energy Reach Indicator (Spatial extension) */}
              <div 
                className={`absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isHoveringAvatar ? 'opacity-100' : 'opacity-0'} pointer-events-none`}
              >
                <div className="p-3 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-300 shadow-[0_0_25px_#10b981] animate-bounce">
                  <Zap size={28} className="animate-pulse" />
                </div>
                <span className="mt-2 font-mono text-[11px] text-cyan-300 font-bold tracking-wider uppercase px-2 py-1 rounded bg-black/60 border border-cyan-500/40">
                  ⚡ DISCHARGE ENERGY
                </span>
              </div>
            </div>
          </div>

          {/* Floating Status Pill */}
          <div 
            className="absolute -bottom-4 px-4 py-1.5 rounded-full bg-slate-950/90 border border-emerald-500/50 backdrop-blur-md flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] z-30"
            style={{ transform: 'translateZ(40px)' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs font-bold text-white tracking-wider flex items-center gap-1">
              ARCHITECT // ONLINE
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. REVOLVING CELESTIAL STACK NODES (ORBITING PLANETS)     */}
        {/* ========================================================= */}
        {ORBITAL_STACK.map((node) => {
          const currentAngle = time * (node.speed * 60) + node.angleOffset;
          const rx = ringRadii[node.ring].rx;
          const ry = ringRadii[node.ring].ry;

          // 3D coordinates based on elliptical rotation
          const x = rx * Math.cos(currentAngle);
          const y = ry * Math.sin(currentAngle);
          const isFront = Math.sin(currentAngle) > 0;
          const zDepth = isFront ? 40 : -40;
          const scale = isFront ? 1.05 : 0.85;
          const opacity = isFront ? 1 : 0.65;

          const isSelected = selectedNode?.id === node.id;
          const NodeIcon = node.icon;

          return (
            <div
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNode(isSelected ? null : node);
                if (onPlaySound) onPlaySound('click');
              }}
              onMouseEnter={() => {
                if (onPlaySound) onPlaySound('hover');
              }}
              className="absolute z-25 cursor-pointer group transition-transform duration-150"
              style={{
                transform: `translate3d(${x}px, ${y}px, ${zDepth}px) scale(${scale})`,
                zIndex: isFront ? 35 : 10,
                opacity: opacity
              }}
            >
              {/* Orbital Planet Node */}
              <div 
                className={`relative p-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 flex items-center gap-2.5 ${
                  isSelected 
                    ? 'ring-2 ring-cyan-400 scale-110 shadow-[0_0_30px_rgba(6,182,212,0.8)]' 
                    : 'hover:scale-115 hover:shadow-[0_0_25px_' + node.glow + ']'
                }`}
                style={{
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                  borderColor: node.color,
                  boxShadow: `0 0 15px ${node.glow}`
                }}
              >
                {/* Node Icon */}
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-12"
                  style={{ backgroundColor: node.color }}
                >
                  <NodeIcon size={16} />
                </div>

                {/* Node Label (Hidden on small screens unless active) */}
                <div className="hidden sm:block text-left pr-1">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    {node.short}
                  </div>
                  <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {node.mastery}
                  </div>
                </div>

                {/* Pulsing Core Ring */}
                <span 
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: node.color }}
                />
              </div>

              {/* Energy Tether Line to Avatar when Selected */}
              {isSelected && (
                <svg 
                  className="absolute top-1/2 left-1/2 pointer-events-none overflow-visible -z-10"
                  style={{ transform: 'translate(-50%, -50%)' }}
                >
                  <line 
                    x1="0" 
                    y1="0" 
                    x2={-x} 
                    y2={-y} 
                    stroke={node.color} 
                    strokeWidth="2" 
                    strokeDasharray="4 4"
                    className="animate-pulse"
                  />
                </svg>
              )}
            </div>
          );
        })}

        {/* ========================================================= */}
        {/* 6. SPATIAL TELEMETRY POPUP HUD (WHEN A TECH NODE IS ACTIVE) */}
        {/* ========================================================= */}
        {selectedNode && (
          <div 
            className="absolute top-full mt-6 w-80 md:w-96 p-4 rounded-2xl bg-slate-950/95 border border-cyan-500/60 shadow-[0_0_35px_rgba(6,182,212,0.3)] backdrop-blur-2xl z-40 text-left animate-fadeIn"
            style={{ transform: 'translateZ(60px)' }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  TELEMETRY // {selectedNode.category}
                </span>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white font-mono text-xs px-2 py-0.5 rounded bg-slate-800"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="flex items-start gap-3">
              <div 
                className="p-2.5 rounded-xl text-white mt-1 shadow-lg"
                style={{ backgroundColor: selectedNode.color }}
              >
                {React.createElement(selectedNode.icon, { size: 20 })}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base text-white">{selectedNode.name}</h4>
                <div className="flex items-center gap-3 font-mono text-xs text-slate-400 mt-0.5 mb-2">
                  <span>⚡ Mastery: <strong className="text-emerald-400">{selectedNode.mastery}</strong></span>
                  <span>⌛ Exp: <strong className="text-cyan-400">{selectedNode.experience}</strong></span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
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
      <div className="absolute -bottom-8 md:-bottom-12 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl text-slate-300 text-xs font-mono z-30">
        <button 
          onClick={() => {
            setSpeedMultiplier(prev => prev === 1 ? 2.5 : prev === 2.5 ? 0 : 1);
            if (onPlaySound) onPlaySound('click');
          }}
          className="px-2.5 py-1 rounded-md hover:bg-slate-800 hover:text-cyan-400 transition flex items-center gap-1.5"
        >
          <Activity size={12} className={speedMultiplier > 1 ? "text-emerald-400 animate-spin" : "text-cyan-400"} />
          <span>ORBIT: {speedMultiplier === 0 ? 'PAUSED' : speedMultiplier === 2.5 ? 'WARP (2.5x)' : 'NORMAL (1x)'}</span>
        </button>

        <span className="text-slate-700">|</span>

        <button 
          onClick={() => {
            setIsScanning(prev => !prev);
            if (onPlaySound) onPlaySound('click');
          }}
          className="px-2.5 py-1 rounded-md hover:bg-slate-800 hover:text-emerald-400 transition flex items-center gap-1.5"
        >
          <Eye size={12} className={isScanning ? "text-emerald-400" : "text-slate-500"} />
          <span>SCANNER: {isScanning ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Embedded Scanline Keyframes */}
      <style>{`
        @keyframes laserScan {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 96%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateZ(30px) translateY(10px); }
          to { opacity: 1; transform: translateZ(60px) translateY(0); }
        }
      `}</style>
    </div>
  );
}

