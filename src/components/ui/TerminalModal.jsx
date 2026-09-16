import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft } from 'lucide-react';

export default function TerminalModal({ isOpen, onClose, onPlaySound }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: '⚡ QUANTUM TERMINAL INITIALIZED [v4.1.0-ghana]' },
    { type: 'system', text: 'Type "help" to view available developer commands, or "projects" to inspect architecture.' }
  ]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    if (onPlaySound) onPlaySound('click');

    const newHistory = [...history, { type: 'user', text: `guest@jeffrey-core:~$ ${input}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: `AVAILABLE COMMANDS:
  • skills     - Print core stack metrics & mastery breakdown
  • projects   - View live African fintech & logistics platforms
  • bio        - Read developer biography & university credentials
  • contact    - Get direct transmission channels (Email, GitHub, LinkedIn)
  • hire       - Initiate project deployment or contracting request
  • clear      - Clear terminal logs
  • exit       - Close developer console`
        });
        break;

      case 'skills':
        newHistory.push({
          type: 'output',
          text: `TECHNICAL POWER MATRIX:
  [==================] 98% React.js & Vite Ecosystem
  [================= ] 95% Node.js, Express & Microservices
  [================= ] 96% Paystack & Mobile Money Automated Gateways
  [================  ] 92% MongoDB & Atlas Distributed Clusters
  [================= ] 94% RESTful APIs, Webhooks & Twilio Systems
  [================  ] 90% SaaS Multi-Tenant Cloud Architecture`
        });
        break;

      case 'projects':
        newHistory.push({
          type: 'output',
          text: `FEATURED ARCHITECTURE:
  1. AJEnterprise - Automated Telecom/Data Reselling Platform (Paystack/Node/React)
     ↳ URL: https://ajenterprise-datastore.onrender.com
  2. Logistics Hub - Corporate Shipment Tracking & Instant Quotation Engine
     ↳ URL: https://j3cube-data.onrender.com
  3. EduTrack - Tertiary Campus Shuttle Real-time GPS & SMS Alert System
     ↳ URL: https://ucc-shuttle-live-2h1i.onrender.com`
        });
        break;

      case 'bio':
        newHistory.push({
          type: 'output',
          text: `NAME: Jeffrey N. K. Pappoe
TITLE: Full Stack Architect & Tech Entrepreneur
EDUCATION: BSc. Computer Science @ University of Cape Coast, Ghana
MISSION: "Building digital bridges for the African market and automated fintech workflows."`
        });
        break;

      case 'contact':
        newHistory.push({
          type: 'output',
          text: `DIRECT TRANSMISSION CHANNELS:
  • Email:    jnkpappoe@gmail.com
  • GitHub:   https://github.com/nisaco
  • LinkedIn: https://linkedin.com/in/jeffrey-nii-kpakpo-pappoe-a0997a391
  • Location: Accra, Ghana`
        });
        break;

      case 'hire':
        newHistory.push({
          type: 'success',
          text: `🚀 STATUS: AVAILABLE FOR FULL-TIME / CONTRACT OPPORTUNITIES
Direct Line: jnkpappoe@gmail.com
Fill the Transmit form in section 05 to trigger instant notification.`
        });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
        onClose();
        return;

      default:
        newHistory.push({
          type: 'error',
          text: `Command not recognized: "${cmd}". Type "help" for a list of valid commands.`
        });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-950 border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col h-[480px]">
        
        {/* Terminal Header */}
        <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-1.5 ml-3 font-mono text-xs text-slate-300">
              <TerminalIcon size={13} className="text-cyan-400" />
              <span>jeffrey-core: ~/developer-console</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Terminal Body */}
        <div 
          className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 select-text"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              {line.type === 'user' && (
                <span className="text-cyan-400 font-bold">{line.text}</span>
              )}
              {line.type === 'system' && (
                <span className="text-slate-400 italic">{line.text}</span>
              )}
              {line.type === 'output' && (
                <pre className="text-emerald-300 whitespace-pre-wrap font-mono">{line.text}</pre>
              )}
              {line.type === 'success' && (
                <pre className="text-cyan-300 font-bold whitespace-pre-wrap font-mono">{line.text}</pre>
              )}
              {line.type === 'error' && (
                <span className="text-red-400">{line.text}</span>
              )}
            </div>
          ))}

          {/* Interactive Prompt Input */}
          <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2">
            <span className="text-emerald-400 font-bold">guest@jeffrey-core:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs focus:ring-0 p-0"
              autoFocus
              spellCheck={false}
            />
            <CornerDownLeft size={13} className="text-slate-500" />
          </form>
          <div ref={bottomRef} />
        </div>

        {/* Terminal Footer */}
        <div className="h-6 bg-slate-900/60 border-t border-slate-800/80 px-3 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>STATUS: CONNECTED // UTF-8</span>
          <span>PRESS ESC OR TYPE 'exit' TO CLOSE</span>
        </div>

      </div>
    </div>
  );
}

