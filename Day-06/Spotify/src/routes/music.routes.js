import express from "express";
import multer from "multer";
import { uploadMusic, getMusic, getMusicById, createAlbum } from "../controllers/music.controllers.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ─── Public routes ────────────────────────────────────────────────────────────
router.get("/", getMusic);
router.get("/:id", getMusicById);

// ─── Protected routes (login required) ───────────────────────────────────────
// Only artists and admins can upload music
router.post("/upload", verifyToken, requireRole("Artist", "admin"), upload.any(), uploadMusic);

// Only artists and admins can create an album
router.post("/album", verifyToken, requireRole("Artist", "admin"), createAlbum);

export default router;