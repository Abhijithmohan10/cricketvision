import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { INITIAL_PLAYER_DATABASE } from './src/data/cricketDatabase.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cricketvision';

app.use(cors());
app.use(express.json());

// Player Schema Definition
const playerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  country: String,
  role: String,
  battingStyle: String,
  bowlingStyle: String,
  iplTeam: String,
  avatar: String,
  jerseyNumber: Number,
  fatigueLevel: Number,
  injuryStatus: String,
  clutchRating: Number,
  skillRadar: Object,
  internationalStats: Object,
  iplStats: Object,
  phaseStats: Object,
  recentForm: Array,
  biomechanicsSummary: Object
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);

// User Schema Definition for MongoDB "users" collection with Validation
const userSchema = new mongoose.Schema({
  id: { type: String, required: [true, 'User ID is required'], unique: true },
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters long'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email address is required'], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: { 
    type: String, 
    required: [true, 'User role is required'], 
    enum: {
      values: ['coach', 'player', 'user'],
      message: 'Role must be either coach, player, or user'
    }
  },
  title: String,
  avatar: String,
  badge: String,
  playerId: String,
  permissions: [String]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);


// Initial Seed Users for MongoDB "users" collection
const INITIAL_USERS = [
  {
    id: "coach-1",
    name: "Rahul Dravid",
    email: "coach@cricketvision.ai",
    password: "coach123",
    role: "coach",
    title: "Head Coach & Performance Director",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    badge: "👑 Head Coach",
    permissions: ["all_access", "edit_players", "team_builder", "biomechanics_upload", "strategy_reports"]
  },
  {
    id: "player-virat",
    name: "Virat Kohli",
    email: "virat@cricketvision.ai",
    password: "player123",
    role: "player",
    playerId: "virat-kohli",
    title: "Star Batter (#18)",
    avatar: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    badge: "🏏 Player Portal",
    permissions: ["personal_stats", "personal_video_analysis", "drill_recommendations", "match_simulator"]
  },
  {
    id: "player-bumrah",
    name: "Jasprit Bumrah",
    email: "bumrah@cricketvision.ai",
    password: "player123",
    role: "player",
    playerId: "jasprit-bumrah",
    title: "Fast Bowler (#93)",
    avatar: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80",
    badge: "🏏 Player Portal",
    permissions: ["personal_stats", "personal_video_analysis", "drill_recommendations"]
  },
  {
    id: "user-1",
    name: "Alex Morgan",
    email: "user@cricketvision.ai",
    password: "user123",
    role: "user",
    title: "Senior Cricket Analyst",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    badge: "📊 Analyst User",
    permissions: ["view_database", "video_upload", "match_simulator", "radar_compare"]
  }
];

// Connect to Local MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log(`🍃 Connected to MongoDB local instance at ${MONGO_URI}`);
    
    // Auto-seed/update 100+ players into MongoDB if collection is missing or outdated
    const playerCount = await Player.countDocuments();
    if (playerCount < 100) {
      console.log("Seeding 100+ verified players into MongoDB...");
      await Player.deleteMany({});
      await Player.insertMany(INITIAL_PLAYER_DATABASE);
      console.log("Successfully seeded 100+ players into MongoDB!");
    } else {
      console.log(`🍃 MongoDB currently holding ${playerCount} player documents.`);
    }

    // Auto-seed users if collection is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("Seeding initial users into MongoDB 'users' collection...");
      await User.insertMany(INITIAL_USERS);
      console.log("Successfully seeded users into MongoDB!");
    }
  })
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
  });

// --- PLAYER ROUTES ---

app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find().sort({ clutchRating: -1 });
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/players', async (req, res) => {
  try {
    const playerObj = req.body;
    if (!playerObj.id && playerObj.name) {
      playerObj.id = playerObj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    // Upsert into MongoDB (Insert or Update if exists)
    const saved = await Player.findOneAndUpdate(
      { id: playerObj.id },
      playerObj,
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/players/:id', async (req, res) => {
  try {
    const updated = await Player.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/players/:id', async (req, res) => {
  try {
    await Player.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Player deleted successfully from MongoDB' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/players/seed', async (req, res) => {
  try {
    await Player.deleteMany({});
    const seeded = await Player.insertMany(INITIAL_PLAYER_DATABASE);
    res.json({ message: `Successfully seeded ${seeded.length} players into MongoDB`, count: seeded.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- USER ROUTES (MongoDB "users" collection) ---

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST User Login Authentication
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(404).json({ error: 'User not found for selected role' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Register new User with Validation
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Manual Validation Checks
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address (e.g. user@domain.com)' });
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: `An account with email ${email} already exists.` });
    }

    const newUser = new User(req.body);
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email or User ID already registered in database' });
    }
    res.status(400).json({ error: err.message });
  }
});


// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 CricketVision Backend Server running on http://localhost:${PORT}`);
});
