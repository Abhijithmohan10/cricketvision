import React, { useState } from 'react';
import { 
  UserCheck, 
  Activity, 
  Award, 
  Flame, 
  CheckCircle, 
  Video, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Target, 
  Clock, 
  Plus, 
  ChevronRight, 
  Zap, 
  AlertCircle, 
  Check, 
  FileText, 
  Lock, 
  User, 
  ArrowRight,
  Upload,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PitchAndWagonWheel from './PitchAndWagonWheel';
import MatchReportModal from './MatchReportModal';
import { getCompletePlayerProfile } from '../data/cricketDatabase';

export default function PlayerPortalView({ players = [] }) {
  const { currentUser, isCoach, isPlayer, switchPlayerAccount } = useAuth();
  
  // Find current active player profile (default to currentUser.playerId or first player in list)
  const defaultPlayerId = currentUser?.playerId || players[0]?.id || 'virat-kohli';
  const [selectedPlayerId, setSelectedPlayerId] = useState(defaultPlayerId);
  const [portalTab, setPortalTab] = useState('overview'); // overview, biomechanics, drills, wagon, matchup
  const [isReportOpen, setIsReportOpen] = useState(false);
  
  // Auto-sync selected player when logged in user changes
  React.useEffect(() => {
    if (currentUser?.playerId) {
      setSelectedPlayerId(currentUser.playerId);
    }
  }, [currentUser?.playerId]);

  // Custom Drills Checkbox State
  const [completedDrills, setCompletedDrills] = useState({
    'drill-1': true,
    'drill-2': false,
    'drill-3': false,
  });

  // Coach Note Form State
  const [showCoachNoteModal, setShowCoachNoteModal] = useState(false);
  const [coachNoteText, setCoachNoteText] = useState('');
  const [coachNotesList, setCoachNotesList] = useState([
    { id: 1, date: '2026-07-28', author: 'Rahul Dravid (Head Coach)', text: 'Excellent wrist extension on the cover drive. Focus on keeping head still against left-arm pace angle.' },
    { id: 2, date: '2026-07-20', author: 'Vikram Rathour (Batting Coach)', text: 'Workload reset completed. Maintain 15-minute ice bath post-training.' }
  ]);

  // Video Upload Simulation State
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadedVideoSuccess, setUploadedVideoSuccess] = useState(false);

  // Active Player Data
  const rawPlayerObj = players.find(p => p.id === selectedPlayerId) || players[0];
  const player = getCompletePlayerProfile(rawPlayerObj) || rawPlayerObj || {
    id: 'virat-kohli',
    name: 'Virat Kohli',
    role: 'Top-Order Batter',
    country: 'India',
    iplTeam: 'Royal Challengers Bengaluru',
    jerseyNumber: 18,
    injuryStatus: 'Fit & Available',
    fatigueLevel: 14,
    clutchRating: 98,
    avatar: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80',
    iplStats: { runs: 8004, avg: 38.7, sr: 131.9, hs: '113*' },
    internationalStats: { testRuns: 8848, odiRuns: 13848, t20iRuns: 4188 }
  };

  const isCurrentLoggedInPlayer = currentUser?.playerId === player.id;

  const toggleDrill = (id) => {
    setCompletedDrills(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddCoachNote = (e) => {
    e.preventDefault();
    if (!coachNoteText.trim()) return;
    setCoachNotesList([
      {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        author: currentUser?.name || 'Head Coach',
        text: coachNoteText.trim()
      },
      ...coachNotesList
    ]);
    setCoachNoteText('');
    setShowCoachNoteModal(false);
  };

  const handleSimulateVideoUpload = () => {
    setIsUploadingVideo(true);
    setUploadedVideoSuccess(false);
    setTimeout(() => {
      setIsUploadingVideo(false);
      setUploadedVideoSuccess(true);
      setTimeout(() => setUploadedVideoSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Selector & Role Access Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: Player Profile Header / Selector (Coach inspects squad; Player locked to self) */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className={`p-2 rounded-xl border ${isCoach ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-slate-300">
                {isCoach ? '👑 Coach Inspecting Squad Member:' : '🏏 Logged-In Player Account:'}
              </label>

              {isCoach ? (
                /* Coach can select any squad member to inspect/manage */
                <select
                  value={selectedPlayerId}
                  onChange={(e) => setSelectedPlayerId(e.target.value)}
                  className="bg-slate-900 border border-cyan-500/40 rounded-lg px-2.5 py-1 text-xs text-cyan-400 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.role} • #{p.jerseyNumber || 10})
                    </option>
                  ))}
                </select>
              ) : (
                /* Player is STRICTLY LOCKED to their own account */
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-extrabold text-amber-400 font-mono-code flex items-center space-x-1">
                  <span>{player.name} (#{player.jerseyNumber || 18})</span>
                  <Lock className="w-3 h-3 text-emerald-400 ml-1" title="Strict Personal Data Access Enabled" />
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isCoach 
                ? "👑 Head Coach Authority: Viewing, Directing & Managing Squad Player Data" 
                : "🔒 User-Wise Data Isolation: Strictly restricted to your personal stats & biomechanics log"}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsReportOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-xs hover:opacity-90 transition-all flex items-center space-x-1.5 shadow-md shadow-cyan-500/20"
          >
            <FileText className="w-4 h-4" />
            <span>Export Official AI Scouting Report for {player.name}</span>
          </button>

          {isCoach && (
            <button
              onClick={() => setShowCoachNoteModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Coach Note</span>
            </button>
          )}
        </div>

      </div>


      {/* Player Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Avatar & Identity */}
        <div className="flex items-center space-x-5 z-10">
          <div className="relative">
            <img
              src={player.avatar}
              alt={player.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-400 shadow-xl shadow-cyan-500/20"
            />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-slate-900 border border-cyan-500 text-cyan-400 text-[10px] font-extrabold font-mono-code rounded-full">
              #{player.jerseyNumber || 18}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{player.name}</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                {player.country}
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold font-mono-code bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                {player.iplTeam}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              {player.role} • {player.battingStyle || 'Right-Hand Bat'} • {player.bowlingStyle || 'Right-Arm Medium'}
            </p>

            <div className="flex items-center space-x-4 pt-1 text-xs font-mono-code">
              <span className="flex items-center space-x-1 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Status: <strong className="text-emerald-400">{player.injuryStatus || 'Fit & Active'}</strong></span>
              </span>
              <span className="flex items-center space-x-1 text-slate-300">
                <Flame className="w-3.5 h-3.5 text-cyan-400" />
                <span>Workload Fatigue: <strong className="text-cyan-400">{player.fatigueLevel || 18}% (Optimal)</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Key Personal Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto z-10">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-mono-code">IPL Runs</p>
            <p className="text-xl font-black font-heading text-cyan-400">{player.iplStats?.runs || player.iplRuns || 0}</p>
            <p className="text-[9px] text-slate-500">High: {player.iplStats?.hs || '100*'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-mono-code">IPL Avg / SR</p>
            <p className="text-xl font-black font-heading text-emerald-400">{player.iplStats?.avg || player.iplAvg || '38.5'}</p>
            <p className="text-[9px] text-emerald-400/80">SR: {player.iplStats?.sr || player.iplSr || '135.0'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-mono-code">Clutch Index</p>
            <p className="text-xl font-black font-heading text-amber-400">{player.clutchRating || 92} / 100</p>
            <p className="text-[9px] text-amber-400/80">Match Winner</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-mono-code">AI Fitness Index</p>
            <p className="text-xl font-black font-heading text-purple-400">96.4%</p>
            <p className="text-[9px] text-purple-400/80">Peak Readiness</p>
          </div>
        </div>

      </div>


      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setPortalTab('overview')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            portalTab === 'overview'
              ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>My Overview & Stats</span>
        </button>

        <button
          onClick={() => setPortalTab('biomechanics')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            portalTab === 'biomechanics'
              ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Video className="w-4 h-4 text-cyan-400" />
          <span>My Biomechanics Video Logs</span>
        </button>

        <button
          onClick={() => setPortalTab('drills')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            portalTab === 'drills'
              ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>AI Drills & Coach Assignments</span>
        </button>

        <button
          onClick={() => setPortalTab('wagon')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            portalTab === 'wagon'
              ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Target className="w-4 h-4 text-amber-400" />
          <span>My Pitch Map & Wagon Wheel</span>
        </button>
      </div>


      {/* TAB CONTENT 1: OVERVIEW & STATS */}
      {portalTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Recent Form Sparklines & Coach Notes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Match Form */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold font-heading text-white flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <span>Recent Match Performance Form (Last 5 Innings)</span>
                </h2>
                <span className="text-xs font-mono-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  AVG: 58.4
                </span>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {[
                  { opp: 'vs CSK', runs: '84*', balls: '48', sr: '175.0', result: 'W', hero: true },
                  { opp: 'vs MI', runs: '51', balls: '34', sr: '150.0', result: 'W', hero: false },
                  { opp: 'vs KKR', runs: '77', balls: '42', sr: '183.3', result: 'W', hero: true },
                  { opp: 'vs RR', runs: '33', balls: '22', sr: '150.0', result: 'L', hero: false },
                  { opp: 'vs SRH', runs: '100*', balls: '53', sr: '188.6', result: 'W', hero: true }
                ].map((m, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border text-center space-y-1 ${
                    m.hero ? 'bg-gradient-to-b from-cyan-500/10 to-slate-900 border-cyan-500/40' : 'bg-slate-900/90 border-slate-800'
                  }`}>
                    <p className="text-[10px] font-bold text-slate-400">{m.opp}</p>
                    <p className="text-lg font-black font-heading text-white">{m.runs}</p>
                    <p className="text-[10px] font-mono-code text-cyan-400">{m.balls}b • {m.sr} SR</p>
                  </div>
                ))}
              </div>

              {/* International Stats Table */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-300">Format Career Breakdown</h3>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <p className="text-slate-400 font-mono-code text-[10px]">TEST MATCHES</p>
                    <p className="text-white font-bold">{player.internationalStats?.testRuns || '8,848'} Runs</p>
                    <p className="text-[10px] text-slate-500">49.1 Avg • 29 100s</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <p className="text-slate-400 font-mono-code text-[10px]">ODI MATCHES</p>
                    <p className="text-white font-bold">{player.internationalStats?.odiRuns || '13,848'} Runs</p>
                    <p className="text-[10px] text-emerald-400">58.7 Avg • 50 100s</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <p className="text-slate-400 font-mono-code text-[10px]">T20 INTERNATIONALS</p>
                    <p className="text-white font-bold">{player.internationalStats?.t20iRuns || '4,188'} Runs</p>
                    <p className="text-[10px] text-cyan-400">48.7 Avg • 137.0 SR</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Head Coach Notes Feed */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold font-heading text-white flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <span>Coach Tactical Directives</span>
                  </h2>
                  <span className="text-[10px] font-mono-code text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    CONFIDENTIAL
                  </span>
                </div>

                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-none">
                  {coachNotesList.map((note) => (
                    <div key={note.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-code">
                        <span className="text-cyan-400 font-bold">{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {isCoach && (
                <button
                  onClick={() => setShowCoachNoteModal(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-bold text-cyan-400 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Confidential Coach Directive</span>
                </button>
              )}
            </div>

          </div>

        </div>
      )}


      {/* TAB CONTENT 2: BIOMECHANICS & VIDEO LOGS */}
      {portalTab === 'biomechanics' && (
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            
            {/* Header & Upload Simulation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-extrabold font-heading text-white flex items-center space-x-2">
                  <Video className="w-5 h-5 text-cyan-400" />
                  <span>Personal Video Biomechanics & High-Speed Analysis</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Computer vision tracking of stance, hip rotation, bat speed, and release point for {player.name}.
                </p>
              </div>

              <button
                onClick={handleSimulateVideoUpload}
                disabled={isUploadingVideo}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-all flex items-center space-x-2 shrink-0 shadow-md shadow-cyan-500/20"
              >
                {isUploadingVideo ? (
                  <span>Analyzing Video Keypoints...</span>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload New Video for {player.name}</span>
                  </>
                )}
              </button>
            </div>

            {uploadedVideoSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Video uploaded successfully! AI keypoint extraction and high-elbow biomechanics score calculated.</span>
              </div>
            )}

            {/* 3 Biomechanics Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {player.isBowler ? (
                <>
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono-code text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        BOWLING RELEASE SLOT
                      </span>
                      <span className="text-xs font-bold font-mono-code text-emerald-400">98 / 100</span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{player.isSpin ? 'Spin Release Revolution' : 'Fast Bowling Arm Slot'}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Delivery release ball speed recorded at <strong>145.4 km/h</strong>. High arm extension provides maximum seam angle stability.
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400 font-mono-code">
                      <p>• Release Point Angle: 178.4°</p>
                      <p>• Seam Position Control: 96%</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono-code text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        YORKER ACCURACY
                      </span>
                      <span className="text-xs font-bold font-mono-code text-amber-400">95 / 100</span>
                    </div>

                    <h3 className="text-sm font-bold text-white">Death Yorker Crease Target</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Pitching accuracy index 95%. Front foot stride alignment maintains consistent line over off-stump base.
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400 font-mono-code">
                      <p>• Yorker Length Precision: 94%</p>
                      <p>• Boundary Avoidance: 89%</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        SLOWER BALL DISGUISE
                      </span>
                      <span className="text-xs font-bold font-mono-code text-emerald-400">97 / 100</span>
                    </div>

                    <h3 className="text-sm font-bold text-white">Variation Disguise Arc</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Arm speed disguise matching stock ball at 98%. Off-cutter / knuckles dip late inside the crease line.
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400 font-mono-code">
                      <p>• Velocity Differential: -24 km/h</p>
                      <p>• Batter Deception Score: High</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono-code text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        FRONT FOOT DRIVE
                      </span>
                      <span className="text-xs font-bold font-mono-code text-emerald-400">96 / 100</span>
                    </div>

                    <h3 className="text-sm font-bold text-white">Cover Drive Weight Swivel</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Bat speed recorded at <strong>142.8 km/h</strong>. Knee angle bend score of 124° provides maximum power transfer.
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400 font-mono-code">
                      <p>• Eye-Line Contact Point: 0.12s early</p>
                      <p>• High Elbow Alignment: 94%</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono-code text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        SHORT PITCH PULL
                      </span>
                      <span className="text-xs font-bold font-mono-code text-amber-400">91 / 100</span>
                    </div>

                    <h3 className="text-sm font-bold text-white">Pull Shot Hip Rotation</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Bat speed recorded at <strong>145.2 km/h</strong>. Back foot pivot speed increased by 4.2% since last fixture.
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400 font-mono-code">
                      <p>• Eye-Level Height: 1.48m</p>
                      <p>• Power Transfer Efficiency: 92%</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        DEFENSIVE STANCE
                      </span>
                      <span className="text-xs font-bold font-mono-code text-emerald-400">98 / 100</span>
                    </div>

                    <h3 className="text-sm font-bold text-white">Forward Defense Alignment</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Soft hands cushion index 98%. Head position strictly over the ball line with zero lateral drift.
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400 font-mono-code">
                      <p>• Head Position Balance: 100%</p>
                      <p>• Edge Avoidance Index: High</p>
                    </div>
                  </div>
                </>
              )}

            </div>

          </div>

        </div>
      )}


      {/* TAB CONTENT 3: AI DRILLS & ASSIGNMENTS */}
      {portalTab === 'drills' && (
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-extrabold font-heading text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>AI Personalized Training Drills for {player.name}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Targeted drills generated from matchup analytics and biomechanics recommendations.
                </p>
              </div>

              <span className="text-xs font-mono-code text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
                {Object.values(completedDrills).filter(Boolean).length} / 3 Completed Today
              </span>
            </div>

            <div className="space-y-4">
              
              {/* Drill 1 */}
              <div className={`p-5 rounded-2xl border transition-all ${
                completedDrills['drill-1'] ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-900/90 border-slate-800'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <button
                      onClick={() => toggleDrill('drill-1')}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all mt-0.5 ${
                        completedDrills['drill-1'] ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-700 bg-slate-900 text-transparent hover:border-emerald-500'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-bold ${completedDrills['drill-1'] ? 'line-through text-slate-400' : 'text-white'}`}>
                          Front-Foot Off-Drive Alignment Drill
                        </h3>
                        <span className="px-2 py-0.5 text-[9px] font-mono-code font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
                          HIGH PRIORITY
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {player.biomechanicsSummary?.recommendation || 'Maintain front-foot clearance against left-arm pace angle. 3 sets of 20 side-arm deliveries.'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono-code pt-1">Target Duration: 25 mins • Focus: Head position & soft hands</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold font-mono-code text-cyan-400 shrink-0">SET 3 / 3</span>
                </div>
              </div>

              {/* Drill 2 */}
              <div className={`p-5 rounded-2xl border transition-all ${
                completedDrills['drill-2'] ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-900/90 border-slate-800'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <button
                      onClick={() => toggleDrill('drill-2')}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all mt-0.5 ${
                        completedDrills['drill-2'] ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-700 bg-slate-900 text-transparent hover:border-emerald-500'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-bold ${completedDrills['drill-2'] ? 'line-through text-slate-400' : 'text-white'}`}>
                          Wrist Mobility & Rotational Power Routine
                        </h3>
                        <span className="px-2 py-0.5 text-[9px] font-mono-code font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                          FITNESS / RECOVERY
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        3 sets of 15 medicine ball rotational throws to improve hip swivel speed on short-pitched balls.
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono-code pt-1">Target Duration: 15 mins • Focus: Core stability & wrist swivel</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold font-mono-code text-amber-400 shrink-0">SET 1 / 3</span>
                </div>
              </div>

              {/* Drill 3 */}
              <div className={`p-5 rounded-2xl border transition-all ${
                completedDrills['drill-3'] ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-900/90 border-slate-800'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <button
                      onClick={() => toggleDrill('drill-3')}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all mt-0.5 ${
                        completedDrills['drill-3'] ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-700 bg-slate-900 text-transparent hover:border-emerald-500'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-bold ${completedDrills['drill-3'] ? 'line-through text-slate-400' : 'text-white'}`}>
                          Spin Sweep & Reverse Sweep Footwork Simulation
                        </h3>
                        <span className="px-2 py-0.5 text-[9px] font-mono-code font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">
                          TACTICAL SQUAD
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Facing wrist-spin throwdowns pitching on middle and turning outside off-stump.
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono-code pt-1">Target Duration: 20 mins • Focus: Reach point & paddle sweep</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold font-mono-code text-purple-400 shrink-0">SET 0 / 3</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}


      {/* TAB CONTENT 4: PITCH MAP & WAGON WHEEL */}
      {portalTab === 'wagon' && (
        <div className="space-y-6">
          <PitchAndWagonWheel player={player} />
        </div>
      )}


      {/* Confidential Coach Note Adding Modal */}
      {showCoachNoteModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-md w-full space-y-4 animate-in fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold font-heading text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Add Directive for {player.name}</span>
              </h3>
              <button onClick={() => setShowCoachNoteModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddCoachNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confidential Directive Text</label>
                <textarea
                  rows={4}
                  required
                  value={coachNoteText}
                  onChange={(e) => setCoachNoteText(e.target.value)}
                  placeholder="Enter tactical recommendation, biomechanics review, or workload directive..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCoachNoteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-90 shadow-md shadow-cyan-500/20"
                >
                  Save Coach Directive
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Match Report Modal */}
      <MatchReportModal
        player={player}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

    </div>
  );
}
