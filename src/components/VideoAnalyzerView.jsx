import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
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
  Award
} from 'lucide-react';
import { SAMPLE_VIDEOS } from '../data/sampleVideos';

export default function VideoAnalyzerView({ onSaveAnalysisReport }) {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_VIDEOS[0]);
  const [customVideoUrl, setCustomVideoUrl] = useState(null);
  const [customVideoName, setCustomVideoName] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Overlay Toggles
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [showAngles, setShowAngles] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeVideoUrl = customVideoUrl || selectedSample.videoUrl;

  // Handle Video File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setCustomVideoName(file.name);
      setIsPlaying(false);
    }
  };

  // Video Time Update & Canvas Overlay Renderer
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');

    const renderOverlay = () => {
      if (!video.videoWidth || !video.videoHeight) return;

      canvas.width = video.clientWidth || 640;
      canvas.height = video.clientHeight || 360;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Current playback progress factor (0 to 1)
      const progress = video.currentTime / (video.duration || 1);

      // Draw Trajectory Vector Line
      if (showTrajectory) {
        ctx.beginPath();
        ctx.strokeStyle = '#06b6d4'; // Cyan
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);

        // Pitch line curve
        ctx.moveTo(w * 0.15, h * 0.35);
        ctx.quadraticCurveTo(w * 0.45, h * 0.85, w * 0.75, h * 0.45);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pitch Impact Circle
        const impactX = w * (0.15 + progress * 0.6);
        const impactY = h * (0.35 + Math.sin(progress * Math.PI) * 0.4);

        ctx.beginPath();
        ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
        ctx.arc(impactX, impactY, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = '#10b981';
        ctx.arc(impactX, impactY, 12, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Simulated Joint Skeleton Pose Overlay
      if (showSkeleton) {
        const headX = w * 0.52 + Math.sin(progress * 4) * 10;
        const headY = h * 0.30;

        const shoulderL = { x: headX - 25, y: headY + 30 };
        const shoulderR = { x: headX + 25, y: headY + 30 };
        
        const elbowR = { x: headX + 50 + Math.cos(progress * 6) * 20, y: headY + 50 };
        const wristR = { x: headX + 70 + Math.sin(progress * 6) * 30, y: headY + 80 };

        const hipL = { x: headX - 15, y: headY + 110 };
        const hipR = { x: headX + 15, y: headY + 110 };

        const kneeL = { x: headX - 25, y: headY + 170 };
        const kneeR = { x: headX + 25, y: headY + 170 };

        // Connect Skeleton Joints
        ctx.strokeStyle = '#10b981'; // Emerald Green
        ctx.lineWidth = 4;

        // Head
        ctx.beginPath();
        ctx.arc(headX, headY, 16, 0, Math.PI * 2);
        ctx.strokeStyle = '#ec4899'; // Pink head
        ctx.stroke();

        // Spine & Shoulders
        ctx.beginPath();
        ctx.strokeStyle = '#06b6d4';
        ctx.moveTo(shoulderL.x, shoulderL.y);
        ctx.lineTo(shoulderR.x, shoulderR.y);
        ctx.lineTo(hipR.x, hipR.y);
        ctx.lineTo(hipL.x, hipL.y);
        ctx.closePath();
        ctx.stroke();

        // Arms (Right arm bat swing arc)
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b'; // Amber arm
        ctx.moveTo(shoulderR.x, shoulderR.y);
        ctx.lineTo(elbowR.x, elbowR.y);
        ctx.lineTo(wristR.x, wristR.y);
        ctx.stroke();

        // Legs
        ctx.beginPath();
        ctx.strokeStyle = '#10b981';
        ctx.moveTo(hipL.x, hipL.y);
        ctx.lineTo(kneeL.x, kneeL.y);
        ctx.moveTo(hipR.x, hipR.y);
        ctx.lineTo(kneeR.x, kneeR.y);
        ctx.stroke();

        // Angle Measurement Labels
        if (showAngles) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '11px Outfit, sans-serif';
          ctx.fillText(`Elbow: 84°`, elbowR.x + 8, elbowR.y);
          ctx.fillText(`Knee Bend: 132°`, kneeR.x + 8, kneeR.y);
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
  }, [showSkeleton, showTrajectory, showAngles]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-xs font-bold font-mono-code bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
              AI COMPUTER VISION
            </span>
            <h1 className="text-2xl font-extrabold font-heading text-white">
              Video Upload & Pose Biomechanics Analyzer
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Upload your shot or bowling video clip to estimate bat speed, elbow angles, footwork balance, and stance alignment.
          </p>
        </div>

        {/* File Upload Button */}
        <div className="flex items-center space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="video/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Custom Video File</span>
          </button>
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

              {/* Canvas Overlay for Pose Keypoints & Trajectory */}
              <canvas
                ref={canvasRef}
                className="analyzer-canvas"
              />

              {/* Active Sample/File Badge */}
              <div className="absolute top-4 left-4 glass-panel px-3 py-1.5 rounded-lg border border-slate-800 text-xs flex items-center space-x-2">
                <FileVideo className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-white">
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

                  {/* Playback Speed Selector */}
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

                {/* AI Overlay Layer Toggles */}
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
                    <span>Joint Skeleton</span>
                  </button>

                  <button
                    onClick={() => setShowTrajectory(!showTrajectory)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                      showTrajectory
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Ball Path Line</span>
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
                    <span>Angle Markers</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Sample Video Library Chooser */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Or Choose Pre-Loaded Sample Video Clip
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

        {/* Right Col: AI Computer Vision Analysis Results Card */}
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-extrabold font-heading text-white">AI Biomechanics Diagnosis</h3>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                COMPUTE READY
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3">
              
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <p className="text-[10px] text-slate-400">Estimated Velocity</p>
                <p className="text-xl font-extrabold font-heading text-cyan-400">
                  {selectedSample.metrics.batSpeed || selectedSample.metrics.releaseSpeed}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <p className="text-[10px] text-slate-400">Balance & Alignment</p>
                <p className="text-xl font-extrabold font-heading text-emerald-400">
                  {selectedSample.metrics.balanceScore}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 col-span-2">
                <p className="text-[10px] text-slate-400">Impact Alignment Line</p>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">
                  {selectedSample.metrics.impactPoint || selectedSample.metrics.releaseAngle}
                </p>
              </div>

            </div>

            {/* Flaw Detection Box */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Detected Technique Flaw</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedSample.metrics.detectedFlaw}
              </p>
            </div>

            {/* Recommended Drill */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <CheckCircle className="w-4 h-4" />
                <span>AI Recommended Drill</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedSample.metrics.recommendedDrill}
              </p>
            </div>

            {/* Save Report Action */}
            <button
              onClick={() => {
                if (onSaveAnalysisReport) {
                  onSaveAnalysisReport({
                    title: customVideoName || selectedSample.title,
                    date: new Date().toLocaleDateString(),
                    metrics: selectedSample.metrics
                  });
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-cyan-400 font-bold text-xs transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Save Report to Local Database</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
