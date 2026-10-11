import React from 'react';
import { 
  Activity, 
  Video, 
  Database, 
  Cpu, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  AlertTriangle, 
  ChevronRight,
  Sparkles,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PlayerAvatar from './PlayerAvatar';

export default function DashboardView({ players = [], setActiveTab, onOpenAICoach }) {
  const { currentUser, isCoach, isPlayer } = useAuth();

  const topPerformers = players.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 text-[10px] font-bold font-mono-code rounded border ${
              isCoach ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {currentUser?.badge || (isCoach ? '👑 HEAD COACH (FULL ACCESS)' : '🏏 PLAYER PORTAL (USER-WISE DATA)')}
            </span>
            <span className="text-xs text-slate-400">IPL & International Season 2026</span>
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-white">
            Welcome back, <span className="text-cyan-400">{currentUser?.name || 'User'}</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            {isCoach 
              ? "CricketVision AI is actively monitoring squad biomechanics, squad Playing XI selection, and match probability simulations."
              : `Viewing user-wise personal data access portal for ${currentUser?.name}. Access your biomechanics video analysis, personalized AI training drills, and pitch heat maps.`}
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          {isPlayer ? (
            <button
              onClick={() => setActiveTab('player_portal')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-all shadow-md shadow-amber-500/20"
            >
              <Zap className="w-4 h-4" />
              <span>Open My Player Portal</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('team_builder')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-all shadow-md shadow-cyan-500/20"
            >
              <Users className="w-4 h-4" />
              <span>Playing XI Builder</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('video_analyzer')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-200 font-bold text-xs transition-all"
          >
            <Video className="w-4 h-4 text-cyan-400" />
            <span>AI Video Upload</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Squad Win Index</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold font-heading text-white">78.4%</p>
          <p className="text-[10px] text-emerald-400 font-medium flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +4.2% from last fixture
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Batting Power Rating</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold font-heading text-white">92.8</p>
          <p className="text-[10px] text-slate-400 font-mono-code">Avg T20 SR: 148.5</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Bowling Death Economy</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold font-heading text-white">7.12 rpo</p>
          <p className="text-[10px] text-cyan-400 font-medium">Bumrah & Rashid leading</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Squad Fatigue Risk</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold font-heading text-emerald-400">Low (22%)</p>
          <p className="text-[10px] text-slate-400">All key bowlers fit</p>
        </div>

      </div>

      {/* Main Grid: Top Performers Cards + AI Tactical Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Top Form Stars */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold font-heading text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Top IPL & International Performers</span>
            </h2>
            <button
              onClick={() => setActiveTab('database')}
              className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>View Full DB</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topPerformers.map((player) => (
              <div
                key={player.id}
                onClick={() => setActiveTab('database')}
                className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <PlayerAvatar player={player} className="w-12 h-12" rounded="rounded-xl" />

                  <div>
                    <h3 className="text-sm font-bold text-white">{player.name}</h3>
                    <p className="text-[11px] text-cyan-400 font-mono-code">{player.country} • {player.iplTeam}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <div>
                    <p className="text-[9px] text-slate-400">Matches</p>
                    <p className="font-bold text-white">{player.iplStats?.matches}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400">Runs/Wkts</p>
                    <p className="font-bold text-cyan-400">{player.iplStats?.runs || player.iplStats?.wickets}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400">Clutch Rating</p>
                    <p className="font-bold text-amber-400">★ {player.clutchRating}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: AI Tactical Assistant & Alerts */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-extrabold font-heading text-white">AI Tactical Intelligence</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-slate-200">
                <p className="font-bold text-cyan-400">Matchup Alert</p>
                <p className="mt-1">
                  Kohli scores 154.6 SR against pace in Powerplay on flat tracks. Recommend attacking with left-arm slow orthogonal early.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-slate-200">
                <p className="font-bold text-emerald-400">Death Bowling Efficiency</p>
                <p className="mt-1">
                  Jasprit Bumrah's yorker accuracy is 88.4% with economy under 7.12 in death overs.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAICoach}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-all shadow-md shadow-cyan-500/20"
            >
              Ask AI Tactical Coach
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
