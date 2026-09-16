import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Github, Linkedin, Mail, ExternalLink, Code2, 
  Terminal, Database, Globe, Moon, Sun, Menu, X, 
  Send, User, Briefcase, FileText, Server, Cpu, Layers, 
  GraduationCap, Download, Twitter, Sparkles, ArrowRight,
  ShieldCheck, Zap, Activity, CheckCircle2, Copy, Check
} from 'lucide-react';

// Custom 3D & UI Components
import SpatialBackground from './components/3d/SpatialBackground';
import HologramAvatar3D from './components/3d/HologramAvatar3D';
import TiltCard from './components/ui/TiltCard';
import DecryptText from './components/ui/DecryptText';
import HudHeader from './components/ui/HudHeader';
import FuturisticNavbar from './components/ui/FuturisticNavbar';
import TerminalModal from './components/ui/TerminalModal';
import CustomCursor from './components/ui/CustomCursor';

// Custom Hooks
import { useSoundEffects } from './hooks/useSoundEffects';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Synthesized Sound Engine
  const { soundEnabled, toggleSound, playHover, playClick, playQuantumPulse, playSuccess } = useSoundEffects();

  // Handle sound triggers for child components
  const handlePlaySound = (type) => {
    if (type === 'hover') playHover();
    else if (type === 'click') playClick();
    else if (type === 'pulse') playQuantumPulse();
    else if (type === 'success') playSuccess();
  };

  // Keyboard shortcut: Press `~` to toggle dev terminal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
        playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playClick]);

  // Scroll spy to highlight active nav item
  useEffect(() => {
    const sections = ['home', 'about', 'services', 'projects', 'contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 250;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('jnkpappoe@gmail.com');
    setCopiedEmail(true);
    playSuccess();
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setFormSent(true);
    playSuccess();

    // Trigger futuristic confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4', '#3b82f6', '#a855f7']
    });

    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  // Personal Profile Data
  const personalInfo = {
    name: "Jeffrey N. K. Pappoe",
    role: "Full Stack Developer & Entrepreneur",
    tagline: "Building digital bridges for the African market & scalable fintech ecosystems.",
    bio: "I am a software engineer focused on solving real-world problems through technology. I am currently a student at the University of Cape Coast, pursuing a Bachelor of Science in Computer Science. My expertise lies in building robust Fintech and E-commerce platforms that integrate complex APIs (like Paystack and Mobile Money) with user-friendly interfaces. I am also the founder and lead developer of AJEnterprise, a high-volume data reselling platform.",
    location: "Accra, Ghana",
    email: "jnkpappoe@gmail.com",
    avatar: "/profile.jpg",
    socials: {
      github: "https://github.com/nisaco",
      linkedin: "https://www.linkedin.com/in/jeffrey-nii-kpakpo-pappoe-a0997a391",
      twitter: "https://x.com/jeffrey_pa84707"
    }
  };

  const services = [
    {
      id: "01",
      title: "Custom Web Applications",
      category: "Frontend & Architecture",
      desc: "Architecting high-performance, responsive web platforms using React, Vite, and Tailwind with high-speed micro-interactions and seamless UX.",
      icon: Globe,
      accent: "#06b6d4"
    },
    {
      id: "02",
      title: "Fintech & Payment Gateways",
      category: "African Payments Core",
      desc: "End-to-end integration of automated payment infrastructure (Paystack, Mobile Money, Hubtel) with instant wallet funding and webhook security.",
      icon: Briefcase,
      accent: "#10b981"
    },
    {
      id: "03",
      title: "API & Microservice Systems",
      category: "Backend Engineering",
      desc: "Building high-throughput RESTful APIs, distributed data queues, SMS notification relays (Twilio), and third-party telecom integrations.",
      icon: Terminal,
      accent: "#a855f7"
    },
    {
      id: "04",
      title: "SaaS & Cloud Platforms",
      category: "Scalable Infrastructure",
      desc: "Full-cycle SaaS development from schema modeling with MongoDB to role-based access control, analytics dashboards, and cloud deployment.",
      icon: Database,
      accent: "#f59e0b"
    }
  ];

  const projects = [
    {
      title: "AJEnterprise",
      category: "Fintech & Telecom Platform",
      badge: "LIVE PRODUCTION",
      desc: "A fully automated telecom data & airtime reselling platform. Features a multi-tiered reseller system, real-time automated wallet funding via Paystack, transaction ledgers, and an executive admin analytics dashboard.",
      tech: ["React.js", "Node.js", "MongoDB Atlas", "Paystack API", "Express"],
      link: "https://ajenterprise-datastore.onrender.com",
      github: "https://github.com/nisaco",
      glowColor: "rgba(16, 185, 129, 0.5)",
      metrics: "Thousands in processed volume • 100% Automated"
    },
    {
      title: "Corporate Logistics Hub",
      category: "Enterprise Business Platform",
      badge: "ACTIVE CLIENT",
      desc: "A corporate digital presence for an international logistics provider. Includes real-time shipment status tracking, instant quotation calculators, service request automation, and dynamic CMS news feeds.",
      tech: ["React", "Node.js", "Tailwind CSS", "REST API"],
      link: "https://j3cube-data.onrender.com",
      github: "https://github.com/nisaco",
      glowColor: "rgba(6, 182, 212, 0.5)",
      metrics: "Live shipment tracker • Interactive quotation engine"
    },
    {
      title: "EduTrack Campus System",
      category: "EdTech & Smart Mobility",
      badge: "CAMPUS SYSTEM",
      desc: "Real-time student transit management platform deployed for tertiary institutions. Tracks campus shuttles with live GPS mapping, estimated arrival times, and automated SMS arrival alerts via Twilio.",
      tech: ["React.js", "Google Maps API", "MongoDB", "Twilio SMS", "Node.js"],
      link: "https://ucc-shuttle-live-2h1i.onrender.com",
      github: "https://github.com/nisaco",
      glowColor: "rgba(168, 85, 247, 0.5)",
      metrics: "Live GPS mapping • SMS arrival notifications"
    }
  ];

  return (
    <div className={`min-h-screen relative font-sans transition-colors duration-500 overflow-x-hidden ${
      isDark 
        ? 'bg-[#050811] text-slate-100 cyber-grid-bg' 
        : 'bg-slate-50 text-slate-900 cyber-grid-bg-light'
    }`}>
      
      {/* 1. Custom Precision Light Cursor */}
      <CustomCursor isDark={isDark} />

      {/* 2. Interactive 3D Spatial Particle Universe (Three.js WebGL) */}
      <SpatialBackground isDark={isDark} />

      {/* 3. Top Mission Control Telemetry HUD */}
      <HudHeader 
        isDark={isDark}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onPlaySound={handlePlaySound}
      />

      {/* 4. Floating VisionOS Capsule Navbar */}
      <FuturisticNavbar 
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onPlaySound={handlePlaySound}
      />

      {/* 5. Interactive Dev Terminal Modal */}
      <TerminalModal 
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onPlaySound={handlePlaySound}
      />

      {/* ========================================================================= */}
      {/* SECTION 01: HERO / QUANTUM SPATIAL CORE                                    */}
      {/* ========================================================================= */}
      <section 
        id="home" 
        className="pt-28 md:pt-36 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center relative z-10"
      >
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Status Cyber Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-xl text-xs font-mono select-none animate-fadeIn border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Sparkles size={13} className="text-emerald-400" />
              <span>SYSTEM READY // ACCRA, GHANA</span>
            </div>

            {/* Kinetic Decryption Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Building digital <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
                <DecryptText text="ecosystems" revealDelay={200} />
              </span>{' '}
              for the modern world.
            </h1>

            {/* Subtext */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Hello, I am <strong className={isDark ? 'text-white' : 'text-slate-900'}>{personalInfo.name}</strong>. 
              A software engineer & entrepreneur creating high-throughput fintech platforms, automated payment gateways, and scalable cloud architectures.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <button 
                onClick={() => {
                  handlePlaySound('click');
                  scrollToSection('projects');
                }}
                onMouseEnter={() => handlePlaySound('hover')}
                className="px-7 py-3.5 rounded-2xl font-mono font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300 hover:opacity-95 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2 group cursor-pointer"
              >
                <span>EXPLORE WORK</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <a 
                href="/resume.pdf" 
                download
                onClick={() => handlePlaySound('click')}
                onMouseEnter={() => handlePlaySound('hover')}
                className={`px-7 py-3.5 rounded-2xl font-mono font-bold text-sm border backdrop-blur-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer ${
                  isDark 
                    ? 'border-slate-700 bg-slate-900/60 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] text-slate-200' 
                    : 'border-slate-300 bg-white/80 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg text-slate-800'
                }`}
              >
                <Download size={16} />
                <span>DOWNLOAD CV</span>
              </a>
            </div>

            {/* Social Links Bar */}
            <div className="flex items-center gap-5 justify-center lg:justify-start pt-4 text-slate-400">
              <a 
                href={personalInfo.socials.github} 
                target="_blank" 
                rel="noreferrer"
                onMouseEnter={() => handlePlaySound('hover')}
                className="p-2.5 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:text-emerald-400 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:-translate-y-1 transition-all"
                title="GitHub"
              >
                <Github size={18} />
              </a>
              <a 
                href={personalInfo.socials.linkedin} 
                target="_blank" 
                rel="noreferrer"
                onMouseEnter={() => handlePlaySound('hover')}
                className="p-2.5 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:text-cyan-400 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:-translate-y-1 transition-all"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href={personalInfo.socials.twitter} 
                target="_blank" 
                rel="noreferrer"
                onMouseEnter={() => handlePlaySound('hover')}
                className="p-2.5 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:text-blue-400 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:-translate-y-1 transition-all"
                title="Twitter / X"
              >
                <Twitter size={18} />
              </a>
              <button 
                onClick={handleCopyEmail}
                onMouseEnter={() => handlePlaySound('hover')}
                className="p-2.5 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:text-purple-400 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:-translate-y-1 transition-all flex items-center gap-1.5 text-xs font-mono"
                title="Copy Email"
              >
                {copiedEmail ? <Check size={16} className="text-emerald-400" /> : <Mail size={18} />}
                <span className="hidden sm:inline">{copiedEmail ? 'COPIED!' : 'COPY EMAIL'}</span>
              </button>
            </div>

          </div>

          {/* Right: The Mind-Blowing 3D Spatial Hologram & Celestial Planetary Revolving Stack */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            <HologramAvatar3D 
              avatarUrl={personalInfo.avatar}
              isDark={isDark}
              onPlaySound={handlePlaySound}
              onTriggerPulse={() => {
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.5 },
                  colors: ['#10b981', '#06b6d4', '#3b82f6']
                });
              }}
            />
          </div>

        </div>

        {/* Floating Telemetry Stats Strip */}
        <div className="mt-16 pt-8 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all hover:scale-105 ${
            isDark ? 'bg-slate-950/50 border-slate-800/80' : 'bg-white/80 border-slate-200'
          }`}>
            <div className="font-mono text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              MERN STACK
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">Core Tech Specialization</div>
          </div>

          <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all hover:scale-105 ${
            isDark ? 'bg-slate-950/50 border-slate-800/80' : 'bg-white/80 border-slate-200'
          }`}>
            <div className="font-mono text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              PAYSTACK
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">Fintech Gateway Integration</div>
          </div>

          <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all hover:scale-105 ${
            isDark ? 'bg-slate-950/50 border-slate-800/80' : 'bg-white/80 border-slate-200'
          }`}>
            <div className="font-mono text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              AJENTERPRISE
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">Founder & Lead Architect</div>
          </div>

          <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all hover:scale-105 ${
            isDark ? 'bg-slate-950/50 border-slate-800/80' : 'bg-white/80 border-slate-200'
          }`}>
            <div className="font-mono text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              BSc. COMP SCI
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">Univ. of Cape Coast</div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 02: ABOUT / CREDENTIALS MATRIX                                     */}
      {/* ========================================================================= */}
      <section 
        id="about" 
        className={`py-24 px-6 relative z-10 border-t ${
          isDark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-white/60'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="font-mono text-xs text-emerald-400 tracking-widest uppercase mb-2">
                02 // BACKGROUND & EDUCATION
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Architecting at the intersection of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  code, commerce, and fintech.
                </span>
              </h2>
            </div>
            <div className="font-mono text-xs text-slate-400">
              ACCREDITATION // BSc COMPUTER SCIENCE
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Biography & Vision */}
            <div className="lg:col-span-7 space-y-6">
              <TiltCard 
                isDark={isDark} 
                className={`p-8 rounded-3xl border backdrop-blur-2xl ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/90 border-slate-200'
                }`}
              >
                <h3 className="font-mono text-xl font-bold mb-4 flex items-center gap-2">
                  <User size={20} className="text-cyan-400" />
                  <span>Profile Overview</span>
                </h3>
                <div className={`space-y-4 text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <p>
                    I am a software engineer and entrepreneurial technologist based in <strong>Accra, Ghana</strong>. Currently completing my Bachelor of Science in Computer Science at the <strong>University of Cape Coast</strong>, I dedicate my engineering efforts toward solving mission-critical business challenges across Africa.
                  </p>
                  <p>
                    My primary engineering focus centers on high-volume <strong>Fintech solutions, automated data distribution, and resilient web architectures</strong>. As the founder and lead developer of <strong>AJEnterprise</strong>, I engineered an automated reseller network allowing thousands of transactions with instant Paystack wallet funding and automated telecom delivery.
                  </p>
                </div>
              </TiltCard>

              {/* Education Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <TiltCard 
                  isDark={isDark}
                  className={`p-5 rounded-2xl border backdrop-blur-xl ${
                    isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white/80 border-slate-200'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mb-3 border border-cyan-500/30">
                    <GraduationCap size={20} />
                  </div>
                  <h4 className="font-bold text-base">University of Cape Coast</h4>
                  <p className="text-xs text-emerald-400 font-mono mt-0.5">BSc. Computer Science</p>
                  <p className="text-xs text-slate-400 mt-2">Specializing in algorithms, distributed systems, and software engineering principles.</p>
                </TiltCard>

                <TiltCard 
                  isDark={isDark}
                  className={`p-5 rounded-2xl border backdrop-blur-xl ${
                    isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white/80 border-slate-200'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-3 border border-emerald-500/30">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="font-bold text-base">University Practice SHS</h4>
                  <p className="text-xs text-cyan-400 font-mono mt-0.5">General Science (Elective ICT)</p>
                  <p className="text-xs text-slate-400 mt-2">Graduated 2022 - 2024 with distinction in computational mathematics and programming.</p>
                </TiltCard>
              </div>
            </div>

            {/* Technical Skills Radar Matrix */}
            <div className="lg:col-span-5 space-y-4">
              <div className={`p-6 rounded-3xl border backdrop-blur-2xl ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white/90 border-slate-200'
              }`}>
                <h3 className="font-mono text-lg font-bold mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Cpu size={18} className="text-emerald-400" />
                    <span>Stack Proficiency</span>
                  </span>
                  <span className="text-xs font-normal text-slate-400">TELEMETRY</span>
                </h3>

                <div className="space-y-4">
                  {[
                    { name: 'React.js, Vite & UI Systems', level: 98, color: '#06b6d4' },
                    { name: 'Node.js, Express & Microservices', level: 95, color: '#10b981' },
                    { name: 'Paystack & Mobile Money Gateways', level: 96, color: '#3b82f6' },
                    { name: 'MongoDB, Atlas & Data Modeling', level: 92, color: '#10b981' },
                    { name: 'REST APIs, Webhooks & Twilio', level: 94, color: '#a855f7' },
                    { name: 'Tailwind CSS & Spatial Design', level: 95, color: '#06b6d4' },
                  ].map((skill, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="font-medium text-slate-200">{skill.name}</span>
                        <span className="font-bold" style={{ color: skill.color }}>{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 shadow-sm"
                          style={{ 
                            width: `${skill.level}%`, 
                            backgroundColor: skill.color,
                            boxShadow: `0 0 10px ${skill.color}`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 03: SERVICES / ARCHITECTURAL SYSTEMS                               */}
      {/* ========================================================================= */}
      <section 
        id="services" 
        className="py-24 px-6 max-w-7xl mx-auto relative z-10"
      >
        <div className="space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase mb-2">
              03 // CORE CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Engineering solutions built for scale and durability.
            </h2>
            <p className={`mt-3 text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              From conceptual design to distributed production deployment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => {
              const ServiceIcon = s.icon;
              return (
                <TiltCard 
                  key={s.id} 
                  isDark={isDark}
                  glowColor={`${s.accent}40`}
                  className={`p-6 rounded-3xl border backdrop-blur-xl flex flex-col justify-between transition-all group ${
                    isDark ? 'bg-slate-900/40 border-slate-800 hover:border-cyan-500/50' : 'bg-white/80 border-slate-200 hover:border-blue-500/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg"
                        style={{ backgroundColor: s.accent }}
                      >
                        <ServiceIcon size={22} />
                      </div>
                      <span className="font-mono text-xs text-slate-500 font-bold">{s.id}</span>
                    </div>

                    <div className="font-mono text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: s.accent }}>
                      {s.category}
                    </div>

                    <h3 className="text-lg font-bold mb-3 group-hover:text-cyan-300 transition-colors">
                      {s.title}
                    </h3>

                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {s.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-500">
                    <span>DEPLOYABLE</span>
                    <span className="text-emerald-400">✓ READY</span>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04: PROJECTS / LIVE PLATFORMS SHOWCASE                             */}
      {/* ========================================================================= */}
      <section 
        id="projects" 
        className={`py-24 px-6 relative z-10 border-t ${
          isDark ? 'border-slate-800/80 bg-slate-950/30' : 'border-slate-200 bg-white/50'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="font-mono text-xs text-emerald-400 tracking-widest uppercase mb-2">
                04 // DEPLOYED SYSTEMS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Featured software & fintech platforms.
              </h2>
            </div>
            <a 
              href="https://github.com/nisaco" 
              target="_blank" 
              rel="noreferrer"
              onMouseEnter={() => handlePlaySound('hover')}
              className="inline-flex items-center gap-2 font-mono text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
            >
              <span>VIEW GITHUB REPOSITORIES</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <TiltCard 
                key={idx} 
                isDark={isDark}
                glowColor={project.glowColor}
                className={`rounded-3xl border backdrop-blur-2xl flex flex-col justify-between overflow-hidden group transition-all ${
                  isDark ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/50' : 'bg-white/90 border-slate-200 hover:border-blue-500/50'
                }`}
              >
                <div>
                  {/* Visual Header / Mockup Representation */}
                  <div className={`h-48 relative overflow-hidden flex items-center justify-center p-6 ${
                    isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-100 to-slate-200'
                  }`}>
                    {/* Glowing Core Icon */}
                    <div className="relative z-10 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-500">
                      <Code2 size={36} className="text-cyan-400 group-hover:text-emerald-400 transition-colors" />
                    </div>

                    {/* Scanlines overlay on project card */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-20"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,180,0.3) 2px, rgba(0,255,180,0.3) 4px)'
                      }}
                    />

                    {/* Category & Status Badges */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-sm">
                        {project.badge}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 z-20">
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noreferrer"
                        onClick={() => handlePlaySound('click')}
                        className="p-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition"
                        title="Open Live Application"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="font-mono text-xs text-cyan-400 uppercase tracking-wider font-semibold">
                        {project.category}
                      </div>
                      <h3 className="text-2xl font-bold mt-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all">
                        {project.title}
                      </h3>
                    </div>

                    <p className={`text-sm leading-relaxed line-clamp-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {project.desc}
                    </p>

                    {/* Metric Highlight */}
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <Activity size={13} className="animate-pulse" />
                      <span>{project.metrics}</span>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.tech.map((t) => (
                        <span 
                          key={t} 
                          className="px-2.5 py-1 rounded-lg text-xs font-mono border border-slate-800 bg-slate-950/80 text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-6 pt-0 flex gap-3">
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={() => handlePlaySound('click')}
                    onMouseEnter={() => handlePlaySound('hover')}
                    className="flex-1 py-3 rounded-xl font-mono text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
                  >
                    <span>LAUNCH PLATFORM</span>
                    <ExternalLink size={14} />
                  </a>

                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={() => handlePlaySound('click')}
                    onMouseEnter={() => handlePlaySound('hover')}
                    className="px-4 py-3 rounded-xl font-mono text-xs font-bold border border-slate-700 hover:border-cyan-400 hover:text-cyan-300 transition-all flex items-center justify-center"
                    title="Source Code"
                  >
                    <Github size={16} />
                  </a>
                </div>
              </TiltCard>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 05: CONTACT / QUANTUM TRANSMISSION HUB                            */}
      {/* ========================================================================= */}
      <section 
        id="contact" 
        className="py-24 px-6 max-w-5xl mx-auto relative z-10"
      >
        <div className="space-y-12">
          
          <div className="text-center max-w-2xl mx-auto">
            <div className="font-mono text-xs text-emerald-400 tracking-widest uppercase mb-2">
              05 // INITIATE TRANSMISSION
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to architect something extraordinary?
            </h2>
            <p className={`mt-3 text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Available for full-time engineering roles, technical advisory, and high-impact software contracts.
            </p>
          </div>

          <TiltCard 
            isDark={isDark} 
            className={`p-8 md:p-10 rounded-3xl border backdrop-blur-2xl shadow-2xl ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/95 border-slate-200'
            }`}
          >
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    // Transmission Sender Name
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Satoshi Nakamoto"
                    className={`w-full p-3.5 rounded-xl border font-mono text-sm outline-none transition-all ${
                      isDark 
                        ? 'bg-slate-950/80 border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-600' 
                        : 'bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    // Sender Electronic Mail
                  </label>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. satoshi@bitcoin.org"
                    className={`w-full p-3.5 rounded-xl border font-mono text-sm outline-none transition-all ${
                      isDark 
                        ? 'bg-slate-950/80 border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-600' 
                        : 'bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  // Message Payload / Project Scope
                </label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your product requirements, timelines, or collaboration goals..."
                  className={`w-full p-3.5 rounded-xl border font-mono text-sm outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-950/80 border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-600' 
                      : 'bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900'
                  }`}
                />
              </div>

              <button 
                type="submit"
                onMouseEnter={() => handlePlaySound('hover')}
                disabled={formSent}
                className={`w-full py-4 rounded-xl font-mono text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                  formSent 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 hover:opacity-95 hover:scale-[1.01] active:scale-98 shadow-cyan-500/25'
                }`}
              >
                {formSent ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>TRANSMISSION BROADCASTED SUCCESSFULLY!</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>DISPATCH SECURE TRANSMISSION</span>
                  </>
                )}
              </button>
            </form>
          </TiltCard>

          {/* Quick Direct Channel */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-mono text-slate-400 pt-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Direct Link:</span>
              <a 
                href={`mailto:${personalInfo.email}`} 
                className="text-cyan-400 hover:underline font-bold"
              >
                {personalInfo.email}
              </a>
            </div>

            <span className="hidden sm:inline text-slate-700">|</span>

            <div>
              <span>Location: Accra, Ghana (GMT)</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className={`py-12 border-t text-center font-mono text-xs select-none relative z-10 ${
        isDark ? 'border-slate-800/80 bg-slate-950/80 text-slate-500' : 'border-slate-200 bg-white text-slate-600'
      }`}>
        <div className="max-w-6xl mx-auto px-6 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400 font-bold tracking-widest uppercase">
              DESIGNED & ENGINEERED BY JEFFREY N. K. PAPPOE
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            &copy; {new Date().getFullYear()} Jeffrey N. K. Pappoe. All digital rights reserved. Powered by React, Three.js, Tailwind & Web Audio Synthesizer.
          </p>
        </div>
      </footer>

    </div>
  );
}