# 📘 Day-04 — Full-Stack Blog Application

> **Date:** February 20, 2026  
> **Project:** Blog App with Image Upload (CRUD)  
> **Stack:** Node.js + Express + MongoDB + ImageKit (Backend) | React + Vite (Frontend)

---

## 🎯 Topics Covered

### 1. Backend (Node.js + Express)

#### 1.1 Express Server Setup
- Created an Express server with `app.listen()` on port **3000**
- Used `dotenv` to load environment variables from `.env`
- Structured the project with separate folders: `models/`, `services/`, `db/`

```javascript
// server.js
require('dotenv').config({ path: __dirname + '/.env' });
const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB().then(() => {
    app.listen(3000, () => console.log("Server running on port 3000"));
});
```

#### 1.2 MongoDB + Mongoose
- Connected to MongoDB using **Mongoose**
- Created a **Post schema** with fields: `title`, `image`, `caption`, `imageUrl`, `imagekitFileId`
- Used `{ timestamps: true }` to automatically add `createdAt` and `updatedAt`

```javascript
// post.model.js
const postSchema = new mongoose.Schema({
    title: String,
    image: String,         // base64 encoded image data
    caption: String,
    imageUrl: String,      // ImageKit URL for displaying
    imagekitFileId: String, // ImageKit file ID for deletion
}, { timestamps: true });
```

**Key Mongoose Methods Used:**
| Method | Purpose |
|---|---|
| `postmodel.create({...})` | Create a new document |
| `postmodel.find()` | Get all documents |
| `postmodel.findById(id)` | Find one document by ID |
| `postmodel.findByIdAndUpdate(id, data, { new: true })` | Update and return updated doc |
| `postmodel.findByIdAndDelete(id)` | Delete a document |

#### 1.3 Multer — File Upload Middleware
- Used **Multer** with `memoryStorage()` to handle file uploads in memory (as Buffer)
- `upload.any()` accepts files with **any field name** (flexible for different frontends)

```javascript
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Usage in route:
app.post('/create-post', upload.any(), async (req, res) => {
    const file = req.files && req.files[0]; // Get the uploaded file
    // file.buffer → raw file data
    // file.originalname → original filename
});
```

**Common Multer Error:**  
`MulterError: Unexpected field` → happens when the field name in form-data doesn't match. Fix: use `upload.any()` instead of `upload.single('specificName')`

#### 1.4 ImageKit — Cloud Image Storage
- Integrated **ImageKit SDK** for uploading, storing, and deleting images in the cloud
- Implemented a **fallback mechanism** when ImageKit credentials are not configured

```javascript
// Upload — returns { url, fileId }
async function uploadImage(file) {
    const response = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: file.originalname,
    });
    return { url: response.url, fileId: response.fileId };
}

// Delete — removes from ImageKit cloud
async function deleteImage(fileId) {
    await imagekit.deleteFile(fileId);
}
```

**Key Concept:** Save the `fileId` during upload so you can delete the image later!

#### 1.5 Helmet — Security Headers
- Used **Helmet** to set secure HTTP headers
- Configured **Content Security Policy (CSP)** to allow specific connections

```javascript
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "http://localhost:3000", "https://api.imagekit.io"],
            imgSrc: ["'self'", "https://ik.imagekit.io", "data:"],
        },
    },
}));
```

#### 1.6 CORS — Cross-Origin Resource Sharing
- Installed `cors` package to allow the React frontend (port 5173) to call the backend (port 3000)
- Without CORS, the browser blocks requests between different origins

```javascript
app.use(cors({ origin: 'http://localhost:5173' }));
```

#### 1.7 RESTful API Routes (CRUD)

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/create-post` | **C**reate — Upload image + save post |
| `GET` | `/posts` | **R**ead — Get all posts |
| `PUT` | `/update-post/:id` | **U**pdate — Edit title/caption, optionally replace image |
| `DELETE` | `/delete-post/:id` | **D**elete — Remove from DB + ImageKit cloud |

**Delete Flow:**
```
1. Find post by ID → get imagekitFileId
2. Delete image from ImageKit cloud (using fileId)
3. Delete post from MongoDB
```

**Update Flow (with new image):**
```
1. Find existing post
2. Delete OLD image from ImageKit cloud
3. Upload NEW image to ImageKit
4. Update post in MongoDB with new imageUrl + fileId
```

---

### 2. Frontend (React + Vite)

#### 2.1 Vite Project Setup
- Scaffolded React project with `npx create-vite@latest`
- Faster than Create React App (CRA) — uses ES modules for instant hot reload

```bash
# Run frontend
cd Frontend && npm run dev    # starts at http://localhost:5173
```

#### 2.2 React Router DOM — Client-Side Routing
- Installed `react-router-dom` for navigation without page reload
- Used `BrowserRouter`, `Routes`, `Route`, `NavLink`, `Navigate`, `useNavigate`

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <nav>
                <NavLink to="/posts">Posts</NavLink>
                <NavLink to="/create">+ Create</NavLink>
            </nav>
            <Routes>
                <Route path="/posts" element={<ViewPosts />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="*" element={<Navigate to="/posts" />} />
            </Routes>
        </BrowserRouter>
    );
}
```

**Key Concepts:**
- `NavLink` → like `<a>` but adds `.active` class automatically
- `Navigate` → redirect to another route
- `useNavigate()` → programmatic navigation (e.g., redirect after form submit)

#### 2.3 Axios — HTTP Client
- Used **Axios** instead of `fetch()` for cleaner API calls
- Created a centralized API service layer

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
});

export const createPost = async ({ title, description, file }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('caption', description);
    return (await api.post('/create-post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })).data;
};

export const fetchPosts = async () => (await api.get('/posts')).data;
export const updatePost = async (id, { title, caption, file }) => { /* ... */ };
export const deletePost = async (id) => (await api.delete(`/delete-post/${id}`)).data;
```

#### 2.4 React Hooks Used

| Hook | Purpose | Example |
|---|---|---|
| `useState` | Manage component state | `const [posts, setPosts] = useState([])` |
| `useEffect` | Run side-effects (API calls) | `useEffect(() => { loadPosts() }, [])` |
| `useNavigate` | Redirect after action | `navigate('/posts')` |

#### 2.5 Form Handling + File Upload
- Used `FormData` to send multipart/form-data (required for file uploads)
- Image preview using `URL.createObjectURL(file)`
- Loading, success, and error states

```jsx
// Image preview
const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file)); // creates temporary URL for preview
};
```

#### 2.6 Component Architecture

```
src/
├── App.jsx                  → Router + Navbar (layout)
├── main.jsx                 → Entry point (renders App)
├── index.css                → All styles (CSS variables, dark theme)
├── pages/
│   ├── CreatePost.jsx       → Form page (create new post)
│   └── ViewPosts.jsx        → Gallery page (view all + delete/edit)
├── components/
│   ├── PostCard.jsx         → Reusable card (image + title + caption + buttons)
│   └── EditPostModal.jsx    → Modal for editing posts
└── services/
    └── api.js               → Axios API layer
```

#### 2.7 State Management Patterns
- **Optimistic UI update** — Remove card from state immediately on delete (don't wait for re-fetch)
- **Modal state** — `editingPost` state controls if the edit modal is visible and which post it's editing

```javascript
// Delete: remove from state immediately
const handleDelete = async (id) => {
    await deletePost(id);
    setPosts(prev => prev.filter(post => post.id !== id));
};

// Update: merge updated data into state
const handleSave = async (id, data) => {
    const result = await updatePost(id, data);
    setPosts(prev => prev.map(post =>
        post.id === id ? { ...post, ...result.post } : post
    ));
};
```

---

### 3. CSS & Design Concepts

#### 3.1 CSS Variables (Design Tokens)
```css
:root {
    --bg-primary: #0a0a0f;
    --accent: #6c5ce7;
    --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    /* ... */
}
```

#### 3.2 Glassmorphism (Navbar)
```css
.navbar {
    background: rgba(10, 10, 15, 0.85);
    backdrop-filter: blur(16px);
}
```

#### 3.3 Modal Pattern
```css
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(6px);
    z-index: 1000;
}
```

#### 3.4 Responsive Grid
```css
.posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}
```

---

### 4. Environment Variables

```env
# .env (inside backend/ folder)
IMAGEKIT_PUBLIC_KEY="your_public_key"
IMAGEKIT_PRIVATE_KEY="your_private_key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id"
```

**Important:** Always wrap values with special characters (`/`, `=`, `+`) in double quotes!

---

### 5. Key NPM Packages

#### Backend
| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `multer` | File upload handling |
| `imagekit` | Cloud image storage |
| `helmet` | Security headers |
| `cors` | Cross-origin requests |
| `dotenv` | Environment variables |

#### Frontend
| Package | Purpose |
|---|---|
| `react` | UI library |
| `react-dom` | DOM rendering |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP client |
| `vite` | Build tool + dev server |

---

### 6. Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `EADDRINUSE: port 3000` | Another server already running | Kill with `lsof -ti:3000 \| xargs kill -9` |
| `MulterError: Unexpected field` | Field name mismatch | Use `upload.any()` |
| `CORS error` | Frontend on different origin | Add `cors({ origin: 'http://localhost:5173' })` |
| `Cannot find module` | Package not installed | Run `npm install` |
| `dotenv not loading` | Wrong path to .env | Use `path: __dirname + '/.env'` |

---

## 🚀 How to Run

```bash
# Terminal 1 — Backend
cd Day-04/Blog-app/backend
node server.js
# → http://localhost:3000

# Terminal 2 — Frontend
cd Day-04/Blog-app/Frontend
npm run dev
# → http://localhost:5173
```

---

## 📁 Project Structure

```
Day-04/
└── Blog-app/
    ├── .env                          # ImageKit credentials
    ├── backend/
    │   ├── server.js                 # Entry point + DB connection
    │   ├── package.json
    │   └── src/
    │       ├── app.js                # Routes + middleware
    │       ├── db/
    │       │   └── db.js             # MongoDB connection
    │       ├── models/
    │       │   └── post.model.js     # Mongoose schema
    │       └── services/
    │           └── storage.service.js # ImageKit upload/delete
    └── Frontend/
        ├── index.html
        ├── package.json
        ├── vite.config.js
        └── src/
            ├── App.jsx               # Router + Navbar
            ├── main.jsx              # Entry point
            ├── index.css             # Dark theme styles
            ├── pages/
            │   ├── CreatePost.jsx    # Create form
            │   └── ViewPosts.jsx     # Posts grid + CRUD
            ├── components/
            │   ├── PostCard.jsx      # Post card with edit/delete
            │   └── EditPostModal.jsx # Edit modal
            └── services/
                └── api.js            # Axios API layer
```

---

## ✅ Key Takeaways

1. **Multer** handles file uploads — use `memoryStorage()` + `upload.any()` for flexibility
2. **ImageKit** stores images in the cloud — always save **fileId** for future deletion
3. **CORS** is mandatory when frontend and backend run on different ports
4. **Helmet** adds security headers — configure CSP to allow your trusted domains
5. **React Router** enables SPA navigation without page reloads
6. **Axios** is cleaner than `fetch()` — use a centralized API service layer
7. **FormData** is required for sending files from frontend to backend
8. **Optimistic UI** — update state immediately for snappy user experience
9. **CSS Variables** — define design tokens once, reuse everywhere
10. **Always delete from cloud first, then database** — prevents orphaned files
