import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import musicRoutes from "./routes/music.routes.js";
import albumRoutes from "./routes/album.routes.js";


const app = express();

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (file://, curl, Postman) and whitelisted origins
        const allowed = [
            "http://localhost:5173",
            "http://localhost:3001",
            "http://localhost:5500",
            "http://127.0.0.1:5500",
            "http://127.0.0.1:5173",
        ];
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // allow all in dev — restrict in production
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check (debug endpoint)
app.get("/health", (req, res) => {
    res.status(200).json({ ok: true });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/albums", albumRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Spotify API" });
});

export default app;