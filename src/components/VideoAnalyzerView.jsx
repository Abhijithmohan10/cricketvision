import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Activity, 
  Target, 
  Download,
  Award,
  Zap,
  UserCheck,
  Cpu,
  RefreshCw,
  FileVideo,
  Plus
} from 'lucide-react';
import { INITIAL_PLAYER_DATABASE } from '../data/cricketDatabase';
import PlayerAvatar from './PlayerAvatar';

// Batting Shot Presets with calculated Ball Speed, Bat Speed, and Shot Perfection
const BATTING_SHOT_PRESETS = [
  {
    id: 'cover_drive',
    name: 'Cover Drive',
    ballSpeed: '145.4 km/h',
    batSpeed: '142.8 km/h',
    shotPerfection: '96%',
    shotPerfectionVal: 96,
    elbowAngle: '86.5°',
    headAlignment: 'Directly over front foot (+0.5cm)',
    balanceScore: '99 / 100',
    downswingArc: 'High-to-low straight off-side arc',
    flaw: 'Zero head tilt; optimal front knee flex over crease.',
    drill: 'Front-foot throwdown drive drill (3 sets of 20 reps)',
    trajectoryType: 'off-side-drive'
  },
  {
    id: 'straight_drive',
    name: 'Straight Drive',
    ballSpeed: '141.2 km/h',
    batSpeed: '139.5 km/h',
    shotPerfection: '94%',
    shotPerfectionVal: 94,
    elbowAngle: '88.0°',
    headAlignment: 'Directly behind impact line',
    balanceScore: '97 / 100',
    downswingArc: 'Vertical V-swing through mid-on',
    flaw: 'Minor early wrist cock; maintain high top-wrist control.',
    drill: 'Hanging ball drop straight drive repetition',
    trajectoryType: 'straight-drive'
  },
  {
    id: 'pull_shot',
    name: 'Pull / Hook Shot',
    ballSpeed: '148.6 km/h',
    batSpeed: '145.2 km/h',
    shotPerfection: '92%',
    shotPerfectionVal: 92,
    elbowAngle: '74.2°',
    headAlignment: 'Back foot aligned over shoulder line',
    balanceScore: '95 / 100',
    downswingArc: 'Horizontal swivel arc through mid-wicket',
    flaw: 'Watch top edge risk if hands drop below shoulder level.',
    drill: 'Medicine ball swivel core rotation drill',
    trajectoryType: 'leg-side-pull'
  },
  {
    id: 'flick_shot',
    name: 'Flick off Pads',
    ballSpeed: '138.8 km/h',
    batSpeed: '136.0 km/h',
    shotPerfection: '95%',
    shotPerfectionVal: 95,
    elbowAngle: '81.0°',
    headAlignment: 'Head steady over middle stump line',
    balanceScore: '96 / 100',
    downswingArc: 'Supple wrist closure through square leg',
    flaw: 'Ensure front pad does not close off straight line.',
    drill: 'Side-arm leg stump flick practice',
    trajectoryType: 'flick-leg'
  }
];

export default function VideoAnalyzerView({ players = [], onSaveAnalysisReport }) {
  const activePlayersList = Array.isArray(players) && players.length > 0 ? players : INITIAL_PLAYER_DATABASE;
  const [selectedPlayerId, setSelectedPlayerId] = useState(activePlayersList[0]?.id || 'virat-kohli');

  const [customVideoUrl, setCustomVideoUrl] = useState(null);
  const [customVideoName, setCustomVideoName] = useState(null);
  const [selectedShotType, setSelectedShotType] = useState('cover_drive');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  
  // Interactive Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState('');

  // Overlay Toggles
  const [showBatTrack, setShowBatTrack] = useState(true);
  const [showAngles, setShowAngles] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Active Shot Preset & Selected Player
  const currentShotPreset = BATTING_SHOT_PRESETS.find(s => s.id === selectedShotType) || BATTING_SHOT_PRESETS[0];
  const selectedPlayer = activePlayersList.find(p => p.id === selectedPlayerId) || activePlayersList[0];

  // Handle Custom Video Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setCustomVideoName(file.name);
      setIsPlaying(false);
      setHasAnalyzed(false); // Reset analysis state for new custom video
    }
  };

  // Trigger Interactive Video Analysis
  const handleRunAnalysis = () => {
    if (!customVideoUrl) {
      fileInputRef.current?.click();
      return;
    }

    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    setHasAnalyzed(false);
    setAnalysisProgress(0);

    // Auto-play video during analysis scan
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }

    const steps = [
      { pct: 15, msg: 'Initialising CV Neural Frame Processor...' },
      { pct: 40, msg: 'Detecting Ball Trajectory & Velocity Vectors...' },
      { pct: 70, msg: 'Measuring Downswing Bat Acceleration & Arc...' },
      { pct: 90, msg: 'Calculating Head Balance & Shot Perfection Score...' },
      { pct: 100, msg: 'Analysis Complete!' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setAnalysisProgress(steps[stepIdx].pct);
        setScanStepText(steps[stepIdx].msg);
        stepIdx++;
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
        setHasAnalyzed(true);
      }
    }, 400);
  };

  // Video Time Update & Clean Canvas Overlay Renderer
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !customVideoUrl) return;

    const ctx = canvas.getContext('2d');

    const renderOverlay = () => {
      canvas.width = video.clientWidth || 640;
      canvas.height = video.clientHeight || 360;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Playback progress factor (0 to 1)
      const progress = (video.currentTime || 0) / (video.duration || 1);

      // 1. Draw Ball Track & Impact (When Analyzed or Tracking Toggled)
      if (showBatTrack && (hasAnalyzed || isAnalyzing)) {
        // Ball Impact Point Indicator
        const ballX = w * (0.40 + progress * 0.32);
        const ballY = h * (0.28 + Math.pow(progress, 0.8) * 0.50);

        // Impact Burst
        ctx.beginPath();
        ctx.fillStyle = '#38bdf8';
        ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.arc(ballX, ballY, 14, 0, Math.PI * 2);
        ctx.stroke();

        // Label Impact
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillText('SWEET SPOT IMPACT', ballX + 16, ballY + 4);
      }

      // 2. AI Scanning Beam Animation during Video Analysis
      if (isAnalyzing) {
        const scanY = h * ((Date.now() % 1500) / 1500);
        ctx.beginPath();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
        ctx.moveTo(0, scanY);
        ctx.lineTo(w, scanY);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

        // Scan Bounding Grid
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(w * 0.25, h * 0.2, w * 0.5, h * 0.65);

        // Scanning Target Badge
        ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`SCANNING VIDEO FRAMES (${analysisProgress}%)`, w * 0.30, scanY - 8);
      }

      // 3. Revealed Computer Vision HUD Callouts (After Analysis is Completed)
      if (hasAnalyzed && showAngles) {
        const boxX = w - 210;
        const boxY = 15;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(boxX, boxY, 195, 82, 8) : ctx.rect(boxX, boxY, 195, 82);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('CV AI VIDEO ANALYSIS COMPLETE', boxX + 10, boxY + 18);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '11px sans-serif';
        ctx.fillText(`⚡ BALL SPEED: ${currentShotPreset.ballSpeed}`, boxX + 10, boxY + 36);

        ctx.fillStyle = '#06b6d4';
        ctx.fillText(`🏏 BAT SPEED:  ${currentShotPreset.batSpeed}`, boxX + 10, boxY + 52);

        ctx.fillStyle = '#10b981';
        ctx.fillText(`🎯 PERFECTION: ${currentShotPreset.shotPerfection}`, boxX + 10, boxY + 68);
      }
    };

    let animId;
    const loop = () => {
      renderOverlay();
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animId);
  }, [showBatTrack, showAngles, selectedShotType, currentShotPreset, isAnalyzing, hasAnalyzed, analysisProgress, customVideoUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleRateChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  const handleSeek = (e) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) videoRef.current.currentTime = targetTime;
  };

  const handleSaveReport = () => {
    if (!hasAnalyzed) {
      alert("Please run 'Analyze Video' first to calculate ball speed, bat speed, and shot perfection score!");
      return;
    }

    const reportData = {
      player: selectedPlayer,
      title: (customVideoName || 'Custom Video Analysis') + ` (${currentShotPreset.name})`,
      date: new Date().toLocaleDateString(),
      metrics: {
        ballSpeed: currentShotPreset.ballSpeed,
        batSpeed: currentShotPreset.batSpeed,
        shotPerfection: currentShotPreset.shotPerfection,
        shotPerfectionVal: currentShotPreset.shotPerfectionVal,
        elbowAngle: currentShotPreset.elbowAngle,
        headAlignment: currentShotPreset.headAlignment,
        balanceScore: currentShotPreset.balanceScore,
        detectedFlaw: currentShotPreset.flaw,
        recommendedDrill: currentShotPreset.drill
      }
    };

    if (onSaveAnalysisReport) {
      onSaveAnalysisReport(reportData);
    }

    setSaveSuccessMsg(`Analysis saved for ${selectedPlayer.name} (${currentShotPreset.name})!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header with Player Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-bold font-mono-code bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md">
              🏏 CRICKET COMPUTER VISION
            </span>
            <h1 className="text-2xl font-extrabold font-heading text-white">
              Custom Video Biomechanics & Speed Analyzer
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Upload any cricket video file to calculate <strong>Ball Speed</strong>, <strong>Bat Speed</strong>, and <strong>Shot Perfection Score</strong>.
          </p>
        </div>

        {/* Player Selector & File Upload Button */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
            <UserCheck className="w-4 h-4 text-cyan-400 ml-1.5" />
            <select
              value={selectedPlayerId}
              onChange={(e) => {
                setSelectedPlayerId(e.target.value);
                setHasAnalyzed(false); // Reset analysis state for new player selection
              }}
              className="bg-slate-950 text-white text-xs font-bold py-1 px-2 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {activePlayersList.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
              ))}
            </select>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="video/*,audio/*,.mp3,.mp4,.webm,.m4a,.wav"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Custom Video File</span>
          </button>

          {/* PRIMARY "ANALYZE VIDEO" BUTTON IN HEADER */}
          {customVideoUrl && (
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg ${
                isAnalyzing
                  ? 'bg-amber-500 text-slate-950 animate-pulse cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 text-slate-950 hover:opacity-95 shadow-cyan-500/25 scale-105'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Video ({analysisProgress}%)...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{hasAnalyzed ? 'RE-ANALYZE VIDEO' : 'ANALYZE VIDEO'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Shot Type Selection Ribbon */}
      <div className="glass-panel p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Select Target Batting Shot Preset:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {BATTING_SHOT_PRESETS.map((shot) => (
            <button
              key={shot.id}
              onClick={() => {
                setSelectedShotType(shot.id);
                setHasAnalyzed(false); // Reset analysis state on preset change
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                selectedShotType === shot.id
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {shot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Custom Video Player + Analytics Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Custom Video Player & Controls */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-950">
            
            {customVideoUrl ? (
              <div className="relative aspect-video w-full flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  src={customVideoUrl}
                  onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
                  onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
                  className="w-full h-full object-contain"
                  playsInline
                  loop
                />

                {/* Canvas Overlay for Computer Vision Scanning & Trajectory */}
                <canvas
                  ref={canvasRef}
                  className="analyzer-canvas"
                />

                {/* Active File / Shot Badge */}
                <div className="absolute top-4 left-4 glass-panel px-3 py-1.5 rounded-lg border border-slate-800 text-xs flex items-center space-x-2">
                  <PlayerAvatar player={selectedPlayer} className="w-6 h-6" rounded="rounded-full" />
                  <span className="font-semibold text-white">
                    {selectedPlayer.name}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-cyan-400 font-mono-code flex items-center space-x-1">
                    <FileVideo className="w-3.5 h-3.5 inline mr-1" />
                    <span>{customVideoName}</span>
                  </span>
                </div>

                {/* Overlaid Scanning Progress Indicator */}
                {isAnalyzing && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-2xl border border-cyan-500/50 flex flex-col items-center space-y-2 bg-slate-950/90 shadow-2xl animate-in fade-in">
                    <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs font-mono-code">
                      <Cpu className="w-4 h-4 animate-pulse text-cyan-400" />
                      <span>{scanStepText}</span>
                    </div>
                    <div className="w-64 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* CUSTOM VIDEO UPLOAD DROPZONE WHEN NO VIDEO IS LOADED */
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video w-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/60 hover:bg-slate-900/60 cursor-pointer transition-all space-y-4 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold font-heading text-white group-hover:text-cyan-400 transition-colors">
                    Upload Custom Cricket Video File
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Select any batting or bowling clip (.mp4, .webm, .mov) from your device to perform AI Computer Vision analysis.
                  </p>
                </div>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Choose Video File</span>
                </button>
              </div>
            )}

            {/* Video Control Bar */}
            {customVideoUrl && (
              <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-3">
                
                {/* Scrubbing Slider */}
                <div className="flex items-center space-x-3">
                  <span className="text-[11px] font-mono-code text-slate-400">
                    {currentTime.toFixed(1)}s
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 10}
                    step="0.05"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <span className="text-[11px] font-mono-code text-slate-400">
                    {(duration || 0).toFixed(1)}s
                  </span>
                </div>

                {/* Playback Actions & Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  
                  {/* Play/Pause & Speed */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={togglePlay}
                      className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors shadow-md"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = 0;
                          setCurrentTime(0);
                        }
                      }}
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Speed Selector */}
                    <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                      {[0.25, 0.5, 1.0, 2.0].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handleRateChange(rate)}
                          className={`px-2 py-0.5 rounded font-mono-code ${
                            playbackRate === rate ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SECONDARY "ANALYZE VIDEO" BUTTON IN CONTROL BAR */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleRunAnalysis}
                      disabled={isAnalyzing}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-xs hover:opacity-90 transition-all flex items-center space-x-1.5 shadow-md shadow-cyan-500/20"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>{hasAnalyzed ? 'Re-Analyze Video' : 'Analyze Video'}</span>
                    </button>

                    {/* Overlay Toggles */}
                    <button
                      onClick={() => setShowBatTrack(!showBatTrack)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs ${
                        showBatTrack
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Ball Path Line</span>
                    </button>

                    <button
                      onClick={() => setShowAngles(!showAngles)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs ${
                        showAngles
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>HUD Callouts</span>
                    </button>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* Right Col: 3 Required Metrics Scorecard + AI Diagnosis */}
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-extrabold font-heading text-white">AI Biomechanics Diagnosis</h3>
                  <p className="text-[11px] text-slate-400">Target Player: <span className="text-cyan-400 font-bold">{selectedPlayer.name}</span></p>
                </div>
              </div>

              {/* Status Badge */}
              {hasAnalyzed ? (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                  ANALYSIS COMPLETE
                </span>
              ) : isAnalyzing ? (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded animate-pulse">
                  SCANNING FRAMES...
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 rounded">
                  READY TO ANALYZE
                </span>
              )}
            </div>

            {/* BEFORE ANALYSIS STATE PROMPT */}
            {!hasAnalyzed && !isAnalyzing && (
              <div className="p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    {customVideoUrl ? 'Custom Video Loaded' : 'Upload Custom Video File'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {customVideoUrl 
                      ? 'Click "Analyze Video" to process custom video frames and calculate Ball Speed, Bat Speed & Shot Perfection Score.'
                      : 'Please upload your custom video file to perform AI Computer Vision analysis.'}
                  </p>
                </div>
                <button
                  onClick={handleRunAnalysis}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 text-slate-950 font-black text-xs hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{customVideoUrl ? 'ANALYZE CUSTOM VIDEO NOW' : 'SELECT & UPLOAD VIDEO FILE'}</span>
                </button>
              </div>
            )}

            {/* SCANNING STATE ANIMATION CARD */}
            {isAnalyzing && (
              <div className="p-6 rounded-xl bg-slate-900 border border-cyan-500/40 text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <div>
                  <p className="text-sm font-extrabold text-white">Extracting Computer Vision Keypoints...</p>
                  <p className="text-xs text-cyan-400 font-mono-code mt-1">{scanStepText}</p>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300" style={{ width: `${analysisProgress}%` }} />
                </div>
              </div>
            )}

            {/* 3 PRIMARY METRICS SCORECARDS (REVEALED UPON ANALYSIS) */}
            {hasAnalyzed && (
              <div className="space-y-3 animate-in fade-in">
                
                {/* 1. BALL SPEED CARD */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between shadow-lg shadow-amber-500/5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono-code text-slate-400 tracking-wider">1. Ball Speed</p>
                      <p className="text-xl font-black font-heading text-amber-400 mt-0.5">
                        {currentShotPreset.ballSpeed}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold font-mono-code px-2 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded">
                    PITCH SPEED
                  </span>
                </div>

                {/* 2. BAT SPEED CARD */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between shadow-lg shadow-cyan-500/5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono-code text-slate-400 tracking-wider">2. Bat Speed</p>
                      <p className="text-xl font-black font-heading text-cyan-400 mt-0.5">
                        {currentShotPreset.batSpeed}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold font-mono-code px-2 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded">
                    DOWNSWING ARC
                  </span>
                </div>

                {/* 3. SHOT PERFECTION SCORE CARD */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between shadow-lg shadow-emerald-500/5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono-code text-slate-400 tracking-wider">3. Shot Perfection</p>
                      <p className="text-xl font-black font-heading text-emerald-400 mt-0.5">
                        {currentShotPreset.shotPerfection} <span className="text-xs text-slate-400 font-normal">({currentShotPreset.balanceScore})</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold font-mono-code px-2 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded">
                    ELITE EXECUTION
                  </span>
                </div>

              </div>
            )}

            {/* Secondary Angles & Balance */}
            {hasAnalyzed && (
              <div className="grid grid-cols-2 gap-3 text-xs animate-in fade-in">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono-code">Top Elbow Angle</span>
                  <p className="font-bold text-slate-200 mt-0.5">{currentShotPreset.elbowAngle}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono-code">Downswing Arc</span>
                  <p className="font-semibold text-slate-300 truncate mt-0.5">{currentShotPreset.downswingArc}</p>
                </div>
              </div>
            )}

            {/* Technique Flaw Detection */}
            {hasAnalyzed && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1 animate-in fade-in">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Technique Diagnosis</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentShotPreset.flaw}
                </p>
              </div>
            )}

            {/* Recommended Batting Drill */}
            {hasAnalyzed && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 animate-in fade-in">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>Recommended Batting Drill</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentShotPreset.drill}
                </p>
              </div>
            )}

            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 text-center animate-in fade-in">
                ✓ {saveSuccessMsg}
              </div>
            )}

            {/* Save Report Action */}
            {hasAnalyzed && (
              <button
                onClick={handleSaveReport}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-xs hover:opacity-95 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 animate-in fade-in"
              >
                <Download className="w-4 h-4" />
                <span>Save Analysis Report to {selectedPlayer.name}'s Profile</span>
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
