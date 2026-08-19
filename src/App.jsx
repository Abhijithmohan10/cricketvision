import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import VideoAnalyzerView from './components/VideoAnalyzerView';
import PlayerAnalyticsView from './components/PlayerAnalyticsView';
import MatchSimulatorView from './components/MatchSimulatorView';
import TeamBuilderView from './components/TeamBuilderView';
import NextMatchPredictorView from './components/NextMatchPredictorView';
import PlayerPortalView from './components/PlayerPortalView';
import LoginView from './components/LoginView';
import DatabaseManagerModal from './components/DatabaseManagerModal';
import AICoachModal from './components/AICoachModal';
import { getStoredPlayerDatabase, savePlayerDatabase, resetPlayerDatabaseToDefault } from './data/cricketDatabase';

function MainApp() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Database State with MongoDB API Sync & LocalStorage Fallback
  const [players, setPlayers] = useState(() => getStoredPlayerDatabase());
  const [isMongoConnected, setIsMongoConnected] = useState(false);
  
  // Modals
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [isDBManagerOpen, setIsDBManagerOpen] = useState(false);

  // Fetch from MongoDB server on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/players')
      .then(res => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPlayers(data);
          setIsMongoConnected(true);
          console.log(`🍃 Connected to MongoDB Server! Received ${data.length} player records.`);
        }
      })
      .catch(() => {
        console.log('MongoDB server offline at localhost:5000. Operating in LocalStorage fallback mode.');
        setIsMongoConnected(false);
      });
  }, []);

  // Sync state to MongoDB (Primary) & LocalStorage (Fallback)
  const handleSavePlayers = async (updatedPlayers) => {
    setPlayers(updatedPlayers);
    savePlayerDatabase(updatedPlayers);

    if (isMongoConnected) {
      try {
        const latestPlayer = updatedPlayers[updatedPlayers.length - 1];
        if (latestPlayer) {
          await fetch('http://localhost:5000/api/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(latestPlayer)
          });
          
          const res = await fetch('http://localhost:5000/api/players');
          if (res.ok) {
            const freshData = await res.json();
            setPlayers(freshData);
          }
        }
      } catch (e) {
        console.error('Error syncing with MongoDB:', e);
      }
    }
  };

  const handleResetDefault = async () => {
    const defaults = resetPlayerDatabaseToDefault();
    setPlayers(defaults);

    if (isMongoConnected) {
      try {
        const res = await fetch('http://localhost:5000/api/players/seed', { method: 'POST' });
        if (res.ok) {
          const freshRes = await fetch('http://localhost:5000/api/players');
          if (freshRes.ok) {
            const freshData = await freshRes.json();
            setPlayers(freshData);
          }
        }
      } catch (e) {
        console.error('Error resetting MongoDB database:', e);
      }
    }
  };


  const handleSaveAnalysisReport = (reportData) => {
    if (!reportData || !reportData.player) return;
    const targetId = reportData.player.id;
    const updated = players.map(p => {
      if (p.id === targetId) {
        return {
          ...p,
          videoMetrics: reportData.metrics,
          lastAnalysisDate: reportData.date
        };
      }
      return p;
    });
    handleSavePlayers(updated);
  };

  // Render appropriate view based on activeTab
  const renderActiveView = () => {
    switch (activeTab) {
      case 'next_match_predictor':
        return <NextMatchPredictorView players={players} />;
      case 'video_analyzer':
        return <VideoAnalyzerView players={players} onSaveAnalysisReport={handleSaveAnalysisReport} />;
      case 'database':
        return <PlayerAnalyticsView players={players} searchQuery={searchQuery} />;
      case 'simulator':
        return <MatchSimulatorView players={players} />;
      case 'team_builder':
        return <TeamBuilderView players={players} />;
      case 'player_portal':
        return <PlayerPortalView players={players} />;
      case 'login':
        return <LoginView players={players} onLoginSuccess={(role) => setActiveTab(role === 'player' ? 'player_portal' : 'dashboard')} />;
      case 'dashboard':
      default:
        return <DashboardView players={players} setActiveTab={setActiveTab} onOpenAICoach={() => setIsAICoachOpen(true)} />;
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAICoach={() => setIsAICoachOpen(true)}
        onOpenDBManager={() => setIsDBManagerOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q.trim() && activeTab !== 'database') setActiveTab('database');
        }}
        playersCount={players.length}
        isMongoConnected={isMongoConnected}
      />

      {/* Main Container View */}
      <main className="flex-1">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono-code">
          <p>© 2026 CricketVision AI • </p>
         
        </div>
      </footer>

      {/* Modals */}
      <AICoachModal
        isOpen={isAICoachOpen}
        onClose={() => setIsAICoachOpen(false)}
      />

      <DatabaseManagerModal
        isOpen={isDBManagerOpen}
        onClose={() => setIsDBManagerOpen(false)}
        players={players}
        onSavePlayers={handleSavePlayers}
        onResetDefault={handleResetDefault}
      />

    </div>
  );
}

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Global React Render Error:", error, errorInfo);
  }
  handleReset = () => {
    localStorage.removeItem("cricketvision_player_db_v1");
    window.location.reload();
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
            <h1 className="text-xl font-extrabold font-heading text-white">CricketVision AI</h1>
            <p className="text-xs text-rose-400">A temporary display error occurred in the browser preview.</p>
            <p className="text-[11px] text-slate-400 font-mono-code bg-slate-900 p-3 rounded-lg border border-slate-800 text-left overflow-x-auto">
              {this.state.error?.toString()}
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
            >
              Reset Cache & Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </GlobalErrorBoundary>
  );
}

