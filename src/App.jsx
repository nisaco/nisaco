import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, Linkedin, Mail, ExternalLink, Code2, 
  Terminal, Database, Globe, Moon, Sun, Menu, X, 
  Send, User, Briefcase, FileText, Server, Cpu, Layers, GraduationCap, Download, Twitter, Sparkles
} from 'lucide-react';

// --- ANIMATION COMPONENT ---
// This wrapper makes elements fade in when they scroll into view
const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- THEMES (Upgraded with Animated Gradients) ---
const THEMES = {
  light: {
    bg: 'bg-gradient-to-br from-blue-50 via-white to-purple-50', // Breathing gradient
    navBg: 'bg-white/70 backdrop-blur-xl border-b border-white/20',
    textMain: 'text-slate-900',
    textSub: 'text-slate-600',
    accent: 'text-blue-600',
    accentBg: 'bg-blue-600',
    card: 'bg-white/60 backdrop-blur-md border border-white/40 shadow-xl', // Glassmorphism
    border: 'border-slate-200/50',
    skillBg: 'bg-white/80'
  },
  dark: {
    bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-black',
    navBg: 'bg-slate-900/70 backdrop-blur-xl border-b border-white/5',
    textMain: 'text-white',
    textSub: 'text-slate-400',
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500',
    card: 'bg-slate-800/40 backdrop-blur-md border border-white/5 shadow-xl',
    border: 'border-white/10',
    skillBg: 'bg-white/5'
  },
  midnight: {
    bg: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-black',
    navBg: 'bg-indigo-950/70 backdrop-blur-xl border-b border-white/10',
    textMain: 'text-indigo-50',
    textSub: 'text-indigo-200',
    accent: 'text-pink-400',
    accentBg: 'bg-pink-500',
    card: 'bg-indigo-900/30 backdrop-blur-md border border-white/10 shadow-xl',
    border: 'border-white/10',
    skillBg: 'bg-indigo-900/40'
  },
  sunset: {
    bg: 'bg-gradient-to-br from-orange-100 via-rose-100 to-amber-100',
    navBg: 'bg-white/60 backdrop-blur-xl border-b border-white/30',
    textMain: 'text-slate-900',
    textSub: 'text-slate-600',
    accent: 'text-orange-600',
    accentBg: 'bg-orange-500',
    card: 'bg-white/50 backdrop-blur-md border border-white/50 shadow-xl',
    border: 'border-orange-200/50',
    skillBg: 'bg-white/70'
  }
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const theme = isDark ? THEMES.dark : THEMES.light;

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsMenuOpen(false);
    }
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
      desc: "A corporate presence for a logistics company featuring shipment tracking, service quotation forms, and a dynamic CMS for news updates.",
      tech: ["Node.js", "Tailwind", "React", "Pretty"],
      link: "https://j3cube-data.onrender.com"
    },
    {
      title: "EduTrack System",
      category: "EdTech",
      desc: "Student management system for local tertiaries to track shuttles on campus.",
      tech: ["React.js", "Google Maps", "MongoDb", "Twilio API"],
      link: "https://ucc-shuttle-live-2h1i.onrender.com"
    }
  ];

  return (
    <div className={`min-h-screen ${theme.textMain} transition-colors duration-500 font-sans selection:bg-blue-500/30 overflow-x-hidden`}>
      
      {/* --- GLOBAL STYLES FOR ANIMATIONS --- */}
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .glass-card {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>

      {/* --- ANIMATED BACKGROUND LAYER --- */}
      <div className={`fixed inset-0 z-[-1] animate-gradient ${theme.bg}`}></div>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${theme.navBg}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2 cursor-pointer group" onClick={() => scrollTo('home')}>
            <div className={`w-10 h-10 rounded-xl ${theme.accentBg} flex items-center justify-center text-white font-mono shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
              JP
            </div>
            <span className="font-bold text-lg tracking-tight group-hover:tracking-wide transition-all duration-300">Jeffrey Pappoe</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {['Home', 'About', 'Services', 'Projects', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className={`relative px-2 py-1 hover:${theme.accent} transition-colors ${activeSection === item.toLowerCase() ? theme.accent : theme.textSub} group`}
              >
                {item}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${theme.accentBg} transition-all duration-300 group-hover:w-full`}></span>
              </button>
            ))}
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full border ${theme.border} hover:scale-110 transition-transform duration-200`}
            >
              {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
             <button onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden absolute w-full ${theme.card} border-b ${theme.border} p-4 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5`}>
            {['Home', 'About', 'Services', 'Projects', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-left font-bold text-lg py-2 pl-4 border-l-4 border-transparent hover:border-current hover:pl-6 transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16 min-h-screen">
        <div className="flex-1 space-y-8 text-center md:text-left z-10">
          <RevealOnScroll>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.border} ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-50 text-blue-700'} mb-4 shadow-sm`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isDark ? 'bg-emerald-400' : 'bg-blue-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isDark ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
              </span>
              Full Stack Developer based in Ghana
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll delay={100}>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              Building digital <br/>
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-emerald-400 to-cyan-400' : 'from-blue-600 to-indigo-600'}`}>
                masterpieces
              </span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <p className={`text-xl md:text-2xl ${theme.textSub} max-w-lg mx-auto md:mx-0 leading-relaxed`}>
              {personalInfo.tagline} I specialize in robust, automated platforms that drive business growth.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <button 
                onClick={() => scrollTo('projects')} 
                className={`${theme.accentBg} text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition transform shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2`}
              >
                View My Work <Code2 size={20} />
              </button>
              <a 
                href="/resume.pdf" 
                download 
                className={`px-8 py-4 rounded-2xl font-bold border ${theme.border} ${theme.card} hover:scale-105 transition transform flex items-center justify-center gap-2 shadow-md`}
              >
                <Download size={20} /> Download CV
              </a>
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll delay={400}>
            <div className={`flex gap-6 justify-center md:justify-start pt-8 ${theme.textSub}`}>
              {[
                { icon: Github, link: personalInfo.socials.github },
                { icon: Linkedin, link: personalInfo.socials.linkedin },
                { icon: Twitter, link: personalInfo.socials.twitter },
                { icon: Mail, link: `mailto:${personalInfo.email}` }
              ].map((item, index) => (
                <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-current hover:-translate-y-1 transition transform duration-200">
                  <item.icon size={28} />
                </a>
              ))}
            </div>
          </RevealOnScroll>
        </div>
        
        {/* --- PROFILE PICTURE (Floating Animation) --- */}
        <div className="flex-1 flex justify-center relative z-10 animate-float">
          <div className={`w-72 h-72 md:w-[28rem] md:h-[28rem] rounded-[2rem] overflow-hidden border-8 ${isDark ? 'border-slate-800/50' : 'border-white/50'} shadow-2xl relative rotate-3 hover:rotate-0 transition-all duration-500`}>
             <img 
               src={personalInfo.avatar} 
               alt="Jeffrey Pappoe" 
               className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700"
               onError={(e) => {
                   e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Jeffrey&backgroundColor=b6e3f4"; 
               }}
             />
             {/* Glass overlay effect */}
             <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2rem]"></div>
          </div>
          {/* Decorative Elements behind image */}
          <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-60 ${theme.accentBg} animate-pulse`}></div>
          <div className={`absolute -top-10 -left-10 w-40 h-40 rounded-full blur-2xl opacity-60 bg-purple-500 animate-pulse delay-700`}></div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-20 items-start">
            
            {/* Biography */}
            <div className="flex-1 space-y-8">
              <RevealOnScroll>
                <h2 className="text-4xl font-bold flex items-center gap-4">
                    About Me <div className={`h-1.5 w-24 ${theme.accentBg} rounded-full`}></div>
                </h2>
              </RevealOnScroll>
              
              <RevealOnScroll delay={100}>
                <div className={`text-lg ${theme.textSub} leading-loose space-y-6 font-medium`}>
                    <p>
                        Hello! I'm <strong>{personalInfo.name}</strong>, a software engineer who believes code is art. 
                    </p>
                    <p>
                        My journey began with a curiosity about digital payments in Africa. That curiosity evolved into <strong>AJEnterprise</strong>, a platform now serving thousands. I don't just write code; I architect systems that solve complex logistic and financial problems.
                    </p>
                    <p>
                        I specialize in the <strong>MERN stack</strong> and complex API integrations. When I'm not debugging, I'm likely exploring new tech stacks or mentoring peers at university.
                    </p>
                </div>
              </RevealOnScroll>
                
                {/* Education Cards */}
                <div className="space-y-4 pt-4">
                  <RevealOnScroll delay={200}>
                    <div className={`p-5 rounded-2xl border ${theme.border} ${theme.card} flex items-center gap-5 hover:translate-x-2 transition-transform duration-300`}>
                        <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800 text-emerald-400' : 'bg-blue-50 text-blue-600'} shadow-inner`}>
                            <GraduationCap size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-xl">University of Cape Coast</h4>
                            <p className={`text-sm ${theme.textSub} font-medium`}>BSc. Computer Science (Student)</p>
                        </div>
                    </div>
                  </RevealOnScroll>

                  <RevealOnScroll delay={300}>
                    <div className={`p-5 rounded-2xl border ${theme.border} ${theme.card} flex items-center gap-5 hover:translate-x-2 transition-transform duration-300`}>
                        <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800 text-emerald-400' : 'bg-blue-50 text-blue-600'} shadow-inner`}>
                            <Briefcase size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-xl">University Practice Senior High</h4>
                            <p className={`text-sm ${theme.textSub} font-medium`}>General Science (Elective ICT) | 2022 - 2024</p>
                        </div>
                    </div>
                  </RevealOnScroll>
                </div>
            </div>

            {/* Skills Grid */}
            <div className="flex-1 w-full">
              <RevealOnScroll delay={400}>
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                   <Sparkles className="text-yellow-500" /> Technical Arsenal
                </h3>
              </RevealOnScroll>
              
              <div className="grid grid-cols-2 gap-4">
                  {skills.map((skill, index) => (
                    <RevealOnScroll key={index} delay={index * 100}>
                      <div className={`group flex items-center gap-4 p-5 rounded-2xl border ${theme.border} ${theme.skillBg} hover:border-current hover:${theme.accent} transition-all duration-300 hover:shadow-lg cursor-default`}>
                          <div className={`${isDark ? 'text-emerald-400' : 'text-blue-600'} group-hover:scale-125 transition-transform duration-300`}>
                              <skill.icon size={28} />
                          </div>
                          <div>
                              <h4 className="font-bold text-base">{skill.name}</h4>
                              <p className={`text-xs ${theme.textSub} font-medium tracking-wide uppercase`}>{skill.level}</p>
                          </div>
                      </div>
                    </RevealOnScroll>
                  ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-4">My Services</h2>
              <p className={`text-xl ${theme.textSub}`}>I turn complex problems into elegant software solutions.</p>
            </div>
          </RevealOnScroll>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => (
              <RevealOnScroll key={i} delay={i * 100}>
                <div className={`${theme.card} p-8 rounded-3xl border ${theme.border} hover:-translate-y-3 transition duration-500 shadow-lg hover:shadow-2xl h-full flex flex-col`}>
                  <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center ${isDark ? 'bg-slate-800 text-emerald-400' : 'bg-blue-50 text-blue-600'} shadow-inner`}>
                    <s.icon size={32} />
                  </div>
                  <h3 className="font-bold text-xl mb-3">{s.title}</h3>
                  <p className={`text-sm ${theme.textSub} leading-relaxed`}>{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className={`py-32 px-6 ${isDark ? 'bg-black/20' : 'bg-white/50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <RevealOnScroll>
              <div>
                <h2 className="text-4xl font-bold mb-2">Featured Projects</h2>
                <p className={`text-xl ${theme.textSub}`}>Some of my recent masterpieces.</p>
              </div>
            </RevealOnScroll>
            <a href={personalInfo.socials.github} target="_blank" className={`flex items-center gap-2 text-sm font-bold ${theme.accent} border-b-2 border-transparent hover:border-current transition`}>
              View GitHub <ExternalLink size={16} />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {projects.map((project, i) => (
              <RevealOnScroll key={i} delay={i * 150}>
                <div className={`${theme.card} rounded-3xl border ${theme.border} overflow-hidden hover:shadow-2xl transition-all duration-500 group h-full flex flex-col`}>
                  {/* Project Mockup */}
                  <div className={`h-56 ${isDark ? 'bg-slate-800' : 'bg-gray-100'} flex items-center justify-center relative overflow-hidden`}>
                    <Code2 size={64} className={`opacity-20 ${theme.textSub} transform group-hover:scale-110 transition duration-700`} />
                    <div className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm`}>
                       <a href={project.link} target="_blank" rel="noopener noreferrer" className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition duration-300 shadow-xl hover:bg-gray-100">
                         View Live Demo
                       </a>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${theme.accent}`}>{project.category}</span>
                        <h3 className="text-2xl font-bold mt-1 group-hover:text-blue-500 transition-colors">{project.title}</h3>
                      </div>
                    </div>
                    <p className={`text-sm ${theme.textSub} mb-6 line-clamp-4 leading-relaxed flex-1`}>
                      {project.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tech.map(t => (
                        <span key={t} className={`px-3 py-1 rounded-lg text-xs font-semibold border ${theme.border} ${theme.bg} ${theme.textMain}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <RevealOnScroll>
            <h2 className="text-4xl font-bold mb-6">Ready to start your next project?</h2>
            <p className={`mb-12 text-xl ${theme.textSub}`}>Reach out and let's discuss how I can help you build something amazing.</p>
          </RevealOnScroll>
          
          <RevealOnScroll delay={200}>
            <div className={`${theme.card} p-10 rounded-[2.5rem] border ${theme.border} shadow-2xl text-left max-w-2xl mx-auto backdrop-blur-2xl`}>
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-xs font-bold uppercase mb-2 ${theme.textSub}`}>Name</label>
                    <input 
                      type="text" 
                      value={formName} 
                      onChange={(e) => setFormName(e.target.value)} 
                      className={`w-full p-4 rounded-xl bg-transparent border ${theme.border} focus:ring-2 focus:ring-${isDark ? 'emerald' : 'blue'}-500 outline-none transition ${theme.textMain}`} 
                      placeholder="Your name" 
                      required 
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase mb-2 ${theme.textSub}`}>Email</label>
                    <input 
                      type="email" 
                      value={formEmail} 
                      onChange={(e) => setFormEmail(e.target.value)} 
                      className={`w-full p-4 rounded-xl bg-transparent border ${theme.border} focus:ring-2 focus:ring-${isDark ? 'emerald' : 'blue'}-500 outline-none transition ${theme.textMain}`} 
                      placeholder="name@example.com" 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase mb-2 ${theme.textSub}`}>Message</label>
                  <textarea 
                    value={formMessage} 
                    onChange={(e) => setFormMessage(e.target.value)} 
                    className={`w-full p-4 rounded-xl bg-transparent border ${theme.border} focus:ring-2 focus:ring-${isDark ? 'emerald' : 'blue'}-500 outline-none transition min-h-[150px] ${theme.textMain}`} 
                    placeholder="Tell me about your project..." 
                    required
                  ></textarea>
                </div>
                <button className={`w-full py-5 rounded-xl font-bold text-white text-lg ${theme.accentBg} hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25`}>
                  <Send size={20} /> Send Message
                </button>
              </form>
            </div>
          </RevealOnScroll>
          
          <div className="mt-16 flex justify-center gap-8">
             <a href={`mailto:${personalInfo.email}`} className={`flex items-center gap-3 ${theme.textMain} font-medium hover:${theme.accent} transition scale-110`}>
                <Mail size={24} /> {personalInfo.email}
             </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className={`py-12 text-center text-sm ${theme.textSub} border-t ${theme.border} relative z-10`}>
        <p>&copy; {new Date().getFullYear()} {personalInfo.name}. Built with React & Tailwind.</p>
      </footer>

    </div>
  );
}
