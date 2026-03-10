import Album from "../models/album.model.js";
import Music from "../models/music.model.js";

const POPULATE_ARTIST = { path: "artist", select: "username email role" };
const POPULATE_SONGS = { path: "songs", select: "title uri playCount artist" };

// ─── POST /api/albums ─────────────────────────────────────────────────────────
// Protected: artist | admin — create an album
export const createAlbum = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title?.trim()) {
            return res.status(400).json({ message: "Album title is required" });
        }

        const album = await Album.create({
            title: title.trim(),
            artist: req.user._id,
        });

        const populated = await album.populate([POPULATE_ARTIST, POPULATE_SONGS]);
        res.status(201).json({ message: "Album created successfully", album: populated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── GET /api/albums ──────────────────────────────────────────────────────────
// Public — all albums
export const getAllAlbums = async (req, res) => {
    try {
        const albums = await Album.find()
            .populate(POPULATE_ARTIST)
            .populate(POPULATE_SONGS)
            .sort({ createdAt: -1 });
        res.status(200).json({ albums });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── GET /api/albums/my ───────────────────────────────────────────────────────
// Protected: artist — only the logged-in artist's albums
export const getMyAlbums = async (req, res) => {
    try {
        const albums = await Album.find({ artist: req.user._id })
            .populate(POPULATE_ARTIST)
            .populate(POPULATE_SONGS)
            .sort({ createdAt: -1 });
        res.status(200).json({ albums });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── GET /api/albums/popular ──────────────────────────────────────────────────
// Public — albums sorted by total playCount of their songs (descending)
export const getPopularAlbums = async (req, res) => {
    try {
        const albums = await Album.find()
            .populate(POPULATE_ARTIST)
            .populate(POPULATE_SONGS);

        // Compute total plays per album and sort
        const ranked = albums
            .map((album) => {
                const totalPlays = album.songs.reduce(
                    (sum, s) => sum + (s.playCount || 0), 0
                );
                return { ...album.toObject(), totalPlays };
            })
            .sort((a, b) => b.totalPlays - a.totalPlays)
            .slice(0, 10); // top 10

        res.status(200).json({ albums: ranked });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── GET /api/albums/search?name= ────────────────────────────────────────────
// Public — case-insensitive album name search
export const searchAlbums = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name?.trim()) {
            return res.status(400).json({ message: "Query param 'name' is required" });
        }

        const albums = await Album.find({
            title: { $regex: name.trim(), $options: "i" },
        })
            .populate(POPULATE_ARTIST)
            .populate(POPULATE_SONGS);

        if (!albums.length) {
            return res.status(404).json({ message: `No albums found matching "${name}"` });
        }

        res.status(200).json({ count: albums.length, albums });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── POST /api/albums/:id/songs ───────────────────────────────────────────────
// Protected: artist — add one of the artist's own songs to their album
export const addSongToAlbum = async (req, res) => {
    try {
        const { songId } = req.body;
        if (!songId) return res.status(400).json({ message: "songId is required" });

        // 1. Verify the album belongs to this artist
        const album = await Album.findById(req.params.id);
        if (!album) return res.status(404).json({ message: "Album not found" });

        if (album.artist.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: Not your album" });
        }

        // 2. Verify the song exists and belongs to this artist
        const song = await Music.findById(songId);
        if (!song) return res.status(404).json({ message: "Song not found" });

        if (song.artist.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You can only add your own songs" });
        }

        // 3. Prevent duplicates
        if (album.songs.some((id) => id.toString() === songId)) {
            return res.status(400).json({ message: "Song is already in this album" });
        }

        album.songs.push(songId);
        await album.save();

        const populated = await album.populate([POPULATE_ARTIST, POPULATE_SONGS]);
        res.status(200).json({ message: "Song added to album", album: populated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── DELETE /api/albums/:id/songs/:songId ────────────────────────────────────
// Protected: artist — remove a song from their own album
export const removeSongFromAlbum = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) return res.status(404).json({ message: "Album not found" });

        if (album.artist.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: Not your album" });
        }

        const { songId } = req.params;
        const before = album.songs.length;
        album.songs = album.songs.filter((id) => id.toString() !== songId);

        if (album.songs.length === before) {
            return res.status(404).json({ message: "Song not found in this album" });
        }

        await album.save();
        const populated = await album.populate([POPULATE_ARTIST, POPULATE_SONGS]);
        res.status(200).json({ message: "Song removed from album", album: populated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
