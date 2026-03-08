# MindLift Role 🌱

Modern full-stack talent and role application platform built with React + Node.js.

MindLift Role helps applicants discover and apply for roles, while admins manage hiring workflows, application reviews, and platform insights.

## Table of Contents 📚

- [Overview](#overview-)
- [Features](#features-)
- [Tech Stack](#tech-stack-)
- [Project Structure](#project-structure-)
- [Getting Started](#getting-started-)
- [Environment Variables](#environment-variables-)
- [Run Commands](#run-commands-)
- [API Routes](#api-routes-)
- [Frontend Routes](#frontend-routes-)
- [File Uploads](#file-uploads-)
- [Security](#security-)
- [Notes](#notes-)
- [License](#license-)

## Overview 🔎

MindLift Role is a MERN-style application for role applications and admin workflows.

### Applicant side

- Register and login
- Browse open roles
- Submit applications with CV/portfolio and motivation text
- Track personal application submissions

### Admin side

- View platform stats
- Review applicants and applications
- Update application statuses
- Manage roles

## Features ✨

- Authentication with JWT
- Role-based access control (user/admin)
- Multi-step application UX
- Admin dashboard and applicant management
- Upload handling for documents
- Theme support (light/dark)
- Query/state management with TanStack Query + Zustand

## Tech Stack 🧱

### Frontend (`Frontend/`)

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui + Radix primitives
- TanStack Query
- Zustand
- Framer Motion
- Zod

### Backend (`Backend/`)

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication
- Multer uploads
- Zod validation
- Helmet, CORS, rate limiting, morgan

## Project Structure 🗂️

```text
ml-role/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── types/
│   ├── uploads/
│   ├── utils/
│   ├── zod/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── server.ts
│   └── tsconfig.json
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── README.md
```

## Getting Started 🚀

### 1. Clone

```bash
git clone <your-repo-url>
cd ml-role
```

### 2. Install dependencies

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

## Environment Variables 🔐

Create `Backend/.env` based on `Backend/.env.example`.

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mindlift-role
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173
USE_CLOUD_STORAGE=false
UPLOAD_BASE_URL=http://localhost:5000
```

Note: `CLIENT_ORIGIN` supports multiple comma-separated values.

## Run Commands 🏃

### Backend

```bash
cd Backend
npm run dev
```

- Dev server: `http://localhost:5000`

### Frontend

```bash
cd Frontend
npm run dev
```

- Dev server: `http://localhost:5173`

### Useful checks

```bash
cd Backend
npm run typecheck

cd ../Frontend
npm run typecheck
npm run lint
```

## API Routes 🔌

Base URL: `http://localhost:5000`

### System

- `GET /` - Backend landing UI
- `GET /api` - API index UI/JSON
- `GET /api/health` - Health UI/JSON

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/profile`

### Roles

- `GET /api/roles`
- `POST /api/roles` (admin)
- `PATCH /api/roles/:id` (admin)
- `DELETE /api/roles/:id` (admin)

### Applications

- `POST /api/applications/apply`
- `GET /api/applications/my`
- `GET /api/applications/:id`

### Admin

- `GET /api/admin/applications`
- `PATCH /api/admin/applications/:id`
- `GET /api/admin/stats`
- `GET /api/admin/users`

### Route aliases (also available)

- `/auth/*`
- `/roles/*`
- `/applications/*`
- `/admin/*`

## Frontend Routes 🧭

The frontend currently uses an app-route state model with hash navigation support for non-root pages.

Key views include:

- Landing
- About
- Application Form
- Minimal Application
- Contact
- Privacy Policy
- Terms of Service
- Admin Login
- Admin Dashboard
- Applicant List
- Applicant Details

## File Uploads 📎

- Supported fields: `cv`, `portfolio`
- Managed with Multer middleware
- Static access path: `/uploads`

## Security 🛡️

- Helmet for HTTP headers
- CORS with multi-origin support
- API rate limiting
- JWT auth + role middleware
- Input validation via Zod

## Notes 📝

- Backend and frontend are both TypeScript.
- Root API pages (`/`, `/api`, `/api/health`) provide browser-friendly UIs.
- If CORS errors appear, verify `CLIENT_ORIGIN` values exactly match your frontend origin(s).

## License 📄

MIT (or project-defined license).
