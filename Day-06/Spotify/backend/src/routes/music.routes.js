import express from "express";
import multer from "multer";
import {
    uploadMusic,
    getMusic,
    getMyMusic,
    getMusicById,
    incrementPlayCount,
    deleteMusic,
} from "../controllers/music.controllers.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ─── Public ───────────────────────────────────────────────────────────────────
router.get("/", getMusic);                          // all tracks
router.get("/my", verifyToken, getMyMusic);         // artist's own songs   ← before /:id
router.get("/:id", getMusicById);                   // single track by ID
router.post("/:id/play", incrementPlayCount);       // increment play count

// ─── Protected (artist | admin) ───────────────────────────────────────────────
router.post("/upload", verifyToken, requireRole("artist", "admin"), upload.any(), uploadMusic);
router.delete("/:id", verifyToken, requireRole("artist", "admin"), deleteMusic);

export default router;