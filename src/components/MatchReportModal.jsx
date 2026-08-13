import React from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Download, Sparkles, Award, ShieldCheck, Activity, CheckCircle2 } from 'lucide-react';
import PlayerAvatar from './PlayerAvatar';

export default function MatchReportModal({ player, isOpen, onClose }) {
  if (!isOpen || !player) return null;

  const handlePrint = () => {
    window.print();
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:static print:p-0 print:bg-white print:overflow-visible">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col print:border-none print:shadow-none print:my-0 print:max-h-none print:bg-white">
        
        {/* Modal Top Action Bar (Screen Only) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold font-mono-code bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
              OFFICIAL AI SCOUTING REPORT
            </span>
            <h2 className="text-sm font-bold text-white">CricketVision AI Report Export</h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content (Formatted for A4 / PDF print view) */}
        <div id="printable-match-report" className="p-6 space-y-4 overflow-y-auto bg-slate-950 text-slate-100 print:bg-white print:text-black print:p-4 print:space-y-3">
          
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b border-slate-800 print:border-black pb-4">
            <div className="flex items-center space-x-4">
              <PlayerAvatar player={player} className="w-16 h-16 print:w-14 print:h-14" rounded="rounded-2xl" />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-black font-heading text-white print:text-black print:text-lg">{player.name}</h1>
                  <span className="px-2 py-0.5 text-xs font-bold font-mono-code bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded print:border-black print:text-black">
                    #{player.jerseyNumber || 10}
                  </span>
                </div>
                <p className="text-xs text-slate-400 print:text-gray-700 mt-0.5">
                  {player.role} • {player.country} • IPL: {player.iplTeam}
                </p>
                <p className="text-[11px] font-mono-code text-cyan-400 print:text-blue-700 mt-0.5">
                  Batting: {player.battingStyle} | Bowling: {player.bowlingStyle}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center space-x-1 text-cyan-400 font-bold font-heading text-base print:text-black">
                <span>CricketVision</span>
                <span className="text-xs font-mono-code text-amber-400">PRO</span>
              </div>
              <p className="text-[10px] text-slate-400 print:text-gray-600 font-mono-code mt-0.5">
                Date: {new Date().toLocaleDateString()}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-mono-code font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded print:border-black print:text-black">
                CONFIDENCE: 96%
              </span>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-4 gap-3 text-center print:gap-2">
            <div className="p-2.5 bg-slate-900 border border-slate-800 print:bg-gray-100 print:border-black rounded-xl">
              <p className="text-[10px] text-slate-400 print:text-gray-700">Clutch Rating</p>
              <p className="text-base font-bold text-amber-400 print:text-black">★ {player.clutchRating}</p>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 print:bg-gray-100 print:border-black rounded-xl">
              <p className="text-[10px] text-slate-400 print:text-gray-700">IPL Runs / Wkts</p>
              <p className="text-base font-bold text-cyan-400 print:text-black">{player.iplStats?.runs || player.iplStats?.wickets || 1200}</p>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 print:bg-gray-100 print:border-black rounded-xl">
              <p className="text-[10px] text-slate-400 print:text-gray-700">Average</p>
              <p className="text-base font-bold text-emerald-400 print:text-black">{player.iplStats?.avg || 32.5}</p>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 print:bg-gray-100 print:border-black rounded-xl">
              <p className="text-[10px] text-slate-400 print:text-gray-700">Fatigue Index</p>
              <p className="text-base font-bold text-emerald-400 print:text-black">{player.fatigueLevel || 20}% (Low)</p>
            </div>
          </div>

          {/* Biomechanical Skills Radar Breakdown */}
          <div className="p-3 bg-slate-900/60 border border-slate-800 print:bg-gray-50 print:border-black rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-white print:text-black uppercase font-mono-code flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400 print:text-black" />
              <span>Multidimensional Biomechanical Breakdown</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-1.5 bg-slate-900 border border-slate-800 print:bg-white print:border-black rounded">
                <span className="text-slate-400 print:text-gray-700">Power Hitting:</span>
                <span className="font-bold text-cyan-400 print:text-black ml-1.5">{player.skillRadar?.powerHitting || 85}/100</span>
              </div>
              <div className="p-1.5 bg-slate-900 border border-slate-800 print:bg-white print:border-black rounded">
                <span className="text-slate-400 print:text-gray-700">Spin Technique:</span>
                <span className="font-bold text-cyan-400 print:text-black ml-1.5">{player.skillRadar?.spinTechnique || 88}/100</span>
              </div>
              <div className="p-1.5 bg-slate-900 border border-slate-800 print:bg-white print:border-black rounded">
                <span className="text-slate-400 print:text-gray-700">Pace Mastery:</span>
                <span className="font-bold text-cyan-400 print:text-black ml-1.5">{player.skillRadar?.paceMastery || 90}/100</span>
              </div>
              <div className="p-1.5 bg-slate-900 border border-slate-800 print:bg-white print:border-black rounded">
                <span className="text-slate-400 print:text-gray-700">Death Execution:</span>
                <span className="font-bold text-cyan-400 print:text-black ml-1.5">{player.skillRadar?.deathExecution || 86}/100</span>
              </div>
              <div className="p-1.5 bg-slate-900 border border-slate-800 print:bg-white print:border-black rounded">
                <span className="text-slate-400 print:text-gray-700">Fielding Rating:</span>
                <span className="font-bold text-cyan-400 print:text-black ml-1.5">{player.skillRadar?.fielding || 92}/100</span>
              </div>
              <div className="p-1.5 bg-slate-900 border border-slate-800 print:bg-white print:border-black rounded">
                <span className="text-slate-400 print:text-gray-700">Injury Status:</span>
                <span className="font-bold text-emerald-400 print:text-black ml-1.5">{player.injuryStatus || 'Fit'}</span>
              </div>
            </div>
          </div>

          {/* AI Tactical Recommendations */}
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 print:bg-gray-100 print:border-black rounded-xl space-y-1.5">
            <h3 className="text-xs font-bold text-cyan-400 print:text-black flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 print:text-black" />
              <span>AI Tactical Coach Match Recommendations</span>
            </h3>
            <ul className="space-y-1 text-xs text-slate-300 print:text-gray-800">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 print:text-black shrink-0 mt-0.5" />
                <span>
                  <strong>Powerplay Strategy:</strong> Target length overs 1-6 with aggressive wrist rotation. Projected Strike Rate: {player.phaseStats?.powerplay?.strikeRate || 140}.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 print:text-black shrink-0 mt-0.5" />
                <span>
                  <strong>Death Overs Execution:</strong> Death overs boundary probability is {player.phaseStats?.deathOvers?.boundaryPct || '26.5%'}.
                </span>
              </li>
            </ul>
          </div>

          {/* Footer Signoff */}
          <div className="pt-2 border-t border-slate-800 print:border-black flex items-center justify-between text-[10px] text-slate-400 print:text-gray-600 font-mono-code">
            <span>Generated by CricketVision AI Performance System</span>
            <span>Document Signature: CV-AI-{player.id.toUpperCase()}-2026</span>
          </div>

        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
