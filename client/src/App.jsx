import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { 
  LayoutDashboard, Wifi, History, LogOut, Menu, X, Wallet, 
  ChevronRight, ArrowUpRight, ArrowDownLeft, Smartphone, 
  Loader2, User, Eye, EyeOff, ShieldCheck, Box,
  TrendingUp, Users, CreditCard, Activity, Lock, Check, 
  AlertCircle, RefreshCw, Landmark, Palette, Store, Share2, DollarSign, CheckCircle, Download, Mail, PlusCircle,
  Moon, Sun, CheckSquare, HelpCircle, MessageSquare, ChevronDown, ChevronUp, Send, Reply, Phone, FileText, Settings as SettingsIcon, Copy, Search, Calendar,
  Briefcase, BarChart3, PieChart 
} from 'lucide-react';

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================
const API_BASE_URL = 'https://ajenterprise-datastore.onrender.com/api'; 
const PAYSTACK_KEY = "pk_live_3be2ebebc6edd6fa9f5f9a7303c80a55ee9e0be1"; 
const NETWORK_LOGOS = { 'MTN': 'mtn_logo.png', 'AirtelTigo': 'at_logo.png', 'Telecel': 'telecel_logo.png' };
const DEFAULT_COLOR = '#009879'; 

const PRESET_COLORS = [
  { name: 'Emerald', value: '#009879' }, { name: 'Blue', value: '#2563eb' },
  { name: 'Purple', value: '#7c3aed' }, { name: 'Rose', value: '#e11d48' },
  { name: 'Orange', value: '#ea580c' }, { name: 'Cyan', value: '#0891b2' },
  { name: 'Indigo', value: '#4f46e5' }, { name: 'Black', value: '#0f172a' },
];

const FAQS = [
    { q: "How long does delivery take?", a: "Data is sent instantly. Rare network delays can take 5 mins." },
    { q: "Transaction failed but money deducted?", a: "Your wallet is automatically refunded instantly. Check your Balance." },
    { q: "How do I fund my wallet?", a: "Click 'Fund Wallet'. Pay via Mobile Money or Card." },
    { q: "Can I resell data?", a: "Yes! Upgrade to 'Agent' (30 GHS) for wholesale prices." },
];

// ==========================================
// 2. GLOBAL HELPER FUNCTIONS
// ==========================================

function generateTheme(mode, accentColor) {
  const isDark = mode === 'dark';
  return {
    mode, accentColor,
    appBg: isDark ? 'bg-slate-950' : 'bg-slate-50', 
    cardBg: isDark ? 'bg-slate-900/80 backdrop-blur-md border-slate-800' : 'bg-white/80 backdrop-blur-md border-white/50',
    textMain: isDark ? 'text-slate-100' : 'text-slate-800', 
    textSub: isDark ? 'text-slate-400' : 'text-slate-500',
    border: isDark ? 'border-slate-800' : 'border-slate-200', 
    inputBg: isDark ? 'bg-slate-800/50' : 'bg-slate-50/80',
    hover: isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/80', 
    sidebar: isDark ? 'bg-slate-900/95 border-r border-slate-800' : 'bg-white/95 border-r border-slate-200',
    inactiveNav: isDark ? 'text-slate-400 hover:bg-slate-800/50' : 'text-slate-500 hover:bg-slate-50/80',
    successBadge: 'bg-green-100 text-green-700', 
    failedBadge: 'bg-red-100 text-red-700'
  };
}

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const fetchOptions = { ...options, credentials: 'include', headers: { 'Content-Type': 'application/json', ...options.headers } };
  try {
    const response = await fetch(url, fetchOptions);
    if (response.status === 401) return null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) return await response.json();
    return { success: true }; 
  } catch (error) { console.error(error); throw error; }
}

function detectNetwork(phone) {
    const p = phone.toString();
    if (['024', '054', '055', '059', '025', '053'].some(pre => p.startsWith(pre))) return 'MTN';
    if (['020', '050'].some(pre => p.startsWith(pre))) return 'Telecel';
    if (['027', '057', '026', '056'].some(pre => p.startsWith(pre))) return 'AirtelTigo';
    return null;
}

function vibrate() { if (navigator.vibrate) navigator.vibrate(10); }

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: true });
}

function timeAgo(date) {
    if (!date) return 'Never';
    try {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        return "Just now";
    } catch (e) { return 'Unknown'; }
}

// ==========================================
// 3. CONTEXTS & PROVIDERS
// ==========================================
const ThemeContext = createContext(null);
const ToastContext = createContext(null);

const globalStyles = `
  html, body, #root { height: 100%; width: 100%; margin: 0; padding: 0; overflow-x: hidden; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-100%) translateX(-50%); } to { opacity: 1; transform: translateY(0) translateX(-50%); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

  .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .animate-toast { animation: slideDown 0.4s ease-out forwards; }
  .animate-pulse-fast { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .animate-slide-in-right { animation: slideInRight 0.4s ease-out forwards; }
  .transition-all-300 { transition: all 0.3s ease-in-out; }
  .glass-card { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
`;

const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) return (msg, type) => alert(msg);
    return context;
};

const usePreventLeave = (isProcessing) => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isProcessing) { e.preventDefault(); e.returnValue = ""; return ""; }
    };
    if (isProcessing) window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isProcessing]);
};

const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        vibrate(); 
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    }, []);

    return (
        <ToastContext.Provider value={addToast}>
            {children}
            <div className="fixed top-6 left-1/2 z-[100] w-full max-w-sm pointer-events-none px-4">
                {toasts.map(t => (
                    <div key={t.id} className={`pointer-events-auto mb-3 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl animate-toast border backdrop-blur-xl transform -translate-x-1/2 ml-[50%] ${t.type === 'error' ? 'bg-red-500/90 text-white border-red-400/30' : 'bg-emerald-600/90 text-white border-emerald-400/30'}`}>
                        {t.type === 'error' ? <AlertCircle size={20} className="shrink-0"/> : <CheckCircle size={20} className="shrink-0"/>}
                        <p className="font-bold text-sm tracking-wide">{t.message}</p>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

// ==========================================
// 5. UI COMPONENTS
// ==========================================

const SkeletonCard = ({ theme }) => (
    <div className={`${theme.cardBg} border ${theme.border} rounded-2xl p-4 mb-3 animate-pulse-fast`}>
        <div className="flex justify-between items-center mb-3">
            <div className="h-4 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-full"></div>
            <div className="h-4 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-full"></div>
        </div>
        <div className="h-3 w-32 bg-slate-100/50 dark:bg-slate-800/50 rounded-full mb-2"></div>
    </div>
);

const TransactionCard = ({ tx, theme }) => {
    const isDeposit = tx.status === 'topup_successful';
    let netColor = 'bg-slate-300';
    const netUpper = (tx.network || '').toUpperCase();
    if (netUpper.includes('MTN')) netColor = 'bg-yellow-400';
    if (netUpper.includes('TELECEL')) netColor = 'bg-red-500';
    if (netUpper.includes('AIRTEL')) netColor = 'bg-blue-600';
    if (isDeposit) netColor = 'bg-emerald-500';

    const dateStr = new Date(tx.createdAt).toLocaleDateString();
    const timeStr = new Date(tx.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    return (
      <div className={`${theme.cardBg} border ${theme.border} rounded-2xl shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] mb-3 cursor-default group`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${netColor} transition-all duration-300 group-hover:w-2`}></div>
        <div className="p-4 pl-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className={`font-bold ${theme.textMain} text-lg flex items-center gap-2`}>
                        {isDeposit ? 'Wallet Deposit' : (tx.network || 'Data Bundle')}
                        {!isDeposit && <span className={`text-[10px] font-bold ${theme.textSub} px-2 py-0.5 ${theme.inputBg} rounded-full border ${theme.border}`}>{tx.dataPlan}</span>}
                    </h4>
                    <p className={`text-[10px] ${theme.textSub} font-mono mt-1 opacity-70 tracking-tight`}>ID: {tx.reference}</p>
                </div>
                <div className="text-right">
                    <p className={`font-bold text-xl ${isDeposit ? 'text-blue-500' : theme.textMain}`}>
                        {isDeposit ? '+' : '-'}GHS {tx.amount?.toFixed(2)}
                    </p>
                </div>
            </div>
            {!isDeposit && (
                <div className={`grid grid-cols-2 gap-y-3 gap-x-4 text-sm mb-4 border-t ${theme.border} pt-3 opacity-90`}>
                    <div>
                        <p className={`text-[10px] font-bold uppercase ${theme.textSub} mb-0.5 flex items-center gap-1 opacity-70`}><Smartphone size={10}/> Phone</p>
                        <p className={`font-mono font-medium ${theme.textMain} tracking-wide`}>{tx.phoneNumber}</p>
                    </div>
                    <div className="text-right">
                        <p className={`text-[10px] font-bold uppercase ${theme.textSub} mb-0.5 flex items-center justify-end gap-1 opacity-70`}><Calendar size={10}/> Date</p>
                        <p className={`font-medium ${theme.textMain}`}>{dateStr} <span className="text-[10px] opacity-70">{timeStr}</span></p>
                    </div>
                </div>
            )}
            <div className={`flex justify-between items-center ${isDeposit ? 'mt-1' : 'pt-1'}`}>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm ${tx.status === 'data_sent' || tx.status === 'success' || tx.status === 'topup_successful' ? 'bg-green-100 text-green-700' : tx.status === 'data_failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{tx.status}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${tx.paymentMethod === 'api_wallet' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : `${theme.inputBg} ${theme.textSub} ${theme.border}`}`}>{tx.paymentMethod === 'api_wallet' ? 'API' : 'WEB'}</span>
            </div>
        </div>
      </div>
    );
};

// ✅ UPDATED ADMIN CARD - Shows User Name Prominently
const AdminCard = ({ title, subTitle, detail, amount, badge, onAction, actionLabel, actionColor, theme }) => {
    let stripColor = 'bg-slate-400';
    if (badge?.text === 'data_sent' || badge?.text === 'Paid') stripColor = 'bg-green-500';
    else if (badge?.text === 'processing' || badge?.text === 'Pending') stripColor = 'bg-yellow-500';
    else if (badge?.text === 'data_failed') stripColor = 'bg-red-500';
    else if (badge?.color?.includes('slate')) stripColor = 'bg-blue-500';

    return (
        <div className={`${theme.cardBg} border ${theme.border} rounded-2xl shadow-sm relative overflow-hidden mb-4 transition-all duration-300 hover:shadow-lg active:scale-[0.98]`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stripColor}`}></div>
            <div className="p-5 pl-7">
                {/* Header: Title (User) & Amount */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <User size={16} className={`${theme.textSub} opacity-70`} />
                        <h4 className={`font-bold ${theme.textMain} text-lg tracking-tight`}>{title}</h4>
                    </div>
                    <div className="text-right">
                         <span className={`font-bold text-lg ${theme.textMain}`}>{amount}</span>
                    </div>
                </div>

                {/* Subtitle: Plan Info */}
                {detail && (
                    <div className={`text-sm font-medium ${theme.textMain} mb-2 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-lg inline-block border ${theme.border}`}>
                        {detail}
                    </div>
                )}

                {/* Footer: Date/Phone & Badge */}
                <div className={`flex justify-between items-center border-t ${theme.border} pt-3 mt-2`}>
                    <div className={`text-xs ${theme.textSub} font-medium flex flex-col`}>
                        <span className="opacity-90">{subTitle}</span>
                    </div>
                    {badge && <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${badge.color}`}>{badge.text}</span>}
                </div>

                {/* Action Button */}
                {onAction && (
                    <div className="pt-3 mt-1">
                        <button onClick={onAction} className={`w-full py-3 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all ${actionColor}`}>
                            {actionLabel}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const Button = ({ children, onClick, disabled = false, fullWidth = false, variant = 'primary', size = 'default' }) => {
  const { theme } = useContext(ThemeContext);
  const handleClick = (e) => { vibrate(); if(onClick) onClick(e); };
  const base = `rounded-xl font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-3.5'}`;
  const primaryStyle = variant === 'primary' ? { backgroundColor: theme.accentColor, color: 'white', boxShadow: `0 8px 20px -6px ${theme.accentColor}60` } : {};
  const variants = { primary: `hover:opacity-90 hover:-translate-y-0.5`, outline: `border-2 ${theme.border} ${theme.textSub} hover:border-current hover:bg-slate-50 dark:hover:bg-slate-800`, dark: "bg-slate-800 text-white hover:bg-slate-900 shadow-lg shadow-slate-900/20", danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30", success: "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30" };
  return <button onClick={handleClick} disabled={disabled} style={variant === 'primary' ? primaryStyle : {}} className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}>{children}</button>;
};

const Input = ({ label, type = "text", value, onChange, placeholder, icon: Icon, isPassword = false, isTextArea = false }) => {
  const { theme } = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const inputMode = type === 'tel' || type === 'number' ? 'decimal' : 'text';
  return (
    <div className="mb-5">
      {label && <label className={`block text-xs font-bold ${theme.textSub} uppercase mb-2 tracking-wider ml-1`}>{label}</label>}
      <div className="relative group">
        {Icon && <Icon className={`absolute left-3.5 top-3.5 ${theme.textSub} transition-colors group-hover:text-current`} size={20} />}
        {isTextArea ? (
             <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 ${theme.inputBg} border ${theme.border} rounded-2xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all duration-300 font-medium ${theme.textMain} placeholder:text-slate-400/50 shadow-sm`} style={{ '--tw-ring-color': theme.accentColor }} />
        ) : (
            <>
                <input type={isPassword ? (show ? "text" : "password") : type} inputMode={isPassword ? 'text' : inputMode} value={value} onChange={onChange} placeholder={placeholder} className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-10 py-3.5 ${theme.inputBg} border ${theme.border} rounded-2xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all duration-300 font-medium ${theme.textMain} placeholder:text-slate-400/50 shadow-sm`} style={{ '--tw-ring-color': theme.accentColor }} />
                {isPassword && <button type="button" onClick={() => setShow(!show)} className={`absolute right-3.5 top-3.5 ${theme.textSub} hover:${theme.textMain} transition-colors`}>{show ? <EyeOff size={20} /> : <Eye size={20} />}</button>}
            </>
        )}
      </div>
    </div>
  );
};

const ThemePickerModal = ({ isOpen, onClose }) => {
  const { theme, setMode, setAccentColor, mode, accentColor } = useContext(ThemeContext);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in-up">
      <div className={`${theme.cardBg} border ${theme.border} w-full max-w-sm p-6 rounded-3xl shadow-2xl relative animate-scale-in`}>
        <button onClick={onClose} className={`absolute top-4 right-4 ${theme.textSub} hover:${theme.textMain} transition-colors`}><X size={20}/></button>
        <h3 className={`text-xl font-bold mb-6 ${theme.textMain} flex items-center gap-2`}><Palette size={20}/> Appearance</h3>
        <div className="mb-6"><label className={`block text-xs font-bold ${theme.textSub} uppercase mb-3 tracking-wider`}>Display Mode</label><div className={`flex ${theme.inputBg} p-1.5 rounded-2xl border ${theme.border}`}><button onClick={() => setMode('light')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${mode === 'light' ? 'bg-white text-black shadow-sm' : theme.textSub}`}><Sun size={16}/> Light</button><button onClick={() => setMode('dark')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${mode === 'dark' ? 'bg-slate-700 text-white shadow-sm' : theme.textSub}`}><Moon size={16}/> Dark</button></div></div>
        <div><label className={`block text-xs font-bold ${theme.textSub} uppercase mb-3 tracking-wider`}>Accent Color</label><div className="grid grid-cols-4 gap-3 mb-4">{PRESET_COLORS.map((c) => (<button key={c.value} onClick={() => setAccentColor(c.value)} className={`h-11 rounded-full transition-all duration-300 active:scale-90 hover:scale-110 flex items-center justify-center ring-2 ring-offset-2 ${theme.mode === 'dark' ? 'ring-offset-slate-900' : 'ring-offset-white'}`} style={{ backgroundColor: c.value, borderColor: c.value, ringColor: accentColor === c.value ? c.value : 'transparent' }}>{accentColor === c.value && <Check size={18} className="text-white font-bold"/>}</button>))}</div><label className={`block text-xs font-bold ${theme.textSub} uppercase mb-2 tracking-wider`}>Custom Hex Code</label><div className="flex gap-2"><div className="h-11 w-11 rounded-xl border-2 transition-colors duration-300" style={{ backgroundColor: accentColor, borderColor: theme.border }}></div><input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className={`flex-1 ${theme.inputBg} ${theme.textMain} border ${theme.border} rounded-xl px-4 font-mono text-sm uppercase transition-colors outline-none focus:ring-2`} style={{ '--tw-ring-color': accentColor }} /></div></div>
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800"><Button fullWidth onClick={onClose}>Done</Button></div>
      </div>
    </div>
  );
};

// ==========================================
// 6. MAIN APP SCREENS
// ==========================================

const Settings = ({ user, refreshUser }) => {
  const { theme } = useContext(ThemeContext);
  const showToast = useToast();
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiCall('/user/update-profile', { method: 'POST', body: JSON.stringify({ newUsername }) });
      if (res && res.success) { showToast("Username updated!"); refreshUser(); }
      else { showToast(res?.message || "Failed to update", "error"); }
    } catch(e) { showToast("Network Error", "error"); }
    setLoading(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return showToast("New passwords do not match", "error");
    setLoading(true);
    try {
      const res = await apiCall('/user/change-password', { method: 'POST', body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }) });
      if (res && res.success) { showToast("Password changed!"); setPasswords({ current: '', new: '', confirm: '' }); } 
      else { showToast(res?.message || "Failed to change password", "error"); }
    } catch(e) { showToast("Network Error", "error"); }
    setLoading(false);
  };

  return (
     <div className="max-w-2xl mx-auto pb-24 animate-slide-in-right space-y-6">
        <div className={`${theme.cardBg} border ${theme.border} p-8 rounded-3xl shadow-sm transition-all hover:shadow-lg`}>
           <div className="flex items-center gap-4 mb-6">
               <div className="p-3.5 bg-blue-100 text-blue-600 rounded-2xl"><User size={24}/></div>
               <div><h3 className={`font-bold ${theme.textMain} text-xl`}>Profile Settings</h3><p className={`text-sm ${theme.textSub}`}>Update your personal information</p></div>
           </div>
           <form onSubmit={handleUpdateProfile}>
              <Input label="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
              <Button fullWidth disabled={loading || newUsername === user?.username}>Update Username</Button>
           </form>
        </div>
        <div className={`${theme.cardBg} border ${theme.border} p-8 rounded-3xl shadow-sm transition-all hover:shadow-lg`}>
           <div className="flex items-center gap-4 mb-6">
               <div className="p-3.5 bg-orange-100 text-orange-600 rounded-2xl"><Lock size={24}/></div>
               <div><h3 className={`font-bold ${theme.textMain} text-xl`}>Security</h3><p className={`text-sm ${theme.textSub}`}>Keep your account safe</p></div>
           </div>
           <form onSubmit={handleUpdatePassword}>
              <Input label="Current Password" isPassword value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} />
              <Input label="New Password" isPassword value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
              <Input label="Confirm New Password" isPassword value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
              <Button fullWidth variant="dark" disabled={loading || !passwords.current || !passwords.new}>Change Password</Button>
           </form>
        </div>
     </div>
  );
};

const PrivacyPolicy = () => { const { theme } = useContext(ThemeContext); return (<div className="max-w-4xl mx-auto pb-24 animate-slide-in-right space-y-6"><div className={`${theme.cardBg} border ${theme.border} p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow`}><div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800"><div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><ShieldCheck size={32}/></div><div><h1 className={`text-2xl font-bold ${theme.textMain}`}>Privacy Policy</h1><p className={`text-sm ${theme.textSub}`}>We prioritize your data security.</p></div></div><p className={`leading-relaxed ${theme.textMain}`}>We collect minimal data to provide services. We do not share your data.</p></div></div>); };

const HelpCenter = () => { 
    const { theme } = useContext(ThemeContext); 
    const [openIndex, setOpenIndex] = useState(null);
    const toggleFaq = (index) => setOpenIndex(openIndex === index ? null : index);
    return (
        <div className="max-w-4xl mx-auto pb-24 animate-slide-in-right space-y-8">
            <div className={`${theme.cardBg} border ${theme.border} p-10 rounded-3xl text-center shadow-lg`}>
                <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: theme.accentColor }}><HelpCircle size={40}/></div>
                <h1 className={`text-3xl font-bold ${theme.textMain} mb-3`}>Help & Support</h1>
                <p className={`${theme.textSub} mb-8 text-lg`}>Need assistance? Chat with us directly on WhatsApp.</p>
                <Button onClick={()=>window.open('https://wa.me/233572992838')}><Phone size={20}/> Chat with Admin</Button>
            </div>
            <div className="space-y-4">
                <h3 className={`font-bold ${theme.textMain} text-xl flex items-center gap-3 mb-4 px-2`}><MessageSquare size={20}/> FAQ</h3>
                {FAQS.map((faq, idx) => ( 
                    <div key={idx} className={`${theme.cardBg} border ${theme.border} rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md`}>
                        <button onClick={() => toggleFaq(idx)} className={`w-full p-5 text-left flex justify-between items-center font-bold ${theme.textMain} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}>{faq.q}{openIndex === idx ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}</button>
                        {openIndex === idx && <div className={`p-5 pt-0 text-sm ${theme.textSub} leading-relaxed animate-fade-in-up`}>{faq.a}</div>}
                    </div> 
                ))}
            </div>
        </div>
    ); 
};

const PublicShop = () => {
  const { theme } = useContext(ThemeContext);
  const showToast = useToast();
  const [shopData, setShopData] = useState(null);
  const [plans, setPlans] = useState({ MTN: [], AirtelTigo: [], Telecel: [] });
  const [network, setNetwork] = useState('MTN');
  const [planId, setPlanId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false); 
  const [fetching, setFetching] = useState(true);
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  usePreventLeave(loading);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get('shop');
    if (!shopId) { setErrorMsg("No Shop ID provided."); setFetching(false); return; }
    apiCall(`/shop-details/${shopId}`).then(res => {
        if (res && res.shopName) {
          setShopData(res);
          const newPlans = {};
          if (res.basePrices) {
              Object.keys(res.basePrices).forEach(net => {
                newPlans[net] = res.basePrices[net].map(p => {
                  const uniqueKey = `${net}_${p.id}`;
                  const customPrice = res.customPrices && (res.customPrices[uniqueKey] || res.customPrices[p.id]);
                  return { ...p, price: customPrice ? parseFloat(customPrice) : p.price };
                });
              });
              setPlans(newPlans);
          }
        } else { setErrorMsg("Shop not found."); }
      }).catch(() => setErrorMsg("Could not load shop."))
      .finally(() => setFetching(false));
  }, []);

  const currentPlans = plans[network] || []; 
  const selectedPlan = currentPlans.find(p => p.id === planId);
  const feeRate = 0.02; 
  const basePrice = selectedPlan?.price || 0;
  const totalCharge = basePrice + (basePrice > 0 ? (basePrice * feeRate) : 0); 

  const handlePaystack = async (e) => {
    e.preventDefault(); 
    if (!planId || phone.length < 10) return; 
    if (!window.PaystackPop) { showToast("Payment system loading...", "error"); return; }
    const handler = window.PaystackPop.setup({ 
        key: PAYSTACK_KEY, email: "customer@ajenterprise.com", amount: Math.ceil(totalCharge * 100), currency: 'GHS', 
        callback: function(response) { 
            setLoading(true); 
            (async () => { 
                const params = new URLSearchParams(window.location.search);
                const shopId = params.get('shop');
                try { 
                    const res = await apiCall('/purchase-direct', { method: 'POST', body: JSON.stringify({ network, planId, phone, reference: response.reference, shopId, customerFee: basePrice * feeRate }) }); 
                    if (res.status === 'success') { 
                        setPurchaseSuccess({ reference: response.reference, plan: selectedPlan.name, amount: totalCharge, phone: phone }); 
                        showToast("Order Successful!");
                    } else { showToast("Payment received but delivery failed.", "error"); } 
                } catch(e) { showToast("Error sending data.", "error"); } 
                setLoading(false); 
            })(); 
        }, onClose: () => showToast("Transaction Cancelled", "error") 
    }); 
    handler.openIframe();
  };

  const handlePhoneChange = (e) => {
      const val = e.target.value.replace(/\s/g, ''); 
      setPhone(val);
      if (val.length === 3) {
          const detected = detectNetwork(val);
          if (detected && detected !== network) {
              setNetwork(detected);
              setPlanId(''); 
              showToast(`Network switched to ${detected}`);
              vibrate();
          }
      }
  };

  if (fetching) return <div className={`min-h-screen flex flex-col items-center justify-center ${theme.appBg} ${theme.textMain}`}><Loader2 className="animate-spin mb-4" size={40} style={{ color: theme.accentColor }} /><h2 className="text-xl font-bold animate-pulse">Loading Shop...</h2></div>;
  if (errorMsg) return <div className={`min-h-screen flex items-center justify-center ${theme.appBg} ${theme.textMain}`}><div className="text-center p-8 bg-white/5 rounded-3xl border border-red-200 animate-scale-in"><AlertCircle size={48} className="mx-auto mb-4 text-red-500"/><h2 className="text-xl font-bold mb-2">{errorMsg}</h2></div></div>;

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme.appBg} p-4 transition-colors duration-300`}>
      <button onClick={() => setShowThemeModal(true)} className={`absolute top-4 right-4 p-3 rounded-full ${theme.cardBg} shadow-lg ${theme.textMain} border ${theme.border}`}><Palette size={20}/></button>
      <ThemePickerModal isOpen={showThemeModal} onClose={() => setShowThemeModal(false)} />
      {purchaseSuccess ? ( 
        <div className={`${theme.cardBg} w-full max-w-md p-8 rounded-3xl shadow-xl border ${theme.border} text-center animate-scale-in`}>
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"><CheckCircle size={32} /></div>
            <h2 className={`text-2xl font-bold ${theme.textMain} mb-2`}>Order Successful!</h2>
            <div className={`${theme.inputBg} p-4 rounded-xl text-left space-y-3 mb-6 border ${theme.border}`}>
                <div className="flex justify-between text-sm"><span className={theme.textSub}>Bundle:</span><span className={`font-bold ${theme.textMain}`}>{purchaseSuccess.plan}</span></div>
                <div className="flex justify-between text-sm"><span className={theme.textSub}>Recipient:</span><span className={`font-bold ${theme.textMain}`}>{purchaseSuccess.phone}</span></div>
                <div className="flex justify-between text-sm"><span className={theme.textSub}>Paid:</span><span className={`font-bold ${theme.textMain}`}>GHS {purchaseSuccess.amount.toFixed(2)}</span></div>
            </div>
            <Button fullWidth onClick={() => { setPurchaseSuccess(null); setPhone(''); setPlanId(''); }}>Buy Another Bundle</Button>
        </div> 
      ) : ( 
        <div className={`${theme.cardBg} w-full max-w-md p-8 rounded-3xl shadow-2xl border ${theme.border} animate-fade-in-up`}>
            <div className="text-center mb-8"><img src="apple-touch-icon.png" alt="Logo" className="w-20 h-20 mx-auto mb-4 object-contain rounded-2xl shadow-md" /><h1 className={`text-3xl font-bold ${theme.textMain}`}>{shopData.shopName}</h1></div>
            <div className="grid grid-cols-3 gap-3 mb-6">{Object.keys(plans).map((net) => ( <button key={net} onClick={() => { setNetwork(net); setPlanId(''); vibrate(); }} className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${network === net ? `border-current bg-opacity-10 scale-105 shadow-md` : `${theme.border} hover:opacity-80 hover:scale-105`}`} style={network === net ? { borderColor: theme.accentColor, color: theme.accentColor } : {}}> <img src={NETWORK_LOGOS[net]} alt={net} className="h-12 w-auto object-contain drop-shadow-sm" /> </button> ))}</div>
            <form onSubmit={handlePaystack} className="space-y-6">
                <div><label className={`block text-xs font-bold ${theme.textSub} uppercase mb-2 tracking-wider ml-1`}>Select Plan</label><select value={planId} onChange={(e) => setPlanId(e.target.value)} className={`w-full p-4 ${theme.inputBg} border ${theme.border} rounded-2xl outline-none font-medium ${theme.textMain} transition-all duration-300 focus:ring-2 shadow-sm`} required><option value="" disabled>Select a bundle...</option>{currentPlans.map(p => <option key={p.id} value={p.id}>{p.name} - GHS {p.price.toFixed(2)}</option>)}</select></div>
                <Input label="Phone Number" type="tel" value={phone} onChange={handlePhoneChange} placeholder="0541234567" icon={Smartphone} />
                {selectedPlan && (<div className={`${theme.inputBg} p-5 rounded-2xl border ${theme.border} text-sm space-y-3 animate-fade-in-up`}><div className={`flex justify-between ${theme.textSub}`}><span>Bundle Price:</span><span className="font-bold">GHS {basePrice.toFixed(2)}</span></div><div className={`flex justify-between ${theme.textSub} text-xs`}><span>Transaction Fee (2%):</span><span>+ GHS {feeAmount.toFixed(2)}</span></div><div className={`border-t ${theme.border} pt-3 flex justify-between items-center`}><span className={`font-bold ${theme.textMain} text-lg`}>Total:</span><span className={`font-bold text-xl`} style={{ color: theme.accentColor }}>GHS {totalCharge.toFixed(2)}</span></div></div>)}
                <Button fullWidth disabled={loading || !selectedPlan} onClick={handlePaystack}>{loading ? <Loader2 className="animate-spin" /> : `Pay GHS ${totalCharge.toFixed(2)}`}</Button>
            </form>
            <div className="mt-6 text-center text-xs text-gray-400 font-medium tracking-wide">Powered by AJEnterprise</div>
        </div> 
      )}
    </div>
  );
};

const Dashboard = ({ user, transactions, setView, onTopUp, refreshUser, loadingHistory }) => {
  const { theme } = useContext(ThemeContext);
  const showToast = useToast();
  const handleUpgrade = () => { if (!window.PaystackPop) { showToast("Payment system initializing.", "error"); return; } const handler = window.PaystackPop.setup({ key: PAYSTACK_KEY, email: user.email || "upgrade@ajenterprise.com", amount: 30 * 100, currency: 'GHS', callback: function(response) { (async () => { const apiRes = await apiCall('/upgrade-agent', { method: 'POST', body: JSON.stringify({ reference: response.reference }) }); if(apiRes && apiRes.success) { showToast("Upgrade Successful!"); refreshUser(); window.location.reload(); } })(); }, onClose: function() { showToast("Transaction Cancelled", "error"); } }); handler.openIframe(); };

  const balance = user?.walletBalance || 0;
  const role = user?.role || 'Client';

  useEffect(() => { window.scrollTo(0,0); }, []);

  return (
    <div className="space-y-8 animate-slide-in-right pb-24">
      <div className="rounded-3xl p-8 text-white shadow-xl relative overflow-hidden transition-transform duration-300 hover:scale-[1.01]" style={{ backgroundColor: theme.accentColor }}>
        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div><p className="opacity-90 font-medium mb-1 text-sm md:text-base uppercase tracking-wider">Wallet Balance</p><h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">GHS {(balance / 100).toFixed(2)}</h1></div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/30 animate-pulse">{role === 'Agent' ? '⚡ AGENT' : (role === 'Admin' ? '🛡️ ADMIN' : '👤 CLIENT')}</div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-8">
            <button onClick={onTopUp} className="bg-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all duration-300 shadow-lg active:scale-95" style={{ color: theme.accentColor }}><Wallet size={20} /> Fund Wallet</button>
            <button onClick={() => { setView('history'); vibrate(); }} className="bg-black/20 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-black/30 transition-all duration-300 border border-white/20 backdrop-blur-md active:scale-95">History</button>
            {role === 'Client' && (<button onClick={handleUpgrade} className="bg-black/20 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-black/30 transition-all duration-300 border border-white/20 backdrop-blur-md active:scale-95">Become Agent (30 GHS)</button>)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <button onClick={() => { setView('purchase'); vibrate(); }} className={`${theme.cardBg} border ${theme.border} p-6 rounded-3xl shadow-sm flex items-center gap-5 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}><div className="w-16 h-16 rounded-2xl bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm" style={{ backgroundColor: `${theme.accentColor}20`, color: theme.accentColor }}><Wifi size={32} /></div><div><h3 className={`font-bold ${theme.textMain} text-xl`}>Buy Data</h3><p className={`${theme.textSub} text-sm mt-1`}>Instant Delivery</p></div><ChevronRight className={`ml-auto ${theme.textSub} opacity-50 group-hover:translate-x-1 transition-transform`} /></button>
        {role === 'Agent' && (<button onClick={() => { setView('shop'); vibrate(); }} className={`${theme.cardBg} border ${theme.border} p-6 rounded-3xl shadow-sm flex items-center gap-5 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}><div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm"><Store size={32} /></div><div><h3 className={`font-bold ${theme.textMain} text-xl`}>My Shop</h3><p className={`${theme.textSub} text-sm mt-1`}>Manage & Profit</p></div><ChevronRight className={`ml-auto ${theme.textSub} opacity-50 group-hover:translate-x-1 transition-transform`} /></button>)}
      </div>
      <div>
        <div className="flex justify-between items-center mb-5"><h3 className={`text-xl font-bold ${theme.textMain}`}>Recent Activity</h3></div>
        <div className="space-y-3 md:hidden">
            {loadingHistory ? Array(3).fill(0).map((_,i) => <SkeletonCard key={i} theme={theme} />) : (
                transactions.length > 0 ? transactions.slice(0, 5).map((tx) => <TransactionCard key={tx._id} tx={tx} theme={theme} />) : <div className={`p-10 text-center ${theme.textSub} text-sm ${theme.cardBg} rounded-3xl border ${theme.border}`}>No recent transactions</div>
            )}
        </div>
        <div className={`hidden md:block ${theme.cardBg} rounded-3xl border ${theme.border} shadow-sm overflow-hidden`}>
          {loadingHistory ? <div className="p-8 text-center">Loading...</div> : (
              transactions.length > 0 ? transactions.slice(0, 5).map((tx) => (<div key={tx._id} className={`p-5 border-b ${theme.border} flex items-center justify-between last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}><div className="flex items-center gap-5"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.status === 'data_sent' ? theme.successBadge : theme.inputBg}`}>{tx.status === 'data_sent' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}</div><div><p className={`font-bold ${theme.textMain} text-base`}>{tx.dataPlan || 'Transaction'}</p><p className={`text-xs ${theme.textSub} mt-0.5`}>{formatDateTime(tx.createdAt)}</p></div></div><p className={`font-bold text-base ${theme.textMain}`}>GHS {tx.amount?.toFixed(2)}</p></div>)) : <div className={`p-8 text-center ${theme.textSub} text-sm`}>No recent transactions</div>
          )}
        </div>
      </div>
    </div>
  );
};

const Purchase = ({ refreshUser }) => {
  const { theme } = useContext(ThemeContext);
  const showToast = useToast();
  const [plans, setPlans] = useState({ MTN: [], AirtelTigo: [], Telecel: [] });
  const [network, setNetwork] = useState('MTN'); const [planId, setPlanId] = useState(''); const [phone, setPhone] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  useEffect(() => { window.scrollTo(0,0); }, []);
  usePreventLeave(loading);
  useEffect(() => { apiCall('/data-plans').then(data => { if(data && data.plans) setPlans(data.plans); }).catch(err => console.log("Plan fetch error:", err)); }, []);
  
  const handleBuy = async (e) => { e.preventDefault(); if (!planId || phone.length < 10) return; setLoading(true); setError(''); try { const res = await apiCall('/purchase', { method: 'POST', body: JSON.stringify({ network, planId, phone }) }); if (res && res.status === 'success') { showToast("Order Successful!"); setPhone(''); refreshUser(); } else { throw new Error(res?.message || "Transaction Failed"); } } catch (err) { setError(err.message); } finally { setLoading(false); } };
  
  const handlePhoneChange = (e) => {
      const val = e.target.value.replace(/\s/g, ''); 
      setPhone(val);
      if (val.length === 3) {
          const detected = detectNetwork(val);
          if (detected && detected !== network) {
              setNetwork(detected);
              setPlanId(''); 
              showToast(`Network switched to ${detected}`);
              vibrate();
          }
      }
  };

  const currentPlans = plans[network] || []; const selectedPlan = currentPlans.find(p => p.id === planId);
  return (
    <div className="max-w-xl mx-auto animate-slide-in-right pb-24">
      <div className={`${theme.cardBg} border ${theme.border} p-8 rounded-3xl shadow-lg transition-all duration-300`}><h2 className={`text-3xl font-bold mb-8 ${theme.textMain}`}>Buy Data</h2>{error && <div className={`p-4 mb-6 rounded-2xl text-sm font-bold ${theme.failedBadge} animate-scale-in`}>{error}</div>}<div className="grid grid-cols-3 gap-4 mb-8">{Object.keys(plans).length > 0 ? Object.keys(plans).map((net) => ( <button key={net} onClick={() => { setNetwork(net); setPlanId(''); vibrate(); }} className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${network === net ? `border-current bg-opacity-10 scale-105 shadow-md` : `${theme.border} hover:opacity-80 hover:scale-105`}`} style={network === net ? { borderColor: theme.accentColor, color: theme.accentColor } : {}}> <img src={NETWORK_LOGOS[net]} alt={net} className="h-12 w-auto object-contain drop-shadow-sm" /> </button> )) : <div className={`col-span-3 text-center py-6 ${theme.textSub}`}>Loading plans...</div>}</div><form onSubmit={handleBuy} className="space-y-6"><div><label className={`block text-xs font-bold ${theme.textSub} uppercase mb-2 tracking-wider ml-1`}>Select Plan</label><select value={planId} onChange={(e) => setPlanId(e.target.value)} className={`w-full p-4 ${theme.inputBg} border ${theme.border} rounded-2xl outline-none font-medium ${theme.textMain} transition-all duration-300 focus:ring-2 shadow-sm`} required><option value="" disabled>Select a bundle...</option>{currentPlans.map(p => <option key={p.id} value={p.id}>{p.name} - GHS {p.price.toFixed(2)}</option>)}</select></div><Input label="Phone Number" type="tel" value={phone} onChange={handlePhoneChange} placeholder="0541234567" icon={Smartphone} /><Button fullWidth disabled={loading || !selectedPlan} onClick={handleBuy}>{loading ? <Loader2 className="animate-spin" /> : `Pay GHS ${selectedPlan?.price.toFixed(2) || '0.00'}`}</Button></form></div>
    </div>
  );
};

const AgentShopManager = ({ user, refreshUser }) => {
  const { theme } = useContext(ThemeContext);
  const showToast = useToast();
  const [shopName, setShopName] = useState(''); const [shopId, setShopId] = useState(user?.shopId || ''); const [prices, setPrices] = useState({}); const [basePrices, setBasePrices] = useState({}); const [loading, setLoading] = useState(false); const [withdrawAmount, setWithdrawAmount] = useState(''); const [momoDetails, setMomoDetails] = useState({ number: '', name: '', network: 'MTN' });
  
  useEffect(() => { window.scrollTo(0,0); }, []);
  useEffect(() => { if (user?.shopId) { apiCall(`/shop-details/${user.shopId}`).then(res => { if(res) { setShopName(res.shopName); setPrices(res.customPrices || {}); setBasePrices(res.basePrices || {}); } }); } else { apiCall('/data-plans').then(res => setBasePrices(res.plans || {})); } }, [user?.shopId]);
  const handleSaveShop = async () => { if (!shopId) return showToast("Please enter a Shop ID", "error"); setLoading(true); const cleanShopId = shopId.toLowerCase().replace(/\s+/g, '-'); await apiCall('/agent/setup-shop', { method: 'POST', body: JSON.stringify({ shopName, shopId: cleanShopId, customPrices: prices }) }); showToast(`Shop Saved!`); setShopId(cleanShopId); refreshUser(); setLoading(false); };
  
  const handleWithdraw = async (e) => { 
      e.preventDefault(); 
      const balance = (user?.payoutWalletBalance || 0) / 100;
      if(balance < 30) return showToast("Min withdrawal is 30 GHS", "error");
      if(parseFloat(withdrawAmount) < 30) return showToast("Min amount is 30 GHS", "error");
      if(parseFloat(withdrawAmount) > balance) return showToast("Insufficient funds", "error"); 

      await apiCall('/withdraw', { method: 'POST', body: JSON.stringify({ amount: withdrawAmount, accountNumber: momoDetails.number, accountName: momoDetails.name, network: momoDetails.network }) }); 
      showToast("Request Sent!"); 
      refreshUser(); 
  };
  
  const copyLink = () => { navigator.clipboard.writeText(`${window.location.origin}/?shop=${shopId}`); vibrate(); showToast("Link Copied!"); };
  const handleShopIdChange = (e) => { const val = e.target.value.toLowerCase().replace(/\s+/g, '-'); setShopId(val); };

  return (
    <div className="pb-24 space-y-8 animate-slide-in-right">
       <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-3xl p-8 text-white shadow-xl transition-transform hover:scale-[1.01]">
           <p className="text-purple-200 text-sm uppercase tracking-widest font-bold">Commission Wallet</p>
           <h1 className="text-5xl font-extrabold mt-2 mb-6">GHS {((user?.payoutWalletBalance || 0) / 100).toFixed(2)}</h1>
           <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20">
               <h3 className="font-bold mb-4 text-sm flex items-center gap-2"><DollarSign size={16}/> Withdraw Funds (Min 30 GHS)</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <input placeholder="Amount" type="number" value={withdrawAmount} onChange={e=>setWithdrawAmount(e.target.value)} className="p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/50 outline-none focus:bg-white/30 transition shadow-inner" />
                   <input placeholder="Momo Number" value={momoDetails.number} onChange={e=>setMomoDetails({...momoDetails, number: e.target.value})} className="p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/50 outline-none focus:bg-white/30 transition shadow-inner" />
               </div>
               <Button size="sm" fullWidth onClick={handleWithdraw}>Withdraw Now</Button>
           </div>
       </div>
       
       <div className={`${theme.cardBg} border ${theme.border} p-8 rounded-3xl shadow-sm`}>
           <h2 className={`text-2xl font-bold mb-6 ${theme.textMain}`}>Shop Settings</h2>
           <Input label="Shop Name" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="My Data Shop" />
           <div className="mb-6"><label className={`block text-xs font-bold ${theme.textSub} uppercase mb-2 tracking-wider ml-1`}>Shop ID (Link Slug)</label><input type="text" value={shopId} onChange={handleShopIdChange} placeholder="unique-shop-name" className={`w-full pl-4 pr-10 py-3.5 ${theme.inputBg} border ${theme.border} rounded-2xl focus:ring-2 focus:ring-opacity-50 outline-none transition font-medium ${theme.textMain} placeholder:text-slate-400/50 shadow-sm`} style={{ '--tw-ring-color': theme.accentColor }} /><p className="text-xs mt-2 text-blue-500 font-medium">Your link: {window.location.origin}/?shop={shopId || '...'}</p></div>{user?.shopId && (<div className="flex gap-2 mb-8 items-center bg-slate-100 p-3 rounded-2xl dark:bg-slate-800"><input disabled value={`${window.location.origin}/?shop=${shopId}`} className={`flex-1 bg-transparent ${theme.textSub} text-xs px-2 font-mono`} /><Button size="sm" onClick={copyLink}><Share2 size={18}/></Button></div>)}<h3 className={`font-bold mt-8 mb-6 ${theme.textMain} text-xl`}>Price Management</h3>
           
           <div className="space-y-6">
             {Object.keys(basePrices).map(net => (
               <div key={net}>
                 <h4 className={`text-xs font-bold uppercase ${theme.textSub} mb-3 tracking-widest`}>{net}</h4>
                 <div className="grid grid-cols-2 gap-4">
                   {basePrices[net].map(plan => {
                     const uniqueKey = `${net}_${plan.id}`; 
                     return (
                       <div key={plan.id} className={`p-4 border ${theme.border} rounded-2xl flex flex-col gap-2 hover:border-blue-400 transition-colors shadow-sm`}>
                         <div className="flex justify-between items-center">
                           <span className={`font-bold text-sm ${theme.textMain}`}>{plan.name}</span>
                           <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Cost: {plan.price}</span>
                         </div>
                         <input type="number" placeholder="Selling Price" value={prices[uniqueKey] || ''} onChange={(e) => setPrices({ ...prices, [uniqueKey]: e.target.value })} className={`w-full p-2.5 text-right border ${theme.border} rounded-xl ${theme.inputBg} ${theme.textMain} text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none`} />
                       </div>
                     );
                   })}
                 </div>
               </div>
             ))}
           </div>
           <div className="mt-8"><Button fullWidth onClick={handleSaveShop} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button></div></div>
    </div>
  );
};

// --- REWRITTEN ADMIN DASHBOARD (RESPONSIVE CARDS) ---
const AdminDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const showToast = useToast();
  const [metrics, setMetrics] = useState(null); 
  const [allOrders, setAllOrders] = useState([]); 
  const [withdrawals, setWithdrawals] = useState([]); 
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [activeTab, setActiveTab] = useState('overview'); 
  const [searchTerm, setSearchTerm] = useState(''); 

  const fetchData = async () => { try { const mRes = await apiCall('/admin/metrics'); if (mRes) setMetrics(mRes); const oRes = await apiCall('/admin/all-orders'); if (oRes) setAllOrders(oRes.orders); const wRes = await apiCall('/admin/withdrawals'); if (wRes) setWithdrawals(wRes.withdrawals); const uRes = await apiCall('/admin/users'); if (uRes) setUsers(uRes.users); } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); const interval = setInterval(fetchData, 10000); return () => clearInterval(interval); }, []);

  const handleStatusUpdate = async (orderId, newStatus) => { if(!window.confirm(`Change status to ${newStatus}?`)) return; try { const res = await apiCall('/admin/update-order', { method: 'POST', body: JSON.stringify({ id: orderId, status: newStatus }) }); if (res && res.success) { showToast("Updated"); fetchData(); } } catch(e) {} };
  const handlePayWithdrawal = async (id) => { if(!confirm("Mark as Paid?")) return; await apiCall('/admin/approve-withdrawal', { method: 'POST', body: JSON.stringify({ id }) }); showToast("Approved"); fetchData(); };
  const handleManualFund = async (userId) => { const amount = prompt("Enter amount (GHS):"); if (!amount) return; const adminSecret = prompt("Admin Secret:"); if (!adminSecret) return showToast("Required!", "error"); try { const res = await apiCall('/admin/credit-wallet', { method: 'POST', body: JSON.stringify({ userId, amount, adminSecret }) }); if(res && res.success) { showToast("Funded!"); fetchData(); } else { showToast(res?.message || 'Error', "error"); } } catch(e) { showToast("Error", "error"); } };

  const filteredUsers = users.filter(u => u?.username && u.username.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredOrders = allOrders.filter(o => (o?.reference && o.reference.toLowerCase().includes(searchTerm.toLowerCase())));
  
  if (loading && !metrics) return <div className="min-h-screen flex items-center justify-center" style={{ color: theme.accentColor }}><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="space-y-8 animate-fade-in-up pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3"><div className="p-3 bg-red-100 text-red-600 rounded-2xl shadow-sm"><Lock size={24} /></div><h2 className={`text-3xl font-bold ${theme.textMain}`}>Admin Portal</h2></div>
        {(activeTab === 'users' || activeTab === 'orders') && (
            <div className={`relative flex-1 max-w-md`}>
                <Search className={`absolute left-3.5 top-3 ${theme.textSub}`} size={20}/>
                <input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-11 pr-4 py-2.5 rounded-xl border ${theme.border} ${theme.inputBg} ${theme.textMain} outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.accentColor }} />
            </div>
        )}
        <div className={`${theme.cardBg} flex p-1.5 rounded-xl border ${theme.border} overflow-x-auto shadow-sm`}>
            {['overview', 'orders', 'withdrawals', 'users'].map(tab => ( <button key={tab} onClick={() => { setActiveTab(tab); setSearchTerm(''); }} className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-colors capitalize whitespace-nowrap ${activeTab === tab ? `${theme.inputBg} ${theme.textMain} shadow-sm` : theme.textSub}`}>{tab}</button> ))}
        </div>
      </div>
      
      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in-right">
            <div className={`${theme.cardBg} border ${theme.border} p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all group`}>
                <div className="flex justify-between items-start mb-4"><div className={`flex items-center gap-3 ${theme.textSub} text-xs font-bold uppercase tracking-wider`}><TrendingUp size={16} /> Revenue</div><div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><BarChart3 size={20}/></div></div>
                <div className="text-4xl font-bold" style={{ color: theme.accentColor }}>GHS {(metrics?.revenue || 0).toFixed(2)}</div>
            </div>
            <div className={`${theme.cardBg} border ${theme.border} p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all group`}>
                 <div className="flex justify-between items-start mb-4"><div className={`flex items-center gap-3 ${theme.textSub} text-xs font-bold uppercase tracking-wider`}><Users size={16} /> Users</div><div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Briefcase size={20}/></div></div>
                <div className={`text-4xl font-bold ${theme.textMain}`}>{metrics?.userCount || 0}</div>
            </div>
            <div className={`${theme.cardBg} border ${theme.border} p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all group`}>
                <div className="flex justify-between items-start mb-4"><div className={`flex items-center gap-3 ${theme.textSub} text-xs font-bold uppercase tracking-wider`}><Activity size={16} /> Orders</div><div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><PieChart size={20}/></div></div>
                <div className={`text-4xl font-bold ${theme.textMain}`}>{metrics?.totalOrders || 0}</div>
            </div>
        </div>
      )}

      {/* Orders (Mobile Cards + Desktop Table) */}
      {activeTab === 'orders' && ( 
        <div className="animate-fade-in-up">
            <div className="md:hidden space-y-3">
                {filteredOrders.map(order => (
                    <AdminCard 
                        key={order._id} 
                        theme={theme} 
                        title={order.userId?.username || 'Guest'} 
                        subTitle={`${order.dataPlan} (${order.phoneNumber}) - ${formatDateTime(order.createdAt)}`}
                        detail={`${order.phoneNumber}`}
                        amount={`GHS ${order.amount}`} 
                        badge={{ text: order.status, color: order.status === 'data_sent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }} 
                        onAction={() => handleStatusUpdate(order._id, 'data_sent')} 
                        actionLabel="Mark Sent" 
                        actionColor="bg-blue-600" 
                    />
                ))}
            </div>
            <div className={`hidden md:block ${theme.cardBg} border ${theme.border} rounded-3xl shadow-sm overflow-hidden`}>
                <table className={`w-full text-sm text-left ${theme.textMain}`}><thead className={`text-xs ${theme.textSub} uppercase border-b ${theme.border} bg-slate-50/50 dark:bg-slate-800/50`}><tr><th className="px-6 py-4">Time</th><th className="px-6 py-4">User</th><th className="px-6 py-4">Recipient</th><th className="px-6 py-4">Plan</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Action</th></tr></thead><tbody>{filteredOrders.map(order => ( <tr key={order._id} className={`border-b ${theme.border} hover:bg-black/5 dark:hover:bg-white/5`}><td className="px-6 py-4">{formatDateTime(order.createdAt)}</td><td className="px-6 py-4">{order.userId?.username}</td><td className="px-6 py-4">{order.phoneNumber}</td><td className="px-6 py-4">{order.dataPlan}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs ${order.status==='data_sent'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{order.status}</span></td><td className="px-6 py-4 text-right"><Button size="sm" onClick={()=>handleStatusUpdate(order._id, 'data_sent')}>Update</Button></td></tr> ))}</tbody></table>
            </div>
        </div> 
      )}
      
      {/* Withdrawals */}
      {activeTab === 'withdrawals' && ( 
        <div className="animate-fade-in-up">
            <div className="md:hidden space-y-3">
                {withdrawals.map(r => (
                    <AdminCard 
                        key={r._id} 
                        theme={theme} 
                        title={r.userId?.username} 
                        subTitle={`${r.accountNumber} (${r.network})`} 
                        amount={`GHS ${r.amount}`} 
                        badge={{ text: r.status, color: r.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }} 
                        onAction={r.status === 'Pending' ? () => handlePayWithdrawal(r._id) : null} 
                        actionLabel="Pay" 
                        actionColor="bg-green-600" 
                    />
                ))}
            </div>
            <div className={`hidden md:block ${theme.cardBg} border ${theme.border} rounded-3xl overflow-hidden`}><table className={`w-full text-sm text-left ${theme.textMain}`}><thead className={`text-xs ${theme.textSub} uppercase border-b ${theme.border} bg-slate-50/50 dark:bg-slate-800/50`}><tr><th className="px-6 py-4">User</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Momo</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Action</th></tr></thead><tbody>{withdrawals.map(r => ( <tr key={r._id} className={`border-b ${theme.border}`}><td className="px-6 py-4">{r.userId?.username}</td><td className="px-6 py-4">GHS {r.amount}</td><td className="px-6 py-4">{r.accountNumber}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs ${r.status==='Paid'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{r.status}</span></td><td className="px-6 py-4">{r.status==='Pending' && <Button size="sm" onClick={()=>handlePayWithdrawal(r._id)}>Pay</Button>}</td></tr> ))}</tbody></table></div>
        </div> 
      )}

      {/* Users */}
      {activeTab === 'users' && ( 
        <div className="animate-fade-in-up">
            <div className="md:hidden space-y-3">
                {filteredUsers.map(u => (
                    <AdminCard 
                        key={u._id} 
                        theme={theme} 
                        title={u.username} 
                        subTitle={`Last seen: ${timeAgo(u.lastLogin)}`} 
                        amount={`Bal: GHS ${(u.walletBalance/100).toFixed(2)}`} 
                        badge={{ text: u.role, color: 'bg-slate-100 text-slate-700' }} 
                        onAction={() => handleManualFund(u._id)} 
                        actionLabel="Fund" 
                        actionColor="bg-purple-600" 
                    />
                ))}
            </div>
            <div className={`hidden md:block ${theme.cardBg} border ${theme.border} rounded-3xl overflow-hidden`}><table className={`w-full text-sm text-left ${theme.textMain}`}><thead className={`text-xs ${theme.textSub} uppercase border-b ${theme.border} bg-slate-50/50 dark:bg-slate-800/50`}><tr><th className="px-6 py-4">Username</th><th className="px-6 py-4">Last Seen</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Balance</th><th className="px-6 py-4">Action</th></tr></thead><tbody>{filteredUsers.map(u => ( <tr key={u._id} className={`border-b ${theme.border}`}><td className="px-6 py-4">{u.username}</td><td className="px-6 py-4">{timeAgo(u.lastLogin)}</td><td className="px-6 py-4">{u.role}</td><td className="px-6 py-4">GHS {(u.walletBalance/100).toFixed(2)}</td><td className="px-6 py-4"><Button size="sm" onClick={()=>handleManualFund(u._id)}>Fund</Button></td></tr> ))}</tbody></table></div>
        </div> 
      )}
    </div>
  );
};

const Auth = ({ onLogin, mode, setMode }) => {
  const { theme } = useContext(ThemeContext); const showToast = useToast(); const [formData, setFormData] = useState({ username: '', email: '', password: '' }); const [loading, setLoading] = useState(false); const [isAdminMode, setIsAdminMode] = useState(false); const [stealthClicks, setStealthClicks] = useState(0); const [roleSelection, setRoleSelection] = useState('Client'); const [termsAccepted, setTermsAccepted] = useState(false); const [error, setError] = useState('');
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); setError(''); if (mode === 'signup' && !termsAccepted) { setError("You must agree to the Terms and Conditions."); setLoading(false); return; } const cleanData = { username: formData.username.trim(), email: formData.email.trim(), password: formData.password }; if (mode === 'signup' && roleSelection === 'Agent') { handleAgentUpgrade(cleanData); return; } try { const endpoint = mode === 'login' ? '/login' : '/signup'; const res = await apiCall(endpoint, { method: 'POST', body: JSON.stringify(cleanData) }); if (res) { if (isAdminMode && res.role !== 'Admin') { await apiCall('/logout'); setError("Access Denied"); } else { onLogin(); showToast(`Welcome ${cleanData.username}`); } } } catch (err) { setError(err.message); } finally { setLoading(false); } };
  const handleAgentUpgrade = async (cleanData) => { try { if (!window.PaystackPop) { showToast("Payment System loading...", "error"); setLoading(false); return; } const signupRes = await apiCall('/signup', { method: 'POST', body: JSON.stringify(cleanData) }); if (!signupRes) throw new Error("Signup failed"); await apiCall('/login', { method: 'POST', body: JSON.stringify({ username: cleanData.username, password: cleanData.password }) }); const handler = window.PaystackPop.setup({ key: PAYSTACK_KEY, email: cleanData.email, amount: 30 * 100, currency: 'GHS', callback: function(response) { (async () => { const verifyRes = await apiCall('/upgrade-agent', { method: 'POST', body: JSON.stringify({ reference: response.reference }) }); if (verifyRes && verifyRes.success) { showToast("Upgrade Successful!"); onLogin(); } else { showToast("Verification Failed.", "error"); onLogin(); } })(); }, onClose: () => { showToast("Cancelled.", "error"); onLogin(); } }); handler.openIframe(); } catch (err) { setError(err.message); setLoading(false); } };
  return (
    <div className={`min-h-screen flex items-center justify-center ${theme.appBg} p-4 transition-colors duration-300`}>
       <div className={`${theme.cardBg} w-full max-w-md p-8 rounded-3xl shadow-xl border ${theme.border} animate-scale-in`}>
          <div onClick={() => { if(stealthClicks+1 >= 5) setIsAdminMode(true); else setStealthClicks(s=>s+1); }} className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white cursor-pointer select-none transition-transform active:scale-95" style={{ backgroundColor: theme.accentColor }}><User size={32}/></div>
          <h1 className={`text-center text-2xl font-bold ${theme.textMain} mb-6`}>{isAdminMode ? 'Admin Portal' : (mode === 'login' ? 'Welcome Back' : 'Create Account')}</h1>
          {error && <div className={`p-3 mb-6 rounded-lg text-sm text-center font-bold ${theme.failedBadge} animate-shake`}>{error}</div>}
          {!isAdminMode && mode === 'signup' && (<div className={`flex ${theme.inputBg} p-1 rounded-xl mb-6 border ${theme.border}`}><button type="button" onClick={() => setRoleSelection('Client')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${roleSelection === 'Client' ? `${theme.cardBg} shadow` : theme.textSub}`} style={roleSelection === 'Client' ? { color: theme.accentColor } : {}}>Client (Free)</button><button type="button" onClick={() => setRoleSelection('Agent')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${roleSelection === 'Agent' ? 'text-white shadow' : theme.textSub}`} style={roleSelection === 'Agent' ? { backgroundColor: theme.accentColor } : {}}>Agent (30 GHS)</button></div>)}
          <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />{mode === 'signup' && !isAdminMode && <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />}<Input label="Password" isPassword value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              {mode === 'login' && (<div className="text-right"><a href="https://wa.me/233572992838?text=Hello Admin, I forgot my AJEnterprise password. My username is..." target="_blank" rel="noreferrer" className={`text-xs font-bold hover:underline`} style={{ color: theme.accentColor }}>Forgot Password?</a></div>)}
              {mode === 'signup' && (<div className="flex items-start gap-2 pt-2"><input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-300 transition-colors" style={{ accentColor: theme.accentColor }} /><label htmlFor="terms" className={`text-xs ${theme.textSub} leading-tight`}>I agree to the Terms and Conditions.</label></div>)}<Button fullWidth disabled={loading}>{loading ? 'Loading...' : (mode === 'login' ? 'Login' : 'Sign Up')}</Button></form>
          {!isAdminMode && (<div className="mt-4 text-center text-sm"><button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ color: theme.accentColor }} className="hover:underline transition-all">{mode === 'login' ? 'Create Account' : 'Back to Login'}</button></div>)}
       </div>
    </div>
  );
};

const TopUpModal = ({ user, isOpen, onClose, onConfirm }) => {
  const { theme } = useContext(ThemeContext); const showToast = useToast(); const [amount, setAmount] = useState(''); const [email, setEmail] = useState(user?.email || "user@example.com"); const [processing, setProcessing] = useState(false); const fee = amount ? (parseFloat(amount) * 0.02) : 0; const totalCharge = amount ? (parseFloat(amount) + fee) : 0;
  useEffect(() => { if(user?.email) setEmail(user.email); }, [user]); usePreventLeave(processing);
  const handleSubmit = () => { if (!amount || isNaN(amount) || amount < 1) return; 
      if (parseFloat(amount) < 10) { showToast("Minimum Top Up is 10 GHS", "error"); return; }
      if (!window.PaystackPop) { showToast("Payment System loading...", "error"); return; } 
      setProcessing(true); const handler = window.PaystackPop.setup({ key: PAYSTACK_KEY, email: email, amount: Math.ceil(parseFloat(amount) * 1.02 * 100), currency: 'GHS', callback: function(response) { (async () => { await onConfirm(amount, response.reference); setProcessing(false); setAmount(''); })(); }, onClose: function() { showToast("Transaction cancelled.", "error"); setProcessing(false); } }); handler.openIframe(); };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up"><div className={`${theme.cardBg} rounded-3xl w-full max-w-sm p-6 border ${theme.border} animate-scale-in`}><h3 className={`text-xl font-bold mb-4 ${theme.textMain}`}>Fund Wallet</h3><label className={`block text-xs font-bold ${theme.textSub} uppercase mb-2`}>Amount (Min 10 GHS)</label><input type="number" placeholder="Amount (GHS)" value={amount} onChange={(e) => setAmount(e.target.value)} className={`w-full border ${theme.border} p-3 rounded-xl mb-4 text-lg font-bold ${theme.inputBg} ${theme.textMain} focus:ring-2 transition-all duration-300`} />{amount > 0 && (<div className={`${theme.inputBg} p-4 rounded-xl border ${theme.border} text-sm space-y-2 mb-4 animate-fade-in-up`}><div className={`flex justify-between ${theme.textSub}`}><span>Wallet Credit:</span><span className="font-bold">GHS {parseFloat(amount).toFixed(2)}</span></div><div className={`flex justify-between ${theme.textSub} text-xs`}><span>Fee (2%):</span><span>+ GHS {fee.toFixed(2)}</span></div><div className={`border-t ${theme.border} pt-2 flex justify-between items-center`}><span className={`font-bold ${theme.textMain}`}>You Pay:</span><span className={`font-bold text-lg`} style={{ color: theme.accentColor }}>GHS {totalCharge.toFixed(2)}</span></div></div>)}<Button fullWidth onClick={handleSubmit} disabled={processing || !amount || amount < 10}>{processing ? 'Processing...' : `Pay GHS ${totalCharge.toFixed(2)}`}</Button><button onClick={onClose} className={`mt-4 text-sm ${theme.textSub} w-full hover:text-red-500 transition-colors`}>Cancel</button></div></div>
  );
};

export default function App() {
  const [user, setUser] = useState(null); 
  const [view, setView] = useState('home'); 
  const [transactions, setTransactions] = useState([]); 
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [showTopUp, setShowTopUp] = useState(false); 
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [mode, setMode] = useState(localStorage.getItem('aj_mode') || 'light'); 
  const [accentColor, setAccentColor] = useState(localStorage.getItem('aj_color') || DEFAULT_COLOR);
  const [loadingHistory, setLoadingHistory] = useState(false); 
  
  const theme = generateTheme(mode, accentColor); 
  const themeContextValue = { theme, mode, setMode, accentColor, setAccentColor };

  useEffect(() => { 
      try { localStorage.setItem('aj_mode', mode); localStorage.setItem('aj_color', accentColor); } catch (e) {}
      document.title = 'AJEnterprise'; 
      const script = document.createElement('script'); script.src = "https://js.paystack.co/v1/inline.js"; document.body.appendChild(script); 
      
      const init = async () => {
          try {
              const u = await apiCall('/user-info');
              if(u && u.username) { 
                  setUser(u); 
                  const params = new URLSearchParams(window.location.search); 
                  if(params.get('shop')) setView('purchase'); else setView(u.role === 'Admin' ? 'admin' : 'dashboard'); 
                  fetchTx(); 
              }
          } catch(e) {}
      };
      init();
  }, [mode, accentColor]);

  const fetchTx = async () => {
      setLoadingHistory(true);
      try { const res = await apiCall('/my-orders'); setTransactions(res?.orders || []); } catch(e){}
      setLoadingHistory(false);
  };
  
  const refreshUser = () => apiCall('/user-info').then(u => { if(u && u.username) { setUser(u); fetchTx(); } }); 
  const handleTopUpConfirm = async (amount, reference) => { try { const res = await apiCall('/wallet/fund', { method: 'POST', body: JSON.stringify({ reference, amount }) }); if (res && res.success) { alert("Wallet Funded!"); setShowTopUp(false); await refreshUser(); } else { alert("Funding failed"); } } catch (e) { alert("Error"); } };
  
  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); vibrate(); alert("Copied: " + text); };

  const [searchTerm, setSearchTerm] = useState('');
  const filteredTransactions = transactions.filter(tx => {
      const search = searchTerm.toLowerCase();
      return (
          (tx.phoneNumber && tx.phoneNumber.includes(search)) ||
          (tx.network && tx.network.toLowerCase().includes(search)) ||
          (tx.reference && tx.reference.toLowerCase().includes(search))
      );
  });

  const params = new URLSearchParams(window.location.search); 
  if (params.get('shop')) return <ThemeContext.Provider value={themeContextValue}><ToastProvider><style>{globalStyles}</style><PublicShop /></ToastProvider></ThemeContext.Provider>; 
  if (!user) return <ThemeContext.Provider value={themeContextValue}><ToastProvider><style>{globalStyles}</style><Auth onLogin={() => window.location.reload()} mode={view === 'home' ? 'login' : view} setMode={setView} /></ToastProvider></ThemeContext.Provider>;

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ToastProvider>
        <style>{globalStyles}</style>
        <div className={`flex h-screen ${theme.appBg} font-sans ${theme.textMain} overflow-hidden transition-colors duration-300`}>
          {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in-up" onClick={() => setSidebarOpen(false)} />}
          <aside className={`fixed inset-y-0 left-0 z-50 w-72 ${theme.sidebar} flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
             <div className={`p-6 border-b ${theme.border} flex items-center gap-3`}><img src="apple-touch-icon.png" alt="AJ" className="w-10 h-10 rounded-xl object-contain bg-black" /><div><h2 className="font-bold text-lg">AJEnterprise</h2><p className={`text-xs ${theme.textSub}`}>v2.1</p></div></div>
             <div className="flex-1 p-4 space-y-2">
                <button onClick={() => { setView('dashboard'); vibrate(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${view === 'dashboard' ? `text-white shadow-md scale-[1.02]` : `${theme.inactiveNav} hover:scale-[1.02]`}`} style={view === 'dashboard' ? { backgroundColor: theme.accentColor } : {}}><LayoutDashboard size={20}/> Dashboard</button>
                <button onClick={() => { setView('purchase'); vibrate(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${view === 'purchase' ? `text-white shadow-md scale-[1.02]` : `${theme.inactiveNav} hover:scale-[1.02]`}`} style={view === 'purchase' ? { backgroundColor: theme.accentColor } : {}}><Wifi size={20}/> Buy Data</button>
                {user?.role === 'Agent' && <button onClick={() => { setView('shop'); vibrate(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${view === 'shop' ? `text-white shadow-md scale-[1.02]` : `${theme.inactiveNav} hover:scale-[1.02]`}`} style={view === 'shop' ? { backgroundColor: theme.accentColor } : {}}><Store size={20}/> My Shop</button>}
                <button onClick={() => { setView('history'); vibrate(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${view === 'history' ? `text-white shadow-md scale-[1.02]` : `${theme.inactiveNav} hover:scale-[1.02]`}`} style={view === 'history' ? { backgroundColor: theme.accentColor } : {}}><History size={20}/> History</button>
                <button onClick={() => { setView('help'); vibrate(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${view === 'help' ? `text-white shadow-md scale-[1.02]` : `${theme.inactiveNav} hover:scale-[1.02]`}`} style={view === 'help' ? { backgroundColor: theme.accentColor } : {}}><HelpCircle size={20}/> Help & Support</button>
                {user?.role === 'Admin' && <button onClick={() => { setView('admin'); vibrate(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${view === 'admin' ? `text-white shadow-md scale-[1.02]` : `${theme.inactiveNav} hover:scale-[1.02]`}`} style={view === 'admin' ? { backgroundColor: theme.accentColor } : {}}><Lock size={20}/> Admin</button>}
             </div>
             <div className={`p-4 border-t ${theme.border} space-y-2`}>
                <button onClick={() => { setView('settings'); vibrate(); }} className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold transition-all duration-200 ${view === 'settings' ? `text-white shadow-md scale-[1.02]` : `${theme.inactiveNav} hover:scale-[1.02]`}`} style={view === 'settings' ? { backgroundColor: theme.accentColor } : {}}><SettingsIcon size={20}/> Settings</button>
                <button onClick={() => { setView('policy'); vibrate(); }} className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold transition-all duration-200 ${view === 'policy' ? `text-white shadow-md scale-[1.02]` : `${theme.inactiveNav} hover:scale-[1.02]`}`} style={view === 'policy' ? { backgroundColor: theme.accentColor } : {}}><FileText size={20}/> Privacy Policy</button>
                <button onClick={() => { setShowThemeModal(true); vibrate(); }} className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold transition-all duration-200 ${theme.inactiveNav} hover:scale-[1.02]`}><Palette size={20}/> Appearance</button>
                <button onClick={async () => { await apiCall('/logout'); window.location.reload(); }} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-200 hover:scale-[1.02]"><LogOut size={20} /> Sign Out</button>
             </div>
          </aside>
          <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative lg:ml-72">
             <header className={`h-16 ${theme.sidebar} flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm`}><button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-black/5 rounded-lg transition-colors"><Menu/></button><div className="ml-auto font-bold">{user?.username}</div></header>
             <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                <div className="max-w-7xl mx-auto w-full">
                    {view === 'dashboard' && <Dashboard user={user} transactions={transactions} setView={setView} onTopUp={() => setShowTopUp(true)} refreshUser={refreshUser} loadingHistory={loadingHistory} />}
                    {view === 'purchase' && <Purchase refreshUser={refreshUser} />} 
                    {view === 'shop' && <AgentShopManager user={user} refreshUser={refreshUser} />}
                    {view === 'help' && <HelpCenter />}
                    {view === 'admin' && <AdminDashboard />}
                    {view === 'settings' && <Settings user={user} refreshUser={refreshUser} />} 
                    {view === 'policy' && <PrivacyPolicy />} 
                    {view === 'history' && (
                        <div className={`${theme.cardBg} md:rounded-2xl md:p-6 md:shadow-sm md:border ${theme.border} animate-fade-in-up`}>
                            {/* Header with Search */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <h2 className={`font-bold text-lg md:text-xl hidden md:block ${theme.textMain}`}>Transaction History</h2>
                                <div className="w-full md:w-64 relative">
                                    <Search className={`absolute left-3 top-3.5 ${theme.textSub}`} size={18}/>
                                    <input 
                                      placeholder="Search phone, ref..." 
                                      value={searchTerm} 
                                      onChange={e => setSearchTerm(e.target.value)} 
                                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.inputBg} ${theme.textMain} outline-none focus:ring-2 transition-all duration-300`} 
                                      style={{ '--tw-ring-color': theme.accentColor }} 
                                    />
                                </div>
                            </div>

                            {/* ✅ MOBILE CARDS */}
                            <div className="space-y-1 md:hidden">
                                {filteredTransactions.length > 0 ? filteredTransactions.map((tx) => (
                                    <TransactionCard key={tx._id} tx={tx} theme={theme} />
                                )) : <div className={`p-8 text-center ${theme.textSub} text-sm ${theme.cardBg} rounded-xl border ${theme.border}`}>No transactions found</div>}
                            </div>

                            {/* DESKTOP LIST */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className={`w-full text-sm text-left ${theme.textMain}`}>
                                    <thead className={`text-xs ${theme.textSub} uppercase border-b ${theme.border}`}><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Description</th><th className="px-6 py-3">Ref</th><th className="px-6 py-3">Recipient</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Amount</th></tr></thead>
                                    <tbody>
                                        {filteredTransactions.map(t => (
                                            <tr key={t._id} className={`border-b ${theme.border} ${theme.hover} transition-colors`}>
                                                <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(t.createdAt)}</td>
                                                <td className="px-6 py-4">{t.dataPlan}</td>
                                                <td className="px-6 py-4">
                                                    <button onClick={() => copyToClipboard(t.reference)} className={`flex items-center gap-1 font-mono text-xs opacity-70 hover:opacity-100 hover:text-blue-500 transition-colors`}><Copy size={12}/> {t.reference.substring(0,8)}...</button>
                                                </td>
                                                <td className="px-6 py-4">{t.phoneNumber}</td>
                                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${t.status === 'data_sent' ? theme.successBadge : `${theme.inputBg} ${theme.textSub}`}`}>{t.status}</span></td>
                                                <td className="px-6 py-4 text-right font-bold">GHS {t.amount.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
             </div>
          </main>
          <TopUpModal user={user} isOpen={showTopUp} onClose={() => setShowTopUp(false)} onConfirm={handleTopUpConfirm} />
          <ThemePickerModal isOpen={showThemeModal} onClose={() => setShowThemeModal(false)} />
        </div>
      </ToastProvider>
    </ThemeContext.Provider>
  );
}