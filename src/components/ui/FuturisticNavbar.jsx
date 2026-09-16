import React, { useState } from 'react';
import { Sun, Moon, Menu, X, Cpu, Layers, Terminal } from 'lucide-react';

export default function FuturisticNavbar({ 
  isDark, 
  onToggleTheme, 
  activeSection, 
  onNavigate,
  onOpenTerminal,
  onPlaySound 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: '01 // Core' },
    { id: 'about', label: '02 // Profile' },
    { id: 'services', label: '03 // Systems' },
    { id: 'projects', label: '04 // Projects' },
    { id: 'contact', label: '05 // Transmit' },
  ];

  const handleNavClick = (id) => {
    if (onPlaySound) onPlaySound('click');
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-10 left-0 right-0 z-40 px-4 md:px-8 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Hologram Capsule */}
        <div 
          onClick={() => handleNavClick('home')}
          onMouseEnter={() => { if (onPlaySound) onPlaySound('hover'); }}
          className={`pointer-events-auto cursor-pointer flex items-center gap-3 px-4 py-2 rounded-2xl border backdrop-blur-2xl transition-all duration-300 ${
            isDark 
              ? 'bg-slate-950/80 border-slate-800 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white' 
              : 'bg-white/80 border-slate-200 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] text-slate-900'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-md">
            JP
          </div>
          <div className="leading-tight">
            <div className="font-bold text-sm tracking-tight flex items-center gap-1.5">
              <span>Jeffrey Pappoe</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              FULL_STACK.SYS
            </div>
          </div>
        </div>

        {/* Center Floating VisionOS Capsule Nav (Desktop) */}
        <div className={`hidden md:flex pointer-events-auto items-center gap-1 p-1.5 rounded-full border backdrop-blur-2xl shadow-2xl transition-all ${
          isDark 
            ? 'bg-slate-950/80 border-slate-800/90 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
            : 'bg-white/80 border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.1)]'
        }`}>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={() => { if (onPlaySound) onPlaySound('hover'); }}
                className={`relative px-4 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all duration-300 ${
                  isActive
                    ? isDark 
                      ? 'text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-emerald-500/15 border border-emerald-500/40' 
                      : 'text-blue-600 font-bold shadow-[0_0_15px_rgba(37,99,235,0.2)] bg-blue-50 border border-blue-200'
                    : isDark 
                      ? 'text-slate-400 hover:text-white hover:bg-slate-900/60' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Action Icons (Theme + Mobile Menu) */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Theme Switcher */}
          <button
            onClick={() => {
              if (onPlaySound) onPlaySound('click');
              onToggleTheme();
            }}
            onMouseEnter={() => { if (onPlaySound) onPlaySound('hover'); }}
            className={`p-2.5 rounded-2xl border backdrop-blur-2xl transition-all duration-300 ${
              isDark 
                ? 'bg-slate-950/80 border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white' 
                : 'bg-white/80 border-slate-200 hover:border-blue-500/50 text-slate-600 hover:text-slate-900'
            }`}
            title="Toggle Visual Mode"
          >
            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-blue-600" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              if (onPlaySound) onPlaySound('click');
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className={`md:hidden p-2.5 rounded-2xl border backdrop-blur-2xl transition-all ${
              isDark 
                ? 'bg-slate-950/80 border-slate-800 text-white' 
                : 'bg-white/80 border-slate-200 text-slate-900'
            }`}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className={`pointer-events-auto md:hidden mt-3 max-w-sm mx-auto p-5 rounded-3xl border backdrop-blur-2xl shadow-2xl transition-all animate-fadeIn ${
          isDark 
            ? 'bg-slate-950/95 border-emerald-500/30 text-white shadow-[0_0_40px_rgba(16,185,129,0.2)]' 
            : 'bg-white/95 border-blue-500/30 text-slate-900 shadow-[0_0_40px_rgba(37,99,235,0.15)]'
        }`}>
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-4 py-3 rounded-xl font-mono text-sm transition-all flex items-center justify-between ${
                  activeSection === item.id 
                    ? isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : isDark ? 'text-slate-400 hover:bg-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs text-slate-500">→</span>
              </button>
            ))}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenTerminal();
              }}
              className="mt-2 text-left px-4 py-3 rounded-xl font-mono text-sm bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Terminal size={14} /> Open CLI Console
              </span>
              <span className="text-xs">LAUNCH</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

