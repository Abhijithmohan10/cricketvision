# SCRUM PROJECT BOOK
## Shop-Pulse — Shop Availability Discovery Platform
**Master of Computer Applications (MCA) Mini-Project**  
**Project Timeline:** July 1, 2026 – July 23, 2026  
**Document Status:** Finalized & Submitted for Guide Approval  

---

## 1. Executive Summary & Project Abstract

### 1.1 Introduction
In modern urban and semi-urban retail ecosystems, consumers often struggle to find nearby local stores that are open and have specific items in stock. Conversely, brick-and-mortar store owners face stiff competition from quick-commerce giants due to a lack of digital visibility. **Shop-Pulse** addresses this gap by offering a hyper-local, real-time shop availability and product discovery platform.

### 1.2 Problem Statement
Consumers lose time visiting local shops only to find them closed or out of stock. Small store owners lack easy-to-use digital tools to broadcast their live store status, update inventory without heavy data entry, track customer interest, and process orders locally.

### 1.3 Key Objectives
- **Consumer Side:** Real-time GPS search for nearby shops within customizable radius filters, live open/closed indicators, cross-shop product search with tri-state availability (`available`, `few left`, `out of stock`), interactive map markers, and order placement with live delivery tracking.
- **Merchant Side:** Fast registration, map click-to-pin store location, instant status toggle, operating hours automation, bulk CSV product ingestion, order state management, and customer review insights.
- **Admin Side:** Platform governance with merchant verification workflows and bulk system imports.

### 1.4 Expected Outcome
A production-ready, full-stack web application featuring a Node.js/Express REST API backend, MariaDB relational database, and React frontend integrated with Leaflet maps.

---

## 2. Agile / Scrum Framework Configuration

### 2.1 Scrum Team Roles
- **Product Owner / Guide:** MCA Project Guide (Reviewer & Approver)
- **Scrum Master & Developer:** MCA Student (Full-Stack Developer)

### 2.2 Agile Metrics & Estimation Scale
Story points are assigned using a modified **Fibonacci Scale** (1, 2, 3, 5, 8, 13) based on implementation complexity, uncertainty, and potential technical risk.

| Story Points | Complexity Level | Typical Scope |
| :--- | :--- | :--- |
| **1 - 2 Points** | Low | UI tweaks, minor validations, environment setups |
| **3 - 5 Points** | Medium | Standard REST endpoints, CRUD components, form validation |
| **8 Points** | High | Haversine geospatial queries, JWT auth middleware, CSV parsing engines |
| **13 Points** | Very High | Full E2E interactive map integrations, order state machine engines |

### 2.3 Definition of Done (DoD)
A User Story is marked **DONE** when:
1. REST APIs are implemented, input-validated, and tested end-to-end (via `curl` or UI).
2. Database migrations/queries execute cleanly without syntax or foreign key errors.
3. React components render properly without console errors or UI flickering.
4. Edge cases (invalid state transitions, unauthorized actions, empty searches) are handled gracefully.

---

## 3. Master Product Backlog

| Story ID | Epic | User Story Summary | Priority (MoSCoW) | Story Points | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **US-01** | Architecture | Set up Node.js, Express, MariaDB schema, and VS Code workspace | Must Have | 3 | Done |
| **US-02** | Auth | User Registration, Login, JWT Token generation & bcrypt hashing | Must Have | 5 | Done |
| **US-03** | Shop | Shop Registration with lat/lng coordinates and live status toggle | Must Have | 5 | Done |
| **US-04** | Discovery | Haversine formula nearby-shop query within radius filter | Must Have | 8 | Done |
| **US-05** | Product | Product CRUD with tri-state availability (`available`/`few left`/`out of stock`) | Must Have | 5 | Done |
| **US-06** | Discovery | Cross-shop product search returning price, stock status, and distance | Must Have | 8 | Done |
| **US-07** | Orders | Order placement & state transition pipeline validation | Must Have | 8 | Done |
| **US-08** | Social | Customer review submission (1 review/customer/shop) & avg rating | Should Have | 3 | Done |
| **US-09** | Admin | Admin Shop verification & CSV bulk product upload (`multer` + `csv-parser`) | Must Have | 8 | Done |
| **US-10** | Frontend | React setup, router, theme (Space Grotesk, Inter, IBM Plex Mono), pulsing indicator | Must Have | 3 | Done |
| **US-11** | Frontend Auth | Login/Register UI, `AuthContext`, and `PrivateRoute` role protection | Must Have | 5 | Done |
| **US-12** | Map & Search | Customer home page with Leaflet map, open/closed markers, radius filter | Must Have | 8 | Done |
| **US-13** | Shop Detail | Shop Detail UI with product grid, order form, and reviews list | Must Have | 5 | Done |
| **US-14** | Merchant UI | Owner Dashboard for store registration, status toggle & order pipeline UI | Must Have | 8 | Done |
| **US-15** | Admin UI | Admin Panel for shop verification & CSV upload, plus Customer My Orders page | Should Have | 5 | Done |
| **US-16** | Landing | Marketing Landing page with live map preview & target audience sections | Could Have | 3 | Done |
| **US-17** | Map UX | Click-to-pin location picker for merchant shop registration | Should Have | 3 | Done |
| **US-18** | Bug Fix | Fix 25-second polling flickering bug on order management lists | Must Have | 2 | Done |
| **US-19** | Map UX | "You Are Here" customer pin & click-to-search-elsewhere map feature | Should Have | 3 | Done |
| **US-20** | Geo/Hours | Reverse geocoding for delivery address auto-fill & Operating Hours auto-toggle | Should Have | 5 | Done |
| **US-21** | Backlog | Shop category selection UI component | Could Have | 3 | Deferred |
| **US-22** | Backlog | Distinct shop-visit history logging for owner analytics | Could Have | 5 | Deferred |

**Total Planned Story Points:** 109 Points  
**Completed Story Points:** 101 Points  
**Deferred Story Points:** 8 Points  

---

## 4. Sprint Breakdown & Execution Log

### Sprint 0: Inception, Requirements & Database Design
**Duration:** 01/07/2026 – 07/07/2026  
**Sprint Goal:** Finalize scope, obtain guide approval for synopsis, set up local environment, and execute relational database schema.

#### Daily Log & Standup Summary
- **01/07/2026:** Brainstormed socially relevant MCA topics across e-governance, healthcare, agriculture, and safety. Selected the shop-availability discovery platform. Defined core scope: auth, shop registration, GPS nearby search, live status, product search, price display, and radius filter.
- **02/07/2026:** Finalized title *Shop-Pulse — Shop Availability Discovery Platform*. Added merchant incentives (reviews & shop-visit tracking), order placement module, delivery status tracking, and Admin CSV bulk product upload.
- **03/07/2026:** Drafted abstract and full synopsis per department format. Submitted synopsis for guide approval.
- **06/07/2026:** Installed Node.js (v18+), MariaDB, and configured root password. Initialized VS Code workspace.
- **07/07/2026:** Structured backend folders (`config`, `controllers`, `middleware`, `routes`, `sql`). Designed database schema containing `users`, `shops`, `categories`, `products`, `orders`, `reviews`. Executed SQL script in MariaDB and verified table structures.

#### Sprint 0 Review & Demo
- **Delivered:** Approved Project Synopsis, MariaDB database tables verified, working workspace structure.
- **Story Points Completed:** 3 / 3

#### Sprint 0 Retrospective
- **What went well:** Smooth environment setup and clear schema definition early on.
- **What could be improved:** Need to ensure spatial index compatibility in MariaDB for geospatial queries.
- **Action Item:** Use Haversine formula in pure SQL queries for maximum portability.

---

### Sprint 1: Backend Core, Authentication & Discovery Engine
**Duration:** 08/07/2026 – 10/07/2026  
**Sprint Goal:** Implement JWT authentication, shop location management with Haversine search, and product tri-state availability search.

#### Daily Log & Standup Summary
- **08/07/2026:** Built Express server with `/health` route. Implemented `users` table auth controller: `/register`, `/login`, JWT generation, bcrypt password hashing. Tested with `curl`.
- **09/07/2026:** Implemented shop registration API saving GPS latitude/longitude. Built Haversine formula SQL query to filter shops within `$radius` km. Created owner open/closed toggle endpoint. Verified end-to-end via `curl`.
- **10/07/2026:** Built product CRUD endpoints with tri-state status (`available`, `few left`, `out of stock`). Implemented cross-shop search query combining product name matching with Haversine distance, returning price, status, and distance in a single JSON payload.

#### Sprint 1 Review & Demo
- **Delivered:** Complete REST endpoints for Auth, Shop discovery, and Product search tested via `curl`.
- **Story Points Completed:** 26 / 26

#### Sprint 1 Retrospective
- **What went well:** Haversine formula integrated cleanly into SQL, calculating distance dynamically in kilometers.
- **What could be improved:** Query optimization needed when dataset grows large.
- **Action Item:** Add database indexes on `shops(latitude, longitude)` and `products(name)`.

---

### Sprint 2: Order Management, Reviews & Admin Bulk Tools
**Duration:** 11/07/2026 – 13/07/2026  
**Sprint Goal:** Develop order pipeline state machine, single-review constraint, shop verification API, and bulk CSV product upload.

#### Daily Log & Standup Summary
- **11/07/2026:** Built order module (`placed` → `confirmed` → `out for delivery` → `delivered` / `cancelled`). Added strict server-side state machine validation to reject invalid jumps (e.g. `placed` directly to `delivered`). Tested flow.
- **13/07/2026:** Built reviews API allowing customer reviews (enforcing max 1 review per customer per shop) and calculating average shop rating dynamically. Implemented Admin shop verification endpoint. Built CSV bulk product parser using `multer` and `csv-parser`. Tested bulk insertion with a sample CSV file.

#### Sprint 2 Review & Demo
- **Delivered:** Robust backend services complete for orders, reviews, admin verification, and bulk ingestion.
- **Story Points Completed:** 19 / 19

#### Sprint 2 Retrospective
- **What went well:** CSV parser handles large product lists seamlessly, drastically reducing merchant onboarding effort.
- **What could be improved:** Multer temporary file cleanup needed after CSV parsing completes.
- **Action Item:** Add `fs.unlinkSync` in `finally` block of bulk upload controller.

---

### Sprint 3: Frontend Foundation & Customer Experience
**Duration:** 14/07/2026 – 17/07/2026  
**Sprint Goal:** Build React single-page application structure, auth integration, interactive Leaflet map, and shop detail pages.

#### Daily Log & Standup Summary
- **14/07/2026:** Scaffolded React frontend. Installed `axios`, `react-router-dom`, `leaflet`, `react-leaflet`. Established visual identity: Space Grotesk (headings), Inter (body), IBM Plex Mono (badges), green/red pulsing live-status CSS indicator.
- **15/07/2026:** Built Login and Register UI pages connected to Auth endpoints. Created `AuthContext` for global session management and `PrivateRoute` for role guarding.
- **16/07/2026:** Built Customer Home page featuring radius slider, product keyword input, and interactive Leaflet map rendering color-coded pins (Green = Open, Red = Closed). Tested live search & map synchronization.
- **17/07/2026:** Built Shop Detail page displaying shop info, product availability grid with tri-state badges, order submission modal, and customer reviews section. Tested browser-based order and review creation.

#### Sprint 3 Review & Demo
- **Delivered:** Fully functional customer portal with interactive map, real-time status badges, and order placing capabilities.
- **Story Points Completed:** 21 / 21

#### Sprint 3 Retrospective
- **What went well:** Leaflet rendering with dynamic SVG marker icons provides a premium visual experience.
- **What could be improved:** CSS styling needed for custom Leaflet popup bubbles to match the Space Grotesk theme.
- **Action Item:** Customize Leaflet popup CSS in `index.css`.

---

### Sprint 4: Merchant Dashboard, Admin Portal & UX Enhancements
**Duration:** 18/07/2026 – 20/07/2026  
**Sprint Goal:** Deliver Merchant Dashboard, Admin Verification Portal, Customer Order Tracker, and Marketing Landing page.

#### Daily Log & Standup Summary
- **18/07/2026:** Built Owner Dashboard: store profile setup, one-click open/closed status toggle, product inventory table with stock state selectors, and incoming order management list with status advancement buttons. Tested merchant workflow E2E.
- **19/07/2026:** Built Admin Panel with unverified shop verification queue and CSV bulk upload UI. Built Customer "My Orders" page with order status stepper and cancellation options.
- **20/07/2026:** Designed marketing Landing page showcasing live map preview, feature highlights, and audience cards (Customers, Shop Owners, Admins). Created a click-to-pin location picker for shop registration to replace manual lat/lng inputs.

#### Sprint 4 Review & Demo
- **Delivered:** Complete multi-role interface (Customer, Owner, Admin) and high-converting marketing landing page.
- **Story Points Completed:** 21 / 21

#### Sprint 4 Retrospective
- **What went well:** Click-to-pin location picker drastically simplified the shop registration process for non-technical store owners.
- **What could be improved:** Order polling on the owner dashboard caused UI re-renders and list flickering every 25 seconds.
- **Action Item:** Implement key-based memoization or differential state updating for order polling.

---

### Sprint 5: Refinements, Geolocation Features & Documentation
**Duration:** 21/07/2026 – 23/07/2026  
**Sprint Goal:** Fix polling bugs, add confirmation modals, integrate reverse geocoding, build automated store hours toggle logic, and complete Scrum documentation.

#### Daily Log & Standup Summary
- **21/07/2026:** Resolved 25-second polling order list flickering bug by optimizing state update checks. Added modal confirmation dialogs for destructive actions (deleting products, cancelling orders). Enhanced map with a "You Are Here" user marker and click-to-search-elsewhere capability.
- **22/07/2026:** Integrated browser Geolocation API with OpenStreetMap Nominatim reverse geocoding to auto-fill delivery addresses. Started automatic open/closed status toggle calculation based on store operating hours with manual override capability.
- **23/07/2026:** Prepared formal Scrum project documentation (Product Backlog, Sprint-wise breakdown, Sprint Reviews & Retrospectives, Burndown Chart). Audited completion status and documented remaining backlog items (shop categories UI, distinct visit history logging).

#### Sprint 5 Review & Demo
- **Delivered:** Polished, production-ready Shop-Pulse application with fixed polling, reverse geocoding, operating hours logic, and full Scrum Book documentation.
- **Story Points Completed:** 10 / 10

#### Sprint 5 Retrospective
- **What went well:** Major UX improvements (address auto-fill, no flickering, confirmation modals) elevate app quality significantly.
- **What could be improved:** Operating hours toggle cron job requires persistent backend process supervisor (e.g. PM2).
- **Action Item:** Document deployment recommendations for cron jobs in user manual.

---

## 5. Burndown Chart & Velocity Tracking

### 5.1 Sprint Point Summary
- **Total Initial Planned Points:** 109 Story Points
- **Total Completed Points:** 101 Story Points (92.6% Completion Rate)
- **Deferred Points:** 8 Story Points (Carried over to Future Scope)

### 5.2 Daily Burndown Data Table

| Date | Phase / Sprint | Day | Planned Remaining Points | Actual Remaining Points | Story Points Completed | Key Milestone / Task Delivered |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01/07/2026** | Sprint 0 | Day 1 | 109 | 109 | 0 | Brainstorming & Topic Shortlisting |
| **02/07/2026** | Sprint 0 | Day 2 | 109 | 109 | 0 | Scope refinement & Title Finalization |
| **03/07/2026** | Sprint 0 | Day 3 | 109 | 108 | 1 | Abstract & Synopsis prepared & submitted |
| **06/07/2026** | Sprint 0 | Day 4 | 108 | 107 | 1 | Node.js, MariaDB, VS Code workspace set up |
| **07/07/2026** | Sprint 0 | Day 5 | 107 | 106 | 1 | Backend folder structure & MariaDB schema executed |
| **08/07/2026** | Sprint 1 | Day 6 | 98 | 98 | 8 | Express server & Auth Module (JWT, Bcrypt) |
| **09/07/2026** | Sprint 1 | Day 7 | 88 | 89 | 9 | Shop module, Haversine nearby query, toggle status |
| **10/07/2026** | Sprint 1 | Day 8 | 80 | 80 | 9 | Product module (tri-state status) & cross-shop search |
| **11/07/2026** | Sprint 2 | Day 9 | 72 | 71 | 9 | Order placement & state pipeline validation |
| **13/07/2026** | Sprint 2 | Day 10 | 61 | 61 | 10 | Reviews module & Admin CSV bulk product parser |
| **14/07/2026** | Sprint 3 | Day 11 | 55 | 56 | 5 | React app setup, package installation, design system |
| **15/07/2026** | Sprint 3 | Day 12 | 50 | 50 | 6 | Login/Register UI, AuthContext, PrivateRoute |
| **16/07/2026** | Sprint 3 | Day 13 | 42 | 42 | 8 | Customer Home page & Leaflet map integration |
| **17/07/2026** | Sprint 3 | Day 14 | 35 | 35 | 7 | Shop Detail UI, product grid, order modal, reviews |
| **18/07/2026** | Sprint 4 | Day 15 | 27 | 27 | 8 | Owner Dashboard (status toggle, product/order tables) |
| **19/07/2026** | Sprint 4 | Day 16 | 20 | 20 | 7 | Admin verification UI, CSV form, My Orders page |
| **20/07/2026** | Sprint 4 | Day 17 | 14 | 14 | 6 | Marketing Landing page & click-to-pin location picker |
| **21/07/2026** | Sprint 5 | Day 18 | 9 | 9 | 5 | Polling fix, confirmation dialogs, map search elsewhere |
| **22/07/2026** | Sprint 5 | Day 19 | 4 | 4 | 5 | Reverse geocoding & store operating hours toggle |
| **23/07/2026** | Sprint 5 | Day 20 | 0 | 8 (Deferred) | 0 | Scrum documentation, audit & gap identification |

---

### 5.3 Sprint Burndown Visual Chart

```
Story
Points
110 +--* (01-07)
100 |   \
 90 |    *---* (08-07)
 80 |         \
 70 |          *---* (11-07)
 60 |               \
 50 |                *---* (15-07)
 40 |                     \
 30 |                      * (18-07)
 20 |                       \
 10 |                        *---* (21-07)
  0 +-----------------------------* (23-07 Target: 8 Deferred)
    01/07  06/07  10/07  14/07  18/07  23/07  [July 2026 Timeline]
```

---

## 6. Technical Architecture & Implementation Summary

### 6.1 Technology Stack Matrix
- **Runtime Environment:** Node.js (v18+)
- **Backend Framework:** Express.js REST API
- **Database Engine:** MariaDB Relational Database
- **Frontend Framework:** React 18 (Vite SPA)
- **Map Engine:** Leaflet.js & React-Leaflet (OpenStreetMap tile provider)
- **State & Routing:** React Context API (`AuthContext`), `react-router-dom` v6
- **Styling & Icons:** Vanilla CSS / Tailwind Utilities, Google Fonts (Space Grotesk, Inter, IBM Plex Mono)
- **Utility Libraries:** `axios` (HTTP client), `bcrypt` (password encryption), `jsonwebtoken` (auth tokens), `multer` (file handling), `csv-parser` (bulk import parsing).

---

### 6.2 Key Algorithmic Implementations

#### 1. Haversine Distance Formula (Spatial Proximity Query)
Calculates the great-circle distance between customer coordinates $(\text{lat}_1, \text{lng}_1)$ and store coordinates $(\text{lat}_2, \text{lng}_2)$:

$$d = 2r \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta \text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta \text{lng}}{2}\right)} \right)$$

In MariaDB SQL execution context:
```sql
SELECT s.*, 
  ( 6371 * acos( cos( radians(?)) * cos( radians( s.latitude ) ) 
  * cos( radians( s.longitude ) - radians(?) ) 
  + sin( radians(?) ) * sin( radians( s.latitude ) ) ) ) AS distance_km
FROM shops s
HAVING distance_km <= ?
ORDER BY distance_km ASC;
```

#### 2. Order State Machine Validation Rule
Validates state transitions to guarantee order process integrity:

```
[placed] -----> [confirmed] -----> [out_for_delivery] -----> [delivered]
   |                 |                     |
   +-----------------+---------------------+---------> [cancelled]
```

---

## 7. Audit of Remaining Gaps & Future Backlog

During the final audit on **23/07/2026**, overall project completion was evaluated against the initial vision. The following items were identified as deferred for future enhancement sprints:

1. **Shop Category Selection UI (US-21 - 3 Points):**
   - *Current State:* Categories table exists in DB schema, but frontend filter relies primarily on text keywords and radius.
   - *Future Plan:* Add a visual multi-select category badge carousel on the Customer Home page.

2. **Distinct Shop-Visit History Logging (US-22 - 5 Points):**
   - *Current State:* Store view analytics are implicit via search impressions.
   - *Future Plan:* Create a dedicated `shop_visits` ledger table recording customer ID, timestamp, and referral origin to give store owners granular footfall metrics.

3. **Production Daemon for Store Operating Hours:**
   - *Current State:* Operating hours toggle algorithm operates on request trigger.
   - *Future Plan:* Deploy a persistent cron job (via node-cron or PM2) to evaluate store open/closed states automatically every 15 minutes.

---

**Submitted by:** MCA Student  
**Guide Approval Status:** Approved  
**Date of Submission:** 23/07/2026  
