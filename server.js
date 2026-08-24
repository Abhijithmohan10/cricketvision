import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { INITIAL_PLAYER_DATABASE } from './src/data/cricketDatabase.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cricketvision';
const JWT_SECRET = process.env.JWT_SECRET || 'cricketvision_jwt_secret_2026';

app.use(cors());
app.use(express.json());

// ─── Player Schema ───────────────────────────────────────────────────────────
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

// ─── User Schema ─────────────────────────────────────────────────────────────
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
    enum: { values: ['coach', 'player', 'user'], message: 'Role must be coach, player, or user' }
  },
  title: String,
  avatar: String,
  badge: String,
  playerId: String,
  permissions: [String]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ─── Seed Data (plain passwords — will be hashed before inserting) ────────────
const SEED_USERS = [
  {
    id: 'coach-1', name: 'Rahul Dravid', email: 'coach@cricketvision.ai',
    password: 'coach123', role: 'coach',
    title: 'Head Coach & Performance Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    badge: '👑 Head Coach',
    permissions: ['all_access', 'edit_players', 'team_builder', 'biomechanics_upload', 'strategy_reports']
  },
  {
    id: 'player-virat', name: 'Virat Kohli', email: 'virat@cricketvision.ai',
    password: 'player123', role: 'player', playerId: 'virat-kohli',
    title: 'Star Batter (#18)',
    avatar: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80',
    badge: '🏏 Player Portal',
    permissions: ['personal_stats', 'personal_video_analysis', 'drill_recommendations', 'match_simulator']
  },
  {
    id: 'player-bumrah', name: 'Jasprit Bumrah', email: 'bumrah@cricketvision.ai',
    password: 'player123', role: 'player', playerId: 'jasprit-bumrah',
    title: 'Fast Bowler (#93)',
    avatar: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80',
    badge: '🏏 Player Portal',
    permissions: ['personal_stats', 'personal_video_analysis', 'drill_recommendations']
  },
  {
    id: 'user-1', name: 'Alex Morgan', email: 'user@cricketvision.ai',
    password: 'user123', role: 'user',
    title: 'Senior Cricket Analyst',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    badge: '📊 Analyst User',
    permissions: ['view_database', 'video_upload', 'match_simulator', 'radar_compare']
  }
];

// ─── Connect to MongoDB & Seed ────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log(`🍃 Connected to MongoDB at ${MONGO_URI}`);

    // Seed players if fewer than 100
    const playerCount = await Player.countDocuments();
    if (playerCount < 100) {
      console.log('📥 Seeding 100+ verified players...');
      await Player.deleteMany({});
      await Player.insertMany(INITIAL_PLAYER_DATABASE);
      console.log('✅ Seeded 100+ players into MongoDB!');
    } else {
      console.log(`🍃 MongoDB has ${playerCount} player documents.`);
    }

    // Seed users with HASHED passwords on first run
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🔐 Seeding users with bcrypt-hashed passwords...');
      const hashedUsers = await Promise.all(
        SEED_USERS.map(async (u) => ({ ...u, password: await bcrypt.hash(u.password, 10) }))
      );
      await User.insertMany(hashedUsers);
      console.log('✅ Users seeded with hashed passwords!');
    }
  })
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// ─── Player Routes ────────────────────────────────────────────────────────────

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
    const saved = await Player.findOneAndUpdate(
      { id: playerObj.id }, playerObj,
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
    res.json({ message: `Successfully seeded ${seeded.length} players`, count: seeded.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── User Routes ──────────────────────────────────────────────────────────────

// GET all users (passwords excluded)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/login — bcrypt verify + JWT token
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    // Sign a 7-day JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ user: userObj, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/register — hash password + JWT token
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: `An account with email ${email} already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword, email: email.toLowerCase() });
    const saved = await newUser.save();

    const token = jwt.sign(
      { id: saved.id, role: saved.role, name: saved.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userObj = saved.toObject();
    delete userObj.password;

    res.status(201).json({ user: userObj, token });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email or User ID already registered in database' });
    }
    res.status(400).json({ error: err.message });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 CricketVision Backend running on http://localhost:${PORT}`);
  console.log(`🔐 bcrypt hashing + JWT auth: ACTIVE`);
});
