import React, { useState } from 'react';
import { Sparkles, TrendingUp, Target, ShieldAlert, Award, ChevronRight, Zap, RefreshCw, BarChart2 } from 'lucide-react';
import { predictNextMatchPlayerStats } from '../utils/mlEngine';

export default function NextMatchPredictorView({ players = [] }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0]?.id || 'virat-kohli');
  const [opposition, setOpposition] = useState('Australia XI');
  const [pitchType, setPitchType] = useState('Flat');
  const [venue, setVenue] = useState('Wankhede Stadium, Mumbai');

  const selectedPlayer = players.find(p => p.id === selectedPlayerId) || players[0];

  // Calculate prediction
  const prediction = predictNextMatchPlayerStats(selectedPlayer, opposition, pitchType, venue);

  // Compute predictions for all players in squad for upcoming match table
  const allSquadPredictions = players.map(p => ({
    player: p,
    prediction: predictNextMatchPlayerStats(p, opposition, pitchType, venue)
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-bold font-mono-code bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
                AI PREDICTIVE MODEL
              </span>
              <h1 className="text-2xl font-extrabold font-heading text-white">
                Next Match Player Performance Predictor
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Machine learning forecasting engine predicting next fixture runs, strike rate, boundaries, wickets, and dismissal risk based on pitch conditions & opposition stats.
            </p>
          </div>
        </div>

        {/* Dynamic Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          
          <div>
            <label className="block text-slate-400 font-medium mb-1">Target Player</label>
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-semibold focus:outline-none focus:border-cyan-500"
            >
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Upcoming Opposition</label>
            <select
              value={opposition}
              onChange={(e) => setOpposition(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="Australia XI">Australia XI</option>
              <option value="Mumbai Indians">Mumbai Indians</option>
              <option value="Chennai Super Kings">Chennai Super Kings</option>
              <option value="Royal Challengers Bengaluru">Royal Challengers Bengaluru</option>
              <option value="Sunrisers Hyderabad">Sunrisers Hyderabad</option>
              <option value="England XI">England XI</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Pitch Condition</label>
            <select
              value={pitchType}
              onChange={(e) => setPitchType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-semibold focus:outline-none focus:border-cyan-500"
            >
              <option value="Flat">🏏 Flat / High Scoring</option>
              <option value="Green">🌱 Green Track (Pace & Bounce)</option>
              <option value="Dusty">🌪️ Dusty / Turning Pitch</option>
              <option value="Slow">🐌 Slow & Low Bounce</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Stadium Venue</label>
            <select
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="Wankhede Stadium, Mumbai">Wankhede Stadium, Mumbai</option>
              <option value="M. Chinnaswamy, Bengaluru">M. Chinnaswamy, Bengaluru</option>
              <option value="Narendra Modi Stadium, Ahmedabad">Narendra Modi Stadium, Ahmedabad</option>
              <option value="Lord's Cricket Ground, London">Lord's, London</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Grid: Prediction Highlights Card + Detailed Breakdown */}
      {prediction && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Player Card & Main Runs Prediction */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center space-x-4">
              <img
                src={selectedPlayer.avatar}
                alt={selectedPlayer.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500 shadow-lg shadow-cyan-500/20"
              />
              <div>
                <h2 className="text-xl font-extrabold font-heading text-white">{selectedPlayer.name}</h2>
                <p className="text-xs text-cyan-400 font-mono-code">{selectedPlayer.role}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedPlayer.country} • IPL: {selectedPlayer.iplTeam}</p>
              </div>
            </div>

            {/* Projected Runs Big Display */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-2 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono-code">
                PROJECTED NEXT MATCH RUNS
              </p>
              <p className="text-4xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-amber-300">
                {prediction.minRuns} – {prediction.maxRuns} Runs
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs font-mono-code">
                <span className="text-slate-300">Most Likely:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  {prediction.likelyRuns} Runs
                </span>
              </div>
            </div>

            {/* Key AI Stat Badges */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400">Projected Strike Rate</p>
                <p className="text-lg font-extrabold text-cyan-400 font-heading">{prediction.projectedStrikeRate} SR</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400">50+ Runs Probability</p>
                <p className="text-lg font-extrabold text-amber-400 font-heading">{prediction.halfCenturyProb}%</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 col-span-2">
                <p className="text-[10px] text-slate-400">Est. Boundaries (4s & 6s)</p>
                <p className="text-lg font-extrabold text-emerald-400 font-heading">
                  ~{prediction.boundaryCount} Boundaries
                </p>
              </div>
            </div>

          </div>

          {/* Right 2 Columns: Bowler Projections & Tactical AI Insights */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Tactical Forecast Summary Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-extrabold font-heading text-white">AI Tactical Forecast Blueprint</h3>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs text-slate-200 leading-relaxed">
                <p className="font-semibold text-cyan-300">{prediction.aiTacticalSummary}</p>
              </div>

              {/* Vulnerability & Risk Warning */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1 text-xs">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Key Dismissal Risk Area</span>
                </div>
                <p className="text-slate-300">{prediction.vulnerability}</p>
              </div>

              {/* Bowler Stats (If player bowls) */}
              {(selectedPlayer.role.includes("Bowler") || selectedPlayer.role.includes("All-Rounder")) && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs">
                  <p className="font-bold text-emerald-400">Bowling Performance Forecast</p>
                  <div className="flex items-center justify-between text-slate-200">
                    <span>Projected Wickets: <strong className="text-white">{prediction.projectedWickets} Wkts</strong></span>
                    <span>Projected Economy: <strong className="text-cyan-400">{prediction.projectedEconomy} RPO</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Squad-Wide Next Match Performance Forecast Table */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold font-heading text-white flex items-center space-x-2">
                  <BarChart2 className="w-4 h-4 text-emerald-400" />
                  <span>Squad-Wide Next Match Runs Forecast</span>
                </h3>
                <span className="text-[10px] font-mono-code text-cyan-400">
                  OPPOSITION: {opposition.toUpperCase()}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-mono-code border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Player</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Projected Runs Range</th>
                      <th className="py-2.5 px-3">Most Likely</th>
                      <th className="py-2.5 px-3">50+ Score Odds</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                    {allSquadPredictions.map(({ player, prediction }) => (
                      <tr 
                        key={player.id}
                        onClick={() => setSelectedPlayerId(player.id)}
                        className={`hover:bg-slate-900/80 cursor-pointer ${
                          selectedPlayerId === player.id ? 'bg-cyan-500/10 text-cyan-300 font-bold' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 flex items-center space-x-2">
                          <img src={player.avatar} alt={player.name} className="w-6 h-6 rounded-full object-cover" />
                          <span>{player.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{player.role}</td>
                        <td className="py-2.5 px-3 font-mono-code text-cyan-400">
                          {prediction.minRuns} – {prediction.maxRuns}
                        </td>
                        <td className="py-2.5 px-3 font-mono-code text-emerald-400 font-bold">
                          {prediction.likelyRuns} Runs
                        </td>
                        <td className="py-2.5 px-3 font-mono-code text-amber-400">
                          {prediction.halfCenturyProb}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
