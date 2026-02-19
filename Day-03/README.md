# Day-03 — Notes API

This repository contains a small Notes API implemented with Express and Mongoose (MongoDB). This README collects the implementation details, concepts from basic to advanced, and the most important commands for quick revisit.

## Project Overview

- Simple REST API to create, read, update, and delete notes.
- Uses Express for routing and request handling.
- Uses Mongoose to connect to a MongoDB Atlas cluster and define the `Note` model.

## Files of interest

- `server.js` — starts the server and initializes DB connection.
- `src/app.js` — Express application, route handlers for `/notes`.
- `src/db/db.js` — Mongoose connection helper.
- `src/db/models/note.model.js` — Mongoose schema and model for notes.

## Prerequisites

- Node.js (v16+ recommended)
- npm (comes with Node)
- MongoDB Atlas account (or local MongoDB)
- (Optional) MongoDB Compass for visual DB browsing

## Setup

1. Install dependencies from the `Day-03` folder:

```bash
cd Day-03
npm install
```

2. Configure MongoDB connection. Recommended: use an environment variable `MONGODB_URI` rather than hard-coding credentials.

Create a `.env` file (do not commit it):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/try?retryWrites=true&w=majority
PORT=3000
```

(If you don't use `.env` yet, `src/db/db.js` currently contains the connection URI inline.)

3. Start the server:

```bash
node server.js
# or from workspace root
node Day-03/server.js
```

For development install `nodemon` and run:

```bash
npm i -D nodemon
npx nodemon server.js
```

## Important Commands (quick)

- Install dependencies: `npm install`
- Start server: `node server.js` (or `node Day-03/server.js`)
- Start with nodemon: `npx nodemon server.js`
- Create note (curl):

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"title":"test","description":"desc"}' \
  http://localhost:3000/notes
```

- List notes:

```bash
curl http://localhost:3000/notes
```

- Delete note:

```bash
curl -X DELETE http://localhost:3000/notes/<id>
```

- Update note (patch):

```bash
curl -X PATCH -H "Content-Type: application/json" \
  -d '{"title":"new title"}' \
  http://localhost:3000/notes/<id>
```

## API Endpoints

- `POST /notes` — create a note. Body: `{ title, description }`.
- `GET /notes` — retrieve all notes.
- `PATCH /notes/:id` — update a note by id.
- `DELETE /notes/:id` — delete a note by id.

Successful responses include a `message` and the `note` or `notes` payload.

## Data Model (Mongoose)

`src/db/models/note.model.js` defines:

```js
const noteSchema = new mongoose.Schema({
  title: String,
  description: String,
});
const notemodel = mongoose.model('Note', noteSchema);
```

- This is a minimal schema — validation and types can be added for production.

## Concepts — Basic to Advanced

- Basic
  - Express app: create `app` with `express()`, use `express.json()` to parse JSON bodies, define route handlers, and export `app`.
  - Mongoose connect: call `mongoose.connect(uri)` to establish DB connection before starting server.
  - CRUD with Mongoose: use `Model.create()`, `Model.find()`, `Model.findByIdAndUpdate()`, `Model.findByIdAndDelete()`.
  - Async/await: route handlers are `async` and use `try/catch` for error handling.

- Intermediate
  - Error handling: return meaningful HTTP status codes (201, 200, 404, 500). Use a centralized error handler for larger apps.
  - Environment variables: move sensitive values to `process.env` and use a `.env` file plus `dotenv` in `server.js` or `db.js`.
  - Model validation: add required fields and types in the Mongoose schema to validate input.
  - Logging: use `console.log` for small apps; use `winston` or `pino` for structured logs in production.

- Advanced
  - Connection resilience: add retry logic and connection options (e.g., `useNewUrlParser`, `useUnifiedTopology` — note some options are default in newer mongoose versions). Handle `mongoose.connection.on('error')` and `on('disconnected')`.
  - Pagination & indexing: implement `.limit()` and `.skip()` for lists and add indexes for search.
  - Validation middleware: use `celebrate` or `joi` to validate request bodies before hitting controllers.
  - Security hardening: use `helmet`, `express-rate-limit`, sanitize inputs, and avoid exposing stack traces in production.
  - Testing: write unit tests for routes (supertest) and mock Mongoose with `mongodb-memory-server` for CI-friendly tests.

## MongoDB Atlas & Compass Notes

- Database may not appear in Compass until the first collection/document is created — write data first and refresh Compass.
- Make sure your Atlas cluster's Network Access allows your IP (or 0.0.0.0/0 for testing, not recommended for production).
- Use the same connection string as in your app (SRV format or standard connection).

## Common Errors & Debugging

- `MODULE_NOT_FOUND`: wrong working directory when running `node`, or incorrect `require` path. Run from the folder containing `server.js` or provide the correct path.
- `MongoServerSelectionError` / connection errors: check `MONGODB_URI`, internet access, Atlas whitelist, and DNS/SRV support.
- Authentication errors: invalid user/password or using the wrong DB in the connection string.
- Empty DB in Compass: refresh after creating a document; ensure you are connected to the same cluster and database name.

## Quick Tips & Improvements

- Move the hard-coded MongoDB URI into `process.env.MONGODB_URI` and add `.env` to `.gitignore`.
- Add `package.json` scripts for convenience:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

- Add request validation and centralized error handling middleware.
- Add unit/integration tests and a CI pipeline.

## References

- Express: https://expressjs.com/
- Mongoose: https://mongoosejs.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- MongoDB Compass: https://www.mongodb.com/products/compass

---


