import React, { useState } from 'react';
import { Cpu, Play, RotateCcw, Sparkles, Trophy, Zap, AlertCircle, Shield, ChevronRight } from 'lucide-react';
import { predictMatchOutcome } from '../utils/mlEngine';

export default function MatchSimulatorView({ players = [] }) {
  const [pitchType, setPitchType] = useState('Flat'); // Flat, Green, Dusty, Slow
  const [venue, setVenue] = useState('Wankhede Stadium, Mumbai');
  const [tossDecision, setTossDecision] = useState('Fielding');
  const [dewFactor, setDewFactor] = useState(true);
  const [targetScore, setTargetScore] = useState(185);
  const [overs, setOvers] = useState(20);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  // Default Teams setup from available database
  const teamA = {
    name: "India XI / Royal Squad",
    players: players.slice(0, 5)
  };

  const teamB = {
    name: "Opposition Stars XI",
    players: players.slice(3, 7)
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimResult(null);

    setTimeout(() => {
      const outcome = predictMatchOutcome({
        teamA,
        teamB,
        pitchType,
        venue,
        tossDecision,
        targetScore,
        oversLeft: overs
      });
      setSimResult(outcome);
      setIsSimulating(false);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-xs font-bold font-mono-code bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
              MONTE CARLO & ML ENGINE
            </span>
            <h1 className="text-xl font-extrabold font-heading text-white">AI Match Scenario & Win Probability Simulator</h1>
          </div>
          <p className="text-xs text-slate-400">
            Simulate pitch conditions, dew factor, target chases, and calculate team win probabilities in real-time.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-all shadow-lg shadow-cyan-500/25"
        >
          <Cpu className="w-4 h-4" />
          <span>{isSimulating ? 'Computing Simulation...' : 'Run ML Match Simulation'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Match Parameters Controls */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <h2 className="text-sm font-extrabold font-heading text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Match Scenario Controls</span>
          </h2>

          {/* Pitch Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pitch Condition</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'Flat', label: '🏏 Flat / Batting Paradise' },
                { id: 'Green', label: '🌱 Green Track (Pace/Seam)' },
                { id: 'Dusty', label: '🌪️ Dusty / Turning Pitch' },
                { id: 'Slow', label: '🐌 Slow & Low Bounce' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPitchType(p.id)}
                  className={`p-2.5 rounded-xl text-left font-medium border transition-all ${
                    pitchType === p.id
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Venue Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Stadium Venue</label>
            <select
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="Wankhede Stadium, Mumbai">Wankhede Stadium, Mumbai (Dew Heavy)</option>
              <option value="M. Chinnaswamy, Bengaluru">M. Chinnaswamy, Bengaluru (Short Boundaries)</option>
              <option value="Narendra Modi Stadium, Ahmedabad">Narendra Modi Stadium, Ahmedabad (Massive)</option>
              <option value="Eden Gardens, Kolkata">Eden Gardens, Kolkata (Spin Friendly)</option>
              <option value="Lord's Cricket Ground, London">Lord's, London (Slope & Seam)</option>
            </select>
          </div>

          {/* Target Score & Overs Input */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Score</label>
              <input
                type="number"
                value={targetScore}
                onChange={(e) => setTargetScore(parseInt(e.target.value) || 160)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Toss Decision</label>
              <select
                value={tossDecision}
                onChange={(e) => setTossDecision(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Fielding">Fielding First (Chasing)</option>
                <option value="Batting">Batting First</option>
              </select>
            </div>
          </div>

          {/* Dew Factor Checkbox */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-300 font-medium">Night Match Heavy Dew Factor</span>
            <input
              type="checkbox"
              checked={dewFactor}
              onChange={(e) => setDewFactor(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>

        </div>

        {/* Right 2 Columns: Win Probability & Simulation Results */}
        <div className="lg:col-span-2 space-y-6">
          
          {simResult ? (
            <>
              {/* Win Probability Dial / Bar Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-extrabold font-heading text-white">Live Win Probability Rating</h3>
                  </div>
                  <span className="text-xs font-mono-code text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                    ML CONFIDENCE: 94.6%
                  </span>
                </div>

                {/* Team Win Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-extrabold font-heading">
                    <span className="text-cyan-400">{teamA.name}: {simResult.winProbA}%</span>
                    <span className="text-rose-400">{simResult.winProbB}%: {teamB.name}</span>
                  </div>
                  <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-l-full transition-all duration-700" 
                      style={{ width: `${simResult.winProbA}%` }}
                    />
                    <div 
                      className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-r-full transition-all duration-700" 
                      style={{ width: `${simResult.winProbB}%` }}
                    />
                  </div>
                </div>

                {/* AI Executive Insight Callout */}
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-slate-200 leading-relaxed">
                  <span className="font-bold text-cyan-400">AI Coach Blueprint: </span>
                  {simResult.aiInsight}
                </div>
              </div>

              {/* Innings Phase Score Projections */}
              <div className="grid grid-cols-3 gap-4">
                
                <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-mono-code">POWERPLAY (OVERS 1-6)</p>
                  <p className="text-2xl font-extrabold font-heading text-cyan-400">{simResult.powerplayProjA} Runs</p>
                  <p className="text-[10px] text-emerald-400 font-medium">RR 9.2 (0-1 Wkts)</p>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-mono-code">MIDDLE OVERS (OVERS 7-15)</p>
                  <p className="text-2xl font-extrabold font-heading text-amber-400">{simResult.middleProjA} Runs</p>
                  <p className="text-[10px] text-slate-400">Spin Rotation Focus</p>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-mono-code">DEATH OVERS (OVERS 16-20)</p>
                  <p className="text-2xl font-extrabold font-heading text-emerald-400">{simResult.deathProjA} Runs</p>
                  <p className="text-[10px] text-cyan-400">Yorkers vs Power Hitters</p>
                </div>

              </div>
            </>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
                <Cpu className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Ready for Simulation</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Select pitch conditions, stadium venue, and target score, then click "Run ML Match Simulation" to compute live win probabilities.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
