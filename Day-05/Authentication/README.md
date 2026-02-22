# 🔐 Day-05: Authentication API — Revision Notes

> Ye notes padho toh poora project yaad aa jaaye — step by step, concept by concept.

---

## 🧭 The Big Picture — How Everything Connects

```
User (Postman) → server.js → app.js → routes → controller → model → MongoDB
                    ↓
              Loads .env       Middleware      Business      Schema     Database
              Connects DB      (JSON,         Logic         Shape      (Atlas)
              Starts Port      Cookies)       (Register)    (User)
```

**Yaad rakho:** Request left se right jaata hai. Har file ka ek kaam hai. Koi file skip nahi hoti.

---

## 📁 Project Ka Folder Structure — Kaun Kya Karta Hai

```
Authentication/
├── server.js              → 🚀 STARTING POINT: yahi file run hoti hai
├── package.json           → 📦 Dependencies list (kya install kiya)
└── src/
    ├── .env               → 🔑 SECRETS: DB password, JWT secret, Port
    ├── app.js             → ⚙️  EXPRESS CONFIG: middleware + routes jodna
    ├── db/
    │   └── db.js          → 🗄️  DATABASE CONNECTION: MongoDB se connect
    ├── models/
    │   └── user.model.js  → 📐 SCHEMA: User ka shape (username, email, password)
    ├── routes/
    │   ├── auth.routes.js → 🛣️  URL MAP: /register → controller function
    │   └── post.routes.js → 🛣️  URL MAP: /create → post handler
    └── controllers/
        └── auth.controllers.js → 🧠 LOGIC: register kaise kaam kare
```

---

## Step 1: `.env` — Secrets Ko Safe Rakhna

### ❓ Kyun?
Password, secret keys directly code mein likhoge toh GitHub pe sabko dikh jaayega.

### 📝 Kya likha:
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=my_super_secret_key
```

### 🧠 Yaad Rakho:
- `.env` file kabhi GitHub pe push mat karo → `.gitignore` mein daalo
- Access kaise karte hain → `process.env.PORT`, `process.env.JWT_SECRET`
- `dotenv` package load karta hai ye values → `dotenv.config({ path: "./src/.env" })`

---

## Step 2: `db.js` — MongoDB Se Connection

### ❓ Kyun?
Bina database connection ke data save/read nahi hoga.

### 📝 Kya likha:
```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);    // ❌ DB nahi mila toh server band karo
    }
};

module.exports = connectDB;
```

### 🧠 Yaad Rakho:
- `mongoose.connect()` — async hai, `await` lagao
- `process.exit(1)` — agar DB fail ho toh server chalne ka matlab nahi
- **Local MongoDB** → `mongodb://127.0.0.1:27017/dbname`
- **Atlas (Cloud)** → `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### ⚠️ Error jo aaya tha:
```
ECONNREFUSED 127.0.0.1:27017
```
**Matlab:** Local MongoDB chal nahi raha. **Fix:** Atlas use karo ya local MongoDB start karo.

---

## Step 3: `user.model.js` — Data Ka Shape Define Karna

### ❓ Kyun?
MongoDB ko batana padta hai ki user ka data kaisa dikhega — kaunse fields, kya type, kya rule.

### 📝 Kya likha:
```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,     // ← Bina iske user nahi bn sakta
        unique: true,       // ← Same username dobara nahi bn sakta
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
```

### 🧠 Yaad Rakho:
- `required: true` → field dena zaroori hai, nahi toh error
- `unique: true` → MongoDB mein INDEX banta hai, duplicate allow nahi
- `mongoose.model("User", schema)` → collection name automatically `users` ban jaata hai (lowercase + plural)
- **IMPORTANT:** `unique: true` sirf index hai, friendly error nahi deta → controller mein khud check karo

---

## Step 4: `auth.routes.js` — URL Ka Map

### ❓ Kyun?
Express ko batana padta hai ki kaunsa URL aaye toh kya karo.

### 📝 Kya likha:
```javascript
const express = require("express");
const authControllers = require("../controllers/auth.controllers");

const router = express.Router();

router.post("/register", authControllers.registeruser);
//     ^^^^               ^^^^^^^^^^^^^^^^^^^^^^^^^^
//     Method              Controller function
//     (POST)              (kya karna hai)

module.exports = router;
```

### 🧠 Yaad Rakho — URL Kaise Banta Hai:
```
app.use("/api/auth", authRoutes)   →  Mount path
router.post("/register", ...)       →  Route path
                                    ─────────────
Final URL:  POST /api/auth/register
```

### ⚠️ Error jo aaya tha:
```
"Cannot GET /api/auth/register"
```
**Matlab:** Route hai POST par tum GET bhej rahe ho! **Fix:** Postman mein method dropdown GET → POST karo.

---

## Step 5: `auth.controllers.js` — Business Logic (Dimag)

### ❓ Kyun?
Route sirf URL map karta hai. Actual kaam (user banana, token banana, cookie set karna) controller mein hota hai.

### 📝 Full Flow — Register User:

```javascript
async function registeruser(req, res) {
    try {
        // ① INPUT NIKALO — body se username, email, password lo
        const { username, email, password } = req.body;

        // ② VALIDATE — sab fields aaye ki nahi?
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields required" });
        }                  // ^^^^ 400 = Bad Request

        // ③ DUPLICATE CHECK — pehle se toh nahi hai ye user?
        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }]
        });    // ^^^ $or = email YA username — koi bhi match ho toh true

        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }                  // ^^^^ 409 = Conflict

        // ④ USER BANAO — new Model + save (Mongoose v9 way)
        const user = new userModel({ username, email, password });
        await user.save();

        // ⑤ TOKEN BANAO — JWT sign karo
        const token = jwt.sign(
            { id: user._id },           // Payload: kya store karna hai
            process.env.JWT_SECRET,     // Secret: sign karne ke liye
            { expiresIn: "1h" }        // Expiry: 1 ghante baad khatam
        );

        // ⑥ COOKIE SET KARO — browser/Postman ko token bhejo
        res.cookie("token", token, {
            httpOnly: true,     // JS access nahi kar sakta (safe from XSS)
            secure: false,      // false = HTTP pe chale (localhost ke liye)
            sameSite: "strict", // CSRF protection
            maxAge: 3600000,    // 1 hour in milliseconds
        });

        // ⑦ RESPONSE BHEJO
        res.status(201).json({ message: "User registered", token, user });
                   // ^^^^ 201 = Created successfully

    } catch (error) {
        // ⑧ KUCH BHI FAIL HO TOH
        res.status(500).json({ error: error.message });
                   // ^^^^ 500 = Server Error
    }
}
```

### 🧠 Yaad Rakho — Register ka Flow:
```
Input nikalo → Validate → Duplicate check → User save → Token banao → Cookie set → Response
```

---

## Step 6: `app.js` — Sab Kuch Jodna (Glue File)

### ❓ Kyun?
Middleware lagana, routes mount karna, 404 handler — sab yahan hota hai.

### 📝 Kya likha:
```javascript
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const cookieParser = require("cookie-parser");

const app = express();

// ① MIDDLEWARE — request aane se pehle process karo
app.use(express.json());      // Body ka JSON parse karo
app.use(cookieParser());      // Cookies parse karo

// ② DEBUG LOGGER — har request terminal mein dikhe
app.use((req, res, next) => {
    console.log(`→ ${req.method} ${req.originalUrl}`);
    next();   // ← IMPORTANT: next() nahi bola toh request aage nahi jaayega!
});

// ③ ROUTES MOUNT — URL path se file jodo
app.use("/api/auth", authRoutes);   // /api/auth/register
app.use("/api/post", postRoutes);   // /api/post/create

// ④ 404 HANDLER — koi unknown URL aaye toh
app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

module.exports = app;
```

### 🧠 Yaad Rakho — ORDER MATTERS! 🚨
```
1. express.json()      ← PEHLE (body parse hona chahiye routes se pehle)
2. cookieParser()      ← PEHLE (cookies parse honi chahiye)
3. Debug logger        ← PEHLE (sab requests log ho)
4. Routes              ← BEECH mein
5. 404 handler         ← SABSE LAST (jo kisi route se match na kare)
```

Agar order ulta kiya toh kaam nahi karega!

---

## Step 7: `server.js` — Sab Start Karo

### 📝 Kya likha:
```javascript
const dotenv = require("dotenv");
dotenv.config({ path: "./src/.env" });  // ① .env load karo

const app = require("./src/app");        // ② Express app laao
const connectDB = require("./src/db/db"); // ③ DB connection function laao

const PORT = process.env.PORT || 3000;

// ④ Pehle DB connect karo, phir server start karo
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
```

### 🧠 Yaad Rakho:
- `.env` sabse pehle load hona chahiye — baaki sab files isko use karti hain
- DB connection **pehle** hona chahiye, server **baad mein** start hona chahiye
- `node server.js` — yahi command run karte ho

---

## 🎯 HTTP Status Codes — Quick Cheat Sheet

```
✅ 200 — OK (sab theek, data mil gaya)
✅ 201 — Created (naya resource ban gaya, jaise new user)
❌ 400 — Bad Request (tumne galat data bheja)
🔒 401 — Unauthorized (login nahi kiya / token nahi hai)
🚫 404 — Not Found (ye URL exist nahi karta)
⚡ 409 — Conflict (duplicate data, user pehle se hai)
💥 500 — Server Error (server mein kuch toot gaya)
```

---

## 🍪 Cookies vs JWT — Kya Fark Hai?

```
JWT Token = 🎫 Ek ticket jo prove karta hai "main kaun hoon"
Cookie    = 📦 Dabba jisme ticket (JWT) rakhte hain

JWT banana  → jwt.sign({ id: user._id }, secret, { expiresIn: "1h" })
JWT check   → jwt.verify(token, secret)
Cookie mein JWT rakhna → res.cookie("token", jwtToken, { httpOnly: true })
Cookie se JWT nikalna  → req.cookies.token
```

### Cookie Options Explained:
```
httpOnly: true   → Browser ka JS access nahi kar sakta (XSS safe)
secure: false    → HTTP pe bhi chale (localhost ke liye false, production mein true)
sameSite: strict → Doosri site se request aaye toh cookie na bheje (CSRF safe)
maxAge: 3600000  → 1 hour baad expire (1000ms × 60s × 60min)
```

---

## ⚠️ Errors Jo Aaye The — Aur Kaise Fix Kiye

### 1. `Cannot find module 'server.js'`
```
❓ Kyun: server.js file exist nahi thi us folder mein
✅ Fix: server.js file banayi Authentication/ folder mein
📌 Lesson: Jis folder se `node server.js` run karo, us mein file honi chahiye
```

### 2. `ECONNREFUSED 127.0.0.1:27017`
```
❓ Kyun: Local MongoDB chal nahi raha tha
✅ Fix: MongoDB Atlas (cloud) ka connection string use kiya
📌 Lesson: Atlas free hai, local install ki zaroorat nahi
```

### 3. `Cannot GET /api/auth/register`
```
❓ Kyun: Postman mein GET method tha, route POST hai
✅ Fix: Postman mein method GET → POST karo
📌 Lesson: Route ka method (GET/POST) aur Postman ka method MATCH hona chahiye
```

### 4. `userModel.create is not a function`
```
❓ Kyun: user.model.js file empty thi / Mongoose v9 mein .create() change hua
✅ Fix: new userModel() + .save() use kiya
📌 Lesson: Mongoose v9: new Model() + save() ✅ | Model.create() ❌
```

### 5. Cookie Postman mein nahi dikh raha tha
```
❓ Kyun: secure: true tha, localhost HTTP hai (HTTPS nahi)
✅ Fix: secure: false kiya
📌 Lesson: secure: true = sirf HTTPS. Localhost pe false rakho.
```

### 6. Same email/username se dobara register ho raha tha
```
❓ Kyun: unique: true sirf index hai, error friendly nahi
✅ Fix: Controller mein findOne() se pehle check kiya
📌 Lesson: Schema level validation + Controller level check — dono karo
```

### 7. Old server port pe stuck tha
```
❓ Kyun: Puraane node processes band nahi hue the
✅ Fix: lsof -ti:3000 | xargs kill -9
📌 Lesson: Code change karo → server restart karo. Ya use karo: npx nodemon server.js
```

---

## 📮 Postman Mein Kaise Test Karo

### Register User
```
Method:  POST  ← (GET nahi!)
URL:     http://localhost:3000/api/auth/register
Headers: Content-Type: application/json
Body:    raw → JSON

{
    "username": "abhinav",
    "email": "abhinav@test.com",
    "password": "secure123"
}

✅ Success (201): { "message": "User registered successfully", "token": "...", "user": {...} }
❌ Duplicate (409): { "error": "User with this email or username already exists" }
❌ Missing fields (400): { "error": "username, email, and password are required" }
```

### Create Post (Protected Route)
```
Method:  POST
URL:     http://localhost:3000/api/post/create
Headers: Content-Type: application/json
Note:    Pehle register karo — cookie automatically set ho jaayega

✅ With token: { "message": "Post created successfully" }
🔒 Without token: { "error": "Unauthorized" }
```

---

## 📦 Packages Installed — Kya Kyun

```
npm install express        → Web framework (routes, middleware, server)
npm install mongoose       → MongoDB se baat karna (schema, model, queries)
npm install dotenv         → .env file se secrets load karna
npm install jsonwebtoken   → JWT token banana aur verify karna
npm install cookie-parser  → Request mein cookies padhna (req.cookies)
```

---

## 🔄 Quick Revision Flow — 2 Minute Mein Yaad Karo

```
1. .env mein secrets rakho (DB URL, JWT Secret, Port)
2. db.js mein mongoose.connect() se MongoDB connect karo
3. user.model.js mein Schema banao (username, email, password)
4. auth.controllers.js mein Logic likho:
   Input → Validate → Duplicate Check → Save → JWT Sign → Cookie Set → Response
5. auth.routes.js mein URL map karo: router.post("/register", controller)
6. app.js mein sab jodo:
   express.json() → cookieParser() → routes → 404 handler
7. server.js mein .env load → DB connect → app.listen()
8. Test: POST /api/auth/register (Postman mein POST method!)
```

---

## 🏃 Commands Yaad Rakho

```bash
node server.js                        # Server start karo
npx nodemon server.js                 # Auto-restart on changes (better!)
lsof -ti:3000 | xargs kill -9        # Port 3000 pe sab process maaro
npm install <package>                  # Naya package install karo
```

---

*Day 05 Complete ✅ — Ab tum JWT Authentication bana sakte ho! 🚀*
