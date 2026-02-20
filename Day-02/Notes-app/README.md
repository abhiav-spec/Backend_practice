# Backend Series - Day 02: Notes App (Express + Static Frontend)

Welcome to Day 02 of the Backend Development Series! Today we connect a minimal Express backend to a static frontend and test the REST API using Postman.

## 📚 What this project is

A tiny Notes application demonstrating:

- An Express backend with simple CRUD routes
- A static frontend served by Express that uses `fetch()` to call the API
- Basic API testing using Postman

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

## 📋 What you implemented (today)

- `express.json()` middleware to parse JSON bodies
- `GET /notes` — returns notes array
- `POST /notes` — pushes a new note into in-memory array
- `PATCH /notes/:id` — updates a note's `description`
- `DELETE /notes/:id` — deletes an entry (currently leaves a null/undefined slot)
- Static serving: `app.use(express.static('public'))` so `http://localhost:3000` serves the frontend

## 🧠 Key Concepts & Notes

- In-memory storage: `const notes = []` — ephemeral during development
- IDs: this app currently uses array indices as IDs; deleting with `delete notes[index]` creates sparse arrays (we handle this on the frontend by skipping null/undefined entries)
- Status codes: `201` for creation, `200` for success responses
- Frontend uses same-origin fetch calls (no CORS required)

## 🛠️ Installation & Run

Prerequisites: Node.js and npm

Install dependencies
```bash
cd /Users/abhinavmishra/Desktop/Backend_practice/Notes-app
npm install
```

Start server
```bash
node Server.js
```

Open the frontend
```
http://localhost:3000
```

Optional: add start script and run `npm start`, or `npx nodemon Server.js` for development auto-reload.

## 🔁 REST API Quick Reference

GET /notes
Response: 200 `{ message, notes: [...] }`

POST /notes
Body: `{ title, description }`
Response: 201 `{ message, note }`

PATCH /notes/:id
Body: `{ description }`
Response: 200 `{ message, note }`

DELETE /notes/:id
Response: 200 `{ message, note }` (deleted slot may be undefined)

## 🧪 Testing with Postman (recommended)

Create Environment Notes App (local) with variable baseUrl = http://localhost:3000.

Create a Collection Notes App and add these saved requests:
- GET `{{baseUrl}}/notes`
- POST `{{baseUrl}}/notes` (Content-Type: application/json)
- PATCH `{{baseUrl}}/notes/:id` (replace `:id`)
- DELETE `{{baseUrl}}/notes/:id`

Example POST body:
```json
{ "title": "Buy milk", "description": "2 liters" }
```


---

## CRUD Mapping (Detailed)

Below is a concise mapping between CRUD operations and the routes implemented in this project, plus small server-side examples.

- Create (C) — `POST /notes`:
	- Client: send JSON body with `title` and `description`.
	- Server example:
		```javascript
		app.post('/notes', (req, res) => {
			notes.push(req.body);
			res.status(201).json({ message: 'Note created successfully', note: req.body });
		});
		```

- Read (R) — `GET /notes` (list) and optionally `GET /notes/:id` (single):
	- Client: request the list to render all notes.
	- Server example (list):
		```javascript
		app.get('/notes', (req, res) => {
			res.status(200).json({ message: 'Notes retrieved successfully', notes: notes });
		});
		```

- Update (U) — `PATCH /notes/:id` (partial) or `PUT /notes/:id` (replace):
	- Client: send the fields to change (e.g. `{ description: 'new text' }`).
	- Server example (partial update):
		```javascript
		app.patch('/notes/:id', (req, res) => {
			const index = Number(req.params.id);
			if (!notes[index]) return res.status(404).json({ message: 'Note not found' });
			if (req.body.description !== undefined) notes[index].description = req.body.description;
			res.status(200).json({ message: 'Note updated successfully', note: notes[index] });
		});
		```

- Delete (D) — `DELETE /notes/:id`:
	- Client: call the endpoint to remove a note.
	- Server example (current implementation):
		```javascript
		app.delete('/notes/:id', (req, res) => {
			const index = Number(req.params.id);
			console.log(notes[index]);
			delete notes[index]; // leaves a sparse slot
			res.status(200).json({ message: 'Note deleted successfully', note: notes[index] });
		});
		```

Notes on mapping:
- `PATCH` is for partial updates (update one or more fields). `PUT` would replace the whole resource.
- Using array indices as IDs is simple but fragile — deleting with `delete` leaves empty slots. Consider adding stable `id` fields and deleting via `splice` or filtering for production.

---

## Using `nodemon` for development

`nodemon` automatically restarts the server when source files change — useful in development.

- Install locally (recommended) and add a dev script:
	```bash
	npm install --save-dev nodemon
	npm pkg set-script dev "nodemon Server.js"
	npm run dev
	```

- Or run without installing globally using `npx`:
	```bash
	npx nodemon Server.js
	```

- Example workflow with `nodemon` running:
	- Open the frontend: `http://localhost:3000`
	- Create a note (POST /notes) from the UI or Postman; `nodemon` keeps the server running while you change code.
	- Edit server code (e.g., improve validation) and save — `nodemon` restarts the server automatically.

---

## Quick curl examples (for manual testing)

- List notes (GET):
	```bash
	curl -i http://localhost:3000/notes
	```

- Create note (POST):
	```bash
	curl -X POST -H "Content-Type: application/json" -d '{"title":"Buy milk","description":"2 liters"}' http://localhost:3000/notes
	```

- Patch note (PATCH):
	```bash
	curl -X PATCH -H "Content-Type: application/json" -d '{"description":"Updated"}' http://localhost:3000/notes/0
	```

- Delete note (DELETE):
	```bash
	curl -X DELETE http://localhost:3000/notes/0
	```

Use the Collection Runner for end-to-end flows and save example responses for documentation.


---

## 📶 HTTP Status Codes — What they mean

HTTP responses include a numeric status code that indicates the result of the request. Below are the most relevant codes for this project, with a short explanation and when you'll see them in this app.

- **200 OK** — The request succeeded. Used for successful reads, updates and deletes when the server returns a body.
	- Example: `GET /notes` returns `200` with the notes array.

- **201 Created** — The request succeeded and a new resource was created.
	- Example: `POST /notes` returns `201` and the created note in the response body.

- **204 No Content** — The request succeeded but there is no response body. Useful for delete endpoints that don't return content.
	- Note: this app currently returns JSON for deletes (status `200`), but you may choose `204` for a cleaner REST convention.

- **400 Bad Request** — The client sent invalid data (malformed JSON or missing required fields).
	- When to use: validate `req.body` and return `400` if required properties are missing.

- **401 Unauthorized** — The request requires authentication and the client did not provide valid credentials.
	- Not used in this simple app, but important when you add authentication.

- **403 Forbidden** — The server understood the request but refuses to authorize it.
	- Use when a logged-in user tries to access a resource they don't own.

- **404 Not Found** — The requested resource doesn't exist.
	- Example: requesting `GET /notes/999` where note `999` does not exist should return `404`.

- **500 Internal Server Error** — A generic server error indicates an unhandled exception or bug.
	- Use logging to capture stack traces and return a friendly `500` response while investigating server-side issues.

Good practice tips:
- Return the most specific and correct status code for each outcome — this makes debugging and automated testing (Postman, curl) simpler.
- Include a helpful JSON body with `message` (and optionally `error` details in development) when returning non-2xx responses.

## ✅ Improvements to make next

- Use stable unique `id` fields for notes (avoid index-based IDs)
- Replace `delete notes[index]` with `notes.splice(index,1)` or filter by id to remove items
- Persist notes to disk or DB (lowdb, SQLite, MongoDB) so data survives restarts
- Add validation and proper 404/400 responses for robustness
- Improve frontend UX: inline editing, delete confirmation, error messages

## 🎓 Summary

Day 02 connects a UI to an Express API and reinforces CRUD + REST concepts. The repository includes runnable code and Postman guidance so you can re-test and learn iteratively.

Happy coding! 🎉


s4zwZPzsVH8OQOAh
mongodb+srv://yt-backend:s4zwZPzsVH8OQOAh@cluster0.44glwqd.mongodb.net/
