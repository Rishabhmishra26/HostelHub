#  HostelHub – AI Powered Hostel Complaint Management System

HostelHub is a full-stack web application that streamlines hostel maintenance by connecting **students**, **maintenance workers**, and **administrators** on a single platform.

Students can register complaints with AI-assisted descriptions and image uploads, administrators can assign complaints to workers, and workers can update progress with completion notes and images. The system provides real-time status tracking from complaint submission to resolution.

## ✨ Key Features

- 🤖 AI-assisted complaint generation using Google Gemini
- 🔐 Secure JWT authentication with role-based access
- 📸 Cloudinary image uploads for complaint and completion proof
- 👨‍🎓 Student, Worker, and Admin dashboards
- 📋 Complaint lifecycle tracking (Pending → Assigned → In Progress → Completed)
- 🕒 Timeline history for every complaint
- 🔔 Notification system
- ☁️ MongoDB Atlas database integration

---

## 1. Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | Next.js 14 (App Router), React, TypeScript, Tailwind CSS |
| Forms      | React Hook Form + Zod (shared validation, client & server) |
| Backend    | Next.js API Routes (same project, no separate server) |
| Database   | MongoDB + Mongoose |
| Auth       | JWT (access + refresh tokens) in httpOnly cookies, bcrypt password hashing |
| Images     | Cloudinary |
| AI         | Google Gemini API (optional — falls back to a simple keyword matcher if no key is set) |
| Email      | Nodemailer (OTP codes / password reset) |
| Deployment | Vercel + MongoDB Atlas |

---

## 2. Folder Structure

```
hostelhub/
├── src/
│   ├── app/                     # Next.js App Router — every folder = a route
│   │   ├── (auth)/              # login, register, otp, forgot/reset password
│   │   ├── student/             # student dashboard, complaints, profile
│   │   ├── worker/              # worker dashboard, complaint detail
│   │   ├── admin/               # admin dashboard, complaints, students, workers
│   │   └── api/                 # REST API routes (backend)
│   ├── components/
│   │   ├── ui/                  # tiny reusable pieces: Button, Input, Card...
│   │   ├── layout/               # Sidebar, Navbar, DashboardShell, AuthLayout
│   │   ├── complaints/            # ComplaintForm, ComplaintCard, StatusTimeline...
│   │   └── shared/               # LoadingSpinner, Pagination, SearchBar, EmptyState
│   ├── models/                   # Mongoose schemas (one file per collection)
│   ├── lib/                      # db connection, jwt, password, cloudinary, gemini...
│   │   └── validations/          # Zod schemas, shared by frontend + backend
│   ├── context/AuthContext.tsx   # who-is-logged-in, available everywhere via useAuth()
│   ├── hooks/useComplaints.ts    # reusable data-fetching hook
│   ├── types/index.ts            # shared TypeScript types
│   └── middleware.ts              # protects /student, /worker, /admin routes
├── scripts/seed.ts                # fills the DB with sample data
└── .env.example                   # copy to .env.local and fill in real values
```

**Rule of thumb used everywhere:** one file = one responsibility. If you can
describe what a file does in one sentence, it's probably structured right.

---

## 3. Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment file and fill in real values
cp .env.example .env.local

# 3. Seed the database with sample hostels/students/workers/complaints
npm run seed

# 4. Run the dev server
npm run dev
```

Open http://localhost:3000

### Sample logins (created by `npm run seed`, password: `Password@123`)
| Role    | Email |
|---------|-------|
| Admin   | admin@college.edu |
| Worker  | ramesh.worker@college.edu |
| Student | asha.verma@college.edu |

> Note: `ALLOWED_EMAIL_DOMAIN` in `.env.local` controls which email domain
> can register (defaults to `college.edu`).

---

## 4. How the App Works (for your viva)

### 4.1 Authentication flow
1. **Register** → `/api/auth/register` creates an *unverified* student and
   emails a 6-digit OTP (stored **hashed** in the `Otp` collection, with a
   MongoDB TTL index so it auto-deletes after 10 minutes).
2. **Verify OTP** → `/api/auth/verify-otp` checks the code and flips
   `isVerified: true`.
3. **Login** → `/api/auth/login` checks the password with `bcrypt.compare`,
   then signs two JWTs:
   - `accessToken` (15 min) — used on every request
   - `refreshToken` (7 days) — long-lived, used to silently renew the access
     token (this "access + refresh" pattern limits how long a stolen token
     is useful)
   Both are stored as **httpOnly cookies** (JavaScript in the browser can't
   read them — this protects against XSS token theft, which is safer than
   localStorage).
4. **Every protected page** (`/student/*`, `/worker/*`, `/admin/*`) is
   guarded by `src/middleware.ts`, which decodes the JWT *before* the page
   loads and redirects to `/login` (or to the correct role's dashboard) if
   the check fails. This is **Role Based Access Control**.

### 4.2 Registering a complaint
1. Student fills the form (`ComplaintForm.tsx`), validated with the same
   Zod schema on both the browser (instant feedback) and the server
   (`/api/complaints` POST — never trust the client!).
2. Optional **"Improve with AI"** button sends the raw text to
   `/api/ai/suggest`, which calls Gemini and returns a suggested title,
   category, and cleaned-up description. **The student can edit or ignore
   it** — nothing is saved until they click Submit.
3. Images are uploaded one at a time to `/api/upload`, which forwards them
   to Cloudinary and returns a URL; the URLs are stored on the complaint.
4. On creation, the complaint gets a `timeline` array starting with
   `"Pending — Complaint submitted by student"`.

### 4.3 Complaint lifecycle
```
Pending → Assigned → In Progress → Completed → Closed
                                 ↘ Rejected
```
- **Admin** assigns a worker (`PATCH /api/complaints/:id/assign`) → status
  becomes `Assigned`, a new timeline entry is pushed, and the student gets
  a `Notification`.
- **Worker** moves it to `In Progress` then `Completed`
  (`PATCH /api/complaints/:id/status`), optionally attaching a completion
  image and notes.
- **Admin** can `Close` it once satisfied.

Every status change appends to the same `timeline` array — that's what
powers the "Submitted → Assigned → Work Started → Completed" view the
student sees.

### 4.4 Database design decisions (good viva talking points)
- **Embed vs Reference:** `timeline` entries are *embedded* inside each
  `Complaint` document (they always belong to one complaint and are always
  read together with it). `assignedWorker` and `student` are *references*
  (ObjectIds) because Worker/Student documents are large, reused, and
  updated independently.
- **`select: false` on passwords:** password hashes are never returned by a
  normal `.find()` — you must explicitly `.select("+password")`, which is
  only done inside the login route.
- **TTL index on OTPs:** `expiresAt` has `expireAfterSeconds: 0`, so MongoDB
  deletes expired OTPs automatically — no cleanup cron job needed.
- **Dynamic reference (`refPath`) on `Notification`:** one collection can
  point to a Student, Worker, *or* Admin without three near-duplicate
  schemas.
- **Aggregation pipeline for admin stats:** `/api/admin/stats` uses
  `$group`/`$sort` to compute hostel-wise and category-wise complaint
  counts inside MongoDB rather than looping in JavaScript — much faster at
  scale.

### 4.5 Why Next.js API Routes instead of a separate Express server?
Both the frontend and backend live in one Next.js project. Each file under
`src/app/api/**/route.ts` is a serverless function mapped straight to a URL
— e.g. `src/app/api/complaints/route.ts` → `GET/POST /api/complaints`. This
keeps the whole app in one repo, one deployment (Vercel), and one language
(TypeScript) end-to-end.

---

## 5. Key Files to Understand Before Your Viva

| File | What to explain |
|------|------------------|
| `src/models/Complaint.ts` | The main schema — explain embed vs. reference |
| `src/lib/jwt.ts` + `src/middleware.ts` | Access/refresh tokens + route protection |
| `src/app/api/auth/login/route.ts` | Checking 3 collections, hashing, cookies |
| `src/components/complaints/ComplaintForm.tsx` | Zod validation + optional AI assist |
| `src/lib/gemini.ts` | AI feature + graceful fallback if no API key |
| `src/app/api/admin/stats/route.ts` | MongoDB aggregation pipeline |

---

## 6. What's Deliberately Kept Simple

This is a portfolio/college project, not a commercial SaaS product, so a
few things are intentionally minimal and can be called out as "future
improvements" if asked:
- Notifications are shown as a simple list (no real-time push/websockets).
- Admin "Manage Hostels/Floors/Blocks/Rooms" uses the `Hostel` model as
  reference data but doesn't yet have a full CRUD UI — the API/schema is
  ready for it.
- No automated tests are included; Zod + TypeScript catch most mistakes at
  compile/request time.

---

## 7. Deployment

1. Push this repo to GitHub.
2. Create a free MongoDB Atlas cluster → copy the connection string into
   `MONGODB_URI`.
3. Import the project into **Vercel**, add all variables from
   `.env.example` under Project Settings → Environment Variables.
4. Deploy. Run `npm run seed` locally (pointed at your Atlas URI) once to
   populate sample data, or register through the UI.



---

## 📌 Future Improvements
- Push notifications
- Mobile responsive PWA version
- QR code based hostel complaint registration

---

## 👨‍💻 Author

**Rishabh Mishra**

Built as a full-stack portfolio project using Next.js, TypeScript, MongoDB, Cloudinary, and Google Gemini AI.