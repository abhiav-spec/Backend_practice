# Backend Series - Day 02: Notes App (Express + Static Frontend)

Welcome to Day 02 of the Backend Development Series! Today we connect a minimal Express backend to a static frontend and test the REST API using Postman.

---

## 📚 What this project is

A tiny Notes application demonstrating:

- An Express backend with simple CRUD routes
- A static frontend served by Express that uses `fetch()` to call the API
- Basic API testing using Postman

---

## 🚀 Project Structure
```
Notes-app/
├── Server.js        # Main server with route handlers
├── package.json     # Project metadata and dependencies
├── src/
│   └── app.js       # Express app instance (serves static files)
├── public/          # Static frontend served by Express
│   ├── index.html
│   ├── style.css
│   └── main.js
└── README.md        # This file
```

---

## 📋 What you implemented (today)

- `express.json()` middleware to parse JSON bodies
- `GET /notes` — returns notes array
- `POST /notes` — pushes a new note into in-memory array
- `PATCH /notes/:id` — updates a note's `description`
- `DELETE /notes/:id` — deletes an entry (currently leaves a null/undefined slot)
- Static serving: `app.use(express.static('public'))` so `http://localhost:3000` serves the frontend

---

## 🧠 Key Concepts & Notes

- In-memory storage: `const notes = []` — ephemeral during development
- IDs: this app currently uses array indices as IDs; deleting with `delete notes[index]` creates sparse arrays (we handle this on the frontend by skipping null/undefined entries)
- Status codes: `201` for creation, `200` for success responses
- Frontend uses same-origin fetch calls (no CORS required)

---

## 🛠️ Installation & Run

Prerequisites: Node.js and npm

1. Install dependencies
```bash
cd /Users/abhinavmishra/Desktop/Backend_practice/Notes-app
npm install
```

2. Start server
```bash
node Server.js
```

3. Open the frontend
```
http://localhost:3000
```

Optional: add `start` script and run `npm start`, or `npx nodemon Server.js` for development auto-reload.

---

## 🔁 REST API Quick Reference

- GET /notes
  - Response: `200` `{ message, notes: [...] }`
- POST /notes
  - Body: `{ title, description }`
  - Response: `201` `{ message, note }`
- PATCH /notes/:id
  - Body: `{ description }`
  - Response: `200` `{ message, note }`
- DELETE /notes/:id
  - Response: `200` `{ message, note }` (deleted slot may be `undefined`)

---

## 🧪 Testing with Postman (recommended)

1. Create Environment `Notes App (local)` with variable `baseUrl = http://localhost:3000`.
2. Create a Collection `Notes App` and add these saved requests:
   - `GET {{baseUrl}}/notes`
   - `POST {{baseUrl}}/notes` (Content-Type: application/json)
   - `PATCH {{baseUrl}}/notes/:id` (replace `:id`)
   - `DELETE {{baseUrl}}/notes/:id`
3. Example POST body:
```json
{ "title": "Buy milk", "description": "2 liters" }
```
4. Use the Collection Runner for end-to-end flows and save example responses for documentation.

---

## ✅ Improvements to make next

- Use stable unique `id` fields for notes (avoid index-based IDs)
- Replace `delete notes[index]` with `notes.splice(index,1)` or filter by `id` to remove items
- Persist notes to disk or DB (lowdb, SQLite, MongoDB) so data survives restarts
- Add validation and proper `404`/`400` responses for robustness
- Improve frontend UX: inline editing, delete confirmation, error messages

---

## 🎓 Summary

Day 02 connects a UI to an Express API and reinforces CRUD + REST concepts. The repository includes runnable code and Postman guidance so you can re-test and learn iteratively.

Happy coding! 🎉
