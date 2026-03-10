import express from "express";
import {
    createAlbum,
    getAllAlbums,
    getMyAlbums,
    getPopularAlbums,
    searchAlbums,
    addSongToAlbum,
    removeSongFromAlbum,
} from "../controllers/album.controllers.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.get("/", getAllAlbums);                      // all albums
router.get("/popular", getPopularAlbums);           // top albums by play count  ← before /:id
router.get("/search", searchAlbums);                // search by name            ← before /:id
router.get("/my", verifyToken, getMyAlbums);        // logged-in artist's albums ← before /:id

// ─── Protected (artist | admin) ───────────────────────────────────────────────
router.post("/", verifyToken, requireRole("artist", "admin"), createAlbum);
router.post("/:id/songs", verifyToken, requireRole("artist", "admin"), addSongToAlbum);
router.delete("/:id/songs/:songId", verifyToken, requireRole("artist", "admin"), removeSongFromAlbum);

export default router;
