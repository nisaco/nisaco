import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, Linkedin, Mail, ExternalLink, Code2, 
  Terminal, Database, Globe, Moon, Sun, Menu, X, 
  Send, User, Briefcase, FileText, Server, Cpu, Layers, GraduationCap, Download, Twitter, Sparkles
} from 'lucide-react';

// --- THEMES & GLASSMORPHISM ---
const THEMES = {
  light: {
    bg: 'bg-gray-50',
    navBg: 'bg-white/70 backdrop-blur-xl border-white/40',
    textMain: 'text-gray-900',
    textSub: 'text-gray-600',
    accent: 'text-blue-600',
    accentBg: 'bg-blue-600',
    accentBorder: 'hover:border-blue-500/50',
    accentShadow: 'hover:shadow-blue-500/20',
    card: 'bg-white/60 backdrop-blur-lg border border-white/50 shadow-xl shadow-blue-500/5', 
    border: 'border-gray-200/50',
    skillBg: 'bg-white/50 backdrop-blur-md'
  },
  dark: {
    bg: 'bg-slate-950',
    navBg: 'bg-slate-950/70 backdrop-blur-xl border-slate-800/60',
    textMain: 'text-white',
    textSub: 'text-slate-400',
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500',
    accentBorder: 'hover:border-emerald-500/50',
    accentShadow: 'hover:shadow-emerald-500/20',
    card: 'bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 shadow-xl shadow-emerald-500/5',
    border: 'border-slate-800/60',
    skillBg: 'bg-slate-800/50 backdrop-blur-md'
  }
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [ripples, setRipples] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = isDark ? THEMES.dark : THEMES.light;

  // --- LOADING EFFECT ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // --- SCROLL ANIMATION OBSERVER ---
  useEffect(() => {
    if (loading) return; // Wait for loading to finish

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optional: unobserve if you want it to happen only once
          // observer.unobserve(entry.target); 
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const revealedElements = document.querySelectorAll('.reveal');
    revealedElements.forEach((el) => observer.observe(el));

    return () => revealedElements.forEach((el) => observer.unobserve(el));
  }, [loading, activeSection]); // Re-run if section changes or loading finishes

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsMenuOpen(false);
    }
  };

  const createRipple = (e) => {
    const section = e.currentTarget;
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 800);
  };

  // --- PERSONAL DATA ---
  const personalInfo = {
    name: "Jeffrey N. K. Pappoe",
    role: "Full Stack Developer & Entrepreneur",
    tagline: "Building digital bridges for the African market.",
    bio: "I am a software engineer focused on solving real-world problems through technology. I am currently a student at the University of Cape Coast, pursuing a Bachelor of Science in Computer Science. My expertise lies in building robust Fintech and E-commerce platforms that integrate complex APIs (like Paystack and Mobile Money) with user-friendly interfaces. I am also the founder and lead developer of AJEnterprise, a data reselling platform.",
    location: "Accra, Ghana",
    email: "jnkpappoe@gmail.com",
    avatar: "/profile.jpg", 
    socials: {
      github: "https://github.com/nisaco", 
      linkedin: "https://www.linkedin.com/in/jeffrey-nii-kpakpo-pappoe-a0997a391",
      twitter: "https://x.com/jeffrey_pa84707"
    }
  };

  const skills = [
    { name: "React & Vite", icon: Globe, level: "Expert" },
    { name: "Node.js & Express", icon: Server, level: "Expert" },
    { name: "MongoDB & Atlas", icon: Database, level: "Advanced" },
    { name: "Payment Integrations", icon: (props) => <Briefcase {...props} />, level: "Expert" },
    { name: "API Development", icon: Terminal, level: "Advanced" },
    { name: "UI/UX Design", icon: Layers, level: "Intermediate" },
  ];

  const services = [
    { title: "Custom Web Development", desc: "Building responsive, high-performance websites tailored to your brand using modern technologies like React and Tailwind CSS.", icon: Globe },
    { title: "E-Commerce Solutions", desc: "Developing secure online stores with automated payment gateways (Paystack/Mobile Money) and inventory management.", icon: Briefcase },
    { title: "API Integration", desc: "Connecting your business systems with third-party services (SMS, Payments, Data Bundles) to automate workflows.", icon: Terminal },
    { title: "SaaS Development", desc: "Architecting scalable Software-as-a-Service platforms from database design to frontend deployment.", icon: Database },
  ];

  const projects = [
    {
      title: "AJEnterprise",
      category: "Fintech Platform",
      desc: "A fully automated data reselling platform allowing users to buy bundles and airtime. Features include an Agent reseller system, real-time wallet funding via Paystack, and an Admin dashboard for sales tracking.",
      tech: ["React", "Node.js", "MongoDB", "Paystack API"],
      link: "https://ajenterprise-datastore.onrender.com"
    },
    {
      title: "Corporate Logistics Hub",
      category: "Business Website",
      desc: "A corporate presence for freelance artisans, where users can find trusted artisans to hire.",
      tech: ["Node.js", "Tailwind", "React", "Pretty", "MongoDB"],
      link: "https://hireme-bk0l.onrender.com"
    },
    {
      title: "EduTrack System",
      category: "EdTech",
      desc: "Student management system for local tertiaries to track shuttles on campus.",
      tech: ["React.js", "Google Maps", "MongoDb", "Twilio API"],
      link: "https://ucc-shuttle-live-2h1i.onrender.com"
    }
  ];

  // --- RENDER LOADING SCREEN ---
  if (loading) {
    return (
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <style>{`
          @keyframes spin-gradient {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.5; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.05); }
          }
        `}</style>
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-transparent border-t-blue-500 border-r-emerald-500 animate-[spin-gradient_1s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border-b-4 border-l-4 border-transparent border-b-purple-500 border-l-pink-500 animate-[spin-gradient_1.5s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className={`text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'} animate-[pulse-glow_2s_ease-in-out_infinite]`}>
               JP
             </span>
          </div>
        </div>
        <div className={`mt-8 font-mono text-sm tracking-widest ${isDark ? 'text-slate-400' : 'text-gray-500'} animate-pulse`}>
          INITIALIZING...
        </div>
      </div>
    );
  }

  // --- MAIN APP ---
  return (
    <div className={`min-h-screen ${theme.bg} ${theme.textMain} transition-colors duration-300 font-sans selection:bg-blue-500/30 overflow-x-hidden`}>
      
      {/* --- ANIMATIONS & STYLES --- */}
      <style>{`
        html { scroll-behavior: smooth; }
        
        /* Utility Animations */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(4); opacity: 0; }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; transition-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; transition-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; transition-delay: 0.3s; }
        
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.4); 
          width: 100px;
          height: 100px;
          margin-left: -50px;
          margin-top: -50px;
          pointer-events: none;
          animation: ripple 0.8s linear forwards;
          z-index: 5;
        }

        /* --- SCROLL REVEAL CLASS --- */
        .reveal {
          opacity: 0;
          transform: translateY(50px); /* Starts 50px down */
          transition: all 1s cubic-bezier(0.5, 0, 0, 1);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }

        /* --- BOUNCY HOVER CLASS --- */
        .hover-bounce {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .hover-bounce:hover {
          transform: translateY(-12px) scale(1.02);
        }
      `}</style>
       
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 border-b ${theme.border} ${theme.navBg}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2 cursor-pointer reveal active" onClick={() => scrollTo('home')}>
            <div className={`w-8 h-8 rounded-lg ${theme.accentBg} flex items-center justify-center text-white font-mono shadow-lg`}>
              JP
            </div>
            <span>Jeffrey N.K Pappoe</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium reveal active">
            {['Home', 'About', 'Services', 'Projects', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className={`hover:${theme.accent} transition-colors ${activeSection === item.toLowerCase() ? theme.accent : theme.textSub}`}
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full border ${theme.border} hover:bg-gray-100 dark:hover:bg-slate-800 transition transform hover:rotate-12`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
             <button onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden absolute w-full ${theme.card} border-b ${theme.border} p-4 flex flex-col gap-4 shadow-xl`}>
            {['Home', 'About', 'Services', 'Projects', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-left font-medium py-2"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section 
        id="home" 
        className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 min-h-screen relative overflow-hidden cursor-pointer"
        onClick={createRipple}
      >
         {/* Animated Background Blobs */}
         <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
            <div className={`absolute top-20 left-10 w-96 h-96 ${isDark ? 'bg-emerald-500' : 'bg-blue-400'} rounded-full mix-blend-multiply filter blur-3xl animate-float`}></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-float delay-100"></div>
            <div className={`absolute -bottom-8 left-1/2 w-96 h-96 ${isDark ? 'bg-blue-500' : 'bg-pink-400'} rounded-full mix-blend-multiply filter blur-3xl animate-float delay-200`}></div>
         </div>

         {/* Render Ripples */}
         {ripples.map(ripple => (
            <span
              key={ripple.id}
              className="ripple"
              style={{
                left: ripple.x,
                top: ripple.y
              }}
            />
          ))}

        <div className="flex-1 space-y-6 text-center md:text-left relative z-10 pointer-events-none">
          <div className={`reveal inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.border} ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-50 text-blue-700'} pointer-events-auto backdrop-blur-sm`}>
            <Sparkles size={14} className="inline mr-2" />
            Full Stack Developer based in Ghana
          </div>
          <h1 className="reveal delay-100 text-4xl md:text-6xl font-bold leading-tight">
            Building digital <span className={theme.accent}>solutions</span> for the modern web.
          </h1>
          <p className={`reveal delay-200 text-xl ${theme.textSub} max-w-lg mx-auto md:mx-0`}>
            {personalInfo.tagline} I specialize in creating seamless, automated platforms that drive business growth.
          </p>
          <div className="reveal delay-300 flex gap-4 justify-center md:justify-start pt-4 pointer-events-auto">
            <button onClick={(e) => { e.stopPropagation(); scrollTo('projects'); }} className={`${theme.accentBg} text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-blue-500/20`}>
              View My Work
            </button>
            <a href="/resume.pdf" download onClick={(e) => e.stopPropagation()} className={`px-8 py-3 rounded-xl font-bold border ${theme.border} hover:bg-gray-100 dark:hover:bg-slate-800 hover:scale-105 transition-all flex items-center gap-2 backdrop-blur-sm`}>
              <Download size={18} /> Download CV
            </a>
          </div>
           
          <div className={`reveal delay-300 flex gap-6 justify-center md:justify-start pt-8 ${theme.textSub} pointer-events-auto`}>
            <a href={personalInfo.socials.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-current transition hover:scale-125 transform duration-200 hover:-translate-y-1"><Github size={24} /></a>
            <a href={personalInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-current transition hover:scale-125 transform duration-200 hover:-translate-y-1"><Linkedin size={24} /></a>
            <a href={personalInfo.socials.twitter} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-current transition hover:scale-125 transform duration-200 hover:-translate-y-1"><Twitter size={24} /></a>
            <a href={`mailto:${personalInfo.email}`} onClick={(e) => e.stopPropagation()} className="hover:text-current transition hover:scale-125 transform duration-200 hover:-translate-y-1"><Mail size={24} /></a>
          </div>
        </div>
        
        {/* --- PROFILE PICTURE --- */}
        <div className="flex-1 flex justify-center relative pointer-events-none reveal delay-200">
          <div className={`w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-4 ${isDark ? 'border-slate-800' : 'border-white'} shadow-2xl relative z-10 bg-gradient-to-br from-blue-500 to-emerald-500`}>
             <img 
               src={personalInfo.avatar} 
               alt="Jeffrey Pappoe" 
               className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700"
               onError={(e) => {
                   e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Jeffrey&backgroundColor=b6e3f4"; 
               }}
             />
          </div>
          <div className={`absolute top-0 right-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${theme.accentBg} animate-pulse`}></div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className={`py-20 px-6 ${isDark ? 'bg-slate-900/30' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            
            {/* Biography */}
            <div className="flex-1 space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3 reveal">
                    About Me <div className={`h-1 w-20 ${theme.accentBg} rounded-full`}></div>
                </h2>
                <div className={`text-lg ${theme.textSub} leading-relaxed space-y-4 reveal delay-100`}>
                    <p>
                        Hello! I'm <strong>{personalInfo.name}</strong>, a passionate software developer and entrepreneur from Accra, Ghana.
                    </p>
                    <p>
                        {personalInfo.bio}
                    </p>
                    <p>
                        I focus on the <strong>MERN stack (MongoDB, Express, React, Node.js)</strong> and have deep experience integrating African payment gateways like Paystack and Hubtel. When I'm not coding, I'm mentoring upcoming developers or exploring new business opportunities in the tech space.
                    </p>
                </div>
                
                {/* Highlighted Education Cards */}
                <div className="space-y-4 reveal delay-200">
                  {/* University */}
                  <div className={`p-4 rounded-xl ${theme.card} flex items-center gap-4 hover-bounce hover:shadow-2xl ${theme.accentBorder} transition-all`}>
                      <div className={`p-3 rounded-full ${isDark ? 'bg-slate-800 text-emerald-400' : 'bg-blue-50 text-blue-600'}`}>
                          <GraduationCap size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-lg">University of Cape Coast</h4>
                          <p className={`text-sm ${theme.textSub}`}>BSc. Computer Science (Student)</p>
                      </div>
                  </div>

                  {/* Senior High School */}
                  <div className={`p-4 rounded-xl ${theme.card} flex items-center gap-4 hover-bounce hover:shadow-2xl ${theme.accentBorder} transition-all`}>
                      <div className={`p-3 rounded-full ${isDark ? 'bg-slate-800 text-emerald-400' : 'bg-blue-50 text-blue-600'}`}>
                          <GraduationCap size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-lg">University Practice Senior High</h4>
                          <p className={`text-sm ${theme.textSub}`}>General Science (Elective ICT) | 2022 - 2024</p>
                      </div>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-4 reveal delay-300">
                    <div className={`p-4 rounded-xl ${theme.card} hover-bounce hover:shadow-xl ${theme.accentBorder} text-center`}>
                        <h4 className="font-bold text-3xl mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">2+</h4>
                        <p className={`text-sm ${theme.textSub}`}>Years Experience</p>
                    </div>
                    <div className={`p-4 rounded-xl ${theme.card} hover-bounce hover:shadow-xl ${theme.accentBorder} text-center`}>
                        <h4 className="font-bold text-3xl mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">3+</h4>
                        <p className={`text-sm ${theme.textSub}`}>Projects Delivered</p>
                    </div>
                </div>
            </div>

            {/* Skills Grid */}
            <div className="flex-1 w-full reveal delay-100">
                <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
                <div className="grid grid-cols-2 gap-4">
                    {skills.map((skill, index) => (
                        <div key={index} className={`flex items-center gap-3 p-4 rounded-xl border ${theme.border} ${theme.skillBg} hover-bounce hover:border-current hover:${theme.accent} ${theme.accentShadow} transition duration-300 cursor-default group`}>
                            <div className={`${isDark ? 'text-emerald-400' : 'text-blue-600'} group-hover:scale-125 transition-transform duration-300`}>
                                <skill.icon size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">{skill.name}</h4>
                                <p className={`text-xs ${theme.textSub}`}>{skill.level}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services" className={`py-20 px-6 border-y ${theme.border} ${theme.bg}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl font-bold mb-4">My Services</h2>
            <p className={theme.textSub}>I help businesses grow with scalable software solutions.</p>
          </div>
           
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className={`${theme.card} p-6 rounded-2xl hover-bounce hover:shadow-2xl ${theme.accentBorder} reveal`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-transform duration-500 hover:rotate-12 ${isDark ? 'bg-slate-800 text-emerald-400' : 'bg-blue-50 text-blue-600'}`}>
                  <s.icon size={28} />
                </div>
                <h3 className="font-bold text-lg mb-3">{s.title}</h3>
                <p className={`text-sm ${theme.textSub} leading-relaxed`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className={`py-20 px-6 max-w-6xl mx-auto ${isDark ? 'bg-slate-900/20' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 reveal">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
            <p className={theme.textSub}>A selection of my recent work.</p>
          </div>
          <button className={`flex items-center gap-2 text-sm font-bold ${theme.accent} border-b-2 border-transparent hover:border-current transition hover:scale-105`}>
            View GitHub <ExternalLink size={16} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <div key={i} className={`${theme.card} rounded-2xl overflow-hidden hover-bounce hover:shadow-2xl ${theme.accentBorder} group reveal`} style={{ transitionDelay: `${i * 100}ms` }}>
              {/* Project Mockup Placeholder */}
              <div className={`h-48 ${isDark ? 'bg-slate-800/50' : 'bg-gray-100/50'} flex items-center justify-center relative overflow-hidden backdrop-blur-sm`}>
                <Code2 size={48} className={`opacity-20 ${theme.textSub} transition-transform duration-700 group-hover:scale-125 group-hover:rotate-6`} />
                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                   <a href={project.link} target="_blank" rel="noopener noreferrer" className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition duration-300 hover:bg-gray-200">View Project</a>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${theme.accent}`}>{project.category}</span>
                    <h3 className="text-xl font-bold mt-1 group-hover:text-blue-500 transition-colors">{project.title}</h3>
                  </div>
                </div>
                <p className={`text-sm ${theme.textSub} mb-6 line-clamp-3 leading-relaxed`}>
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map(t => (
                    <span key={t} className={`px-2 py-1 rounded-md text-xs font-medium border ${theme.border} ${theme.bg} ${theme.textSub}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className={`py-20 px-6 border-t ${theme.border} ${isDark ? 'bg-slate-900/50' : 'bg-blue-50'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="reveal">
            <h2 className="text-3xl font-bold mb-4">Ready to start your next project?</h2>
            <p className={`mb-12 ${theme.textSub}`}>Reach out and let's discuss how I can help you build something amazing.</p>
          </div>
           
          <div className={`${theme.card} p-8 rounded-3xl border ${theme.border} shadow-xl text-left max-w-xl mx-auto reveal delay-100 hover:shadow-2xl transition-shadow duration-500`}>
            <form className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase mb-2 ${theme.textSub}`}>Name</label>
                <input type="text" className={`w-full p-3 rounded-xl bg-transparent border ${theme.border} focus:ring-2 focus:ring-${isDark ? 'emerald' : 'blue'}-500 outline-none transition ${theme.textMain}`} placeholder="Your name" />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase mb-2 ${theme.textSub}`}>Email</label>
                <input type="email" className={`w-full p-3 rounded-xl bg-transparent border ${theme.border} focus:ring-2 focus:ring-${isDark ? 'emerald' : 'blue'}-500 outline-none transition ${theme.textMain}`} placeholder="name@example.com" />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase mb-2 ${theme.textSub}`}>Message</label>
                <textarea className={`w-full p-3 rounded-xl bg-transparent border ${theme.border} focus:ring-2 focus:ring-${isDark ? 'emerald' : 'blue'}-500 outline-none transition min-h-[120px] ${theme.textMain}`} placeholder="Tell me about your project..."></textarea>
              </div>
              <button className={`w-full py-4 rounded-xl font-bold text-white ${theme.accentBg} hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg`}>
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>
           
          <div className="mt-12 flex justify-center gap-8 reveal delay-200">
             <a href={`mailto:${personalInfo.email}`} className={`flex items-center gap-2 ${theme.textSub} hover:${theme.accent} transition hover:scale-110`}>
                <Mail size={20} /> {personalInfo.email}
             </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className={`py-8 text-center text-sm ${theme.textSub} border-t ${theme.border}`}>
        <p>&copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
      </footer>

    </div>
  );
}
