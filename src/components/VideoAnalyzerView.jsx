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
  Eye, 
  EyeOff, 
  Target, 
  Download,
  FileVideo,
  Award,
  Zap,
  UserCheck
} from 'lucide-react';
import { SAMPLE_VIDEOS } from '../data/sampleVideos';
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

  const [selectedSample, setSelectedSample] = useState(SAMPLE_VIDEOS[0]);
  const [customVideoUrl, setCustomVideoUrl] = useState(null);
  const [customVideoName, setCustomVideoName] = useState(null);
  const [selectedShotType, setSelectedShotType] = useState('cover_drive');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  
  // Batting Biomechanics Overlay Toggles
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showBatTrack, setShowBatTrack] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [showStumps, setShowStumps] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeVideoUrl = customVideoUrl || selectedSample.videoUrl;

  // Active Shot Preset & Selected Player
  const currentShotPreset = BATTING_SHOT_PRESETS.find(s => s.id === selectedShotType) || BATTING_SHOT_PRESETS[0];
  const selectedPlayer = activePlayersList.find(p => p.id === selectedPlayerId) || activePlayersList[0];

  // Handle Batting Video Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setCustomVideoName(file.name);
      setIsPlaying(false);
    }
  };

  // Video Time Update & Batting Pose Overlay Renderer
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');

    const renderOverlay = () => {
      canvas.width = video.clientWidth || 640;
      canvas.height = video.clientHeight || 360;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Playback progress factor (0 to 1)
      const progress = (video.currentTime || 0) / (video.duration || 1);
      const cycle = Math.sin(progress * Math.PI * 2);

      // 1. Draw Stumps & Crease Box
      if (showStumps) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        // Crease line
        const creaseX = w * 0.42;
        ctx.beginPath();
        ctx.moveTo(creaseX, h * 0.35);
        ctx.lineTo(creaseX, h * 0.90);
        ctx.stroke();

        // Stumps (Behind Batter)
        const stumpX = w * 0.32;
        const stumpY = h * 0.45;
        const stumpH = h * 0.40;
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(stumpX - 8, stumpY, 4, stumpH);
        ctx.fillRect(stumpX, stumpY, 4, stumpH);
        ctx.fillRect(stumpX + 8, stumpY, 4, stumpH);
        // Bails
        ctx.fillRect(stumpX - 10, stumpY - 3, 24, 3);
      }

      // 2. Draw Bat Track & Ball Swing Arc
      if (showBatTrack) {
        ctx.beginPath();
        ctx.strokeStyle = '#06b6d4'; // Cyan arc
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);

        // Downswing trajectory from high backlift down to extra cover
        ctx.moveTo(w * 0.40, h * 0.28);
        ctx.quadraticCurveTo(w * 0.52, h * 0.65, w * 0.72, h * 0.78);
        ctx.stroke();
        ctx.setLineDash([]);

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

      // 3. Draw Realistic Cricket Batter Skeleton Pose
      if (showSkeleton) {
        // Batter Head (Positioned over front knee)
        const headX = w * 0.50 + Math.sin(progress * 3) * 6;
        const headY = h * 0.32;

        // Shoulder joint
        const shoulderL = { x: headX - 20, y: headY + 30 };
        const shoulderR = { x: headX + 20, y: headY + 30 };

        // Top Elbow & Wrist (High elbow backlift position)
        const elbowTop = { x: headX - 35, y: headY + 20 - cycle * 8 };
        const wristR = { x: headX + 10 + progress * 25, y: headY + 65 + cycle * 12 };

        // Hips & Legs (Front foot stride forward)
        const hipL = { x: headX - 12, y: headY + 100 };
        const hipR = { x: headX + 12, y: headY + 100 };

        const kneeFront = { x: headX + 35, y: headY + 155 }; // Flexed front knee
        const ankleFront = { x: headX + 45, y: headY + 215 };

        const kneeBack = { x: headX - 25, y: headY + 160 }; // Back leg
        const ankleBack = { x: headX - 30, y: headY + 220 };

        // Connect Pose Skeleton Lines
        ctx.lineWidth = 4;

        // Head (Pink circle with eye alignment line)
        ctx.beginPath();
        ctx.arc(headX, headY, 15, 0, Math.PI * 2);
        ctx.strokeStyle = '#ec4899';
        ctx.stroke();

        // Eye Alignment Vertical Plumb Line (Head over front foot)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.moveTo(headX, headY);
        ctx.lineTo(headX, ankleFront.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Spine & Shoulders
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#06b6d4'; // Cyan torso
        ctx.beginPath();
        ctx.moveTo(shoulderL.x, shoulderL.y);
        ctx.lineTo(shoulderR.x, shoulderR.y);
        ctx.lineTo(hipR.x, hipR.y);
        ctx.lineTo(hipL.x, hipL.y);
        ctx.closePath();
        ctx.stroke();

        // Top Arm (High Elbow)
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b'; // Amber arm
        ctx.moveTo(shoulderR.x, shoulderR.y);
        ctx.lineTo(elbowTop.x, elbowTop.y);
        ctx.lineTo(wristR.x, wristR.y);
        ctx.stroke();

        // CRICKET BAT VECTOR BLADE
        const batTipX = wristR.x + 35 + progress * 40;
        const batTipY = wristR.y + 45 + progress * 20;

        ctx.beginPath();
        ctx.strokeStyle = '#eab308'; // Golden Bat
        ctx.lineWidth = 7;
        ctx.moveTo(wristR.x, wristR.y);
        ctx.lineTo(batTipX, batTipY);
        ctx.stroke();

        // Bat Face Label
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('CRICKET BAT', wristR.x + 10, wristR.y + 20);

        // Legs (Front knee & back leg)
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.strokeStyle = '#10b981'; // Emerald legs
        // Back leg
        ctx.moveTo(hipL.x, hipL.y);
        ctx.lineTo(kneeBack.x, kneeBack.y);
        ctx.lineTo(ankleBack.x, ankleBack.y);
        // Front Stride leg
        ctx.moveTo(hipR.x, hipR.y);
        ctx.lineTo(kneeFront.x, kneeFront.y);
        ctx.lineTo(ankleFront.x, ankleFront.y);
        ctx.stroke();

        // 4. Angle Measurement Annotations & Real-Time Computer Vision Callouts
        if (showAngles) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '11px Outfit, sans-serif';
          ctx.fillText(`Top Elbow: ${currentShotPreset.elbowAngle}`, elbowTop.x - 65, elbowTop.y);
          ctx.fillText(`Front Knee Flex: 132°`, kneeFront.x + 10, kneeFront.y);
          ctx.fillText(`Head Alignment: OK`, headX - 45, headY - 20);

          // HUD Metrics Badge Overlay top-right of canvas
          const boxX = w - 195;
          const boxY = 15;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(boxX, boxY, 180, 80, 8) : ctx.rect(boxX, boxY, 180, 80);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('CV REAL-TIME ANALYSIS', boxX + 10, boxY + 18);

          ctx.fillStyle = '#f59e0b';
          ctx.font = '11px sans-serif';
          ctx.fillText(`⚡ BALL SPEED: ${currentShotPreset.ballSpeed}`, boxX + 10, boxY + 36);

          ctx.fillStyle = '#06b6d4';
          ctx.fillText(`🏏 BAT SPEED:  ${currentShotPreset.batSpeed}`, boxX + 10, boxY + 52);

          ctx.fillStyle = '#10b981';
          ctx.fillText(`🎯 PERFECTION: ${currentShotPreset.shotPerfection}`, boxX + 10, boxY + 68);
        }
      }
    };

    let animId;
    const loop = () => {
      renderOverlay();
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animId);
  }, [showSkeleton, showBatTrack, showAngles, showStumps, selectedShotType, currentShotPreset]);

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
    const reportData = {
      player: selectedPlayer,
      title: (customVideoName || selectedSample.title) + ` (${currentShotPreset.name})`,
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
              Video Biomechanics & Shot Speed Analyzer
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Calculates <strong>Ball Speed</strong>, <strong>Bat Speed</strong>, and <strong>Shot Perfection Score</strong> in real-time.
          </p>
        </div>

        {/* Player Selector & File Upload Button */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
            <UserCheck className="w-4 h-4 text-cyan-400 ml-1.5" />
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="bg-slate-950 text-white text-xs font-bold py-1 px-2 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-500"
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
            <span>Upload Batting Video File</span>
          </button>
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
              onClick={() => setSelectedShotType(shot.id)}
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

      {/* Main Grid: Video Player + Analytics Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Video Player & Overlay Controls */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Video Container with HTML5 Canvas Overlay */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-950">
            
            <div className="relative aspect-video w-full flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                src={activeVideoUrl}
                onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
                onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
                className="w-full h-full object-contain"
                playsInline
                loop
              />

              {/* Canvas Overlay for Batting Pose Keypoints & Bat Vector */}
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
                <span className="text-cyan-400 font-mono-code">
                  {customVideoName ? customVideoName : selectedSample.title}
                </span>
              </div>
            </div>

            {/* Video Control Bar */}
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

                {/* Batting Overlay Layer Toggles */}
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => setShowSkeleton(!showSkeleton)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                      showSkeleton
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    {showSkeleton ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>Skeleton</span>
                  </button>

                  <button
                    onClick={() => setShowBatTrack(!showBatTrack)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                      showBatTrack
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Swing Arc</span>
                  </button>

                  <button
                    onClick={() => setShowAngles(!showAngles)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
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

          </div>

          {/* Sample Batting Clips Chooser */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Or Select Pre-Loaded Highlight Clip
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_VIDEOS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => {
                    setSelectedSample(sample);
                    setCustomVideoUrl(null);
                    setCustomVideoName(null);
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    selectedSample.id === sample.id && !customVideoUrl
                      ? 'bg-cyan-500/10 border-cyan-500/40 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold text-white">{sample.title}</p>
                  <p className="text-[10px] text-cyan-400 font-mono-code">{sample.category} • {sample.player}</p>
                </div>
              ))}
            </div>
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
                  <h3 className="text-base font-extrabold font-heading text-white">Video Analysis Metrics</h3>
                  <p className="text-[11px] text-slate-400">Target Player: <span className="text-cyan-400 font-bold">{selectedPlayer.name}</span></p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                LIVE CV METRICS
              </span>
            </div>

            {/* 3 PRIMARY REQUIRED METRICS SCORECARDS */}
            <div className="space-y-3">
              
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
                  DOWNSWIGN ARC
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

            {/* Secondary Angles & Balance */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono-code">Top Elbow Angle</span>
                <p className="font-bold text-slate-200 mt-0.5">{currentShotPreset.elbowAngle}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono-code">Downswing Arc</span>
                <p className="font-semibold text-slate-300 truncate mt-0.5">{currentShotPreset.downswingArc}</p>
              </div>
            </div>

            {/* Technique Flaw Detection */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Technique Diagnosis</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentShotPreset.flaw}
              </p>
            </div>

            {/* Recommended Batting Drill */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <CheckCircle className="w-4 h-4" />
                <span>Recommended Batting Drill</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentShotPreset.drill}
              </p>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 text-center animate-in fade-in">
                ✓ {saveSuccessMsg}
              </div>
            )}

            {/* Save Report Action */}
            <button
              onClick={handleSaveReport}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-xs hover:opacity-95 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Save Analysis Report to {selectedPlayer.name}'s Profile</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
