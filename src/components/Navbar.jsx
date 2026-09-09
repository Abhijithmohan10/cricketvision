import React, { useState, useRef, useEffect } from 'react';
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
  Lock,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccessRestrictedModal, setShowAccessRestrictedModal] = useState(false);
  const [restrictedFeatureName, setRestrictedFeatureName] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, coachOnly: false },
    { id: 'player_portal', label: 'My Player Portal', icon: UserCheck, highlight: true, playerOnly: false },
    { id: 'next_match_predictor', label: 'Next Match Predictor', icon: Sparkles },
    { id: 'video_analyzer', label: 'AI Video Upload', icon: Video },
    { id: 'database', label: 'IPL & Intl Database', icon: Database },
    { id: 'simulator', label: 'Match Simulator', icon: Cpu },
    { id: 'team_builder', label: 'Playing XI Builder', icon: Users, coachOnly: true },
  ];

  // Mobile Bottom Bar subset
  const mobileBottomItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'player_portal', label: 'Portal', icon: UserCheck },
    { id: 'video_analyzer', label: 'Video AI', icon: Video },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'next_match_predictor', label: 'Predictor', icon: Sparkles },
  ];

  const handleTabClick = (item) => {
    if (item.coachOnly && !isCoach) {
      setRestrictedFeatureName(item.label);
      setShowAccessRestrictedModal(true);
      return;
    }
    setActiveTab(item.id);
    setShowMobileMenu(false);
  };

  const handleOpenDBManagerSecure = () => {
    if (!isCoach) {
      setRestrictedFeatureName('Database Master Editor & Player Modifier');
      setShowAccessRestrictedModal(true);
      return;
    }
    onOpenDBManager();
    setShowMobileMenu(false);
  };

  return (
    <>
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            
            {/* Brand Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer shrink-0" 
              onClick={() => setActiveTab(isPlayer ? 'player_portal' : 'dashboard')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-amber-400 p-0.5 shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                  <span className="text-lg">🏏</span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-white">
                    Cricket<span className="text-cyan-400">Vision</span>
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold font-mono-code bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded hidden xs:inline-block">
                    {isCoach ? '👑 COACH' : isPlayer ? '🏏 PORTAL' : '📊 ANALYST'}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
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
                    {isRestrictedForUser && (
                      <Lock className="w-3 h-3 text-amber-400 ml-0.5" title="Coach Permission Required" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Side Tools & User Profile */}
            <div className="flex items-center space-x-2 shrink-0">
              
              {/* Global Search (Desktop) */}
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

              {/* AI Tactical Assistant Button */}
              <button
                onClick={onOpenAICoach}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:opacity-90 transition-all shadow-md shadow-cyan-500/20"
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AI Coach</span>
              </button>

              {/* Database Admin Button */}
              <button
                onClick={handleOpenDBManagerSecure}
                title={isCoach ? "Database Manager (Coach Access)" : "Database Manager (Coach Required)"}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center space-x-1 ${
                  isCoach ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30' : 'bg-slate-900/50 border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span className="hidden md:inline">DB Admin</span>
                {!isCoach && <Lock className="w-3 h-3 text-amber-400" />}
              </button>

              {/* Log In & Role Selector Button */}
              <button
                onClick={() => setActiveTab('login')}
                className="px-2.5 py-1.5 text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 rounded-lg flex items-center space-x-1 transition-all"
                title="Switch Role / Log In"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Roles</span>
              </button>

              {/* User Avatar Dropdown */}
              {currentUser && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="flex items-center space-x-1 p-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-cyan-500/40"
                    />
                    <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {showRoleDropdown && (
                    <div className="absolute right-0 mt-2 w-72 glass-panel rounded-xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase font-mono-code">Logged-In Profile</p>
                        <p className="text-sm font-extrabold text-white">{currentUser.name}</p>
                        <p className="text-[11px] text-cyan-400 font-mono-code mt-0.5">{currentUser.badge}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => { setActiveTab('login'); setShowRoleDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-cyan-400 hover:bg-cyan-500/10 flex items-center space-x-2 border-b border-slate-800/60"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>Open Roles & Authentication</span>
                        </button>

                        <p className="px-4 pt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Role Switch</p>
                        
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

              {/* Mobile Hamburger Drawer Toggle Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white"
                aria-label="Toggle Navigation Menu"
              >
                {showMobileMenu ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-slate-300" />}
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-30 bg-slate-950/95 backdrop-blur-xl pt-20 px-4 pb-24 overflow-y-auto animate-in fade-in space-y-5">
          
          {/* Mobile Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search players or stats..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Navigation Items List */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase font-mono-code tracking-wider px-2">Navigation Views</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isRestrictedForUser = item.coachOnly && !isCoach;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-900/60 text-slate-300 border border-slate-800/80 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isRestrictedForUser && (
                    <Lock className="w-4 h-4 text-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Role Status & Actions */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-code">
              <span className="text-slate-400">Access Mode:</span>
              <span className="text-cyan-400 font-bold">{isCoach ? '👑 Head Coach' : '🏏 Player Portal'}</span>
            </div>
            <button
              onClick={() => { setActiveTab('login'); setShowMobileMenu(false); }}
              className="w-full py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20"
            >
              🔑 Open Role Switcher Portal
            </button>
          </div>
        </div>
      )}

      {/* Native Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 px-2 py-1 flex items-center justify-around">
        {mobileBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all ${
                isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'}`} />
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Permission Restriction Guard Modal */}
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
              You are currently logged in with <strong className="text-amber-400">Player Access ({currentUser?.name})</strong>.
            </p>
            <p className="text-xs text-slate-400">
              The feature <strong>"{restrictedFeatureName}"</strong> is restricted to Head Coaches and High-Performance Directors.
            </p>

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
    </>
  );
}
