import React, { useState } from 'react';
import { Target, Compass, Filter, Sparkles, Layers, RefreshCw } from 'lucide-react';

// Generates synthetic pitch & wagon wheel data based on player role & stats
const generatePlayerData = (player) => {
  const isBowler = player?.role?.toLowerCase().includes('bowler') || player?.role?.toLowerCase().includes('fast') || player?.role?.toLowerCase().includes('spin');

  // Pitch Heatmap points (x: 0-100%, y: 0-100% on 22-yard pitch)
  const pitchPoints = isBowler ? [
    { x: 48, y: 88, type: 'yorker', label: 'Toe-Crushing Yorker', frequency: 94, color: '#06b6d4' },
    { x: 50, y: 85, type: 'yorker', label: 'In-swinging Yorker', frequency: 90, color: '#06b6d4' },
    { x: 44, y: 64, type: 'good', label: 'Top of Off-Stump', frequency: 96, color: '#10b981' },
    { x: 54, y: 68, type: 'good', label: 'Middle-Stump Channel', frequency: 92, color: '#10b981' },
    { x: 38, y: 70, type: 'good', label: 'Out-swinging Line', frequency: 85, color: '#10b981' },
    { x: 46, y: 35, type: 'short', label: 'Searing Bouncer', frequency: 88, color: '#ef4444' },
    { x: 52, y: 38, type: 'short', label: 'Body-line Short Ball', frequency: 82, color: '#ef4444' }
  ] : [
    { x: 48, y: 88, type: 'yorker', label: 'Yorker Facing', frequency: 85, color: '#06b6d4' },
    { x: 42, y: 65, type: 'good', label: 'Off-Stump Good', frequency: 95, color: '#10b981' },
    { x: 50, y: 68, type: 'good', label: 'Middle-Stump Good', frequency: 88, color: '#10b981' },
    { x: 46, y: 35, type: 'short', label: 'Bouncer (Helmet)', frequency: 90, color: '#ef4444' },
    { x: 35, y: 72, type: 'spin', label: 'Spin Turn', frequency: 88, color: '#f59e0b' }
  ];

  // 360 Wagon Wheel / Wicket Vector Map
  const wagonShots = isBowler ? [
    { angle: 180, distance: 40, runs: 0, zone: 'Stumps', stroke: '🎯 Bowled / LBW (Dismissal)', isWicket: true },
    { angle: 220, distance: 70, zone: 'Slips / Keeper', stroke: '🧤 Edged & Caught behind (Dismissal)', isWicket: true },
    { angle: 0, distance: 130, runs: 0, zone: 'Long-Off', stroke: '🚀 Caught at Long-Off (Dismissal)', isWicket: true },
    { angle: 270, distance: 120, runs: 0, zone: 'Deep Mid-Wicket', stroke: '💥 Caught on Pull Shot (Dismissal)', isWicket: true },
    { angle: 45, distance: 125, runs: 4, zone: 'Cover Boundary', stroke: 'Conceded Cover Boundary 4', isWicket: false },
    { angle: 300, distance: 135, runs: 6, zone: 'Square Leg', stroke: 'Conceded Six 6', isWicket: false },
    { angle: 120, distance: 60, runs: 1, zone: 'Point', stroke: 'Defended Single 1', isWicket: false }
  ] : [
    { angle: 45, distance: 135, runs: 6, zone: 'Cover Drive (Off)', stroke: 'Cover Drive', isWicket: false },
    { angle: 30, distance: 110, runs: 4, zone: 'Extra Cover', stroke: 'Lofted Drive', isWicket: false },
    { angle: 0, distance: 140, runs: 6, zone: 'Long-Off', stroke: 'Straight Loft', isWicket: false },
    { angle: 330, distance: 130, runs: 6, zone: 'Long-On', stroke: 'Down the Ground', isWicket: false },
    { angle: 300, distance: 105, runs: 4, zone: 'Mid-Wicket', stroke: 'Flick Shot', isWicket: false },
    { angle: 270, distance: 125, runs: 6, zone: 'Deep Square Leg', stroke: 'Pull Shot', isWicket: false },
    { angle: 210, distance: 85, runs: 2, zone: 'Fine Leg', stroke: 'Glance', isWicket: false },
    { angle: 120, distance: 115, runs: 4, zone: 'Point', stroke: 'Square Cut', isWicket: false }
  ];

  return { pitchPoints, wagonShots, isBowler };
};

export default function PitchAndWagonWheel({ player }) {
  const [filterType, setFilterType] = useState('all'); // all, boundary, singles, yorker, short, wicket
  const [selectedShot, setSelectedShot] = useState(null);

  const { pitchPoints, wagonShots, isBowler } = generatePlayerData(player);

  const filteredShots = wagonShots.filter(shot => {
    if (filterType === 'wicket') return shot.isWicket;
    if (filterType === 'boundary') return shot.runs >= 4;
    if (filterType === 'singles') return shot.runs < 4 && !shot.isWicket;
    return true;
  });

  const filteredPitchPoints = pitchPoints.filter(p => {
    if (filterType === 'yorker') return p.type === 'yorker';
    if (filterType === 'short') return p.type === 'short';
    return true;
  });

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold font-mono-code bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
              BIOMECHANICAL SPATIAL ANALYSIS
            </span>
            <h2 className="text-lg font-extrabold font-heading text-white">
              {isBowler ? 'Bowler Delivery Pitch Zone & Wicket Map' : 'Pitch Delivery Heatmap & 360° Wagon Wheel'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isBowler 
              ? `Delivery length pitch clusters, seam release zones, and wicket dismissal map for `
              : `Real-time delivery pitch zones, length clusters, and boundary wagon wheel vectors for `}
            <strong className="text-cyan-400">{player?.name || 'Selected Player'}</strong>.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {['all', isBowler ? 'wicket' : 'boundary', 'singles', 'yorker', 'short'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-lg capitalize font-bold transition-all ${
                filterType === f
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Pitch Heatmap (Left) + 360 Wagon Wheel (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: 22-Yard Pitch Heatmap */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold font-heading text-white flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>{isBowler ? 'Bowler Pitch Delivery Clusters' : '22-Yard Pitch Delivery Zones'}</span>
            </h3>
            <span className="text-[10px] font-mono-code text-emerald-400">PITCH METRICS</span>
          </div>

          {/* Canvas Pitch Box */}
          <div className="relative w-full h-[360px] bg-gradient-to-b from-emerald-950/60 via-amber-950/30 to-emerald-950/60 rounded-2xl border-2 border-slate-800 overflow-hidden p-4 flex flex-col justify-between">
            
            {/* Pitch Marking Lines */}
            <div className="absolute inset-x-8 top-6 bottom-6 border-x-2 border-amber-600/40 bg-amber-900/10 pointer-events-none" />
            
            {/* Stumps Top (Bowler End) */}
            <div className="z-10 flex justify-center space-x-1">
              <div className="w-1.5 h-4 bg-amber-400 rounded-sm" />
              <div className="w-1.5 h-4 bg-amber-400 rounded-sm" />
              <div className="w-1.5 h-4 bg-amber-400 rounded-sm" />
              <span className="text-[9px] font-mono-code text-slate-400 ml-2">Bowler End</span>
            </div>

            {/* Crease Lines */}
            <div className="absolute top-12 left-10 right-10 h-0.5 bg-white/40" />
            <div className="absolute bottom-12 left-10 right-10 h-0.5 bg-white/40" />

            {/* Pitch Length Markers */}
            <div className="absolute left-2 top-16 text-[9px] font-mono-code text-red-400">Bouncer (8-10m)</div>
            <div className="absolute left-2 top-1/2 text-[9px] font-mono-code text-emerald-400">Good Length (6-8m)</div>
            <div className="absolute left-2 bottom-16 text-[9px] font-mono-code text-cyan-400">Yorker / Full (0-4m)</div>

            {/* Interactive Pitch Heatmap Dots */}
            <div className="absolute inset-x-8 top-12 bottom-12 relative pointer-events-auto">
              {filteredPitchPoints.map((pt, i) => (
                <div
                  key={i}
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                >
                  <div
                    className="w-4 h-4 rounded-full animate-pulse border border-white/60 shadow-lg"
                    style={{ backgroundColor: pt.color }}
                  />
                  {/* Tooltip */}
                  <div className="hidden group-hover:block absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700 text-[10px] text-white font-mono-code px-2 py-1 rounded shadow-xl whitespace-nowrap z-30">
                    <p className="font-bold">{pt.label}</p>
                    <p className="text-cyan-400">Accuracy: {pt.frequency}%</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stumps Bottom (Batter End) */}
            <div className="z-10 flex justify-center space-x-1">
              <div className="w-1.5 h-4 bg-amber-400 rounded-sm" />
              <div className="w-1.5 h-4 bg-amber-400 rounded-sm" />
              <div className="w-1.5 h-4 bg-amber-400 rounded-sm" />
              <span className="text-[9px] font-mono-code text-slate-400 ml-2">Striker Crease</span>
            </div>
          </div>

          {/* Pitch Legend */}
          <div className="flex items-center justify-around text-[10px] font-mono-code pt-1 text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
              <span>Yorker (0-4m)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span>Good Length (6-8m)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
              <span>Bouncer / Short (8-10m)</span>
            </span>
          </div>
        </div>

        {/* Right Column: 360 Stadium Wagon Wheel / Wicket Map */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold font-heading text-white flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>{isBowler ? '360° Wicket & Delivery Conceded Map' : '360° Stadium Shot Wagon Wheel'}</span>
            </h3>
            <span className="text-[10px] font-mono-code text-cyan-400">{isBowler ? 'WICKETS & RUNS' : 'SHOT VECTORS'}</span>
          </div>

          {/* SVG Wagon Wheel Stadium Ground */}
          <div className="relative w-full h-[360px] bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden flex items-center justify-center p-4">
            
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {/* Outer Boundary Ring */}
              <circle cx="150" cy="150" r="135" fill="#064e3b" opacity="0.3" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* 30-Yard Circle */}
              <circle cx="150" cy="150" r="75" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.4" />
              
              {/* Center Pitch Block */}
              <rect x="142" y="130" width="16" height="40" fill="#78350f" rx="2" />

              {/* Sector Labels */}
              <text x="150" y="30" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">LONG-OFF</text>
              <text x="260" y="70" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">COVER</text>
              <text x="270" y="150" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">POINT</text>
              <text x="240" y="240" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">THIRD MAN</text>
              <text x="150" y="280" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">FINE LEG</text>
              <text x="40" y="240" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">SQUARE LEG</text>
              <text x="30" y="150" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">MID-WICKET</text>
              <text x="40" y="70" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">LONG-ON</text>

              {/* Shot Vectors Lines */}
              {filteredShots.map((shot, idx) => {
                const rad = (shot.angle - 90) * (Math.PI / 180);
                const endX = 150 + shot.distance * Math.cos(rad);
                const endY = 150 + shot.distance * Math.sin(rad);

                const strokeColor = shot.isWicket 
                  ? '#ef4444' 
                  : (shot.runs === 6 ? '#f59e0b' : shot.runs === 4 ? '#06b6d4' : '#10b981');

                return (
                  <g key={idx} className="cursor-pointer group" onClick={() => setSelectedShot(shot)}>
                    <line
                      x1="150"
                      y1="150"
                      x2={endX}
                      y2={endY}
                      stroke={strokeColor}
                      strokeWidth={shot.isWicket ? 3 : (shot.runs >= 4 ? 2.5 : 1.5)}
                      strokeDasharray={!shot.isWicket && shot.runs < 4 ? "3 3" : "none"}
                      opacity="0.9"
                    />
                    <circle cx={endX} cy={endY} r={shot.isWicket ? 5 : 3.5} fill={strokeColor} />
                  </g>
                );
              })}
            </svg>

            {/* Selected Shot Info Box */}
            {selectedShot && (
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl text-xs flex items-center justify-between z-20">
                <div>
                  <p className="font-bold text-white">{selectedShot.stroke} ({selectedShot.zone})</p>
                  <p className="text-[10px] text-cyan-400 font-mono-code">
                    {selectedShot.isWicket ? '🎯 Wicket Taken' : `${selectedShot.runs} Runs Scored`}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedShot(null)}
                  className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-400 hover:text-white rounded"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Wagon Legend */}
          <div className="flex items-center justify-around text-[10px] font-mono-code pt-1 text-slate-400">
            {isBowler ? (
              <>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  <span>🎯 Wicket Dismissal</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span>Boundary Conceded</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Dot / Single</span>
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span>6 Runs (Sixes)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                  <span>4 Runs (Fours)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Singles / Doubles</span>
                </span>
              </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

