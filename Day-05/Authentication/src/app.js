const express = require("express");
const authRoutes = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");


const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
    res.json({ message: "Authentication Server is running!" });
});

// Debug logger - logs every request to terminal
app.use((req, res, next) => {
    console.log(`→ ${req.method} ${req.originalUrl}`);
    next();
});

// Auth routes
app.use("/api/auth", authRoutes);

// Post routes
const postRoutes = require("./routes/post.routes");
app.use("/api/post", postRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

module.exports = app;
