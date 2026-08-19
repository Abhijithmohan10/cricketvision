import React, { useState } from 'react';
import { 
  Activity, 
  Video, 
  Database, 
  Cpu, 
  Users, 
  Bot, 
  UserCheck, 
  LogOut, 
  ChevronDown,
  Sparkles,
  Search,
  Key,
  ShieldCheck,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { useAuth, DEFAULT_USERS } from '../context/AuthContext';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAICoach, 
  onOpenDBManager,
  searchQuery,
  setSearchQuery,
  playersCount = 0,
  isMongoConnected = false
}) {
  const { currentUser, loginAsRole, logout, isCoach, isPlayer } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showAccessRestrictedModal, setShowAccessRestrictedModal] = useState(false);
  const [restrictedFeatureName, setRestrictedFeatureName] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, coachOnly: false },
    { id: 'player_portal', label: 'My Player Portal', icon: UserCheck, highlight: true, playerOnly: false },
    { id: 'next_match_predictor', label: 'Next Match Predictor', icon: Sparkles, badge: 'ML' },
    { id: 'video_analyzer', label: 'AI Video Upload', icon: Video, badge: 'AI' },
    { id: 'database', label: 'IPL & Intl Database', icon: Database },
    { id: 'simulator', label: 'Match Simulator', icon: Cpu },
    { id: 'team_builder', label: 'Playing XI Builder', icon: Users, coachOnly: true },
  ];

  const handleTabClick = (item) => {
    if (item.coachOnly && !isCoach) {
      setRestrictedFeatureName(item.label);
      setShowAccessRestrictedModal(true);
      return;
    }
    setActiveTab(item.id);
  };

  const handleOpenDBManagerSecure = () => {
    if (!isCoach) {
      setRestrictedFeatureName('Database Master Editor & Player Modifier');
      setShowAccessRestrictedModal(true);
      return;
    }
    onOpenDBManager();
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5 cursor-pointer shrink-0" onClick={() => setActiveTab(isPlayer ? 'player_portal' : 'dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-amber-400 p-0.5 shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                <span className="text-lg">🏏</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-heading font-extrabold text-lg tracking-tight text-white">
                  Cricket<span className="text-cyan-400">Vision</span>
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold font-mono-code bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
                  {isCoach ? '👑 COACH FULL ACCESS' : isPlayer ? '🏏 PLAYER PORTAL' : '📊 ANALYST'}
                </span>
                <span className={`px-1.5 py-0.2 text-[9px] font-bold font-mono-code rounded hidden sm:flex items-center space-x-1 ${
                  isMongoConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  <span>{isMongoConnected ? '🍃 MongoDB' : '⚡ Local'}</span>
                </span>
              </div>
             
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isRestrictedForUser = item.coachOnly && !isCoach;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  } ${item.highlight ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[8px] font-bold uppercase bg-cyan-500 text-slate-950 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isRestrictedForUser && (
                    <Lock className="w-3 h-3 text-amber-400 ml-0.5" title="Coach Permission Required" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools & User Profile */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Global Search */}
            <div className="relative hidden xl:block w-40">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stats..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* AI Tactical Assistant */}
            <button
              onClick={onOpenAICoach}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:opacity-90 transition-all shadow-md shadow-cyan-500/20"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Coach</span>
            </button>

            {/* Database Admin Button with Role Security Check */}
            <button
              onClick={handleOpenDBManagerSecure}
              title={isCoach ? "Database Manager & Master Editor (Coach Access)" : "Database Manager (Coach Permission Required)"}
              className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center space-x-1 ${
                isCoach ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30' : 'bg-slate-900/50 border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              {!isCoach && <Lock className="w-3 h-3 text-amber-400" />}
            </button>

            {/* Top-Right Log In & Role Selector Button */}
            <button
              onClick={() => setActiveTab('login')}
              className="px-2.5 py-1.5 text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 rounded-lg flex items-center space-x-1 transition-all"
              title="Log In or Switch Access Role"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Role Switcher</span>
            </button>

            {/* Active User Avatar & Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center space-x-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-cyan-500/40"
                  />
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Role Switcher Menu */}
                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-72 glass-panel rounded-xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-[10px] text-slate-400 uppercase font-mono-code">Active Logged-In User</p>
                      <p className="text-sm font-extrabold text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-cyan-400 font-mono-code mt-0.5">{currentUser.badge}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { setActiveTab('login'); setShowRoleDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-cyan-400 hover:bg-cyan-500/10 flex items-center space-x-2 border-b border-slate-800/60"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>🔑 Open Login & Roles Portal</span>
                      </button>

                      <p className="px-4 pt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role Switcher (Testing Mode)</p>
                      
                      <button
                        onClick={() => { loginAsRole('coach'); setShowRoleDropdown(false); setActiveTab('dashboard'); }}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-800/60 ${isCoach ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-slate-300'}`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>👑</span>
                          <span>Head Coach</span>
                        </div>
                      </button>

                      <button
                        onClick={() => { loginAsRole('user'); setShowRoleDropdown(false); setActiveTab('database'); }}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-800/60 ${currentUser.role === 'user' ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-slate-300'}`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>📊</span>
                          <span>Analyst User</span>
                        </div>
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-1 mt-1">
                      <button
                        onClick={() => { logout(); setShowRoleDropdown(false); setActiveTab('login'); }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-800/60 overflow-x-auto space-x-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Permission Restriction Security Guard Modal */}
      {showAccessRestrictedModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-md w-full space-y-4 animate-in fade-in shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold font-heading text-white">Coach Authorization Required</h3>
              </div>
              <button onClick={() => setShowAccessRestrictedModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You are currently logged in with <strong className="text-amber-400">Player Data Access ({currentUser?.name})</strong>.
            </p>
            <p className="text-xs text-slate-400">
              The feature <strong>"{restrictedFeatureName}"</strong> is restricted to Head Coaches and High-Performance Directors.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs font-mono-code text-cyan-400">
              <p>👑 Need full administrative access?</p>
              <p className="text-slate-400 text-[11px]">Click below to switch into Head Coach mode instantly for demo testing.</p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAccessRestrictedModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Return to My Player Portal
              </button>
              <button
                onClick={() => {
                  loginAsRole('coach');
                  setShowAccessRestrictedModal(false);
                  if (restrictedFeatureName.includes('Playing XI')) setActiveTab('team_builder');
                  else setActiveTab('dashboard');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-90 shadow-md shadow-cyan-500/20"
              >
                Switch to Head Coach Role
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
