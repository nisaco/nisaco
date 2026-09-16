import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Terminal, Radio, Shield, Globe, Clock, Sparkles } from 'lucide-react';

export default function HudHeader({ 
  isDark, 
  soundEnabled, 
  onToggleSound, 
  onOpenTerminal,
  onPlaySound 
}) {
  const [timeString, setTimeString] = useState('');
  const [ping, setPing] = useState(28);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // GMT / Accra Time
      const options = { timeZone: 'Africa/Accra', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
      setTimeString(now.toLocaleTimeString('en-GB', options) + ' GMT');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subtle ping jitter for authentic telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(24 + Math.floor(Math.random() * 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full border-b text-[11px] font-mono tracking-wider z-50 select-none ${
      isDark 
        ? 'bg-slate-950/80 border-slate-800/80 text-slate-400' 
        : 'bg-white/80 border-slate-200 text-slate-600'
    } backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-8 flex items-center justify-between">
        
        {/* Left: Location & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>SYS_READY</span>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <Globe size={12} className="text-cyan-400" />
            <span>ACCRA, GH // 5.6037° N, 0.1870° W</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-slate-500">
            <Radio size={12} className="text-emerald-400 animate-pulse" />
            <span>PING: {ping}ms</span>
          </div>
        </div>

        {/* Center: Mission Tag */}
        <div className="hidden md:flex items-center gap-2">
          <Sparkles size={11} className="text-cyan-400" />
          <span className="uppercase text-slate-400 font-semibold tracking-widest text-[10px]">
            ARCHITECTING FINTECH & CLOUD ECOSYSTEMS
          <Sparkles size={11} className="text-cyan-400 animate-pulse" />
          <span className="uppercase text-cyan-400/90 font-bold tracking-widest text-[10px]">
            "The Future Is Exciting,...READY?!"
          </span>
        </div>

        {/* Right: Clock & Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-mono font-medium">
            <Clock size={12} className="text-cyan-400" />
            <span>{timeString || '12:00:00 GMT'}</span>
          </div>

          <span className="text-slate-700">|</span>

          {/* Terminal Launcher */}
          <button
            onClick={() => {
              if (onPlaySound) onPlaySound('click');
              onOpenTerminal();
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-all ${
              isDark 
                ? 'border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-300' 
                : 'border-blue-500/40 hover:bg-blue-50 text-blue-600'
            }`}
            title="Open Interactive Developer Console (~)"
          >
            <Terminal size={11} />
            <span className="font-bold text-[10px]">CLI [~]</span>
          </button>

          {/* Sound FX Switcher */}
          <button
            onClick={() => {
              onToggleSound();
              if (onPlaySound) onPlaySound('click');
            }}
            className={`p-1 rounded transition-colors ${
              soundEnabled 
                ? isDark ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-600 hover:bg-slate-100'
                : 'text-slate-500 hover:bg-slate-800'
            }`}
            title={soundEnabled ? 'Audio FX Enabled (Click to Mute)' : 'Audio FX Muted (Click to Enable)'}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>
        </div>

      </div>
    </div>
  );
}

