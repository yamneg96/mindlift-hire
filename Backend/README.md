# MindLift Role Backend

Production-style backend for role application and recruitment workflow.

## Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Zod validation
- JWT auth
- Multer uploads
- Helmet, CORS, rate limiting

## Setup

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   - `npm install`
3. Run in development:
   - `npm run dev`

## Key Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/roles`
- `POST /api/roles` (admin)
- `POST /api/applications/apply` (multipart: cv + optional portfolio)
- `GET /api/applications/my`
- `GET /api/admin/applications`
- `PATCH /api/admin/applications/:id`
- `GET /api/admin/stats`
- `GET /api/admin/users`

## Uploads

- Local storage (default):
  - `uploads/cv/`
  - `uploads/portfolio/`
- Optional cloud adapter stub exists in `config/cloudStorage.ts`.

## Notes

- Duplicate application for the same role is blocked.
- CV format enforced: PDF/DOCX, max 5 MB.
- Admin list supports filter by role/status/date/skill and CSV export (`?export=csv`).
