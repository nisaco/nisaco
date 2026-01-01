import React, { useState, useEffect } from 'react';
import { 
  Github, Linkedin, Mail, ExternalLink, Code2, 
  Terminal, Database, Globe, Moon, Sun, Menu, X, 
  Send, User, Briefcase, FileText, Server, Cpu, Layers, GraduationCap
} from 'lucide-react';

// --- THEMES ---
const THEMES = {
  light: {
    bg: 'bg-gray-50',
    navBg: 'bg-white/80 backdrop-blur-md',
    textMain: 'text-gray-900',
    textSub: 'text-gray-600',
    accent: 'text-blue-600',
    accentBg: 'bg-blue-600',
    card: 'bg-white',
    border: 'border-gray-200',
    skillBg: 'bg-white'
  },
  dark: {
    bg: 'bg-slate-950',
    navBg: 'bg-slate-950/80 backdrop-blur-md',
    textMain: 'text-white',
    textSub: 'text-slate-400',
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500',
    card: 'bg-slate-900',
    border: 'border-slate-800',
    skillBg: 'bg-slate-800'
  }
};

export default function Portfolio() {
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
    email: "contact@jeffreypappoe.com",
    // Link your actual profile picture here (must be in client/public folder)
    avatar: "profile.jpg", 
    socials: {
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourusername",
      twitter: "https://twitter.com/yourusername"
    }
  };

  const skills = [
    { name: "React & Vite", icon: Globe, level: "Expert" },
    { name: "Node.js & Express", icon: Server, level: "Expert" },
    { name: "MongoDB & Atlas", icon: Database, level: "Advanced" },
    { name: "Payment Integrations", icon: CreditCard => <Briefcase size={20} />, level: "Expert" },
    { name: "API Development", icon: Terminal, level: "Advanced" },
    { name: "UI/UX Design", icon: Layers, level: "Intermediate" },
  ];

  const services = [
    { title: "Custom Web Development", desc: "Building responsive, high-performance websites tailored to your brand using modern technologies like React and Tailwind CSS.", icon: Globe },
    { title: "E-Commerce Solutions", desc: "Developing secure online stores with automated payment gateways (Paystack/Mobile Money) and inventory management.", icon: Briefcase },
    { title: "API Integration", desc: "Connecting your business systems with third-party services (SMS, Payments, Data Bundles) to automate workflows.", icon: Terminal },
    { title: "SaaS Development", desc: "Architecting scalable Software-as-a-Service platforms from database design to frontend deployment.", icon: Database },
  ];

  // --- LINK YOUR PROJECTS HERE ---
  const projects = [
    {
      title: "AJEnterprise",
      category: "Fintech Platform",
      desc: "A fully automated data reselling platform allowing users to buy bundles and airtime. Features include an Agent reseller system, real-time wallet funding via Paystack, and an Admin dashboard for sales tracking.",
      tech: ["React", "Node.js", "MongoDB", "Paystack API"],
      // Use your actual Render URL here
      link: "https://ajenterprise-datastore.onrender.com" 
    },
    {
      title: "Corporate Logistics Hub",
      category: "Business Website",
      desc: "A corporate presence for a logistics company featuring shipment tracking, service quotation forms, and a dynamic CMS for news updates.",
      tech: ["Next.js", "Tailwind", "Framer Motion"],
      link: "#" // Replace with actual link when ready
    },
    {
      title: "EduTrack System",
      category: "EdTech",
      desc: "Student management system for local schools to track attendance, grades, and fee payments with SMS notifications to parents.",
      tech: ["Vue.js", "Firebase", "Twilio API"],
      link: "#" // Replace with actual link when ready
    }
  ];

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.textMain} transition-colors duration-300 font-sans selection:bg-blue-500/30`}>
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 border-b ${theme.border} ${theme.navBg}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
            <div className={`w-8 h-8 rounded-lg ${theme.accentBg} flex items-center justify-center text-white font-mono shadow-lg`}>
              JP
            </div>
            <span>Jeffrey Pappoe</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
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
              className={`p-2 rounded-full border ${theme.border} hover:bg-gray-100 dark:hover:bg-slate-800 transition`}
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
      <section id="home" className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 min-h-screen">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.border} ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-50 text-blue-700'}`}>
            Full Stack Developer based in Ghana
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Building digital <span className={theme.accent}>solutions</span> for the modern web.
          </h1>
          <p className={`text-xl ${theme.textSub} max-w-lg mx-auto md:mx-0`}>
            {personalInfo.tagline} I specialize in creating seamless, automated platforms that drive business growth.
          </p>
          <div className="flex gap-4 justify-center md:justify-start pt-4">
            <button onClick={() => scrollTo('projects')} className={`${theme.accentBg} text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-blue-500/20`}>
              View My Work
            </button>
            <button onClick={() => scrollTo('contact')} className={`px-8 py-3 rounded-xl font-bold border ${theme.border} hover:bg-gray-100 dark:hover:bg-slate-800 transition`}>
              Contact Me
            </button>
          </div>
          
          <div className={`flex gap-6 justify-center md:justify-start pt-8 ${theme.textSub}`}>
            <a href={personalInfo.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-current transition hover:scale-110 transform duration-200"><Github size={24} /></a>
            <a href={personalInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-current transition hover:scale-110 transform duration-200"><Linkedin size={24} /></a>
            <a href={`mailto:${personalInfo.email}`} className="hover:text-current transition hover:scale-110 transform duration-200"><Mail size={24} /></a>
          </div>
        </div>
        
        {/* --- PROFILE PICTURE --- */}
        <div className="flex-1 flex justify-center relative">
          <div className={`w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-4 ${isDark ? 'border-slate-800' : 'border-white'} shadow-2xl relative z-10 bg-gradient-to-br from-blue-500 to-emerald-500`}>
             <img 
               src={personalInfo.avatar} 
               alt="Jeffrey Pappoe" 
               className="w-full h-full object-cover"
               onError={(e) => {
                   e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Jeffrey&backgroundColor=b6e3f4"; // Fallback if image fails
               }}
             />
          </div>
          <div className={`absolute top-0 right-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${theme.accentBg}`}></div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className={`py-20 px-6 ${isDark ? 'bg-slate-900/30' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            
            <div className="flex-1 space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    About Me <div className={`h-1 w-20 ${theme.accentBg} rounded-full`}></div>
                </h2>
                <div className={`text-lg ${theme.textSub} leading-relaxed space-y-4`}>
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
                
                <div className={`mt-6 p-4 rounded-xl border ${theme.border} ${theme.card} flex items-center gap-4`}>
                    <div className={`p-3 rounded-full ${isDark ? 'bg-slate-800 text-emerald-400' : 'bg-blue-50 text-blue-600'}`}>
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">University of Cape Coast</h4>
                        <p className={`text-sm ${theme.textSub}`}>BSc. Computer Science (Student)</p>
                    </div>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border ${theme.border} ${theme.card}`}>
                        <h4 className="font-bold text-2xl mb-1">2+</h4>
                        <p className={`text-sm ${theme.textSub}`}>Years Experience</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${theme.border} ${theme.card}`}>
                        <h4 className="font-bold text-2xl mb-1">3+</h4>
                        <p className={`text-sm ${theme.textSub}`}>Projects Delivered</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full">
                <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
                <div className="grid grid-cols-2 gap-4">
                    {skills.map((skill, index) => (
                        <div key={index} className={`flex items-center gap-3 p-4 rounded-xl border ${theme.border} ${theme.skillBg} hover:border-current hover:${theme.accent} transition duration-300`}>
                            <div className={`${isDark ? 'text-emerald-400' : 'text-blue-600'}`}>
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
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">My Services</h2>
            <p className={theme.textSub}>I help businesses grow with scalable software solutions.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className={`${theme.card} p-6 rounded-2xl border ${theme.border} hover:-translate-y-2 transition duration-300 shadow-sm hover:shadow-lg`}>
                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${isDark ? 'bg-slate-800 text-emerald-400' : 'bg-blue-50 text-blue-600'}`}>
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
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
            <p className={theme.textSub}>A selection of my recent work.</p>
          </div>
          <button className={`flex items-center gap-2 text-sm font-bold ${theme.accent} border-b-2 border-transparent hover:border-current transition`}>
            View GitHub <ExternalLink size={16} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <div key={i} className={`${theme.card} rounded-2xl border ${theme.border} overflow-hidden hover:shadow-2xl transition-all duration-300 group`}>
              <div className={`h-48 ${isDark ? 'bg-slate-800' : 'bg-gray-100'} flex items-center justify-center relative overflow-hidden`}>
                <Code2 size={48} className={`opacity-20 ${theme.textSub}`} />
                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                   <a href={project.link} target="_blank" rel="noopener noreferrer" className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition duration-300">View Project</a>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${theme.accent}`}>{project.category}</span>
                    <h3 className="text-xl font-bold mt-1">{project.title}</h3>
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
          <h2 className="text-3xl font-bold mb-4">Ready to start your next project?</h2>
          <p className={`mb-12 ${theme.textSub}`}>Reach out and let's discuss how I can help you build something amazing.</p>
          
          <div className={`${theme.card} p-8 rounded-3xl border ${theme.border} shadow-xl text-left max-w-xl mx-auto`}>
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
              <button className={`w-full py-4 rounded-xl font-bold text-white ${theme.accentBg} hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg`}>
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>
          
          <div className="mt-12 flex justify-center gap-8">
             <a href={`mailto:${personalInfo.email}`} className={`flex items-center gap-2 ${theme.textSub} hover:${theme.accent} transition`}>
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
