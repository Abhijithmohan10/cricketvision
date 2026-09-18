import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Award, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Swords, 
  CheckCircle,
  ArrowRight,
  Target
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { INITIAL_PLAYER_DATABASE, getCompletePlayerProfile } from '../data/cricketDatabase';
import PlayerAvatar from './PlayerAvatar';

// Common Head-to-Head Comparison Presets
const PRESET_MATCHUPS = [
  { id: 'kohli_vs_rohit', name: 'Virat Kohli vs Rohit Sharma', p1: 'virat-kohli', p2: 'rohit-sharma' },
  { id: 'bumrah_vs_cummins', name: 'Jasprit Bumrah vs Pat Cummins', p1: 'jasprit-bumrah', p2: 'pat-cummins' },
  { id: 'dhoni_vs_samson', name: 'MS Dhoni vs Sanju Samson', p1: 'ms-dhoni', p2: 'sanju-samson' },
  { id: 'perry_vs_harman', name: 'Ellyse Perry vs Harmanpreet Kaur', p1: 'ellyse-perry', p2: 'harmanpreet-kaur' },
];

export default function PlayerComparisonView({ players = [] }) {
  const activePlayersList = Array.isArray(players) && players.length > 0 ? players : INITIAL_PLAYER_DATABASE;

  const [player1Id, setPlayer1Id] = useState('virat-kohli');
  const [player2Id, setPlayer2Id] = useState('rohit-sharma');

  const rawP1 = activePlayersList.find(p => p.id === player1Id) || activePlayersList[0];
  const rawP2 = activePlayersList.find(p => p.id === player2Id) || activePlayersList[1] || activePlayersList[0];

  const p1 = getCompletePlayerProfile(rawP1);
  const p2 = getCompletePlayerProfile(rawP2);

  // Skill Radar Overlapping Data Format for Recharts
  const radarData = [
    { subject: 'Power Hitting', A: p1?.skillRadar?.powerHitting || 85, B: p2?.skillRadar?.powerHitting || 85 },
    { subject: 'Pace Mastery', A: p1?.skillRadar?.paceMastery || 88, B: p2?.skillRadar?.paceMastery || 88 },
    { subject: 'Spin Control', A: p1?.skillRadar?.spinTechnique || 86, B: p2?.skillRadar?.spinTechnique || 86 },
    { subject: 'Death Execution', A: p1?.skillRadar?.deathExecution || 90, B: p2?.skillRadar?.deathExecution || 90 },
    { subject: 'Precision', A: p1?.skillRadar?.bowlingPrecision || 82, B: p2?.skillRadar?.bowlingPrecision || 82 },
    { subject: 'Clutch Factor', A: p1?.clutchRating || 90, B: p2?.clutchRating || 90 },
  ];

  // Head-to-head Stat Winners
  const p1Sr = parseFloat(p1?.iplStats?.sr || p1?.sr || 135);
  const p2Sr = parseFloat(p2?.iplStats?.sr || p2?.sr || 135);

  const p1Avg = parseFloat(p1?.iplStats?.avg || p1?.avg || 35);
  const p2Avg = parseFloat(p2?.iplStats?.avg || p2?.avg || 35);

  const p1Runs = p1?.iplStats?.runs || p1?.runs || 0;
  const p2Runs = p2?.iplStats?.runs || p2?.runs || 0;

  const p1Wkts = p1?.iplStats?.wickets || p1?.wkts || 0;
  const p2Wkts = p2?.iplStats?.wickets || p2?.wkts || 0;

  const handleApplyPreset = (preset) => {
    setPlayer1Id(preset.p1);
    setPlayer2Id(preset.p2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Title & Preset Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-bold font-mono-code bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md">
              ⚔️ HEAD-TO-HEAD ANALYTICS
            </span>
            <h1 className="text-2xl font-extrabold font-heading text-white">
              Player Head-to-Head Comparison
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Compare stats, skill radar overlays, biomechanics metrics, and AI advantage ratings between any 2 players.
          </p>
        </div>

        {/* Quick Matchup Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono-code text-slate-500 font-bold mr-1">RIVALRY PRESETS:</span>
          {PRESET_MATCHUPS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Player Selection Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PLAYER 1 CARD */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <PlayerAvatar player={p1} className="w-16 h-16" rounded="rounded-2xl" border="border-2 border-cyan-400" />
              <div>
                <select
                  value={player1Id}
                  onChange={(e) => setPlayer1Id(e.target.value)}
                  className="bg-slate-900 text-white font-extrabold text-sm py-1.5 px-3 rounded-xl border border-cyan-500/40 focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {activePlayersList.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.team})</option>
                  ))}
                </select>
                <div className="flex items-center space-x-2 mt-1.5">
                  <span className="text-xs text-cyan-400 font-semibold">{p1?.role}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-mono-code">{p1?.team}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider block">OVERALL RATING</span>
              <span className="text-3xl font-black font-heading text-cyan-400">{p1?.clutchRating || 94}</span>
            </div>
          </div>
        </div>

        {/* PLAYER 2 CARD */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <PlayerAvatar player={p2} className="w-16 h-16" rounded="rounded-2xl" border="border-2 border-emerald-400" />
              <div>
                <select
                  value={player2Id}
                  onChange={(e) => setPlayer2Id(e.target.value)}
                  className="bg-slate-900 text-white font-extrabold text-sm py-1.5 px-3 rounded-xl border border-emerald-500/40 focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  {activePlayersList.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.team})</option>
                  ))}
                </select>
                <div className="flex items-center space-x-2 mt-1.5">
                  <span className="text-xs text-emerald-400 font-semibold">{p2?.role}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-mono-code">{p2?.team}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider block">OVERALL RATING</span>
              <span className="text-3xl font-black font-heading text-emerald-400">{p2?.clutchRating || 92}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Overlapping Skill Radar + Stat Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Overlapping Dual Skill Radar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-extrabold font-heading text-white">Skill Radar Comparison</h3>
            </div>
            
            {/* Legend */}
            <div className="flex items-center space-x-4 text-xs font-bold">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block"></span>
                <span className="text-cyan-300">{p1?.name}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                <span className="text-emerald-300">{p2?.name}</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name={p1?.name} dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                <Radar name={p2?.name} dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono-code">
            <span>🔹 Cyan Polygon: {p1?.name}</span>
            <span>🟢 Emerald Polygon: {p2?.name}</span>
          </div>
        </div>

        {/* Right Column: Key Career & Biomechanics Metrics Side-by-Side */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Swords className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-extrabold font-heading text-white">Head-to-Head Metrics Breakdown</h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
              STATISTICAL OVERLAY
            </span>
          </div>

          <div className="space-y-3">
            
            {/* Metric 1: Total Runs */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className={p1Runs >= p2Runs ? 'text-cyan-400 font-extrabold' : 'text-slate-300'}>{p1Runs} Runs</span>
                <span className="text-slate-400 font-mono-code text-[11px] uppercase">Career Runs</span>
                <span className={p2Runs >= p1Runs ? 'text-emerald-400 font-extrabold' : 'text-slate-300'}>{p2Runs} Runs</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                <div className="bg-cyan-400 h-full" style={{ width: `${(p1Runs / (p1Runs + p2Runs || 1)) * 100}%` }}></div>
                <div className="bg-emerald-400 h-full" style={{ width: `${(p2Runs / (p1Runs + p2Runs || 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* Metric 2: Batting Average */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className={p1Avg >= p2Avg ? 'text-cyan-400 font-extrabold' : 'text-slate-300'}>{p1Avg}</span>
                <span className="text-slate-400 font-mono-code text-[11px] uppercase">Batting Average</span>
                <span className={p2Avg >= p1Avg ? 'text-emerald-400 font-extrabold' : 'text-slate-300'}>{p2Avg}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                <div className="bg-cyan-400 h-full" style={{ width: `${(p1Avg / (p1Avg + p2Avg || 1)) * 100}%` }}></div>
                <div className="bg-emerald-400 h-full" style={{ width: `${(p2Avg / (p1Avg + p2Avg || 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* Metric 3: Strike Rate */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className={p1Sr >= p2Sr ? 'text-cyan-400 font-extrabold' : 'text-slate-300'}>{p1Sr}</span>
                <span className="text-slate-400 font-mono-code text-[11px] uppercase">Strike Rate</span>
                <span className={p2Sr >= p1Sr ? 'text-emerald-400 font-extrabold' : 'text-slate-300'}>{p2Sr}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                <div className="bg-cyan-400 h-full" style={{ width: `${(p1Sr / (p1Sr + p2Sr || 1)) * 100}%` }}></div>
                <div className="bg-emerald-400 h-full" style={{ width: `${(p2Sr / (p1Sr + p2Sr || 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* Metric 4: Total Wickets */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className={p1Wkts >= p2Wkts ? 'text-cyan-400 font-extrabold' : 'text-slate-300'}>{p1Wkts} Wkts</span>
                <span className="text-slate-400 font-mono-code text-[11px] uppercase">Career Wickets</span>
                <span className={p2Wkts >= p1Wkts ? 'text-emerald-400 font-extrabold' : 'text-slate-300'}>{p2Wkts} Wkts</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                <div className="bg-cyan-400 h-full" style={{ width: `${(p1Wkts / (p1Wkts + p2Wkts || 1)) * 100}%` }}></div>
                <div className="bg-emerald-400 h-full" style={{ width: `${(p2Wkts / (p1Wkts + p2Wkts || 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* Metric 5: Video Computer Vision Shot Perfection */}
            <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/20 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-cyan-400 font-extrabold">96% Perfection</span>
                <span className="text-amber-400 font-mono-code text-[11px] uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3" /> CV Shot Perfection
                </span>
                <span className="text-emerald-400 font-extrabold">94% Perfection</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                <div className="bg-cyan-400 h-full" style={{ width: '51%' }}></div>
                <div className="bg-emerald-400 h-full" style={{ width: '49%' }}></div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* AI Head-to-Head Tactical Advantage Verdict */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 relative overflow-hidden bg-slate-950/80 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-extrabold font-heading text-white">AI Head-to-Head Tactical Verdict</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
              <Zap className="w-4 h-4" />
              <span>Pace & Express Pitch Advantage</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-400">{p1?.name}</strong> demonstrates superior top-wrist downswing control (+{Math.abs(p1Sr - p2Sr).toFixed(1)} SR differential) against 140+ km/h pace deliveries.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
              <Target className="w-4 h-4" />
              <span>Spin & Slow Track Execution</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-emerald-400">{p2?.name}</strong> holds a lower dot ball percentage against left-arm spin with enhanced lofted V-extension through long-off.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>Clutch Match Rating</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Overall Clutch rating rates <strong className="text-white">{p1?.name} ({p1?.clutchRating || 94})</strong> and <strong className="text-white">{p2?.name} ({p2?.clutchRating || 92})</strong> as elite match-winners.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
