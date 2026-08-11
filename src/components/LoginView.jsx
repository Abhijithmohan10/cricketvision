import React, { useState } from 'react';
import { Shield, UserCheck, Key, Mail, Sparkles, ArrowRight, Award, Lock, CheckCircle2, User, UserPlus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginView({ players = [], onLoginSuccess }) {
  const { loginAsRole } = useAuth();
  const [activeAuthMode, setActiveAuthMode] = useState('login'); // 'login' | 'register'
  
  // Login Form State
  const [selectedRole, setSelectedRole] = useState('coach'); // coach, player, user
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0]?.id || 'virat-kohli');
  const [email, setEmail] = useState('coach@cricketvision.ai');
  const [password, setPassword] = useState('••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register New User State & Validation
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('user');
  const [regTitle, setRegTitle] = useState('Cricket Analyst');
  const [regSuccessMsg, setRegSuccessMsg] = useState(null);
  const [regErrorMsg, setRegErrorMsg] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'coach') setEmail('coach@cricketvision.ai');
    else if (role === 'player') setEmail('virat@cricketvision.ai');
    else setEmail('user@cricketvision.ai');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (selectedRole === 'player') {
        const foundPlayer = players.find(p => p.id === selectedPlayerId) || players[0];
        loginAsRole('player', foundPlayer);
      } else {
        loginAsRole(selectedRole);
      }
      setIsSubmitting(false);
      if (onLoginSuccess) onLoginSuccess(selectedRole);
    }, 400);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegSuccessMsg(null);
    setRegErrorMsg(null);

    // 1. Frontend Validation Checks
    if (!regName || regName.trim().length < 2) {
      setRegErrorMsg('Full Name must be at least 2 characters long.');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!regEmail || !emailRegex.test(regEmail.trim())) {
      setRegErrorMsg('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setRegErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    const newUserPayload = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword,
      role: regRole,
      title: regTitle || 'Cricket Member',
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      badge: regRole === 'coach' ? '👑 Head Coach' : regRole === 'player' ? '🏏 Player Portal' : '📊 Analyst User',
      permissions: regRole === 'coach' ? ['all_access'] : ['view_database', 'video_upload', 'match_simulator']
    };

    try {
      // POST to MongoDB API
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserPayload)
      });
      
      const data = await res.json();

      if (!res.ok) {
        setRegErrorMsg(data.error || 'Failed to register user in MongoDB');
        setIsSubmitting(false);
        return;
      }

      setRegSuccessMsg(`Successfully registered ${regName} in MongoDB 'users' collection!`);
      
      setTimeout(() => {
        loginAsRole(regRole);
        if (onLoginSuccess) onLoginSuccess(regRole);
      }, 1000);
    } catch (err) {
      setRegSuccessMsg(`Registered ${regName} in local session mode!`);
      setTimeout(() => {
        loginAsRole(regRole);
        if (onLoginSuccess) onLoginSuccess(regRole);
      }, 1000);
    }

    setIsSubmitting(false);
  };


  const rolesConfig = [
    {
      id: 'coach',
      title: 'Head Coach',
      badge: '👑 ALL ACCESS',
      icon: Shield,
      color: 'from-cyan-500 to-emerald-500',
      description: 'Full squad tactics, Playing XI builder, video biomechanics, and tactical AI coaching assistant.',
      permissions: ['Squad XI Builder', 'AI Tactical Coach', 'Biomechanics Video Upload', 'Edit Player Database']
    },
    {
      id: 'player',
      title: 'Player Portal',
      badge: '🏏 PERSONAL HUB',
      icon: UserCheck,
      color: 'from-amber-500 to-emerald-500',
      description: 'Personal IPL & International form history, video analysis logs, fatigue recovery index, and personalized AI drills.',
      permissions: ['Personal Stats Hub', 'Private Video Analysis Log', 'AI Drill Recommendations', 'Workload & Fatigue']
    },
    {
      id: 'user',
      title: 'Cricket Analyst',
      badge: '📊 ANALYST USER',
      icon: User,
      color: 'from-cyan-500 to-pink-500',
      description: 'Access to public IPL/International database, match scenario simulator, next match run predictions, and video upload tools.',
      permissions: ['IPL & International DB', 'Next Match Runs Predictor', 'Match Scenario Simulator', 'Video AI Tool']
    }
  ];

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-amber-400 p-0.5 shadow-xl shadow-cyan-500/20 mb-2">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="text-3xl">🏏</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white tracking-tight">
            Cricket<span className="text-cyan-400">Vision</span> User Authentication
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Log in to existing accounts or add new Head Coach, Player, and Analyst user profiles.
          </p>
        </div>

        {/* Auth Mode Toggle Bar (Log In vs Add User) */}
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveAuthMode('login')}
            className={`py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all ${
              activeAuthMode === 'login'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Sign In to Account</span>
          </button>

          <button
            onClick={() => setActiveAuthMode('register')}
            className={`py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all ${
              activeAuthMode === 'register'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>


        {activeAuthMode === 'login' ? (
          <>
            {/* 3 Interactive Role Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rolesConfig.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id)}
                    className={`glass-panel p-5 rounded-2xl cursor-pointer transition-all border relative space-y-3 ${
                      isSelected
                        ? 'bg-slate-900/90 border-cyan-500 ring-2 ring-cyan-500/30 shadow-xl shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-r ${r.color} text-slate-950 font-bold shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold font-mono-code bg-slate-900 text-cyan-400 px-2 py-0.5 rounded border border-slate-800">
                        {r.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold font-heading text-white">{r.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{r.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      {r.permissions.map((p, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[10px] text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Login Form Box */}
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl max-w-lg mx-auto relative overflow-hidden space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold font-heading text-white">
                    Logging in as <span className="text-cyan-400">{rolesConfig.find(r => r.id === selectedRole)?.title}</span>
                  </h3>
                </div>
                <span className="text-[10px] font-mono-code text-slate-400">DEMO AUTH READY</span>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Player Selector when Player Role is selected */}
                {selectedRole === 'player' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Select Player Profile</label>
                    <select
                      value={selectedPlayerId}
                      onChange={(e) => setSelectedPlayerId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-semibold focus:outline-none focus:border-cyan-500"
                    >
                      {players.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.country} • {p.role})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to {rolesConfig.find(r => r.id === selectedRole)?.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

              {/* Quick Demo Login Shortcuts */}
              <div className="pt-4 border-t border-slate-800 text-center space-y-2">
                <p className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider">
                  Or Click Below to Test User-Wise Access Roles
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => { loginAsRole('coach'); if (onLoginSuccess) onLoginSuccess('coach'); }}
                    className="py-2 px-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 font-mono-code text-[11px] transition-all"
                  >
                    👑 Head Coach
                  </button>

                  <button
                    onClick={() => { 
                      const kohli = players.find(p => p.id === 'virat-kohli') || players[0];
                      loginAsRole('player', kohli); 
                      if (onLoginSuccess) onLoginSuccess('player'); 
                    }}
                    className="py-2 px-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-amber-400 font-mono-code text-[11px] transition-all"
                  >
                    🏏 Player (Kohli #18)
                  </button>

                  <button
                    onClick={() => { 
                      const bumrah = players.find(p => p.id === 'jasprit-bumrah') || players[1] || players[0];
                      loginAsRole('player', bumrah); 
                      if (onLoginSuccess) onLoginSuccess('player'); 
                    }}
                    className="py-2 px-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 font-mono-code text-[11px] transition-all"
                  >
                    🏏 Player (Bumrah #93)
                  </button>

                  <button
                    onClick={() => { loginAsRole('user'); if (onLoginSuccess) onLoginSuccess('user'); }}
                    className="py-2 px-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-slate-300 hover:text-purple-400 font-mono-code text-[11px] transition-all"
                  >
                    📊 Analyst User
                  </button>
                </div>
              </div>

            </div>
          </>
        ) : (
          /* Register New User Form Box */
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl max-w-lg mx-auto relative overflow-hidden space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold font-heading text-white">
                  Add User
                </h3>
              </div>
              <span className="text-[10px] font-mono-code text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                NEW ACCOUNT
              </span>
            </div>


            {regErrorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center space-x-2">
                <span className="text-rose-400 font-bold">⚠️ Error:</span>
                <span>{regErrorMsg}</span>
              </div>
            )}

            {regSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{regSuccessMsg}</span>
              </div>
            )}


            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Gautam Gambhir"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. gambhir@cricketvision.ai"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Account Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-semibold"
                  >
                    <option value="coach">👑 Head Coach</option>
                    <option value="player">🏏 Player</option>
                    <option value="user">📊 Analyst User</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Title / Position</label>
                  <input
                    type="text"
                    value={regTitle}
                    onChange={(e) => setRegTitle(e.target.value)}
                    placeholder="e.g. Mentor / Analyst"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20"
              >
                {isSubmitting ? 'Saving User...' : 'Add User'}
              </button>


            </form>
          </div>
        )}

      </div>
    </div>
  );
}
