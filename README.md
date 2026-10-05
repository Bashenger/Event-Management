# 🎓 Campus Event & Workshop Management System

A full-stack web application designed for university campuses to publish, discover, manage, and register for technical workshops, hackathons, seminars, webinars, and cultural festivals with live seat tracking, digital QR passes, and role-based access control.

---

## 🌟 Key Features

### 🖥️ Frontend (React 18+, Vite, Tailwind CSS)
- **Multi-Faceted Search & Filter Engine (`useEventFilter.js`)**: Real-time keyword search across titles, speakers, venues, and `#tags`, multi-select category pills, status filters, date range filters, and multiple sort metrics.
- **Finite State Machine (FSM) Status Workflow**:
  - `Draft` ➔ `Published` ➔ `Registration Open` ➔ `Registration Closed` ➔ `Completed`
  - Auto-evaluates past events as `Completed` and auto-locks full events as `Registration Closed`.
- **Dynamic Role Simulator (`AuthContext.jsx`)**: Instant role switcher in the Navbar between **Student (Attendee)**, **Organizer (Faculty/Club)**, and **Admin (Full Access)**.
- **Seat Capacity Indicator (`SeatIndicator.jsx`)**: Real-time visual progress bar with color-coded alerts (>30% Green, <20% Amber "Filling Fast", 0% Red "Sold Out").
- **Live Event Countdown Ticker (`CountdownTimer.jsx`)**: JavaScript timer computing remaining `DD:HH:MM:SS` until event commencement with memory leak cleanup.
- **Form Validation Engine (`useEventFormValidation.js`)**: Controlled form with touch/blur tracking, future-date checks, character limits, agenda timeline builder, and live card preview tab.
- **Smart Recommendations (`useRecommendations.js`)**: "You Might Also Like" algorithm computing related events by category, tags, and keynote speakers.
- **Digital Event Ticket Pass (`TicketModal.jsx`)**: Printable/downloadable event pass with simulated QR verification token, attendee metadata, and barcode.
- **Organizer Analytics Dashboard (`RegistrationAnalytics.jsx`)**: Aggregated metrics, fill rates, and SVG category breakdown charts.
- **Dual-Mode Data Bridge**: Communicates with the Express REST API backend while seamlessly falling back to `localStorage` mock data if the backend is offline.

---

### ⚙️ Backend (Node.js, Express.js, MongoDB & Mongoose)
- **MVC Architecture**: Structured controllers, models, routes, middleware, and utilities.
- **JWT & Role-Based Access Control (RBAC)**: Password hashing with `bcryptjs` (salt 10) and bearer token authentication (`protect`, `authorizeRoles`).
- **Atomic Concurrency Booking**: MongoDB `$inc: { availableSeats: -1 }` with compound unique index on `{ eventId: 1, userId: 1 }` preventing double-registrations.
- **MongoDB Aggregation Pipeline**: Real-time analytics dashboard metrics (`/api/analytics/dashboard`).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn
- MongoDB (optional for live backend; frontend runs independently in standalone/localStorage mode)

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Run Applications

#### Option A: Run Frontend (Standalone Mode with pre-populated demo events)
```bash
cd frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser.

#### Option B: Run Full-Stack (Backend + Frontend)
```bash
# Terminal 1 - Start MongoDB Seed & Express Backend Server
cd backend
npm run seed     # Seeds demo users & events to MongoDB
npm run dev      # Starts API on http://localhost:5000

# Terminal 2 - Start React Vite Frontend
cd frontend
npm run dev      # Starts UI on http://localhost:5173
```

---

## 🧭 RESTful API Reference

| Method | Endpoint | Access / Roles | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new student or organizer |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/auth/me` | Protected | Retrieve authenticated user profile |
| `GET` | `/api/events` | Public | Search, filter, sort & paginate events |
| `GET` | `/api/events/:id` | Public | Retrieve single event details |
| `POST` | `/api/events` | Organizer / Admin | Create new campus event |
| `PUT` | `/api/events/:id` | Organizer / Admin | Update event details & capacity |
| `PATCH`| `/api/events/:id/status` | Organizer / Admin | Transition event workflow status |
| `DELETE`| `/api/events/:id` | Organizer / Admin | Delete event & cascade registrations |
| `POST` | `/api/registrations/:eventId` | Student / Admin | Atomic event seat booking & ticket issue |
| `GET` | `/api/registrations/my` | Student / Admin | List user's registered event passes |
| `DELETE`| `/api/registrations/:id/cancel` | Student / Admin | Cancel registration & restore seat |
| `GET` | `/api/registrations/event/:eventId` | Organizer / Admin | Retrieve attendee roster |
| `GET` | `/api/analytics/dashboard` | Organizer / Admin | Aggregation analytics & fill rate metrics |

---

## 🎨 User Roles & Test Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Student** | `student@campus.edu` | `password123` | Browse events, filter/sort, register, view digital passes & cancel bookings |
| **Organizer** | `organizer@campus.edu` | `password123` | Create events, edit events, delete events, transition status, view analytics |
| **Admin** | `admin@campus.edu` | `password123` | Full administrative control across all resources and user data |

> 💡 *Tip: Use the **Role Simulator** dropdown widget in the top right of the Navbar to switch roles instantly.*
