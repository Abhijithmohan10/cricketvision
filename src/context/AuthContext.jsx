import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'cricketvision_auth_user_v1';

export const DEFAULT_USERS = {
  coach: {
    name: "Rahul Dravid",
    role: "coach",
    title: "Head Coach & High-Performance Director",
    email: "coach@cricketvision.ai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    badge: "👑 Head Coach (Full Access)",
    permissions: ["all_access", "edit_players", "team_builder", "biomechanics_upload", "strategy_reports", "manage_squad"]
  },
  player: {
    name: "Virat Kohli",
    role: "player",
    playerId: "virat-kohli",
    title: "Star Batter (#18)",
    email: "virat@cricketvision.ai",
    avatar: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    badge: "🏏 Player Portal ",
    permissions: ["personal_stats", "personal_video_analysis", "drill_recommendations", "match_simulator"]
  },
  player_bumrah: {
    name: "Jasprit Bumrah",
    role: "player",
    playerId: "jasprit-bumrah",
    title: "Fast Bowler (#93)",
    email: "bumrah@cricketvision.ai",
    avatar: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80",
    badge: "🏏 Player Portal ",
    permissions: ["personal_stats", "personal_video_analysis", "drill_recommendations"]
  },
  player_rohit: {
    name: "Rohit Sharma",
    role: "player",
    playerId: "rohit-sharma",
    title: "Opening Batter (#45)",
    email: "rohit@cricketvision.ai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    badge: "🏏 Player Portal ",
    permissions: ["personal_stats", "personal_video_analysis", "drill_recommendations"]
  },
  user: {
    name: "Alex Morgan",
    role: "user",
    title: "Senior Cricket Analyst / Member",
    email: "user@cricketvision.ai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    badge: "📊 Analyst User",
    permissions: ["view_database", "video_upload", "match_simulator", "radar_compare"]
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load auth user:", e);
    }
    // Default start as Head Coach
    return DEFAULT_USERS.coach;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const loginAsRole = (roleKey, customPlayer = null) => {
    if (roleKey === 'player' && customPlayer) {
      setCurrentUser({
        name: customPlayer.name,
        role: "player",
        playerId: customPlayer.id,
        title: `${customPlayer.role} (#${customPlayer.jerseyNumber || 10})`,
        email: `${customPlayer.id}@cricketvision.ai`,
        avatar: customPlayer.avatar || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
        badge: "🏏 Player Portal (User-wise Data)",
        permissions: ["personal_stats", "personal_video_analysis", "drill_recommendations", "match_simulator"]
      });
    } else if (DEFAULT_USERS[roleKey]) {
      setCurrentUser(DEFAULT_USERS[roleKey]);
    }
  };

  const switchPlayerAccount = (playerObj) => {
    if (!playerObj) return;
    setCurrentUser({
      name: playerObj.name,
      role: "player",
      playerId: playerObj.id,
      title: `${playerObj.role} (#${playerObj.jerseyNumber || 10})`,
      email: `${playerObj.id}@cricketvision.ai`,
      avatar: playerObj.avatar || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
      badge: "🏏 Player Portal (User-wise Data)",
      permissions: ["personal_stats", "personal_video_analysis", "drill_recommendations", "match_simulator"]
    });
  };

  const canAccessPlayer = (targetPlayerId) => {
    if (!currentUser) return false;
    if (currentUser.role === 'coach') return true; // Coach has access to all players
    if (currentUser.role === 'player') return currentUser.playerId === targetPlayerId;
    return false;
  };

  const hasPermission = (permissionKey) => {
    if (!currentUser) return false;
    if (currentUser.role === 'coach') return true;
    return currentUser.permissions?.includes(permissionKey);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isCoach = currentUser?.role === 'coach';
  const isPlayer = currentUser?.role === 'player';
  const isUser = currentUser?.role === 'user';

  return (
    <AuthContext.Provider value={{
      currentUser,
      loginAsRole,
      switchPlayerAccount,
      canAccessPlayer,
      hasPermission,
      logout,
      isCoach,
      isPlayer,
      isUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

