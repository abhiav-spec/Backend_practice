import Music from "../models/music.model.js";
import { uploadFile } from "../services/storage.services.js";

// ─── POST /api/music/upload ───────────────────────────────────────────────────
// Protected: artist | admin
export const uploadMusic = async (req, res) => {
    try {
        const { title } = req.body;

        let file = req.file;
        if (!file && Array.isArray(req.files) && req.files.length > 0) {
            file = req.files[0];
        }

        if (!title || !file) {
            return res.status(400).json({ message: "Title and audio file are required" });
        }

        const result = await uploadFile(file);

        const music = await Music.create({
            title,
            artist: req.user._id,
            uri: result.url,
        });

        res.status(201).json({ message: "Music uploaded successfully", music });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── GET /api/music ───────────────────────────────────────────────────────────
// Public — all tracks
export const getMusic = async (req, res) => {
    try {
        const music = await Music.find()
            .populate("artist", "username email role")
            .sort({ createdAt: -1 });
        res.status(200).json({ music });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── GET /api/music/my ────────────────────────────────────────────────────────
// Protected: artist — returns only songs uploaded by the logged-in artist
export const getMyMusic = async (req, res) => {
    try {
        const music = await Music.find({ artist: req.user._id })
            .sort({ createdAt: -1 });
        res.status(200).json({ music });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── GET /api/music/:id ───────────────────────────────────────────────────────
// Public
export const getMusicById = async (req, res) => {
    try {
        const music = await Music.findById(req.params.id).populate("artist", "username email role");
        if (!music) return res.status(404).json({ message: "Music not found" });
        res.status(200).json({ music });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── POST /api/music/:id/play ─────────────────────────────────────────────────
// Public — increments play count by 1 (called from frontend when a track starts)
export const incrementPlayCount = async (req, res) => {
    try {
        const music = await Music.findByIdAndUpdate(
            req.params.id,
            { $inc: { playCount: 1 } },
            { new: true }
        );
        if (!music) return res.status(404).json({ message: "Music not found" });
        res.status(200).json({ playCount: music.playCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── DELETE /api/music/:id ────────────────────────────────────────────────────
// Protected: artist — only the owner can delete their song
export const deleteMusic = async (req, res) => {
    try {
        const music = await Music.findById(req.params.id);
        if (!music) return res.status(404).json({ message: "Music not found" });

        // Only the owner artist (or admin) can delete
        if (
            music.artist.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Forbidden: Not your song" });
        }

        await music.deleteOne();
        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
