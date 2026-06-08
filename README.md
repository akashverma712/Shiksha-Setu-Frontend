# Shiksha-Setu Frontend

> **AI-powered college management web app** — dropout risk dashboard, attendance tracking, marks management, scholarship finder, and AI counselling, built with Next.js 16 + React 19.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.5-000000?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-0055FF?logo=framer)](https://framer.com/motion)

---
## 🎥 Demo Video



Experience Shiksha-Setu in action through the project demo video:



👉 **[Watch Demo Video](https://drive.google.com/file/d/13WB0mGJUXYcFqqjoimfyLpg2tKgnqBBZ/view?usp=sharing)**



---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [App Structure](#app-structure)
- [Pages & Features](#pages--features)
  - [Landing & Auth](#landing--auth)
  - [Student Dashboard](#student-dashboard)
  - [Teacher Dashboard](#teacher-dashboard)
  - [Admin Dashboard](#admin-dashboard)
- [Third-Party Integrations](#third-party-integrations)
- [State & Auth Management](#state--auth-management)
- [Component Architecture](#component-architecture)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Known Issues & Roadmap](#known-issues--roadmap)

---

## Overview

Shiksha-Setu Frontend is a **full-stack-flavoured Next.js application** that acts as the face of the dropout prevention platform. It serves three distinct user roles — **Student**, **Teacher/HOD**, and **Admin** — each with their own protected dashboard, navigation, and feature set.

The app is notable for embedding **AI directly in the student experience**: a Gemini-powered quiz analyzer, an ElevenLabs voice AI widget in the global layout, a Botpress chatbot, AI-assisted scholarship essay writing, and voice AI counsellor sessions.

---

## Tech Stack

| Category | Library / Tool |
|----------|---------------|
| Framework | Next.js 16.0.5 (App Router) |
| UI Library | React 19.2 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12, GSAP 3 |
| Charts | Recharts 3 |
| HTTP | Axios |
| Forms | React Hook Form + Zod |
| Notifications | react-hot-toast |
| Date Utilities | date-fns |
| PDF Export | jsPDF + html2canvas |
| CSV Parsing | PapaParse |
| Icons | Lucide React |
| Fonts | Montserrat + Poppins (next/font/google) |
| AI (client) | Google Gemini 1.5 Flash API |
| Voice AI | ElevenLabs ConvAI widget |
| Chatbot | Botpress webchat |

> **Note:** `BB/` folder in the repo is a copy of the Node.js backend — it should not be part of the frontend repository.

---

## App Structure

```
app/
│
├── layout.tsx                  # Root layout: fonts, ThemeProvider,
│                               # ElevenLabs widget, Botpress, Toaster
├── page.tsx                    # Landing page (Spline 3D background + Navbar)
├── globals.css                 # Tailwind + CSS variable setup
├── ThemeProvider.tsx           # Dark/light mode context (persisted to localStorage)
│
├── lib/
│   └── api.ts                  # Axios instance with JWT interceptor
│
├── context/
│   └── AuthContext.tsx         # Auth state context (login, logout, user)
│
├── components/
│   ├── Navbar.tsx              # Glassmorphism floating navbar (Home/About/Contact/Login)
│   ├── Loading.tsx             # Full-screen branded loader (6s timer)
│   ├── StairsTransition.tsx    # Page transition animation
│   └── SocialSidebar.tsx       # Social links sidebar (currently commented out)
│
├── src/
│   └── FullScreenLoader.tsx    # Alternative full-screen loader component
│
├── (auth)/
│   └── admin/
│       ├── login/page.tsx      # Admin login form
│       ├── register/page.tsx   # First-time admin registration
│       └── page.tsx            # Admin dashboard (register teachers & students)
│
├── login/page.tsx              # Unified login: Student (OTP) + Teacher (password)
│                               # Animated sliding panel switching between roles
│
├── about/page.tsx              # About page
├── contact/page.tsx            # Contact page
│
├── studentReg/page.tsx         # Student self-registration (if enabled)
│
├── student/dashboard/
│   ├── layout.tsx              # Student sidebar, mobile menu, auth guard
│   ├── page.tsx                # Overview: stats, charts, mentor card, risk badge
│   ├── attendance/page.tsx     # Animated donut, radar chart, subject-wise bars
│   ├── marks/page.tsx          # Semester selector, subject table, CGPA/SGPA
│   ├── fees/page.tsx           # Fee breakdown, payment history, pie chart (static)
│   ├── routine/page.tsx        # Weekly timetable with PDF export (jsPDF)
│   ├── assignments/page.tsx    # Assignment list
│   ├── Ai/page.tsx             # Gemini quiz generator + performance analysis
│   ├── Scholarship/page.tsx    # Scholarship directory + AI essay writer
│   ├── connect/page.tsx        # Student Connect: mentors, peer groups, emergency
│   └── counsellor/page.tsx     # ElevenLabs AI voice counsellor booking
│
└── teacher/dashboard/
    ├── layout.tsx              # Teacher sidebar, theme toggle, role-based auth guard
    ├── page.tsx                # Overview: stats grid, area chart, radar chart
    ├── attendance/page.tsx     # Mark all/individual, bulk upload to API
    ├── marks/page.tsx          # Upload marks by rollNo + dynamic subject rows
    ├── student/page.tsx        # Paginated student grid, full profile modal,
    │                           # mentor assignment, SMS sending
    ├── timetable/page.tsx      # Day-by-day timetable navigator (static data)
    ├── assignments/page.tsx    # Assignment management
    └── sms/page.tsx            # SMS panel (currently commented out in sidebar)
```

---

## Pages & Features

### Landing & Auth

**Landing Page** (`/`)
- Full-screen Spline 3D interactive background embedded via iframe
- Glassmorphism floating navbar with hover labels
- 6-second animated loader on first visit

**Login Page** (`/login`)
- Animated sliding panel — left/right layout swaps between Student and Teacher
- **Student login:** email → OTP sent via backend → 6-digit OTP input → JWT
- **Teacher login:** employeeId + password → JWT
- Smart redirect: Teacher/HOD → `/teacher/dashboard`, Student → `/student/dashboard`
- Role switcher buttons at the bottom with smooth CSS transitions

**Admin Auth** (`/(auth)/admin/`)
- One-time registration at `/admin/register` (only first admin allowed, enforced by backend)
- Login at `/admin/login` → JWT stored in `localStorage`

---

### Student Dashboard

Protected by `localStorage` token check in layout. All pages are dark-theme, mobile-responsive with collapsible sidebar.

**Sidebar routes:**

| Route | Page | Description |
|-------|------|-------------|
| `/student/dashboard` | Overview | Welcome banner, 4-stat grid, area chart, pie chart, mentor card, risk badge, quick actions |
| `/student/dashboard/attendance` | Attendance | Animated SVG donut (green/yellow/red by %), radar chart, subject-wise animated bars, monthly trend |
| `/student/dashboard/marks` | Marks | Semester pill selector, subject table (name/code/credits/marks/grade/points), SGPA/CGPA summary footer |
| `/student/dashboard/fees` | Fee Details | Overview/breakdown/history tabs, progress bar, Recharts pie chart, payment table (static demo data) |
| `/student/dashboard/routine` | Routine | Week view with expandable days, mood tracker, PDF export via jsPDF + html2canvas |
| `/student/dashboard/assignments` | Assignments | Assignment listing |
| `/student/dashboard/Ai` | Siksha Help | Gemini 1.5 Flash quiz generator: upload image or enter topic → auto-generates MCQ quiz → performance analysis with bar/radar charts |
| `/student/dashboard/Scholarship` | Scholarship | Directory of 8 real scholarships with eligibility + links, AI essay writer (Gemini), tab-based UI |
| `/student/dashboard/connect` | Student Connect | Mentor directory, peer group quick links, emergency contacts, message form |
| `/student/dashboard/counsellor` | Counsellor Connect | ElevenLabs AI voice sessions (external link), counsellor profiles with ratings |

**Student Dashboard — data sources:**

| Data | Source |
|------|--------|
| Profile, CGPA, risk score, attendance % | `GET /api/students/me` |
| Attendance history, monthly trend | `GET /api/attendance/my-history` |
| Marks, academics | `GET /api/students/me` (embedded) |
| Fee details | **Static demo data** (not connected to API) |
| Timetable/Routine | **Static demo data** |
| Subject-wise chart on overview | **Randomly generated** client-side |

---

### Teacher Dashboard

Protected by `localStorage` token check with role validation (`Teacher` or `HOD` only). Has dark/light theme toggle in header.

**Sidebar routes:**

| Route | Page | Description |
|-------|------|-------------|
| `/teacher/dashboard` | Dashboard | Stats (total students, classes today, at-risk count, marked today), area chart, radar chart, subjects list, quick actions |
| `/teacher/dashboard/attendance` | Attendance | Subject code/name inputs, per-student present/absent/late toggle, "mark all" buttons, sticky upload button → `POST /api/attendance/upload` |
| `/teacher/dashboard/student` | All Students | Paginated grid (20/page), search by name/rollNo/email/batch, student cards with attendance bar + risk badge, full profile modal with socio-economic data, mentor assign form, SMS panel |
| `/teacher/dashboard/marks` | Upload Marks | Roll number + semester + dynamic subject rows (name/code/credits/grade/marks), → `POST /api/marks/upload` |
| `/teacher/dashboard/timetable` | My Timetable | Day navigator, class cards with type badges (Theory/Lab/Advanced) — **static dummy data** |
| `/teacher/dashboard/assignments` | Assignments | Assignment management |

**Teacher features worth noting:**

- **Student full profile modal** — fetches from `GET /api/teachers/students/:id`, shows attendance aggregate, risk level with color coding, socio-economic data (family income, distance, scholarship status), warning history, mentor info, SMS panel
- **Mentor assignment** — inline form in student modal → `PUT /api/teachers/assign-mentor/:id`
- **SMS dispatch** — sends to hardcoded admin number via `POST /api/teachers/send-test-sms` (demo only)

---

### Admin Dashboard

Accessible at `/(auth)/admin/page.tsx`. Single-page dashboard with three tabs:

| Tab | Description |
|-----|-------------|
| Home | Welcome screen with navigation cards |
| Register Teacher | Full form: employeeId, name, email, password, department, designation + dynamic subject rows → `POST /api/auth/teacher/register` |
| Register Student | Full form: name, email, rollNo, phone, department, program, batch, semester, section, family income, distance, scholarship → `POST /api/auth/student/register` |

---

## Third-Party Integrations

### ElevenLabs ConvAI (Voice AI)

Embedded globally in `layout.tsx`:

```html
<elevenlabs-convai agent-id="agent_1001kbq27qjjeajtpb778dztghpw"></elevenlabs-convai>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async></script>
```

A floating voice AI widget appears on every page. Students can also book dedicated counsellor sessions at `/student/dashboard/counsellor`, which links to a separate ElevenLabs agent.

### Botpress Chatbot

Injected globally via two `<script>` tags in `layout.tsx` — provides a persistent chat bubble across all pages.

### Google Gemini 1.5 Flash



Features:
- Upload an image of notes/textbook pages → Gemini extracts the topic and generates a 5-question MCQ quiz
- Manual mode: enter class/subject/topic → quiz generated
- After quiz submission → performance analysis with bar chart and detailed feedback

Also used in `/student/dashboard/Scholarship/page.tsx` for AI scholarship essay generation.

### Spline 3D

Homepage background uses an embedded Spline scene via `<iframe>`:
```
https://my.spline.design/quantum-KEA5SsgHlabw69udiGz2AEEj/
```

---

## State & Auth Management

### Token storage

JWT is stored in `localStorage` under the key `token`. User object is stored separately under `user`.

```ts
localStorage.setItem('token', res.data.token);
localStorage.setItem('user', JSON.stringify(res.data.user));
```

### Auth guards

Both dashboard layouts check for the token on mount and redirect to `/login` if absent:

```ts
// Student layout
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) router.replace('/login');
}, []);

// Teacher layout — also checks role
const parsedUser = JSON.parse(user);
if (parsedUser.role !== 'Teacher' && parsedUser.role !== 'HOD') {
  router.replace('/login');
}
```

### Axios interceptor

`app/lib/api.ts` sets `baseURL: 'http://localhost:5000/api'` and automatically attaches the JWT:

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Note:** Many pages bypass the shared `api` instance and call `axios` directly with hardcoded `http://localhost:5000` — inconsistency to fix.

### Theme

`ThemeProvider.tsx` provides a `dark | light` context, persisted to `localStorage`. The teacher dashboard has a visible toggle button; the student dashboard is dark-only.

---

## Component Architecture

### Shared Components

| Component | Location | Description |
|-----------|----------|-------------|
| `Navbar` | `app/components/Navbar.tsx` | Glassmorphism nav: logo + Home/About/Contact/Login icons |
| `Loading` | `app/components/Loading.tsx` | Full-screen animated loader (6s auto-dismiss) |
| `ThemeProvider` | `app/ThemeProvider.tsx` | Dark/light context with `useTheme()` hook |
| `StairsTransition` | `app/components/StairsTransition.tsx` | GSAP staircase page transition |
| `FullScreenLoader` | `app/src/FullScreenLoader.tsx` | Alternative loader |
| `AuthContext` | `app/context/AuthContext.tsx` | Auth context with `login()` / `logout()` (not used by main pages — they manage auth manually) |

### Inline Page Components

Most pages define their sub-components inline (e.g. `StatCard`, `InfoCard`, `QAItem`, `MetricItem`, `Donut`). These are good candidates to extract into a shared `components/` directory as the codebase scales.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000

# Google Gemini API = NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

\

---

## Getting Started

### Prerequisites

- Node.js 18+
- The [Shiksha-Setu Backend](https://github.com/akashverma712/Shiksha-Setu-Backend) running on `http://localhost:5000`

### Install & Run

```bash
# Install dependencies
npm install

# Development server (with hot reload)
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm start

# Lint
npm run lint
```

### First-time Setup

```
1. Start the backend on port 5000
2. Visit http://localhost:3000/(auth)/admin/register to create the first Admin
3. Log in at http://localhost:3000/(auth)/admin/login
4. Use the Admin dashboard to register Teachers and Students
5. Teachers log in at /login (toggle to Teacher)
6. Students log in at /login (default Student tab, OTP flow)
```

---



ISC © Shiksha-Setu Contributors
