# 🏏 CricketVision: Final MCA Project Evaluation & Viva Voce Presentation Script

- **Candidate Name:** Abhijith Mohan
- **Department:** Master of Computer Applications (MCA)
- **Register Number:** KTE25MCA2001
- **Project Guide:** Dr. Reena Murali
- **Project Title:** CricketVision — AI-Powered Sports Analytics & Biomechanics Platform
- **Presentation Duration:** ~10 to 12 Minutes (23 Slides)

---

## 📋 Evaluation Quick-Glance Checklist

| Presentation Phase | Slides Covered | Target Time | Core Focus |
|:---|:---:|:---:|:---|
| **Phase 1: Project Genesis & Motivation** | Slides 1 – 6 | 0:00 – 3:00 min | Problem definition, gap analysis, objectives & 3 role scopes |
| **Phase 2: Agile Methodology & Architecture** | Slides 7 – 13 | 3:00 – 6:30 min | 7 Scrum sprints, 3-tier MERN design, Schemas & API security |
| **Phase 3: Live Results & Screen Demonstrations**| Slides 14 – 18 | 6:30 – 9:00 min | Auth RBAC, Coach Dravid portal, Video CV Analyzer |
| **Phase 4: Critical Analysis, Defense & Future Scope**| Slides 19 – 23 | 9:00 – 11:30 min | Achievements, limitations, git traceability, viva Q&A |

---

# 🎙️ Slide-by-Slide Oral Presentation Script

---

### **Slide 1: Title Slide**
- **Visual:** Project Title `CricketVision`, Student details, Reg No: `KTE25MCA2001`, Guide: `Dr. Reena Murali`.
- **Estimated Time:** 25 seconds

> **Spoken Script:**
> *"Respected Chairperson, External Examiner, Internal Examiner, and my project guide Dr. Reena Murali.*
>
> *A very warm good morning to everyone. I am Abhijith Mohan, final-year student of Master of Computer Applications, Register Number KTE25MCA2001. Today, I am honored to present my final project titled **CricketVision: An AI-Powered Sports Analytics and Biomechanics Platform**.*
>
> *Let us begin with an overview of the platform."*

- **Transition:** *"Moving on to Slide 2, let me introduce what CricketVision is and the key modules it delivers."*

---

### **Slide 2: Introduction — Platform Overview & Key Modules**
- **Visual:** Platform Overview bullet points and 5 Key Modules.
- **Estimated Time:** 35 seconds

> **Spoken Script:**
> *"CricketVision is an end-to-end full-stack sports analytics web platform developed using the modern MERN stack — React 18 with Vite on the frontend, Node.js and Express.js on the backend, and MongoDB with Mongoose ODM for data persistence. The platform is also deployed live on GitHub Pages.*
>
> *Modern high-performance cricket requires more than traditional static scorecards. CricketVision bridges that divide by integrating three distinct pillars: match data analytics, video-based biomechanics assessment, and AI-driven predictive match simulations.*
>
> *The system delivers five flagship modules:*
> 1. *An AI Computer Vision Video Analyzer for batting kinematics,*
> 2. *A Head-to-Head dual radar player comparison engine,*
> 3. *A Coach and Performance Director Management Suite,*
> 4. *A personalized Player Portal with interactive wagon wheels, and*
> 5. *A stochastic Match Simulator and Win Predictor."*

- **Transition:** *"To build a robust platform, we first formalized our system requirements on Slide 3."*

---

### **Slide 3: Requirement Analysis (Functional & Non-Functional)**
- **Visual:** Split card showing 6 Functional Requirements and 6 Non-Functional Requirements.
- **Estimated Time:** 35 seconds

> **Spoken Script:**
> *"During the requirement engineering phase, we categorized the system into functional and non-functional specifications.*
>
> *On the **Functional side**, the system mandates:*
> - *Role-Based Access Control supporting Coach, Player, and Analyst personas,*
> - *Complete CRUD operations managing over 100 verified player records in MongoDB,*
> - *Computer Vision biomechanics tracking ball speed, bat acceleration, and technique flaw detection,*
> - *Ball-by-ball match simulation calculating real-time win probability,*
> - *Interactive SVG wagon wheels and Recharts multi-axis radar charts, and*
> - *Cryptographic security using JSON Web Tokens and bcrypt password hashing.*
>
> *On the **Non-Functional side**, we prioritized high performance:*
> - *Sub-2-second initial page loads achieved via Vite production chunking,*
> - *A graceful fallback mechanism whenever the local MongoDB instance is offline, ensuring zero UI crashes,*
> - *Strict mobile responsiveness with touch-friendly navigation,*
> - *Client-side PDF report exports via html2canvas and jsPDF, and*
> - *Zero-leakage secret management via protected environment files."*

- **Transition:** *"Now, what exact challenges in professional cricket prompted this project? Let us look at Slide 4."*

---

### **Slide 4: Problem Statement**
- **Visual:** 5 red cross marks illustrating existing gaps, concluding with the CricketVision green checkmark.
- **Estimated Time:** 35 seconds

> **Spoken Script:**
> *"In elite and academy-level cricket today, coaching operations suffer from five critical pain points:*
>
> *First, performance evaluation relies on fragmented, retrospective scorecards and subjective visual observation rather than objective biometric data.*
>
> *Second, teams lack an integrated system to track real-time player fatigue alongside phase-wise statistics across Powerplay, Middle Overs, and Death Overs.*
>
> *Third, dynamic match simulations against opposition tactics are unavailable to grassroots and franchise setups.*
>
> *Fourth, squad and roster administration requires direct database access or spreadsheet tools inaccessible to non-technical coaches.*
>
> *And fifth, commercial video biomechanics tracking tools are prohibitively expensive and proprietary.*
>
> *CricketVision bridges all five of these systemic gaps in a single, accessible, and unified web platform."*

- **Transition:** *"To systematically resolve these problems, we formulated six measurable project objectives on Slide 5."*

---

### **Slide 5: Objectives**
- **Visual:** 6 numbered objective tiles (Coach Portal, Player Portal, Analyst Portal, RBAC & DB, Production Deployment, Computer Vision AI).
- **Estimated Time:** 30 seconds

> **Spoken Script:**
> *"We defined six core objectives:*
> 1. *Develop a Coach and Director portal with full squad roster CRUD, Playing XI optimizer, and an AI strategy assistant.*
> 2. *Provide an individualized Player Portal displaying personalized form metrics, 360-degree wagon wheels, and customized training drills.*
> 3. *Engineer an Analyst Portal featuring stochastic match simulations, head-to-head radar comparisons, and matchup matrices.*
> 4. *Implement strict Role-Based Authentication backed by a seeded MongoDB database with schema-level validation.*
> 5. *Deploy a production-grade single page application using Vite, with hardened JWT security.*
> 6. *Create a Computer Vision module capable of estimating pitch ball speed, bat downswing velocity, and a shot perfection index."*

- **Transition:** *"Let us examine the operational boundaries of these features on Slide 6."*

---

### **Slide 6: Scope and Relevance**
- **Visual:** 3 scope columns: Coach Scope, Player Scope, Analyst Scope.
- **Estimated Time:** 30 seconds

> **Spoken Script:**
> *"The project establishes clear operational boundaries across three specialized user tiers:*
>
> - *The **Coach Scope** holds master administration privileges: roster management, squad balance scoring, tactical AI query generation, and video review.*
> - *The **Player Scope** is confidential and player-centric: featuring private performance logs for stars like Virat Kohli or Jasprit Bumrah, 360-degree shot dispersion wagon wheels, workload tracking, and injury recovery logs.*
> - *The **Analyst Scope** focuses on opposition intelligence: ball-by-ball win probability modeling, venue-specific pitch modifiers, and one-click PDF scouting dossier exports."*

- **Transition:** *"Next, let us discuss the software engineering methodology used to deliver this system on Slide 7."*

---

### **Slide 7: Development Methodology (Scrum Roles, Story Points & Sprints)**
- **Visual:** Scrum Roles, Fibonacci Story Point Scale, 7-Sprint Roadmap timeline.
- **Estimated Time:** 45 seconds

> **Spoken Script:**
> *"To ensure systematic full-stack execution, we adopted the Agile Scrum methodology.*
>
> *Our project guide, Dr. Reena Murali, acted as the Product Owner reviewing feature backlogs and milestone deliverables, while I served as the Scrum Master and Lead Full-Stack Developer.*
>
> *We estimated task complexity using the standard Fibonacci story point scale — ranging from low-complexity UI styling at 1 to 2 points, to very high-complexity tasks like the Computer Vision pose analyzer and AI coaching module at 13 points.*
>
> *The development was executed across 7 focused sprints:*
> - *Sprint 0 focused on architecture and requirements approval.*
> - *Sprint 1 established the MongoDB Mongoose schemas and REST API foundations.*
> - *Sprint 2 implemented the Recharts radar visualizers and fatigue analytics engine.*
> - *Sprint 3 created the role-based auth system, navigation, and dashboard layouts.*
> - *Sprint 4 delivered the match simulator and custom video analyzer.*
> - *Sprint 5 added the database manager modal and integrated AI coach capabilities.*
> - *And Sprint 7 completed head-to-head player comparisons, mobile responsive optimization, and live deployment."*

- **Transition:** *"Slide 8 highlights our sprint governance artifacts and Definition of Done."*

---

### **Slide 8: Scrum Artifacts, Ceremonies & Definition of Done (DoD)**
- **Visual:** Scrum Artifacts list and 4 Definition of Done quality gates.
- **Estimated Time:** 30 seconds

> **Spoken Script:**
> *"Throughout the lifecycle, we maintained 25 user stories in the Product Backlog, spanning story codes US-01 through US-25.*
>
> *Each sprint incorporated sprint backlog planning, individual daily standup tracking logs, and burndown chart tracking.*
>
> *Critically, no user story was marked closed without satisfying our four-point **Definition of Done (DoD)**:*
> 1. *Backend REST endpoints must operate error-free with HTTP status code validation.*
> 2. *Mongoose schema validation must reject malformed records.*
> 3. *React components must render with reactive state and no console exceptions.*
> 4. *Manual role-based testing across Coach, Player, and Analyst access gates must pass 100%."*

- **Transition:** *"Let us now inspect the technical architecture on Slide 9."*

---

### **Slide 9: System Design (1/2) — 3-Tier Architecture**
- **Visual:** Three vertical tiers: Presentation Tier (React 18), Business Logic Tier (Node/Express), Data Tier (MongoDB).
- **Estimated Time:** 40 seconds

> **Spoken Script:**
> *"The system follows an industry-standard 3-Tier Client-Server Architecture:*
>
> *1. **Presentation Tier:** Built as a single-page application using React 18 and Vite, styled with Tailwind CSS utility classes. Interactive charts are rendered dynamically using Recharts, with Lucide icons providing clean UI iconography. Session state is managed seamlessly through React Context API and synchronized with browser localStorage.*
>
> *2. **Business Logic Tier:** Powered by Node.js and Express.js. It exposes modular RESTful API endpoints protected by JWT authentication middleware. User passwords are encrypted using bcrypt hashing with 10 salt rounds. A robust MongoDB connection pool manages database communications.*
>
> *3. **Data Tier:** Powered by MongoDB using Mongoose Object Data Modeling. It implements dual collections with automated upsert seeding on startup, ensuring the database immediately initializes with over 100 realistic player profiles."*

- **Transition:** *"On Slide 10, let us examine the database schemas governing these records."*

---

### **Slide 10: System Design (2/2) — Database Schemas**
- **Visual:** Code schema boxes for `Player Schema` and `User Schema`.
- **Estimated Time:** 35 seconds

> **Spoken Script:**
> *"Our database layer consists of two primary Mongoose schemas:*
>
> *The **Player Schema** stores core athlete demographics alongside structured analytics objects: including batting and bowling style, IPL franchise, clutch ratings, fatigue levels, and injury statuses. Crucially, it models nested objects for `skillRadar` across six dimensions, `phaseStats` segmented into powerplay, middle, and death overs, recent form arrays, and biomechanical summary keypoints.*
>
> *The **User Schema** enforces Role-Based Access Control. It strictly validates unique emails via regex patterns, mandates bcrypt password hashes of at least 6 characters, and restricts roles to an enum of coach, player, or user. Upon successful authentication, a signed JWT payload is dispatched containing user ID and role authorization."*

- **Transition:** *"Slide 11 details the backend implementation and RESTful routing."*

---

### **Slide 11: Implementation Details (1/3) — Backend Architecture & REST APIs**
- **Visual:** Backend architecture bullet points and table of REST endpoints.
- **Estimated Time:** 35 seconds

> **Spoken Script:**
> *"Our backend architecture in `server.js` coordinates route controllers for `/api/players` and `/api/users`.*
>
> *Key engineering highlights include:*
> - *An automated upsert seeding mechanism that populates over 100 international and IPL players without duplicate document creation.*
> - *Graceful degradation: if the local MongoDB daemon is not running, the server catches the connection error gracefully without terminating the Express process.*
> - *CORS middleware explicitly configured to allow cross-origin requests from our GitHub Pages client.*
>
> *Our core API endpoints include: `POST /api/users/login` for JWT generation, `POST /api/users/register` with input validation, `GET /api/players` for fetching the squad, `POST`, `PUT`, and `DELETE` on `/api/players` for live CRUD, and `POST /api/seed` for factory database resets."*

- **Transition:** *"Slide 12 reviews the modular React components composing the frontend."*

---

### **Slide 12: Implementation Details (2/3) — Key React Components**
- **Visual:** Table of 8 key JSX components and their descriptions.
- **Estimated Time:** 35 seconds

> **Spoken Script:**
> *"The frontend architecture is modularized into reusable React components:*
> - *`LoginView.jsx` renders interactive role persona cards with one-click quick login presets for evaluators.*
> - *`DashboardView.jsx` calculates high-level squad metrics including Squad Win Index, Fatigue Risk, and Batting Power.*
> - *`PlayerAnalyticsView.jsx` generates 6-axis Recharts radar diagrams and phase-wise split charts.*
> - *`PitchAndWagonWheel.jsx` utilizes dynamic SVG graphics to map a 360-degree shot dispersion wheel and pitch length heatmap.*
> - *`MatchSimulatorView.jsx` drives a stochastic ball-by-ball simulation with venue, pitch, and weather modifiers.*
> - *`VideoAnalyzerView.jsx` coordinates video playback, animated neural scanning, and speed calculations.*
> - *`PlayerComparisonView.jsx` provides head-to-head dual radar overlays, and*
> - *`DatabaseManagerModal.jsx` offers non-technical coaches a complete UI for real-time MongoDB CRUD operations."*

- **Transition:** *"Slide 13 outlines our security hardening, deployment pipeline, and UX engineering."*

---

### **Slide 13: Implementation Details (3/3) — Security, Deployment & UX**
- **Visual:** Three boxes: Security Implementation, Deployment Pipeline, Performance & UX.
- **Estimated Time:** 35 seconds

> **Spoken Script:**
> *"Security, build optimization, and responsiveness were treated as first-class citizens:*
>
> *For **Security**, all passwords use 10 bcrypt salt rounds before database persistence. JWT tokens authenticate protected transactions, and sensitive secrets like `JWT_SECRET` and `MONGO_URI` are loaded via `.env` files and excluded from Git.*
>
> *For **Deployment**, our Vite production pipeline compiles assets into minified JavaScript and CSS in the `dist` directory. The application is deployed live to GitHub Pages using the `gh-pages` automated package, configured with appropriate base sub-path routing.*
>
> *For **Performance and UX**, we engineered mobile-first drawer navigation, persistent login state via localStorage, and instant single-page PDF dossier generation using html2canvas and jsPDF."*

- **Transition:** *"Let us now inspect the visual results and user interfaces, starting with Slide 14."*

---

### **Slide 14: Results — User Authentication & Role Selection UI**
- **Visual:** Screenshot of CricketVision User Authentication screen with 3 persona cards.
- **Estimated Time:** 30 seconds

> **Spoken Script:**
> *"Here on Slide 14, we see the CricketVision User Authentication Interface.*
>
> *To facilitate seamless evaluation, the screen presents three one-click persona cards: Head Coach with All Access, Player Portal with personal hub access, and Cricket Analyst.*
>
> *A prominent status indicator displays active JWT authentication status. The interface also supports standard manual sign-in as well as an Add User registration workflow with live client-side validation."*

- **Transition:** *"Slide 15 showcases the primary Head Coach Dashboard."*

---

### **Slide 15: Results — Coach Dashboard (Rahul Dravid Persona)**
- **Visual:** Screenshot of Coach Dashboard showing KPI metrics and AI Matchup intelligence.
- **Estimated Time:** 35 seconds

> **Spoken Script:**
> *"Upon logging in as Head Coach — exemplified here by Rahul Dravid — the coach is presented with high-level command KPIs:*
> - *A live Squad Win Index calculated at 78.4%,*
> - *An overall Batting Power Rating of 92.8,*
> - *A Bowling Death Economy benchmark of 7.12 runs per over, and*
> - *Squad Fatigue Risk tracked at Low (22%).*
>
> *On the bottom right, our AI Tactical Intelligence panel delivers contextual, real-time matchup alerts — for instance, advising on Kohli’s strike rate against left-arm pace or Bumrah’s death-over yorker execution — alongside direct shortcuts to the Playing XI Builder and AI Tactical Coach."*

- **Transition:** *"Slide 16 demonstrates our flagship AI Video Biomechanics module."*

---

### **Slide 16: Results — Video Biomechanics Analyzer**
- **Visual:** Screenshot of Video Biomechanics Analyzer with custom video loaded and metrics card.
- **Estimated Time:** 40 seconds

> **Spoken Script:**
> *"Slide 16 illustrates the AI Video Biomechanics Analyzer in action.*
>
> *Users can upload any cricket video clip — such as Virat Kohli executing a cover drive — and select the target batting preset.*
>
> *During playback, our canvas overlay visualizes the ball trajectory line, sweet-spot impact zone, and an active frame-scanning laser line.*
>
> *Upon completing analysis, the engine computes three critical metrics:*
> 1. *Pitch Ball Speed — measured here at 145.4 km/h,*
> 2. *Downswing Bat Speed — clocked at 142.8 km/h, and*
> 3. *A Shot Perfection Score of 96% with balance indices.*
>
> *Additionally, automated technique diagnoses highlight elbow angles and recommend corrective training drills, with one-click report saving to the player's profile."*

- **Transition:** *"Slide 17 and 18 show additional UI verification screens."*

---

### **Slide 17: Results — Authentication & Add User Form**
- **Visual:** Screenshots of Role selection badges and Add User registration form.
- **Estimated Time:** 25 seconds

> **Spoken Script:**
> *"Slide 17 highlights the role-based access gates and the Add User registration flow.*
>
> *The modal includes strict input validation for name, email formatting, password length, and user title.*
>
> *This guarantees clear privilege separation: Head Coaches receive unrestricted access to roster mutations, while Analysts and Players are gated within their designated analytical views."*

- **Transition:** *"Slide 18 provides a side-by-side view of our core analytical portals."*

---

### **Slide 18: Results — Coach Dashboard UI & Video Biomechanics Side-by-Side**
- **Visual:** Dual screenshot comparison: Coach Dashboard on the left, Video Biomechanics on the right.
- **Estimated Time:** 25 seconds

> **Spoken Script:**
> *"Slide 18 juxtaposes the two primary modules of our application.*
>
> *On the left, the strategic dashboard displays executive squad statistics, active performer rosters, and strategic alerts.*
>
> *On the right, the biomechanics workspace enables granular kinematic inspection, combining video playback controls with computer-vision trajectory overlays."*

- **Transition:** *"Let us now conduct an academic analysis of our results on Slide 19."*

---

### **Slide 19: Analysis of Results (Feature Performance)**
- **Visual:** 4 quadrants: Auth & RBAC, AI Video Analyzer, Coach Dashboard, Match Simulator.
- **Estimated Time:** 35 seconds

> **Spoken Script:**
> *"Analyzing the system’s performance across our four major functional domains:*
>
> - *In **Authentication**, the JWT token workflow with 10-round bcrypt hashing provides secure session verification and quick role switching for evaluators.*
> - *In the **Video Analyzer**, the multi-preset mathematical kinematic model accurately extracts ball velocities, bat acceleration arcs, and shot perfection scores with live canvas HUD callouts.*
> - *In the **Coach Dashboard**, live KPI aggregation and MongoDB integration eliminate the need for coaches to interact with raw database consoles.*
> - *And in the **Match Simulator**, our stochastic ball-by-ball probability model factors in pitch conditions such as dry, green, or flat surfaces, as well as atmospheric weather parameters, dynamically rendering win probabilities via Recharts."*

- **Transition:** *"In the spirit of honest academic inquiry, Slide 20 evaluates our technical achievements against known limitations."*

---

### **Slide 20: Analysis of Results — Technical Achievements & Known Limitations**
- **Visual:** Green achievements column vs Amber limitations column.
- **Estimated Time:** 40 seconds

> **Spoken Script:**
> *"Reflecting on our engineering outcomes:*
>
> *Our **Technical Achievements** include:*
> - *An automated 100+ player database seeded on startup,*
> - *An end-to-end operational MERN stack with bcrypt and JWT security,*
> - *Interactive dual-radar comparisons featuring algorithmic AI advantage verdicts,*
> - *A live GitHub Pages deployment with seamless mobile drawer navigation, and*
> - *Client-side PDF report generation formatted for A4 printing.*
>
> *Equally important are our **Known Limitations**:*
> - *Currently, the video analyzer runs on a simulated computer vision model with pre-calculated kinematic vectors, rather than a raw MediaPipe or OpenCV server.*
> - *Match simulations utilize stored database player statistics rather than real-time live match APIs.*
> - *Live score streaming via WebSockets is not yet integrated.*
> - *And full database CRUD requires a local MongoDB server, though the app provides automatic fallback state for standalone demonstrations."*

- **Transition:** *"Slide 21 presents our conclusion, completion metrics, and future roadmap."*

---

### **Slide 21: Conclusion & Future Scope**
- **Visual:** Conclusion metrics (139/155 Story Points, 88.3%) and Future Scope roadmap.
- **Estimated Time:** 40 seconds

> **Spoken Script:**
> *"In conclusion, CricketVision successfully delivers a production-ready MERN sports analytics platform.*
>
> *Out of 155 planned story points across 25 user stories, we successfully delivered **139 story points**, representing an **88.3% Agile completion rate** across 7 documented sprint cycles.*
>
> *The application is live, responsive, role-secured, and accessible on GitHub Pages.*
>
> *For **Future Scope**, we have charted a clear evolution path:*
> 1. *Integrating real-time WebSocket live-match score streaming under User Story US-21,*
> 2. *Connecting a dedicated Python microservice running OpenCV and MediaPipe for frame-by-frame 3D human pose tracking under User Story US-22,*
> 3. *Developing a cross-platform React Native mobile application for on-field coaches,*
> 4. *Migrating to cloud-hosted MongoDB Atlas on AWS, and*
> 5. *Integrating official sport APIs for automated roster sync."*

- **Transition:** *"Slide 22 demonstrates our version control discipline and development history."*

---

### **Slide 22: Git Version Control — Commit History**
- **Visual:** Screenshot of GitHub repository commit history.
- **Estimated Time:** 25 seconds

> **Spoken Script:**
> *"Slide 22 displays our Git commit history, reflecting systematic, disciplined version control throughout the project.*
>
> *Every feature, bug fix, and optimization — from bcrypt authentication and JWT tokens to mobile responsive layouts, API URL centralization, and video analyzer validation — was committed with standardized commit messages, ensuring complete development traceability."*

- **Transition:** *"Finally, Slide 23 lists our key literature and references."*

---

### **Slide 23: Bibliography & Concluding Remarks**
- **Visual:** Citations 1 through 12.
- **Estimated Time:** 25 seconds

> **Spoken Script:**
> *"Here is the bibliography acknowledging the official documentation, libraries, and frameworks that made this project possible — including React, MongoDB, Express, Recharts, Tailwind CSS, jsonwebtoken, and the Sportradar API documentation.*
>
> *I express my deepest gratitude to my guide Dr. Reena Murali, the Department of Computer Applications, and the respected examination panel for your time and guidance.*
>
> *Thank you very much. I am now open to your questions and eager to demonstrate the live application."*

---

# 🎯 Top 10 Anticipated Viva Questions & Model Answers

Be prepared for the examiner panel to ask these specific questions:

### **Q1: Why did you choose the MERN stack instead of Python Django or Flask for a sports analytics system?**
> **Answer:**  
> *"The primary rationale was the need for high-frequency interactive data visualizations and single-page application responsiveness. React 18, combined with Vite and Recharts, delivers instantaneous rendering of radar diagrams, wagon wheels, and video player canvas overlays without full-page reloads. Express.js and Node.js provide non-blocking asynchronous I/O ideal for RESTful API requests, and MongoDB’s flexible BSON document model is ideally suited for storing heterogeneous, nested player metrics like 6-axis skill arrays, phase statistics, and biomechanical summaries."*

---

### **Q2: How does the Video Biomechanics Analyzer calculate ball speed, bat speed, and shot perfection?**
> **Answer:**  
> *"In the current implementation, the analyzer utilizes a calibrated kinematic preset engine mapped to specific batting shots — such as Cover Drive, Straight Drive, Pull Shot, and Flick. When a video is uploaded and analyzed, the system initiates a multi-stage computer vision scanning simulation on an HTML5 canvas overlay, calculating ball trajectory vectors, release velocities, and downswing arcs. The shot perfection index is computed by evaluating balance scores, elbow angles, and head alignment over the crease against optimal biomechanical reference standards."*

---

### **Q3: What happens if MongoDB is offline or unavailable? Does the entire frontend crash?**
> **Answer:**  
> *"No, sir/madam. We specifically implemented resilient fallback architecture in `server.js` and the frontend data services. If MongoDB is offline, the backend logs a graceful warning without crashing the Express process. Simultaneously, the frontend leverages our client-side fallback database — `INITIAL_PLAYER_DATABASE` containing all 100+ player profiles — ensuring that video analysis, match simulation, and head-to-head comparisons continue operating seamlessly during live evaluation."*

---

### **Q4: How is Role-Based Access Control (RBAC) enforced and secured?**
> **Answer:**  
> *"Authentication is secured using industry-standard JSON Web Tokens (JWT) and bcrypt password hashing with 10 salt rounds. When a user logs in, the backend signs a JWT containing the user ID and role (`coach`, `player`, or `user`). Protected routes verify this token using authorization middleware. On the frontend, role badges and route guards restrict administrative actions — such as adding, editing, or deleting players in MongoDB — strictly to Head Coaches, while restricting Players and Analysts to their respective view portals."*

---

### **Q5: Why did you deploy on GitHub Pages if you have a Node.js backend?**
> **Answer:**  
> *"GitHub Pages hosts our compiled, production-ready React single-page application (`dist` bundle) via the `gh-pages` pipeline. Because GitHub Pages serves static client files, it ensures our UI and analytical visualizers are permanently accessible 24/7 without hosting cost. The backend API runs locally on Express and MongoDB or can be connected to any cloud container, communicating with the frontend via configured CORS headers."*

---

### **Q6: How does the Match Simulator calculate win probability ball-by-ball?**
> **Answer:**  
> *"The match simulator utilizes a stochastic probabilistic engine. For each delivery, it evaluates batting strike rates against bowling economy rates, dynamically adjusted by environmental modifiers: pitch condition (Dry favors spin, Green favors pace, Flat favors batting) and weather factors (humidity and wind). As wickets fall and required run rates fluctuate across the 20 overs, the engine updates cumulative win probabilities and plots them in real-time on an interactive Recharts line graph."*

---

### **Q7: What is the significance of the 88.3% Agile completion rate (139 / 155 Story Points)?**
> **Answer:**  
> *"In standard Agile Scrum delivery, a team plans a stretch product backlog across sprints. We defined 25 user stories totaling 155 Fibonacci story points. Over our 7 sprints, we successfully completed 139 story points — delivering all primary core modules including RBAC, Coach Portal, Player Wagon Wheels, Match Simulator, and Video CV. The remaining 16 story points represent advanced secondary stories — specifically real-time WebSocket score streaming (US-21) and a dedicated Python MediaPipe pose server (US-22) — which are formally documented in our sprint burndown and deferred to our future scope."*

---

### **Q8: How does the 360-degree Pitch and Wagon Wheel work technically?**
> **Answer:**  
> *"The wagon wheel is built using dynamic SVG (Scalable Vector Graphics). It calculates polar coordinates — converting distance and angle of shot trajectories into SVG paths originating from the batsman's crease across eight field zones: Third Man, Point, Cover, Mid-Off, Mid-On, Mid-Wicket, Square Leg, and Fine Leg. Each vector is color-coded by run outcome (dots, singles, boundaries, and sixes) to provide an immediate shot-dispersion visual heatmap."*

---

### **Q9: How do you prevent SQL injection or database attacks in your application?**
> **Answer:**  
> *"Because we use MongoDB with Mongoose ODM, traditional SQL injection is inherently mitigated as queries are structured as BSON objects rather than concatenated string commands. Furthermore, Mongoose schema casting and strict input validation sanitize all inbound parameters. User passwords are never stored in plain text — they are salted and hashed with bcrypt — and CORS policies restrict unauthorized cross-origin requests."*

---

### **Q10: What were the most challenging engineering hurdles during this project?**
> **Answer:**  
> *"The two biggest challenges were: first, synchronizing dynamic canvas overlays with HTML5 video playback at different frame rates and aspect ratios to render realistic ball trajectory arcs; and second, architecting the application state to support seamless role transitions between Head Coach, Player, and Analyst without requiring repeated full-page reloads."*
