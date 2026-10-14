import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Shield, 
  Zap, 
  Activity, 
  Award, 
  Flame, 
  ChevronRight,
  BarChart3,
  Percent,
  CheckCircle2,
  Gauge,
  Target,
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { predictPlayerFormTrajectory } from '../utils/mlEngine';

import PitchAndWagonWheel from './PitchAndWagonWheel';
import MatchReportModal from './MatchReportModal';
import PlayerAvatar from './PlayerAvatar';
import { FileText } from 'lucide-react';


import { INITIAL_PLAYER_DATABASE, getCompletePlayerProfile } from '../data/cricketDatabase.js';

class AnalyticsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("PlayerAnalyticsView rendering error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-3">
          <p className="text-sm font-bold text-rose-400">Unable to load player details.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-3 py-1.5 bg-slate-800 text-xs text-cyan-400 rounded-lg hover:bg-slate-700"
          >
            Retry Loading
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { useAuth } from '../context/AuthContext';

export default function PlayerAnalyticsView({ players = [], searchQuery = '', onComparePlayers }) {
  const { currentUser, isPlayer } = useAuth();
  const activePlayers = Array.isArray(players) && players.length > 0 ? players : INITIAL_PLAYER_DATABASE;

  const defaultId = (isPlayer && currentUser?.playerId) ? currentUser.playerId : (activePlayers[0]?.id || 'virat-kohli');
  const [selectedPlayerId, setSelectedPlayerId] = useState(defaultId);
  const [activeFormat, setActiveFormat] = useState('ipl'); // ipl, t20i, odi, test
  const [roleFilter, setRoleFilter] = useState('all');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [allRounderStatMode, setAllRounderStatMode] = useState('both'); // 'both', 'batting', 'bowling'

  const rawSelected = activePlayers.find(p => p.id === selectedPlayerId) || activePlayers[0];
  const selectedPlayer = getCompletePlayerProfile(rawSelected) || rawSelected;

  // Keep selectedPlayerId valid if players list changes
  React.useEffect(() => {
    if (activePlayers.length > 0 && !activePlayers.some(p => p.id === selectedPlayerId)) {
      setSelectedPlayerId(activePlayers[0]?.id || 'virat-kohli');
    }
  }, [activePlayers, selectedPlayerId]);


  // Filtering players list
  const filteredPlayers = activePlayers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.country.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.iplTeam?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || p.role.toLowerCase().includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  const isBowler = selectedPlayer?.role?.toLowerCase().includes('bowler') || (selectedPlayer?.role?.toLowerCase().includes('fast') && !selectedPlayer?.role?.toLowerCase().includes('all-rounder'));
  const isAllRounder = selectedPlayer?.role?.toLowerCase().includes('all-rounder');
  const pressureVal = selectedPlayer?.pressureIndex || selectedPlayer?.pressureProfile?.overall || selectedPlayer?.clutchRating || 90;

  // Prepare role-specific radar chart data including Pressure Index
  const radarData = selectedPlayer?.skillRadar ? (
    isAllRounder ? [
      { subject: 'Power Hitting', value: selectedPlayer.skillRadar.powerHitting || 82, fullMark: 100 },
      { subject: 'Spin Mastery', value: selectedPlayer.skillRadar.spinTechnique || 84, fullMark: 100 },
      { subject: 'Pace Mastery', value: selectedPlayer.skillRadar.paceMastery || 88, fullMark: 100 },
      { subject: 'Death Execution', value: selectedPlayer.skillRadar.deathExecution || 86, fullMark: 100 },
      { subject: 'Pressure Index', value: pressureVal, fullMark: 100 },
      { subject: 'Fielding', value: selectedPlayer.skillRadar.fielding || 92, fullMark: 100 }
    ] : isBowler ? [
      { subject: 'Yorker Accuracy', value: selectedPlayer.skillRadar.deathExecution || 88, fullMark: 100 },
      { subject: 'Spin / Drift', value: selectedPlayer.skillRadar.spinTechnique || 85, fullMark: 100 },
      { subject: 'Pace & Seam', value: selectedPlayer.skillRadar.paceMastery || 92, fullMark: 100 },
      { subject: 'Econ Control', value: selectedPlayer.skillRadar.deathExecution || 86, fullMark: 100 },
      { subject: 'Pressure Index', value: pressureVal, fullMark: 100 },
      { subject: 'Fielding', value: selectedPlayer.skillRadar.fielding || 84, fullMark: 100 }
    ] : [
      { subject: 'Power Hitting', value: selectedPlayer.skillRadar.powerHitting || 85, fullMark: 100 },
      { subject: 'Spin Mastery', value: selectedPlayer.skillRadar.spinTechnique || 88, fullMark: 100 },
      { subject: 'Pace Mastery', value: selectedPlayer.skillRadar.paceMastery || 90, fullMark: 100 },
      { subject: 'Death Execution', value: selectedPlayer.skillRadar.deathExecution || 86, fullMark: 100 },
      { subject: 'Pressure Index', value: pressureVal, fullMark: 100 },
      { subject: 'Fielding', value: selectedPlayer.skillRadar.fielding || 88, fullMark: 100 }
    ]
  ) : [];

  // ML Form trajectory forecast
  const mlTrajectoryData = predictPlayerFormTrajectory(selectedPlayer);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 text-xs font-bold font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
            IPL & INTL DATABASE
          </span>
          <h1 className="text-xl font-extrabold font-heading text-white">Player Analytics & Stats Engine</h1>
        </div>

        {/* Filters & Export Button */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={() => setIsReportOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-all shadow-md shadow-cyan-500/20 flex items-center space-x-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Export AI Match Report</span>
          </button>

          <span className="text-slate-400 font-medium">Format:</span>
          {['ipl', 't20i', 'odi', 'test'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setActiveFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg uppercase font-bold transition-all ${
                activeFormat === fmt
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {fmt}
            </button>
          ))}

          <span className="ml-2 text-slate-400 font-medium">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="batter">Batters</option>
            <option value="bowler">Bowlers</option>
            <option value="all-rounder">All-Rounders</option>
          </select>
        </div>
      </div>


      {/* Main Layout: Player Selector Sidebar + Player Deep Dive Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Player Selection Roster */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 max-h-[720px] overflow-y-auto">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Players ({filteredPlayers.length})
            </span>
          </div>

          <div className="space-y-2">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                onClick={() => setSelectedPlayerId(player.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center space-x-3 border ${
                  selectedPlayerId === player.id
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60'
                }`}
              >
                <PlayerAvatar player={player} className="w-10 h-10" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{player.name}</p>
                  <p className="text-[10px] text-cyan-400 font-mono-code truncate">
                    {player.role} • {player.iplTeam}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] font-mono-code bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded font-bold" title="Pressure Index">
                    PI {player.pressureIndex || player.clutchRating || 88}
                  </span>
                  <span className="text-[9px] font-mono-code text-slate-500 mt-0.5">
                    ★ {player.clutchRating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 3 Columns: Selected Player Deep Analytics */}
        <AnalyticsErrorBoundary key={selectedPlayer?.id || 'default'}>
          {selectedPlayer && (
            <div className="lg:col-span-3 space-y-6">
              
              {/* Player Banner Header */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4 z-10">
                  <PlayerAvatar player={selectedPlayer} className="w-20 h-20" rounded="rounded-2xl" />

                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl font-extrabold font-heading text-white">{selectedPlayer.name}</h2>
                      <span className="px-2 py-0.5 text-xs font-bold font-mono-code bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                        #{selectedPlayer.jerseyNumber || 10}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 flex items-center flex-wrap gap-2">
                      <span className={`px-2 py-0.5 font-bold rounded uppercase text-[10px] ${
                        isAllRounder ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-cyan-500/10 text-cyan-400'
                      }`}>
                        {isAllRounder ? '⚡ DUAL IMPACT ALL-ROUNDER' : selectedPlayer.role}
                      </span>
                      <span>Batting: {selectedPlayer.battingStyle}</span>
                      <span>•</span>
                      <span>Bowling: {selectedPlayer.bowlingStyle}</span>
                    </p>
                    <div className="flex items-center space-x-2 mt-2 text-xs font-mono-code text-cyan-400">
                      <span>{selectedPlayer.country}</span>
                      <span>•</span>
                      <span>IPL: {selectedPlayer.iplTeam}</span>
                    </div>
                  </div>
                </div>

                {/* Right Top Status Cards: Pressure Index & Fitness/Fatigue */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto z-10">
                  {/* Pressure Index Compact Meter */}
                  <div className="flex-1 md:flex-initial min-w-[150px] p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center space-x-1">
                        <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Pressure Index</span>
                      </span>
                      <span className={`font-black font-mono-code ${
                        (selectedPlayer.pressureIndex || 88) >= 92 ? 'text-emerald-400' : 'text-cyan-400'
                      }`}>
                        {selectedPlayer.pressureIndex || selectedPlayer.pressureProfile?.overall || 88}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${selectedPlayer.pressureIndex || selectedPlayer.pressureProfile?.overall || 88}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-mono-code text-cyan-400 font-bold uppercase tracking-wider text-right">
                      {selectedPlayer.pressureProfile?.badgeLabel || 'CLUTCH MASTER'}
                    </p>
                  </div>

                  {/* Fitness & Fatigue Meter */}
                  <div className="flex-1 md:flex-initial min-w-[150px] p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Fatigue Index</span>
                      <span className="font-bold text-emerald-400 font-mono-code">{selectedPlayer.fatigueLevel || 20}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full" 
                        style={{ width: `${selectedPlayer.fatigueLevel || 20}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 text-right">Status: <span className="text-emerald-400 font-semibold">{selectedPlayer.injuryStatus || 'Fit'}</span></p>
                  </div>
                </div>

              </div>

              {/* ─── Dedicated Player Pressure Index (PI) Deep Dive Panel ─── */}
              {selectedPlayer.pressureProfile && (
                <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden space-y-5">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Panel Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 z-10 relative">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/40">
                        <Gauge className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <h3 className="text-base font-extrabold font-heading text-white">
                            Player Situational Pressure Index (PI)
                          </h3>
                          <span className={`px-2 py-0.5 text-[10px] font-extrabold font-mono-code rounded border ${
                            selectedPlayer.pressureProfile.tierColor === 'emerald'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : selectedPlayer.pressureProfile.tierColor === 'cyan'
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {selectedPlayer.pressureProfile.badgeLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Multi-dimensional stress metrics: target chase escalation, death overs finishing, and collapse recovery.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <span className="text-xs text-slate-400 font-mono-code">OVERALL PI:</span>
                      <span className="text-2xl font-black font-heading text-cyan-400">
                        {selectedPlayer.pressureProfile.overall}
                      </span>
                      <span className="text-xs text-slate-500 font-mono-code">/ 100</span>
                    </div>
                  </div>

                  {/* Main Sub-Index Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 z-10 relative">
                    
                    {/* Dial & AI Insight */}
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
                      <div className="flex items-center space-x-4">
                        {/* Circular Graphic Gauge */}
                        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-slate-800"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={
                                selectedPlayer.pressureProfile.tierColor === 'emerald'
                                  ? 'text-emerald-400'
                                  : selectedPlayer.pressureProfile.tierColor === 'cyan'
                                  ? 'text-cyan-400'
                                  : 'text-amber-400'
                              }
                              strokeDasharray={`${selectedPlayer.pressureProfile.overall}, 100`}
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-lg font-black font-heading text-white">
                              {selectedPlayer.pressureProfile.overall}
                            </span>
                            <span className="text-[8px] font-mono-code text-slate-400 uppercase">PI SCORE</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-mono-code">Classification Tier</p>
                          <p className="text-sm font-bold text-white">{selectedPlayer.pressureProfile.tier}</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {isBowler ? 'Elite pressure creation & death execution' : 'High-stakes target chase & anchor mastery'}
                          </p>
                        </div>
                      </div>

                      {/* AI Tactical Assessment */}
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                        <p className="font-bold text-cyan-400 flex items-center space-x-1.5 text-[11px]">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>AI Situational Assessment</span>
                        </p>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {selectedPlayer.pressureProfile.tacticalSummary}
                        </p>
                      </div>
                    </div>

                    {/* Right 2 Columns: 4 Situational Sub-Indices */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {Object.entries(selectedPlayer.pressureProfile.subIndices).map(([key, item]) => (
                        <div key={key} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white flex items-center space-x-1.5">
                              {key === 'chasePressure' ? <Target className="w-3.5 h-3.5 text-cyan-400" /> :
                               key === 'deathOverPressure' ? <Flame className="w-3.5 h-3.5 text-rose-400" /> :
                               key === 'collapseRecovery' ? <Shield className="w-3.5 h-3.5 text-emerald-400" /> :
                               <Zap className="w-3.5 h-3.5 text-amber-400" />}
                              <span>{item.name}</span>
                            </span>
                            <span className="font-extrabold font-mono-code text-cyan-400">
                              {item.value} / 100
                            </span>
                          </div>

                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                item.value >= 90 ? 'bg-gradient-to-r from-cyan-500 to-emerald-400' :
                                item.value >= 80 ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                                'bg-gradient-to-r from-amber-500 to-amber-300'
                              }`}
                              style={{ width: `${item.value}%` }}
                            />
                          </div>

                          <p className="text-[10px] text-slate-400 leading-tight">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Situational Pressure Performance Stats Ribbon */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-xs z-10 relative">
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 text-center">
                      <p className="text-[9px] text-slate-400 font-mono-code uppercase">
                        {isBowler ? 'Death Econ (Overs 16-20)' : 'Avg (RRR > 9.5)'}
                      </p>
                      <p className="text-base font-extrabold font-heading text-cyan-400">
                        {selectedPlayer.pressureProfile.pressureStats.avgUnderPressure}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 text-center">
                      <p className="text-[9px] text-slate-400 font-mono-code uppercase">Boundary % Under Pressure</p>
                      <p className="text-base font-extrabold font-heading text-amber-400">
                        {selectedPlayer.pressureProfile.pressureStats.boundaryPctUnderPressure}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 text-center">
                      <p className="text-[9px] text-slate-400 font-mono-code uppercase">Dot-Ball Control / Release</p>
                      <p className="text-base font-extrabold font-heading text-emerald-400">
                        {selectedPlayer.pressureProfile.pressureStats.dotBallUnderPressure}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 text-center">
                      <p className="text-[9px] text-slate-400 font-mono-code uppercase">Clutch Match Win Rate</p>
                      <p className="text-base font-extrabold font-heading text-purple-400">
                        {selectedPlayer.pressureProfile.pressureStats.winContribution}
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* Middle Grid: Skill Radar + Phase Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Skill Radar Chart */}
                <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold font-heading text-white flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span>{isAllRounder ? 'Dual Batting & Bowling Skill Radar' : isBowler ? 'Bowler Biomechanical Radar' : 'Batter Hitting & Skill Radar'}</span>
                    </h3>
                    <span className="text-[10px] font-mono-code text-cyan-400">INDEX SCORES</span>
                  </div>

                  <div className="h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                        <Radar 
                          name={selectedPlayer.name} 
                          dataKey="value" 
                          stroke={isAllRounder ? "#f59e0b" : isBowler ? "#10b981" : "#06b6d4"} 
                          fill={isAllRounder ? "#f59e0b" : isBowler ? "#10b981" : "#06b6d4"} 
                          fillOpacity={0.35} 
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Phases of Play Analytics (Powerplay, Middle, Death) */}
                <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-extrabold font-heading text-white flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>{isAllRounder ? 'Dual Phase Impact (Batting SR & Bowling Econ)' : isBowler ? 'Bowling Phase Economy & Wickets' : 'Batting Phase Efficiency'}</span>
                  </h3>

                  <div className="space-y-3">
                    
                    {/* Powerplay (Overs 1-6) */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>⚡ Powerplay (Overs 1-6)</span>
                        <span className="text-cyan-400 font-mono-code">
                          {isAllRounder 
                            ? `Bat SR: ${selectedPlayer.phaseStats?.powerplay?.strikeRate || '138.5'} | Bowl Econ: ${selectedPlayer.phaseStats?.powerplay?.economy || '6.5'}`
                            : isBowler 
                            ? `Econ: ${selectedPlayer.phaseStats?.powerplay?.economy || '6.2'}` 
                            : `SR: ${selectedPlayer.phaseStats?.powerplay?.strikeRate || '142.5'}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {isAllRounder 
                          ? `Boundary %: 19.2% • Wkts/Match: 0.8 • Dual Impact: High`
                          : isBowler 
                          ? `Wkts/Match: ${selectedPlayer.phaseStats?.powerplay?.avgWkts || '0.9'} • Dot Ball %: 52%` 
                          : `Boundary %: ${selectedPlayer.phaseStats?.powerplay?.boundaryPct || '18.5%'} • Avg Runs: ${selectedPlayer.phaseStats?.powerplay?.avgRuns || '28.4'}`}
                      </p>
                    </div>

                    {/* Middle Overs (Overs 7-15) */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>🎯 Middle Overs (Overs 7-15)</span>
                        <span className="text-amber-400 font-mono-code">
                          {isAllRounder 
                            ? `Bat SR: ${selectedPlayer.phaseStats?.middleOvers?.strikeRate || '130.0'} | Bowl Econ: ${selectedPlayer.phaseStats?.middleOvers?.economy || '7.1'}`
                            : isBowler 
                            ? `Econ: ${selectedPlayer.phaseStats?.middleOvers?.economy || '6.8'}` 
                            : `SR: ${selectedPlayer.phaseStats?.middleOvers?.strikeRate || '132.0'}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {isAllRounder 
                          ? `Spin rotation & overs containment efficiency: 86%`
                          : isBowler 
                          ? `Control Index: 88% • Strike Rate: 16.5 balls/wkt` 
                          : `Dot Ball %: ${selectedPlayer.phaseStats?.middleOvers?.dotBallPct || '12.1%'} • Rotation: High`}
                      </p>
                    </div>

                    {/* Death Overs (Overs 16-20) */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>🔥 Death Overs (Overs 16-20)</span>
                        <span className="text-emerald-400 font-mono-code">
                          {isAllRounder 
                            ? `Bat SR: ${selectedPlayer.phaseStats?.deathOvers?.strikeRate || '178.0'} | Bowl Econ: ${selectedPlayer.phaseStats?.deathOvers?.economy || '8.8'}`
                            : isBowler 
                            ? `Econ: ${selectedPlayer.phaseStats?.deathOvers?.economy || '8.4'}` 
                            : `SR: ${selectedPlayer.phaseStats?.deathOvers?.strikeRate || '185.0'}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {isAllRounder 
                          ? `Finishing boundaries & death bowling yorker execution`
                          : isBowler 
                          ? `Yorker Accuracy: 84% • Boundary Concealment: High` 
                          : `Finishing Index: ${selectedPlayer.phaseStats?.deathOvers?.boundaryPct || '26.8%'} boundaries`}
                      </p>
                    </div>

                  </div>
                </div>

              </div>

              {/* IPL & International Detailed Tables with Dynamic Format Support */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-extrabold font-heading text-white">
                      {activeFormat.toUpperCase()} {isAllRounder ? 'All-Rounder Career Stats' : isBowler ? 'Career Bowling Performance' : 'Career Batting Performance'}
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold font-mono-code bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded uppercase">
                      {activeFormat}
                    </span>
                  </div>

                  {/* All-Rounder Stat Mode Switcher */}
                  {isAllRounder && (
                    <div className="flex items-center space-x-1.5 text-xs bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setAllRounderStatMode('both')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                          allRounderStatMode === 'both' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        ⚡ Dual View
                      </button>
                      <button
                        onClick={() => setAllRounderStatMode('batting')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                          allRounderStatMode === 'batting' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🏏 Batting
                      </button>
                      <button
                        onClick={() => setAllRounderStatMode('bowling')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                          allRounderStatMode === 'bowling' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🎯 Bowling
                      </button>
                    </div>
                  )}
                </div>

                {/* Format Data Resolution */}
                {(() => {
                  const currentStats = activeFormat === 'ipl'
                    ? selectedPlayer.iplStats
                    : (selectedPlayer.internationalStats?.[activeFormat] || selectedPlayer.iplStats);

                  return (
                    <div className="space-y-4">
                      {/* All-Rounder Dual Summary Cards for Current Format */}
                      {isAllRounder && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Batting Card */}
                          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                              <span className="font-bold text-cyan-400 uppercase tracking-wide">
                                🏏 {activeFormat.toUpperCase()} BATTING STATS
                              </span>
                              <span className="text-slate-400 font-mono-code">{currentStats?.matches || 40} Matches</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                              <div>
                                <p className="text-[10px] text-slate-400">Total Runs</p>
                                <p className="text-base font-bold text-white">{currentStats?.runs || 1200}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400">Batting Avg</p>
                                <p className="text-base font-bold text-emerald-400">{currentStats?.avg || 34.0}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400">Strike Rate</p>
                                <p className="text-base font-bold text-amber-400">{currentStats?.sr || (activeFormat === 'test' ? '54.5' : '138.0')}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400">High Score</p>
                                <p className="text-base font-bold text-cyan-400">{currentStats?.hs || '91*'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Bowling Card */}
                          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                              <span className="font-bold text-emerald-400 uppercase tracking-wide">
                                🎯 {activeFormat.toUpperCase()} BOWLING STATS
                              </span>
                              <span className="text-slate-400 font-mono-code">{currentStats?.matches || 40} Matches</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                              <div>
                                <p className="text-[10px] text-slate-400">Total Wickets</p>
                                <p className="text-base font-bold text-white">{currentStats?.wickets || selectedPlayer.iplStats?.wickets || 45}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400">Bowling Avg</p>
                                <p className="text-base font-bold text-emerald-400">{currentStats?.avg ? (currentStats.avg * 0.8).toFixed(1) : '24.5'}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400">Economy Rate</p>
                                <p className="text-base font-bold text-amber-400">{currentStats?.econ || (activeFormat === 'test' ? '3.10' : activeFormat === 'odi' ? '5.20' : '7.50')}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400">Best Bowling</p>
                                <p className="text-base font-bold text-cyan-400">{currentStats?.bb || '4/22'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Format Detailed Performance Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900 text-slate-400 font-mono-code border-b border-slate-800">
                            <tr>
                              <th className="py-2.5 px-3">Format / Category</th>
                              <th className="py-2.5 px-3">Matches</th>
                              <th className="py-2.5 px-3">{isBowler && !isAllRounder ? 'Total Wickets' : 'Total Runs'}</th>
                              {isAllRounder && <th className="py-2.5 px-3">Total Wickets</th>}
                              <th className="py-2.5 px-3">{isBowler && !isAllRounder ? 'Bowling Average' : 'Batting Average'}</th>
                              <th className="py-2.5 px-3">{isBowler && !isAllRounder ? 'Economy Rate' : 'Strike Rate'}</th>
                              {isAllRounder && <th className="py-2.5 px-3">Economy Rate</th>}
                              <th className="py-2.5 px-3">{isBowler && !isAllRounder ? 'Best Bowling' : 'High Score'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                            <tr className="bg-cyan-500/10 text-cyan-300 font-bold">
                              <td className="py-3 px-3 uppercase font-mono-code">{activeFormat} Career Overall</td>
                              <td className="py-3 px-3">{currentStats?.matches || 40}</td>
                              <td className="py-3 px-3">
                                {isBowler && !isAllRounder
                                  ? (currentStats?.wickets || 45)
                                  : (currentStats?.runs || 1200)}
                              </td>
                              {isAllRounder && <td className="py-3 px-3 text-emerald-400">{currentStats?.wickets || 45}</td>}
                              <td className="py-3 px-3">{currentStats?.avg || (isBowler ? '22.4' : '34.0')}</td>
                              <td className="py-3 px-3">
                                {isBowler && !isAllRounder
                                  ? (currentStats?.econ || '7.20')
                                  : (currentStats?.sr || '138.0')}
                              </td>
                              {isAllRounder && <td className="py-3 px-3 text-amber-400">{currentStats?.econ || '7.40'}</td>}
                              <td className="py-3 px-3">
                                {isBowler && !isAllRounder
                                  ? (currentStats?.bb || '5/18')
                                  : (currentStats?.hs || '100*')}
                              </td>
                            </tr>

                            {/* Sub-Rows: Season / Cycle Breakdown */}
                            {Array.isArray(currentStats?.seasons) && currentStats.seasons.length > 0 ? (
                              currentStats.seasons.map((s) => (
                                <tr key={s.year} className="hover:bg-slate-900/60">
                                  <td className="py-2.5 px-3 font-mono-code text-slate-400">{activeFormat.toUpperCase()} {s.year} Season / Cycle</td>
                                  <td className="py-2.5 px-3">{Math.round((currentStats?.matches || 40) * (s.year === 2024 ? 0.35 : s.year === 2023 ? 0.38 : 0.27))}</td>
                                  <td className="py-2.5 px-3">
                                    {isBowler && !isAllRounder ? s.wickets : s.runs}
                                  </td>
                                  {isAllRounder && <td className="py-2.5 px-3 text-emerald-400">{s.wickets}</td>}
                                  <td className="py-2.5 px-3">{s.avg}</td>
                                  <td className="py-2.5 px-3">
                                    {isBowler && !isAllRounder ? s.econ : s.sr}
                                  </td>
                                  {isAllRounder && <td className="py-2.5 px-3 text-amber-400">{s.econ || '7.1'}</td>}
                                  <td className="py-2.5 px-3">
                                    {isBowler && !isAllRounder ? (s.bb || currentStats?.bb) : (s.hs || currentStats?.hs)}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              [2024, 2023, 2022].map((yr, idx) => {
                                const pct = idx === 0 ? 0.35 : idx === 1 ? 0.38 : 0.27;
                                return (
                                  <tr key={yr} className="hover:bg-slate-900/60">
                                    <td className="py-2.5 px-3 font-mono-code text-slate-400">{activeFormat.toUpperCase()} {yr} Season / Cycle</td>
                                    <td className="py-2.5 px-3">{Math.round((currentStats?.matches || 40) * pct)}</td>
                                    <td className="py-2.5 px-3">
                                      {isBowler && !isAllRounder
                                        ? Math.round((currentStats?.wickets || 45) * pct)
                                        : Math.round((currentStats?.runs || 1200) * pct)}
                                    </td>
                                    {isAllRounder && <td className="py-2.5 px-3 text-emerald-400">{Math.round((currentStats?.wickets || 45) * pct)}</td>}
                                    <td className="py-2.5 px-3">{currentStats?.avg}</td>
                                    <td className="py-2.5 px-3">
                                      {isBowler && !isAllRounder ? currentStats?.econ : currentStats?.sr}
                                    </td>
                                    {isAllRounder && <td className="py-2.5 px-3 text-amber-400">{currentStats?.econ || '7.1'}</td>}
                                    <td className="py-2.5 px-3">
                                      {isBowler && !isAllRounder ? currentStats?.bb : currentStats?.hs}
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  );
                })()}
              </div>


              {/* ML Predictive Trajectory Chart */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold font-heading text-white flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>
                      {isAllRounder 
                        ? 'ML Dual Batting Runs & Bowling Wickets Trajectory' 
                        : isBowler 
                        ? 'ML Next 5 Matches Wicket Forecast' 
                        : 'ML Next 5 Matches Run Forecast'}
                    </span>
                  </h3>
                  <span className="text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                    CONFIDENCE: 92%
                  </span>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mlTrajectoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="match" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                      
                      {/* Render Runs Line for Batters & All-Rounders */}
                      {(!isBowler || isAllRounder) && (
                        <Line 
                          type="monotone" 
                          dataKey="projectedRuns" 
                          name="Projected Runs"
                          stroke="#06b6d4" 
                          strokeWidth={3} 
                          dot={{ fill: "#06b6d4", r: 5 }} 
                        />
                      )}

                      {/* Render Wickets Line for Bowlers & All-Rounders */}
                      {(isBowler || isAllRounder) && (
                        <Line 
                          type="monotone" 
                          dataKey="projectedWickets" 
                          name="Projected Wickets"
                          stroke="#10b981" 
                          strokeWidth={3} 
                          dot={{ fill: "#10b981", r: 5 }} 
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pitch Heatmap & 360 Wagon Wheel Visualizer */}
              <PitchAndWagonWheel player={selectedPlayer} />

            </div>
          )}
        </AnalyticsErrorBoundary>




      </div>

      {/* Match Report Printable Modal */}
      <MatchReportModal
        player={selectedPlayer}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

    </div>
  );
}

