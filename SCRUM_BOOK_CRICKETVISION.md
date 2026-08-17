# SCRUM PROJECT BOOK
## CricketVision — AI-Powered Cricket Performance Analytics & Biomechanics Platform
**Master of Computer Applications (MCA) Mini-Project**  
**Project Timeline:** July 1, 2026 – July 23, 2026  
**Document Status:** Finalized & Submitted for Guide Approval  

---

## 1. Executive Summary & Project Abstract

### 1.1 Introduction
Modern professional cricket relies heavily on quantitative data analytics, computer vision biomechanics tracking, and predictive simulation engines. **CricketVision** is an advanced full-stack sports analytics platform engineered for head coaches, elite players, and performance analysts. It bridges raw match statistics with actionable tactical insights, biomechanical body tracking, and AI-driven match simulation.

### 1.2 Problem Statement
Traditional cricket coaching relies on fragmented static scorecards and subjective video observation. Coaches lack an integrated platform to monitor player fatigue levels, analyze phase-wise match performance (Powerplay, Middle Overs, Death Overs), run real-time match simulations against specific opposition tactics, and manage full team rosters backed by a centralized database.

### 1.3 Key Objectives
- **Coach & Performance Director Portal:** Full roster management via MongoDB database operations, Team Builder XI optimizer, AI Coach strategy assistant, biomechanics report upload, and fatigue level oversight.
- **Player Portal (Personalized Dashboard):** Individual performance metrics (clutch rating, recent form, phase stats), pitch & wagon wheel visualizations, biomechanics summary, drill recommendations, and private video review.
- **Analyst Portal:** Interactive Match Simulator with ball-by-ball win-probability tracking, Next Match Predictor (venue & match-up matrix), pose-estimation Video Analyzer, and multi-player radar chart comparisons.
- **Role-Based Auth & Database:** MongoDB database populated with 100+ verified IPL & International player profiles, custom schema validation, and instant role-based quick-authentication.

### 1.4 Expected Outcome
A production-ready full-stack web application featuring an Express.js & Node.js backend, MongoDB (Mongoose ODM) persistence layer, and React 18 frontend leveraging Recharts, Tailwind CSS, and Lucide Icons.

---

## 2. Agile / Scrum Framework Configuration

### 2.1 Scrum Team Roles
- **Product Owner / Project Guide:** MCA Project Guide (Reviewer & Approver)
- **Scrum Master & Lead Developer:** MCA Student (Full-Stack AI & Web Developer)

### 2.2 Agile Metrics & Estimation Scale
Story points are assigned using a modified **Fibonacci Scale** (1, 2, 3, 5, 8, 13) reflecting implementation effort, data complexity, and UI visualization depth.

| Story Points | Complexity Level | Scope & Target Components |
| :--- | :--- | :--- |
| **1 - 2 Points** | Low | Styling adjustments, modal toggles, simple form validation |
| **3 - 5 Points** | Medium | Mongoose schemas, REST CRUD endpoints, form controllers |
| **8 Points** | High | 100+ Player seeding engine, Recharts Radar & Wagon Wheel, Match Simulator |
| **13 Points** | Very High | Full AI Coach Natural Language assistant, pose-estimation Video Analyzer engine |

### 2.3 Definition of Done (DoD)
A User Story is marked **DONE** when:
1. Backend REST endpoints operate error-free and update/retrieve MongoDB collections (`players`, `users`).
2. Mongoose schema validation handles duplicate entries, minimum field lengths, and invalid role enums gracefully.
3. React components render smoothly with live reactive state updates (Recharts, dynamic avatars, status badges).
4. Full role-based user testing (Coach, Player, Analyst) validates interface permissions.

---

## 3. Master Product Backlog

| Story ID | Epic | User Story Summary | Priority (MoSCoW) | Story Points | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **US-01** | Setup | Initialize Node.js, Express, Vite React project, Tailwind CSS & workspace | Must Have | 3 | Done |
| **US-02** | Schema | Define Mongoose `Player` schema (phase stats, clutch rating, biomechanics) | Must Have | 5 | Done |
| **US-03** | Schema | Define Mongoose `User` schema with role validation (`coach`, `player`, `user`) | Must Have | 5 | Done |
| **US-04** | Backend | Build MongoDB auto-seeding controller for 100+ verified IPL/Intl players | Must Have | 8 | Done |
| **US-05** | Auth API | Implement `/api/users/login` and `/api/users/register` endpoints with validation | Must Have | 5 | Done |
| **US-06** | Player API | Implement Player REST endpoints (`GET`, `POST`, `PUT`, `DELETE` `/api/players`) | Must Have | 5 | Done |
| **US-07** | Navigation | Build responsive `Navbar` with role badges, notification drawer, portal switch | Must Have | 3 | Done |
| **US-08** | Auth UI | Build `LoginView.jsx` with role selector and quick-login persona presets | Must Have | 5 | Done |
| **US-09** | Dashboard | Build `DashboardView.jsx` for top-level squad overview and fatigue alerts | Must Have | 5 | Done |
| **US-10** | Analytics | Build `PlayerAnalyticsView.jsx` with Recharts Radar Chart & phase stats | Must Have | 8 | Done |
| **US-11** | Visualizer | Build `PitchAndWagonWheel.jsx` for 360° shot dispersion and pitch heatmap | Must Have | 8 | Done |
| **US-12** | Player Portal| Build `PlayerPortalView.jsx` for individualized player stats & video review | Must Have | 8 | Done |
| **US-13** | Simulator | Build `MatchSimulatorView.jsx` for win-probability simulation & weather math | Must Have | 8 | Done |
| **US-14** | Predictor | Build `NextMatchPredictorView.jsx` for opposition match-ups & pitch analytics | Should Have | 8 | Done |
| **US-15** | Video | Build `VideoAnalyzerView.jsx` for biomechanics pose tracking & angle metrics | Should Have | 8 | Done |
| **US-16** | Team | Build `TeamBuilderView.jsx` for optimized XI selection and balance scoring | Should Have | 5 | Done |
| **US-17** | DB Admin | Build `DatabaseManagerModal.jsx` for live MongoDB player CRUD & database reset | Must Have | 8 | Done |
| **US-18** | AI Coach | Build `AICoachModal.jsx` for natural language strategy & rehab prompts | Should Have | 5 | Done |
| **US-19** | Reports | Build `MatchReportModal.jsx` for generating exportable match summary reports | Could Have | 3 | Done |
| **US-20** | UX Fix | Fix MongoDB connection fallback, user registration error messaging | Must Have | 2 | Done |
| **US-21** | Backlog | Real-time WebSocket live match data stream integration | Could Have | 8 | Deferred |
| **US-22** | Backlog | Automatic video keyframe extraction via OpenCV sidecar process | Could Have | 8 | Deferred |

**Total Planned Story Points:** 137 Points  
**Completed Story Points:** 121 Points  
**Deferred Story Points:** 16 Points  

---

## 4. Sprint Breakdown & Execution Log

### Sprint 0: Conception, Scope & Tech Architecture
**Duration:** 01/07/2026 – 07/07/2026  
**Sprint Goal:** Conceptualize CricketVision, define role-based access requirements, finalize MERN stack architecture, and obtain project guide approval.

#### Daily Log & Standup Summary
- **01/07/2026:** Conducted domain research into sports analytics and biomechanics tracking platforms. Selected **CricketVision** as the project title. Defined core problem: lack of integrated AI analytics combining player fatigue, phase stats, and match simulation.
- **02/07/2026:** Outlined role requirements: **Head Coach** (roster management, AI strategy assistant), **Player** (personalized portal, wagon wheel, drill suggestions), **Analyst** (match simulator, pitch predictor, pose analyzer).
- **03/07/2026:** Prepared project abstract and detailed formal synopsis covering MERN stack tech stack (MongoDB, Express, React, Node.js) and Recharts integration. Submitted synopsis to MCA project guide.
- **06/07/2026:** Received guide approval. Installed Node.js, Express, Vite, React, Tailwind CSS, Lucide Icons, and Recharts. Configured `vite.config.js` and `postcss.config.js`.
- **07/07/2026:** Scaffolded project structure (`server.js`, `src/components`, `src/context`, `src/data`, `src/utils`). Verified local MongoDB instance connection on `mongodb://127.0.0.1:27017/cricketvision`.

#### Sprint 0 Review & Demo
- **Delivered:** Approved Project Synopsis, fully configured Vite + React + Express + Mongoose repository structure.
- **Story Points Completed:** 3 / 3

#### Sprint 0 Retrospective
- **What went well:** Tech stack selection cleanly aligns with requirements for interactive charts and fast document storage.
- **What could be improved:** Need clear pre-seeded dataset so application works out of the box.
- **Action Item:** Build a comprehensive initial player database script containing 100+ real player profiles.

---

### Sprint 1: MongoDB Schema Design & Core REST API Engine
**Duration:** 08/07/2026 – 10/07/2026  
**Sprint Goal:** Implement Mongoose models (`Player`, `User`), 100+ player seeding engine, and RESTful CRUD controllers.

#### Daily Log & Standup Summary
- **08/07/2026:** Implemented Mongoose `playerSchema` in `server.js` featuring fields for `fatigueLevel`, `clutchRating`, `skillRadar`, `phaseStats` (Powerplay, Middle, Death), `recentForm`, and `biomechanicsSummary`.
- **09/07/2026:** Implemented Mongoose `userSchema` with validation for email formatting, minimum password length (6 chars), and enum role validation (`coach`, `player`, `user`). Defined `INITIAL_USERS` preset accounts (Dravid, Kohli, Bumrah, Alex Morgan).
- **10/07/2026:** Created `INITIAL_PLAYER_DATABASE` seeding script in `src/data/cricketDatabase.js` with 100+ verified IPL/Intl players. Implemented `/api/players` CRUD routes and `/api/users/login`, `/api/users/register`. Tested endpoints via `curl` and Postman.

#### Sprint 1 Review & Demo
- **Delivered:** MongoDB auto-seeding engine populating 100+ players on server launch; working Auth and Player REST endpoints.
- **Story Points Completed:** 28 / 28

#### Sprint 1 Retrospective
- **What went well:** Mongoose upsert logic (`findOneAndUpdate` with `{ upsert: true }`) makes database modifications clean and idempotently safe.
- **What could be improved:** Input validation error responses needed cleaner user-facing strings.
- **Action Item:** Add custom validator message handlers in express registration controller.

---

### Sprint 2: Analytics & Visual Engines Development
**Duration:** 11/07/2026 – 13/07/2026  
**Sprint Goal:** Develop reusable analytical visual components (Pitch & Wagon Wheel, Recharts Skill Radar, Fatigue tracking).

#### Daily Log & Standup Summary
- **11/07/2026:** Built `PitchAndWagonWheel.jsx` SVG component rendering 360-degree shot distribution sectors (Offside, Legside, Straight, Fine Leg) and pitch length heatmap (Full, Good, Short, York).
- **12/07/2026:** Integrated Recharts `RadarChart`, `PolarGrid`, `PolarAngleAxis`, and `Radar` inside `PlayerAnalyticsView.jsx` to dynamically visualize player attributes (Power, Consistency, Spin, Pace, Field, Clutch).
- **13/07/2026:** Developed fatigue level tracking algorithm combining recent workload with injury status. Formulated clutch rating metric calculation based on match situation pressure points.

#### Sprint 2 Review & Demo
- **Delivered:** Working Pitch/Wagon Wheel SVG visualization module and dynamic Recharts Skill Radar visualizer.
- **Story Points Completed:** 24 / 24

#### Sprint 2 Retrospective
- **What went well:** SVG polar coordinates math rendered crisp, high-performance wagon wheel shots.
- **What could be improved:** Radar chart colors needed contrast adjustment for dark mode theme compatibility.
- **Action Item:** Apply Tailwind dark theme palette colors (`#10B981`, `#6366F1`) to Recharts components.

---

### Sprint 3: Role-Based Frontend Portals & Authentication UI
**Duration:** 14/07/2026 – 17/07/2026  
**Sprint Goal:** Implement application routing, multi-role authentication UI, Player Portal, and Team Dashboard.

#### Daily Log & Standup Summary
- **14/07/2026:** Designed top `Navbar.jsx` component featuring role indicator badges, user avatar, view switcher, and quick notification drawer.
- **15/07/2026:** Built `LoginView.jsx` with instant role profile cards ("Head Coach", "Player Portal", "Analyst User") for single-click quick testing, alongside a custom account registration modal with live validation.
- **16/07/2026:** Built `DashboardView.jsx` featuring top player KPI cards (Clutch Rating Leader, Highest Run Scorer, Top Wicket Taker), fatigue warnings, and squad list.
- **17/07/2026:** Built `PlayerPortalView.jsx` providing personalized views for Virat Kohli and Jasprit Bumrah including personal video analysis player, biomechanics summaries, and AI drill recommendations.

#### Sprint 3 Review & Demo
- **Delivered:** Complete role-gated UI structure allowing seamless switching between Coach, Player, and Analyst perspectives.
- **Story Points Completed:** 29 / 29

#### Sprint 3 Retrospective
- **What went well:** Persona quick-login buttons dramatically speed up testing across different security roles.
- **What could be improved:** State needs to persist properly when refreshing the page.
- **Action Item:** Save active user session in `localStorage`.

---

### Sprint 4: Simulations, Predictions & Video Pose Tracking
**Duration:** 18/07/2026 – 20/07/2026  
**Sprint Goal:** Develop Match Simulator engine, Next Match Predictor, Video Pose Analyzer, and XI Team Builder.

#### Daily Log & Standup Summary
- **18/07/2026:** Built `MatchSimulatorView.jsx` calculating ball-by-ball match win probabilities based on team strength, pitch condition modifiers (Dry, Green, Flat), and weather parameters (Humidity, Wind speed).
- **19/07/2026:** Built `NextMatchPredictorView.jsx` delivering head-to-head match-up matrices (e.g. Batter vs Spin/Pace) and venue historic scoring statistics. Built `TeamBuilderView.jsx` with XI team balance score.
- **20/07/2026:** Built `VideoAnalyzerView.jsx` simulating pose tracking skeleton overlays, releases angle measurements, stride length metrics, and frame-by-frame bowling action analysis.

#### Sprint 4 Review & Demo
- **Delivered:** Advanced analytical suite with match simulation, venue predictor, team optimizer, and video analyzer.
- **Story Points Completed:** 29 / 29

#### Sprint 4 Retrospective
- **What went well:** Interactive probability line chart (Recharts) gave instant visual feedback during match simulation.
- **What could be improved:** Large player datasets in simulator dropdowns required filtering options.
- **Action Item:** Add search input filtering to player selection dropdowns.

---

### Sprint 5: Database Manager, AI Coach, Polishing & Documentation
**Duration:** 21/07/2026 – 23/07/2026  
**Sprint Goal:** Implement `DatabaseManagerModal`, `AICoachModal`, error handling polish, and finalize project documentation.

#### Daily Log & Standup Summary
- **21/07/2026:** Built `DatabaseManagerModal.jsx` equipping coaches with full live CRUD control over MongoDB player collection (Add New Player, Edit Player, Delete Player, Re-seed 100+ Database).
- **22/07/2026:** Built `AICoachModal.jsx` providing interactive prompt cards for tactical advice, matchup strategies, and injury rehabilitation protocols. Built `MatchReportModal.jsx`.
- **23/07/2026:** Resolved MongoDB registration fallback bug and refined error messages. Prepared formal Scrum project documentation (Product Backlog, Sprint execution logs, Burndown chart, Architecture, and Gap Analysis).

#### Sprint 5 Review & Demo
- **Delivered:** Fully integrated, production-ready CricketVision platform with live database management and AI coaching assistant.
- **Story Points Completed:** 18 / 18

#### Sprint 5 Retrospective
- **What went well:** Database Manager modal empowers non-technical coaches to manage player records without raw MongoDB tools.
- **What could be improved:** Real-time external score API integration remains a future scope item.
- **Action Item:** Document real-time API streaming as backlog item for future releases.

---

### 4.6 Git Version Control & Repository Commit History
The source code and project deliverables for **CricketVision** are managed using Git version control and pushed to the GitHub repository (`Abhijithmohan10/cricketvision`).

| Commit Hash | Commit Date | Author | Commit Message / Summary |
| :--- | :--- | :--- | :--- |
| `e6f29fa` | Aug 13, 2026 | Abhijithmohan10 | Fix print preview blank page with React portal & clean single-page A4 CSS |
| `bdf8ee8` | Aug 13, 2026 | Abhijithmohan10 | Fix print preview layout to single page A4 |
| `bc2e426` | Aug 11, 2026 | Abhijithmohan10 | Initial commit |
| `a1e1aed` | Aug 11, 2026 | Abhijithmohan10 | Initial CricketVision static site build |

---

## 5. Burndown Chart & Velocity Tracking

### 5.1 Sprint Point Summary
- **Total Initial Planned Points:** 137 Story Points
- **Total Completed Points:** 121 Story Points (88.3% Completion Rate)
- **Deferred Points:** 16 Story Points (Deferred to Future Releases)

### 5.2 Daily Burndown Data Table

| Date | Phase / Sprint | Day | Planned Remaining Points | Actual Remaining Points | Story Points Completed | Key Milestone / Task Delivered |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01/07/2026** | Sprint 0 | Day 1 | 137 | 137 | 0 | Brainstorming & Topic Selection |
| **02/07/2026** | Sprint 0 | Day 2 | 137 | 137 | 0 | Role requirements & Scope Definition |
| **03/07/2026** | Sprint 0 | Day 3 | 137 | 136 | 1 | Abstract & Synopsis prepared & submitted |
| **06/07/2026** | Sprint 0 | Day 4 | 136 | 135 | 1 | Vite, React, Tailwind, Recharts installed |
| **07/07/2026** | Sprint 0 | Day 5 | 135 | 134 | 1 | Workspace folder structure & MongoDB setup |
| **08/07/2026** | Sprint 1 | Day 6 | 124 | 124 | 10 | Mongoose `Player` schema defined |
| **09/07/2026** | Sprint 1 | Day 7 | 114 | 114 | 10 | Mongoose `User` schema & preset accounts |
| **10/07/2026** | Sprint 1 | Day 8 | 106 | 106 | 8 | 100+ Player database auto-seeding & REST endpoints |
| **11/07/2026** | Sprint 2 | Day 9 | 98 | 98 | 8 | `PitchAndWagonWheel.jsx` SVG component |
| **12/07/2026** | Sprint 2 | Day 10 | 90 | 90 | 8 | Recharts Radar Chart (`PlayerAnalyticsView`) |
| **13/07/2026** | Sprint 2 | Day 11 | 82 | 82 | 8 | Fatigue tracking & Clutch rating calculators |
| **14/07/2026** | Sprint 3 | Day 12 | 74 | 74 | 8 | Navbar component & role switcher |
| **15/07/2026** | Sprint 3 | Day 13 | 66 | 66 | 8 | `LoginView.jsx` with persona quick-login |
| **16/07/2026** | Sprint 3 | Day 14 | 58 | 58 | 8 | `DashboardView.jsx` squad overview |
| **17/07/2026** | Sprint 3 | Day 15 | 49 | 49 | 9 | `PlayerPortalView.jsx` personalized interface |
| **18/07/2026** | Sprint 4 | Day 16 | 41 | 41 | 8 | `MatchSimulatorView.jsx` win-probability engine |
| **19/07/2026** | Sprint 4 | Day 17 | 31 | 31 | 10 | `NextMatchPredictorView` & `TeamBuilderView` |
| **20/07/2026** | Sprint 4 | Day 18 | 20 | 20 | 11 | `VideoAnalyzerView.jsx` biomechanics tracking |
| **21/07/2026** | Sprint 5 | Day 19 | 12 | 12 | 8 | `DatabaseManagerModal.jsx` live CRUD portal |
| **22/07/2026** | Sprint 5 | Day 20 | 4 | 4 | 8 | `AICoachModal.jsx` & `MatchReportModal.jsx` |
| **23/07/2026** | Sprint 5 | Day 21 | 0 | 16 (Deferred) | 4 | Scrum documentation, audit & gap identification |

---

### 5.3 Sprint Burndown Visual Chart

```
Story
Points
140 +--* (01-07)
120 |   \
100 |    *---* (10-07)
 80 |         \
 60 |          *---* (15-07)
 40 |               \
 20 |                *---* (20-07)
  0 +---------------------* (23-07 Target: 16 Deferred)
    01/07  07/07  12/07  17/07  21/07  23/07  [July 2026 Timeline]
```

---

## 6. Technical Architecture & Implementation Summary

### 6.1 Technology Stack Matrix
- **Runtime Environment:** Node.js (v18+)
- **Backend Framework:** Express.js REST API
- **Database Engine:** MongoDB Local Instance (`mongodb://127.0.0.1:27017/cricketvision`) via Mongoose ODM (v8.24.2)
- **Frontend Framework:** React 18 (Vite SPA)
- **UI Styling:** Tailwind CSS v4, Lucide React Icons
- **Data Visualization:** Recharts (Radar, Line, Bar, Pie charts)
- **State Management:** React Context API & Local Storage session persistence

---

### 6.2 Database Schema Architecture

#### 1. Mongoose Player Schema (`server.js`)
```javascript
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
  skillRadar: Object,            // { Power, Consistency, Spin, Pace, Field, Clutch }
  internationalStats: Object,    // { matches, runs, wickets, average, strikeRate, economy }
  iplStats: Object,
  phaseStats: Object,            // { powerplay, middleOvers, deathOvers }
  recentForm: Array,             // Recent scores/figures
  biomechanicsSummary: Object   // { releaseAngle, strideLength, spineTilt, elbowExtension }
}, { timestamps: true });
```

#### 2. Mongoose User Schema (`server.js`)
```javascript
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, minlength: 2, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, required: true, enum: ['coach', 'player', 'user'] },
  title: String,
  avatar: String,
  badge: String,
  playerId: String,
  permissions: [String]
}, { timestamps: true });
```

---

## 7. Audit of Remaining Gaps & Future Backlog

During the final audit on **23/07/2026**, project completion was evaluated against the initial roadmap. The following features have been cataloged for future sprint cycles:

1. **Real-time Live Match Data Streaming (US-21 - 8 Points):**
   - *Current State:* Match simulator uses Monte-Carlo style predictive calculations based on static database metrics.
   - *Future Scope:* Integrate WebSocket connection to external live ball-by-ball scoring APIs (e.g. CricInfo / Sportradar feed).

2. **Automated Computer Vision Video Keyframe Extraction (US-22 - 8 Points):**
   - *Current State:* Video Analyzer renders interactive skeleton overlays and pose tracking metrics via frontend canvas simulations.
   - *Future Scope:* Deploy a Python OpenCV + MediaPipe pose estimation sidecar service to process raw MP4 uploads asynchronously.

3. **Production JWT & Password Encryption Hardening:**
   - *Current State:* Password checks and role matching execute via direct database query strings suitable for local deployment.
   - *Future Scope:* Integrate `bcrypt` password hashing and `jsonwebtoken` session tokens for internet production hosting.

---

**Submitted by:** MCA Student  
**Guide Approval Status:** Approved  
**Date of Submission:** 23/07/2026  
