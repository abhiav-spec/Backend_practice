import { useRef, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import styles from "./Upload.module.css";

export default function Upload() {
    const { user } = useAuth();
    const canUpload = user && (user.role === "artist" || user.role === "admin");

    const [musicTitle, setMusicTitle] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [drag, setDrag] = useState(false);
    const fileRef = useRef();

    const [albumTitle, setAlbumTitle] = useState("");
    const [creatingAlbum, setCreatingAlbum] = useState(false);

    // My content states
    const [myTracks, setMyTracks] = useState([]);
    const [myAlbums, setMyAlbums] = useState([]);
    const [loadingContent, setLoadingContent] = useState(true);

    const fetchMyContent = async () => {
        if (!canUpload) return;
        try {
            const [trackRes, albumRes] = await Promise.all([
                api.get("/music/my"),
                api.get("/albums/my")
            ]);
            setMyTracks(trackRes.data.music || []);
            setMyAlbums(albumRes.data.albums || []);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoadingContent(false);
        }
    };

    useEffect(() => {
        fetchMyContent();
    }, [canUpload]);

    const handleFileDrop = (e) => {
        e.preventDefault(); setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f) setFile(f);
    };

    const uploadMusic = async (e) => {
        e.preventDefault();
        if (!musicTitle.trim() || !file) { toast.error("Title and audio file are required"); return; }
        setUploading(true);
        const fd = new FormData();
        fd.append("title", musicTitle);
        fd.append("file", file);
        try {
            await api.post("/music/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Track uploaded! 🎶");
            setMusicTitle(""); setFile(null);
            fetchMyContent();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Upload failed");
        } finally { setUploading(false); }
    };

    const createAlbum = async (e) => {
        e.preventDefault();
        if (!albumTitle.trim()) { toast.error("Album title is required"); return; }
        setCreatingAlbum(true);
        try {
            await api.post("/albums", { title: albumTitle });
            toast.success(`Album "${albumTitle}" created! 💿`);
            setAlbumTitle("");
            fetchMyContent();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create album");
        } finally { setCreatingAlbum(false); }
    };

    const deleteTrack = async (id) => {
        if (!window.confirm("Delete this track?")) return;
        try {
            await api.delete(`/music/${id}`);
            toast.success("Track deleted");
            fetchMyContent();
        } catch (err) {
            toast.error("Failed to delete track");
        }
    };

    const addSongToAlbum = async (albumId, songId) => {
        try {
            await api.post(`/albums/${albumId}/songs`, { songId });
            toast.success("Song added to album");
            fetchMyContent();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to add song");
        }
    };

    const removeSongFromAlbum = async (albumId, songId) => {
        try {
            await api.delete(`/albums/${albumId}/songs/${songId}`);
            toast.success("Song removed from album");
            fetchMyContent();
        } catch (err) {
            toast.error("Failed to remove song");
        }
    };

    if (!canUpload) return (
        <div className={styles.locked}>
            <div className={styles.lockIcon}>🔒</div>
            <h3>Artist Access Required</h3>
            <p>Log in as an <strong>artist</strong> or <strong>admin</strong> to manage your music.</p>
        </div>
    );

    return (
        <div className={styles.wrap}>
            <div className={styles.gridContainer}>
                {/* Left Column: Forms */}
                <div className={styles.column}>
                    <h2 className={styles.heading}><span className={styles.bar} /> Upload New Track</h2>
                    <div className={styles.panel}>
                        <form onSubmit={uploadMusic} className={styles.form}>
                            <div className={styles.group}>
                                <label>Track Title</label>
                                <input className={styles.input} value={musicTitle} onChange={(e) => setMusicTitle(e.target.value)} placeholder="Enter track title…" />
                            </div>
                            <div className={styles.group}>
                                <div
                                    className={`${styles.dropZone} ${drag ? styles.dragging : ""} ${file ? styles.hasFile : ""}`}
                                    onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                                    onDragLeave={() => setDrag(false)}
                                    onDrop={handleFileDrop}
                                    onClick={() => fileRef.current.click()}
                                >
                                    <input ref={fileRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
                                    <div className={styles.dropIcon}>{file ? "✅" : "🎵"}</div>
                                    {file ? <strong>{file.name}</strong> : <p>Drop audio file or click</p>}
                                </div>
                            </div>
                            <button className={styles.uploadBtn} type="submit" disabled={uploading}>
                                {uploading ? "Uploading…" : "Upload Track"}
                            </button>
                        </form>
                    </div>

                    <h2 className={styles.heading} style={{ marginTop: "32px" }}><span className={styles.bar} /> Create New Album</h2>
                    <div className={styles.panel}>
                        <form onSubmit={createAlbum} className={styles.form}>
                            <div className={styles.group}>
                                <label>Album Title</label>
                                <input className={styles.input} value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} placeholder="Enter album name…" />
                            </div>
                            <button className={styles.albumBtn} type="submit" disabled={creatingAlbum}>
                                {creatingAlbum ? "Creating…" : "💿 Create Album"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Management */}
                <div className={styles.column}>
                    <h2 className={styles.heading}><span className={styles.bar} /> My Content</h2>

                    {/* My Tracks List */}
                    <div className={styles.mgmtTitle}>My Tracks ({myTracks.length})</div>
                    <div className={styles.mgmtList}>
                        {myTracks.map(t => (
                            <div key={t._id} className={styles.mgmtItem}>
                                <div className={styles.itemInfo}>
                                    <div className={styles.itemTitle}>{t.title}</div>
                                    <div className={styles.itemMeta}>{t.playCount || 0} plays</div>
                                </div>
                                <button className={styles.delBtn} onClick={() => deleteTrack(t._id)}>🗑️</button>
                            </div>
                        ))}
                    </div>

                    {/* My Albums List */}
                    <div className={styles.mgmtTitle} style={{ marginTop: "24px" }}>My Albums ({myAlbums.length})</div>
                    <div className={styles.mgmtList}>
                        {myAlbums.map(album => (
                            <div key={album._id} className={styles.albumMgmtCard}>
                                <div className={styles.albumHeader}>
                                    <strong>{album.title}</strong>
                                    <span className={styles.songCount}>{album.songs?.length || 0} tracks</span>
                                </div>

                                {/* Songs in album */}
                                <div className={styles.albumSongs}>
                                    {album.songs?.map(s => (
                                        <div key={s._id} className={styles.albumSongItem}>
                                            <span>{s.title}</span>
                                            <button onClick={() => removeSongFromAlbum(album._id, s._id)}>✕</button>
                                        </div>
                                    ))}
                                </div>

                                {/* Add song dropdown */}
                                <div className={styles.addSongRow}>
                                    <select
                                        defaultValue=""
                                        onChange={(e) => {
                                            if (e.target.value) addSongToAlbum(album._id, e.target.value);
                                            e.target.value = "";
                                        }}
                                        className={styles.smallSelect}
                                    >
                                        <option value="" disabled>+ Add Track to Album</option>
                                        {myTracks.filter(t => !album.songs?.some(s => s._id === t._id)).map(t => (
                                            <option key={t._id} value={t._id}>{t.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
