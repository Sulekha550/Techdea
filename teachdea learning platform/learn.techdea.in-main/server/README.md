# TechDea Learn - Server

## Setup

1. Copy `.env.example` to `.env`.
2. Add your MongoDB Atlas connection string.
3. Set a strong `JWT_SECRET`.
4. Set admin credentials.
5. Install packages:

```bash
npm install
```

6. Create the first admin:

```bash
npm run seed:admin
```

7. Start development server:

```bash
npm run dev
```

API:
- http://localhost:5000/
- http://localhost:5000/api/health

## Auth endpoints

POST `/api/auth/register`
POST `/api/auth/login`
POST `/api/auth/admin/login`
GET `/api/auth/me`

## Important

Videos are intended to use YouTube Unlisted URLs/IDs.
Notes/PYQs/practical files can use Google Drive URLs.
Do not commit `.env` to GitHub.
