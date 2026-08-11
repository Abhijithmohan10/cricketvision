import React, { useState } from 'react';
import { Users, Plus, Trash2, ShieldCheck, AlertTriangle, Sparkles, Check, Flame, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PlayerAvatar from './PlayerAvatar';

export default function TeamBuilderView({ players = [] }) {
  const { isCoach, currentUser, loginAsRole } = useAuth();
  // Pre-select first 11 players into Playing XI
  const [playingXI, setPlayingXI] = useState(() => players.slice(0, 11));
  const [teamName, setTeamName] = useState("CricketVision All-Star XI");


  const availableSquad = players.filter(p => !playingXI.some(xi => xi.id === p.id));

  // Add Player to XI
  const handleAddPlayer = (player) => {
    if (playingXI.length < 11) {
      setPlayingXI([...playingXI, player]);
    }
  };

  // Remove Player from XI
  const handleRemovePlayer = (id) => {
    setPlayingXI(playingXI.filter(p => p.id !== id));
  };

  // AI Synergy & Team Balance Calculator
  const battersCount = playingXI.filter(p => p.role.includes("Batter")).length;
  const bowlersCount = playingXI.filter(p => p.role.includes("Bowler")).length;
  const allroundersCount = playingXI.filter(p => p.role.includes("All-Rounder")).length;
  const wkCount = playingXI.filter(p => p.role.includes("Wicketkeeper")).length;

  const paceCount = playingXI.filter(p => p.bowlingStyle?.includes("Fast") || p.bowlingStyle?.includes("Medium")).length;
  const spinCount = playingXI.filter(p => p.bowlingStyle?.includes("Spin") || p.bowlingStyle?.includes("Break")).length;

  // Calculate Synergy Score out of 100
  let synergyScore = 60;
  if (playingXI.length === 11) synergyScore += 10;
  if (battersCount >= 4) synergyScore += 10;
  if (bowlersCount + allroundersCount >= 5) synergyScore += 10;
  if (paceCount >= 2 && spinCount >= 1) synergyScore += 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header & Team Synergy Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 text-xs font-bold font-mono-code rounded border ${
                isCoach ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {isCoach ? '👑 HEAD COACH TACTICAL SQUAD XI BUILDER' : '🔒 PLAYER VIEW ONLY MODE'}
              </span>
              {!isCoach && (
                <button
                  onClick={() => loginAsRole('coach')}
                  className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded hover:bg-cyan-500/30 transition-all"
                >
                  Switch to Coach to Edit Squad
                </button>
              )}
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={!isCoach}
                className="text-xl font-extrabold font-heading text-white bg-transparent border-b border-dashed border-slate-700 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select 11 players, balance batting depth and bowling variations, and monitor player fatigue index.
            </p>
          </div>

          {/* Synergy Badge */}
          <div className="flex items-center space-x-4 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono-code">AI Team Synergy Score</p>
              <p className="text-2xl font-extrabold font-heading text-cyan-400">{synergyScore} / 100</p>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500 flex items-center justify-center bg-cyan-500/10 text-cyan-400 font-bold text-xs">
              {synergyScore >= 85 ? 'ELITE' : 'GOOD'}
            </div>
          </div>
        </div>

        {/* Roles Distribution Badges */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
            🏏 Batters: <strong className="text-cyan-400">{battersCount}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
            ⚡ Pace Bowlers: <strong className="text-amber-400">{paceCount}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
            🌀 Spin Options: <strong className="text-emerald-400">{spinCount}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
            ⭐ All-Rounders: <strong className="text-pink-400">{allroundersCount}</strong>
          </span>
        </div>

      </div>

      {/* Main Grid: Playing XI Lineup (Left) vs Available Squad (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Playing XI Slots */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold font-heading text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Playing XI Lineup ({playingXI.length} / 11)</span>
            </h2>
          </div>

          <div className="space-y-2">
            {playingXI.map((player, index) => (
              <div
                key={player.id}
                className="glass-panel p-3.5 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-cyan-400 font-mono-code font-bold text-xs flex items-center justify-center border border-slate-800">
                    {index + 1}
                  </span>
                  <PlayerAvatar player={player} className="w-10 h-10" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-bold text-white">{player.name}</p>
                      <span className="text-[10px] font-mono-code bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800">
                        {player.country}
                      </span>
                    </div>
                    <p className="text-[11px] text-cyan-400 font-mono-code">{player.role}</p>
                  </div>
                </div>

                {/* Fatigue Badge & Remove Action */}
                <div className="flex items-center space-x-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-400">Fatigue Index</p>
                    <p className="text-xs font-bold text-emerald-400 font-mono-code">{player.fatigueLevel || 20}%</p>
                  </div>

                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {playingXI.length < 11 && (
              <div className="p-6 rounded-xl border-2 border-dashed border-slate-800 text-center text-slate-500 text-xs font-medium">
                Add {11 - playingXI.length} more player(s) from the available squad pool to complete your XI.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Available Bench & Squad Reserves */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold font-heading text-slate-400 uppercase tracking-wider">
              Available Squad Reserves ({availableSquad.length})
            </h2>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {availableSquad.map((player) => (
              <div
                key={player.id}
                className="glass-panel p-3 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <PlayerAvatar player={player} className="w-9 h-9" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{player.name}</p>
                    <p className="text-[10px] text-cyan-400 font-mono-code truncate">{player.role}</p>
                  </div>
                </div>


                <button
                  onClick={() => handleAddPlayer(player)}
                  disabled={playingXI.length >= 11}
                  className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
