# CHANGELOG — Before → After

This documents every fix made during the GitHub Finish-Up-A-Thon revival.

## Architecture

| Before | After |
|--------|-------|
| Frontend HTML/JS/CSS lived inside `backend/public/` — one folder for everything | Fully separated: `frontend/` (React/Vite) and `backend/` (Express) are independent projects |
| Business logic spread across route files | All logic moved into `controllers/` — routes are thin URL-to-controller maps |
| Empty `controllers/` folder | Three complete controllers: `authController`, `adminController`, `lecturerController` |
| Allocations embedded as an array inside the Lecturer document | `Allocation` is now a proper first-class MongoDB collection with its own schema and a unique compound index |

## Security

| Before | After |
|--------|-------|
| Admin credentials hardcoded as `admin` / `admin123` in source code | Admin stored in MongoDB, password hashed with bcrypt. Created via `npm run seed` |
| Lecturer login returned the raw `lecturerId` string as a "token" | Both admin and lecturer login return a real signed JWT with role and expiry |
| `authMiddleware` existed but was applied to zero routes | `protect` + `adminOnly` / `lecturerOnly` middleware applied to every protected route |
| Frontend stored admin and lecturer tokens under the same key `lecturerId` | Single `token` key + separate `user` object with role; role determines redirect |

## Bug Fixes

| Before | After |
|--------|-------|
| `models/Admin.js` exported `mongoose.models.Admin` (undefined) instead of a model | Fixed: `mongoose.model('Admin', adminSchema)` |
| `phone` field saved in routes but schema defined `phonenumber` — phone never persisted | Unified to `phoneNumber` in both model and controller |
| `getCoursesAllocated()` tried `lecturer.courses.courseCode` — `courses` is an array, always returned `undefined` | Dashboard stats now computed server-side using `Allocation.distinct('course')` — always correct |
| Logout called as `GET`, server only defined `POST` | Logout removed from server (stateless JWT). Client just clears localStorage |
| Several pages fetched `http://localhost:5000` hardcoded | All API calls go through a single axios instance at `frontend/src/api/index.js` with base URL from `.env` |

## Frontend

| Before | After |
|--------|-------|
| Static HTML pages with inline `<script>` tags and separate CSS files | React SPA with React Router, component-based architecture |
| No shared state — each page re-reads `localStorage` independently | `AuthContext` manages token and user object across the whole app |
| No API abstraction — every page built its own `fetch()` call with hardcoded URLs | `src/api/index.js` exports named functions for every endpoint. Pages just import and call them |
| Basic / unstyled UI | Design system with CSS variables — navy + gold institutional palette, Syne + DM Sans typography, consistent cards, tables, modals, badges |
