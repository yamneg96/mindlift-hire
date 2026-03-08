# MindLift Role

### Talent & Role Application System

NexusRole is a **full-stack MERN web application** designed to manage **role applications, talent discovery, and recruitment workflows** for projects, startups, communities, and organizations.

The platform allows individuals to **apply for roles with their CV and motivational letter**, while administrators can **review, filter, and manage applicants efficiently**.

This system is designed not only for **role-based community applications**, but also for **future recruitment and talent hiring workflows**.

---

# Table of Contents

- Overview
- Features
- Tech Stack
- System Architecture
- Project Structure
- Installation
- Environment Variables
- Running the Project
- API Overview
- Application Flow
- File Upload System
- Security
- Future Improvements
- Contributing
- License

---

# Overview

NexusRole provides a structured system where:

**Applicants can:**

- Register and create profiles
- Browse open roles
- Submit applications
- Upload CVs
- Write motivational letters
- Track application status

**Admins can:**

- Create and manage roles
- View applicants
- Review CVs
- Filter applications
- Approve or reject candidates
- Add internal notes
- Monitor application statistics

The platform is designed to support **future hiring pipelines and talent marketplace functionality**.

---

# Features

## Applicant Features

- User registration and authentication
- Profile creation
- Browse open roles
- Apply for roles
- Upload CV
- Submit motivational letter
- Track application status

---

## Admin Features

- Admin dashboard
- View all applicants
- Filter applications by role or status
- Review uploaded CVs
- Approve, reject, or shortlist candidates
- Add review notes
- View platform statistics

---

## Platform Features

- Secure authentication
- File upload system
- Role-based access control
- Application tracking
- Scalable architecture
- Future-ready recruitment pipeline

---

# Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (file uploads)

---

## Frontend

- React
- Tailwind CSS
- Axios
- React Router

---

## Infrastructure

- MongoDB Atlas
- Cloud Storage (optional)
- Docker (optional)

---

# System Architecture

The project follows a **MERN stack architecture**.

Client (React)
│
▼
REST API (Express.js)
│
▼
MongoDB Database

Applications interact with the backend via **RESTful APIs**.

The backend handles:

- authentication
- role management
- application submission
- admin workflows

---

# Project Structure

nexusrole/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ ├── uploads/
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── hooks/
│ │ └── App.js
│ └── package.json
│
├── docs/
│
└── README.md

---

# Installation

## Clone the Repository

git clone https://github.com/yourusername/nexusrole.git

cd nexusrole

---

## Install Backend Dependencies

cd backend
npm install

---

## Install Frontend Dependencies

cd ../frontend
npm install

---

# Environment Variables

Create a `.env` file in the backend directory.

PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

MAX_FILE_SIZE=5000000

Optional:

CLOUDINARY_KEY=
CLOUDINARY_SECRET=
CLOUDINARY_NAME=

---

# Running the Project

## Start Backend

cd backend
npm run dev

---

## Start Frontend

cd frontend
npm start

Frontend will run on:

http://localhost:3000

Backend will run on:

http://localhost:5000

---

# API Overview

## Authentication

POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile

---

## Roles

GET /api/roles
POST /api/roles
PATCH /api/roles/:id
DELETE /api/roles/:id

---

## Applications

POST /api/applications/apply
GET /api/applications/my
GET /api/applications/:id

---

## Admin

GET /api/admin/applications
PATCH /api/admin/applications/:id
GET /api/admin/stats

---

# Application Flow

1. User registers and logs in
2. User browses available roles
3. User submits application
4. System stores CV and data
5. Admin reviews applicants
6. Admin approves, rejects, or shortlists candidates

---

# File Upload System

The platform allows users to upload:

- CV
- Portfolio files (optional)

Supported formats:

PDF
DOCX

Maximum file size:

5MB

Files are stored locally or in cloud storage depending on configuration.

---

# Security

Security features include:

- Password hashing (bcrypt)
- JWT authentication
- Input validation
- Rate limiting
- Helmet security headers
- File upload validation

---

# Future Improvements

Planned future features include:

## Talent Marketplace

Organizations can search for talent using:

- skill filters
- experience filters
- availability

---

## Hiring Pipelines

Application stages:

Applied
Screening
Interview
Offer
Hired

---

## AI Candidate Screening

Future modules may include:

- CV analysis
- skill extraction
- automated candidate ranking

---

## Notifications

- Email alerts
- Application status updates
- Admin notifications

---

# Contributing

Contributions are welcome.

Steps:

1. Fork the repository
2. Create a new branch
3. Commit changes
4. Submit a pull request

---

# License

This project is licensed under the MIT License.

---

# Vision

NexusRole aims to become a **scalable talent management platform** that helps
