// ─── Centralized API Configuration ───────────────────────────────────────────
// All backend API calls go through this base URL.
// In development: points to local Express server (localhost:5000).
// In production (GitHub Pages): falls back gracefully since there is no server
// and the app uses LocalStorage mode automatically.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
