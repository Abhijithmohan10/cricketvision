# 🏏 CricketVision AI — Performance Analytics & Biomechanics Platform

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Deployment](https://img.shields.io/badge/GitHub_Pages-Live-22C55E?style=for-the-badge&logo=github&logoColor=white)

**CricketVision AI** is an advanced full-stack sports analytics and computer vision biomechanics platform engineered for head coaches, elite players, and cricket performance analysts. It bridges raw match statistics with actionable tactical insights, biomechanical movement tracking, and AI-driven match simulations.

---

## 🌟 Key Features & Modules

### 1. ⚡ AI Computer Vision Video Analyzer
- **Custom Video File Upload:** Drag and drop or upload any cricket video clip (`.mp4`, `.mov`, `.webm`).
- **Real-Time Frame Scanning:** Active neural scanning laser animation during frame processing.
- **Calculated CV Metrics:**
  - ⚡ **Ball Speed** (e.g. `145.4 km/h`)
  - 🏏 **Bat Speed** (e.g. `142.8 km/h`)
  - 🎯 **Shot Perfection Score** (e.g. `96%` • Elite Execution)
- **Technique Flaws & Drills:** Automated diagnosis of elbow angles, footwork stance, and custom training drills.

### 2. ⚔️ Head-to-Head Player Comparison (H2H)
- **1-on-1 Player Matchups:** Compare any 2 squad members side-by-side (e.g. *Virat Kohli vs Rohit Sharma*, *Jasprit Bumrah vs Pat Cummins*).
- **Rivalry Presets:** 1-click presets for classic international & IPL rivalries.
- **Overlapping Skill Radar:** Interactive Recharts `<RadarChart>` comparing 6 core dimensions (*Power Hitting, Pace Mastery, Spin Control, Death Execution, Precision, Clutch Factor*).
- **AI Advantage Verdict:** Algorithmic matchup analysis rating who holds the edge on express pace pitches, spin tracks, and death overs.

### 3. 👑 Coach & Performance Director Suite
- **MongoDB Roster Management:** Full CRUD operations over 100+ verified IPL & International player profiles.
- **Playing XI Optimizer:** Team balance scoring engine evaluating batting depth, pace/spin ratio, and death bowling coverage.
- **AI Strategy Coach:** Natural language assistant providing tactical advice, matchup strategies, and injury rehab protocols.
- **Fatigue Monitoring:** Squad-wide workload tracking and injury risk alerts.

### 4. 🏏 Player Portal & Biomechanics Dashboard
- **Personalized Metrics:** Individualized clutch rating, recent form, and phase stats (Powerplay, Middle Overs, Death Overs).
- **360° Pitch & Wagon Wheel:** Interactive visualizer displaying shot dispersion sectors and ball length heatmaps.
- **Scouting Reports:** Exportable single-page A4 PDF/Match Summary reports.

### 5. 🎯 Match Simulator & Opposition Predictor
- **Win Probability Engine:** Ball-by-ball stochastic match simulation incorporating venue factors, pitch conditions, and DLS weather calculations.
- **Next Match Predictor:** Opposition matchup matrix and venue strategy planner.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, html2canvas, jspdf.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose ODM), bcrypt, jsonwebtoken (JWT).
- **Deployment:** GitHub Pages & Node.js Server API.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- Git >= 2.x

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhijithmohan10/cricketvision.git
   cd cricketvision
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The application will open automatically at `http://localhost:3000`.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

---

## 🔑 Demo Access Roles & Test Personas

You can switch roles instantly using the **Role Switcher** button in the header:

- **👑 Head Coach (`Rahul Dravid`):** Full administrative access to roster CRUD, Team Builder XI, and AI strategy assistant.
- **🏏 Player (`Virat Kohli` / `Jasprit Bumrah`):** Personal player portal access to private biomechanics stats, wagon wheel, and drills.
- **📊 Analyst User (`Analyst User`):** Access to public match simulations, opposition predictor, and H2H comparison suite.

---

## 🌐 Live Application Links

- **Live Web Application:** [abhijithmohan10.github.io/cricketvision](https://abhijithmohan10.github.io/cricketvision/)
- **GitHub Repository:** [github.com/Abhijithmohan10/cricketvision](https://github.com/Abhijithmohan10/cricketvision)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

© 2026 CricketVision AI • Performance Analysis & Team Intelligence Platform.
