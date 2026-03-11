# Day-06 — Spotify

Summary
-------
This folder contains the Spotify project (backend + frontend) built during Day-06. This README documents the project structure, concepts used, setup and run steps, environment variables, development notes, and troubleshooting tips so you can quickly revise the project later.

Table of contents
-----------------
- [Overview](#overview)
- [Concepts Covered](#concepts-covered)
- [Folder Structure](#folder-structure)
- [Setup & Run](#setup--run)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Environment Variables](#environment-variables)
- [Secrets & Git Hygiene](#secrets--git-hygiene)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## Overview

This project is a simple fullstack app named "Spotify" (Soundwave). It includes a Node/Express backend (with MongoDB) and a React + Vite frontend. The backend provides authentication and music upload endpoints; the frontend provides UI for signing up, logging in, browsing, and uploading.

## Concepts Covered

- Node.js + Express (API routes, middleware)
- MongoDB via Mongoose (schemas, models)
- Authentication (bcrypt password hashing, JWT)
- File uploads (multer or external storage service)
- Image/file hosting with ImageKit (used in backend deps)
- React + Vite (frontend dev server, components)
- Axios for client-server communication
- Environment variable management (`.env`)
- Basic security and git hygiene for secrets

## Folder Structure

Click any path to jump to it in this repository:

- [Day-06/Spotify](Day-06/Spotify)
  - [backend](Day-06/Spotify/backend)
    - `server.js` — app entry
    - `src/` — backend source files
      - `controllers/` — request handlers
      - `db/` — DB connection helpers
      - `middlewares/` — auth middleware, etc.
      - `models/` — Mongoose schemas
      - `services/` — storage or helper services
    - `package.json` — backend dependencies & scripts
  - [frontend](Day-06/Spotify/frontend)
    - `index.html` — Vite entry
    - `src/` — React source
      - `components/` — UI components
      - `context/` — React contexts (Auth, Player)
      - `pages/` — App pages (Albums, Browse, Upload)
    - `package.json` — frontend deps & scripts

## Setup & Run

Prerequisites
- Node.js (>=16 recommended)
- npm
- MongoDB URI (Atlas or local)

Recommended workflow (from repository root):

Backend

1. Open a terminal and go to the backend folder:

```bash
cd Day-06/Spotify/backend
```

2. Install dependencies (if not already):

```bash
npm install
```

3. Add a local `.env` file (DO NOT commit it). See the [Environment Variables](#environment-variables) section for keys.

4. Start the backend in dev mode:

```bash
npm run dev
```

The backend uses `nodemon` (script: `dev`) and runs the server defined in `server.js`.

Frontend

1. Open another terminal and go to the frontend folder:

```bash
cd Day-06/Spotify/frontend
```

2. Install dependencies (if not already):

```bash
npm install
```

3. Start the Vite dev server:

```bash
npm run dev
```

4. The frontend will be served on `http://localhost:5173/` by default.

## Environment Variables

Create a `.env` file in `Day-06/Spotify/backend` with these variables (example values):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/dbname
PORT=5000
JWT_SECRET=replace_with_secure_random_value
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

Notes:
- Never commit `.env` to the repository. Use `.env.example` with placeholders instead (see next section).
- Rotate any secrets if they were previously committed.

## Secrets & Git Hygiene

- If a secret was pushed accidentally, rotate it immediately.
- To stop tracking an existing secret file:

```bash
git rm --cached Day-06/Spotify/backend/.env
git commit -m "chore(secrets): remove .env from repository"
git push
```

- To purge a secret from history (dangerous, rewrites history — requires force-push):
  - Use BFG or `git filter-repo` and then `git push --force`.

## Development Notes

- Use `src/controllers/auth.controllers.js` for authentication flows (signup/login).
- Passwords are hashed with `bcrypt` before saving.
- JWT tokens are created with `jsonwebtoken` and validated via middleware in `middlewares/`.
- Image/file uploads are handled by `multer` and/or delegated to ImageKit via `@imagekit/nodejs` (see `services/storage.services.js`).

## Troubleshooting

- Backend fails to connect to DB:
  - Confirm `MONGODB_URI` in `.env` and that network access is allowed for your IP (Atlas).
- CORS errors on frontend:
  - Ensure backend sets appropriate CORS headers (see `cors` usage in `server.js`).
- Port conflicts:
  - Check `PORT` env var and change if another service uses it.

## Next Steps (for revision)

- Add `Day-06/Spotify/backend/.env.example` with placeholders for required env keys.
- Add CI checks that prevent committing `.env` (pre-commit hook).
- Consider adding a `.dockerignore` and Dockerfiles for reproducible dev environment.

---

If you'd like, I can:

- create a `Day-06/Spotify/backend/.env.example` with placeholders,
- add `Day-06/Spotify/backend/.env` to `.gitignore` (if missing),
- commit and push the README for you.

File: [Day-06/README.md](Day-06/README.md)
# Day-06 — Spotify

Summary
-------
This folder contains the Spotify project (backend + frontend) built during Day-06. This README documents the project structure, concepts used, setup and run steps, environment variables, development notes, and troubleshooting tips so you can quickly revise the project later.

Table of contents
-----------------
- [Overview](#overview)
- [Concepts Covered](#concepts-covered)
- [Folder Structure](#folder-structure)
- [Setup & Run](#setup--run)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Environment Variables](#environment-variables)
- [Secrets & Git Hygiene](#secrets--git-hygiene)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## Overview

This project is a simple fullstack app named "Spotify" (Soundwave). It includes a Node/Express backend (with MongoDB) and a React + Vite frontend. The backend provides authentication and music upload endpoints; the frontend provides UI for signing up, logging in, browsing, and uploading.

## Concepts Covered

- Node.js + Express (API routes, middleware)
- MongoDB via Mongoose (schemas, models)
- Authentication (bcrypt password hashing, JWT)
- File uploads (multer or external storage service)
- Image/file hosting with ImageKit (used in backend deps)
- React + Vite (frontend dev server, components)
- Axios for client-server communication
- Environment variable management (`.env`)
- Basic security and git hygiene for secrets

## Folder Structure

Click any path to jump to it in this repository:

- [Day-06/Spotify](Day-06/Spotify)
  - [backend](Day-06/Spotify/backend)
    - `server.js` — app entry
    - `src/` — backend source files
      - `controllers/` — request handlers
      - `db/` — DB connection helpers
      - `middlewares/` — auth middleware, etc.
      - `models/` — Mongoose schemas
      - `services/` — storage or helper services
    - `package.json` — backend dependencies & scripts
  - [frontend](Day-06/Spotify/frontend)
    - `index.html` — Vite entry
    - `src/` — React source
      - `components/` — UI components
      - `context/` — React contexts (Auth, Player)
      - `pages/` — App pages (Albums, Browse, Upload)
    - `package.json` — frontend deps & scripts

## Setup & Run

Prerequisites
- Node.js (>=16 recommended)
- npm
- MongoDB URI (Atlas or local)

Recommended workflow (from repository root):

Backend

1. Open a terminal and go to the backend folder:

```bash
cd Day-06/Spotify/backend
```

2. Install dependencies (if not already):

```bash
npm install
```

3. Add a local `.env` file (DO NOT commit it). See the [Environment Variables](#environment-variables) section for keys.

4. Start the backend in dev mode:

```bash
npm run dev
```

The backend uses `nodemon` (script: `dev`) and runs the server defined in `server.js`.

Frontend

1. Open another terminal and go to the frontend folder:

```bash
cd Day-06/Spotify/frontend
```

2. Install dependencies (if not already):

```bash
npm install
```

3. Start the Vite dev server:

```bash
npm run dev
```

4. The frontend will be served on `http://localhost:5173/` by default.

## Environment Variables

Create a `.env` file in `Day-06/Spotify/backend` with these variables (example values):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/dbname
PORT=5000
JWT_SECRET=replace_with_secure_random_value
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

Notes:
- Never commit `.env` to the repository. Use `.env.example` with placeholders instead (see next section).
- Rotate any secrets if they were previously committed.

## Secrets & Git Hygiene

- If a secret was pushed accidentally, rotate it immediately.
- To stop tracking an existing secret file:

```bash
git rm --cached Day-06/Spotify/backend/.env
git commit -m "chore(secrets): remove .env from repository"
git push
```

- To purge a secret from history (dangerous, rewrites history — requires force-push):
  - Use BFG or `git filter-repo` and then `git push --force`.

## Development Notes

- Use `src/controllers/auth.controllers.js` for authentication flows (signup/login).
- Passwords are hashed with `bcrypt` before saving.
- JWT tokens are created with `jsonwebtoken` and validated via middleware in `middlewares/`.
- Image/file uploads are handled by `multer` and/or delegated to ImageKit via `@imagekit/nodejs` (see `services/storage.services.js`).

## Troubleshooting

- Backend fails to connect to DB:
  - Confirm `MONGODB_URI` in `.env` and that network access is allowed for your IP (Atlas).
- CORS errors on frontend:
  - Ensure backend sets appropriate CORS headers (see `cors` usage in `server.js`).
- Port conflicts:
  - Check `PORT` env var and change if another service uses it.

## Next Steps (for revision)

- Add `Day-06/Spotify/backend/.env.example` with placeholders for required env keys.
- Add CI checks that prevent committing `.env` (pre-commit hook).
- Consider adding a `.dockerignore` and Dockerfiles for reproducible dev environment.

---

If you'd like, I can:

- create a `Day-06/Spotify/backend/.env.example` with placeholders,
- add `Day-06/Spotify/backend/.env` to `.gitignore` (if missing),
- commit and push the README for you.

File: [Day-06/README.md](Day-06/README.md)
