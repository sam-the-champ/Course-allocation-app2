# Course Allocation System — Revived

A department-level course allocation portal built with a clean modular monolith architecture. Admins manage lecturers, courses, and timetable allocations. Lecturers log in to view their own schedule.

## Architecture

```
course-allocation-app/
├── backend/               # Express + MongoDB REST API
│   └── src/
│       ├── config/        # DB connection + seed script
│       ├── models/        # Admin, Lecturer, Course, Allocation
│       ├── controllers/   # All business logic lives here
│       ├── routes/        # Thin route files — map URL → controller
│       └── middleware/    # JWT auth + error handler
│
└── frontend/              # React (Vite) SPA
    └── src/
        ├── api/           # Single axios instance — all API calls in one place
        ├── context/       # AuthContext — token + user state
        └── pages/         # Admin pages + Lecturer pages
```

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- **Frontend**: React 18, React Router v6, Vite, Axios

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env        # fill in MONGODB_URI and JWT_SECRET
npm run seed                # creates the first admin account
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env        # set VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```

Visit `http://localhost:5173`

## API Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/admin/login` | — | Admin login |
| POST | `/api/auth/lecturer/login` | — | Lecturer login |
| GET | `/api/admin/dashboard` | Admin JWT | Dashboard stats |
| GET/POST | `/api/admin/lecturers` | Admin JWT | List / add lecturers |
| DELETE | `/api/admin/lecturers/:id` | Admin JWT | Remove lecturer |
| GET/POST | `/api/admin/courses` | Admin JWT | List / add courses |
| DELETE | `/api/admin/courses/:id` | Admin JWT | Remove course |
| GET/POST | `/api/admin/allocations` | Admin JWT | List / allocate |
| DELETE | `/api/admin/allocations/:id` | Admin JWT | Remove allocation |
| GET | `/api/lecturer/me` | Lecturer JWT | My profile |
| GET | `/api/lecturer/my-allocations` | Lecturer JWT | My courses |

## What Changed (Before → After)

See `CHANGELOG.md` for the full before/after comparison.
