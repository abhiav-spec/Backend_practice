import { useEffect, useState } from "react";
import api from "../api/axios";
import { usePlayer } from "../context/PlayerContext";
import AlbumModal from "../components/AlbumModal";
import styles from "./Browse.module.css";

const EMOJIS = ["🎵", "🎶", "🎸", "🎹", "🥁", "🎺", "🎻", "🎷", "🎤", "🎧"];

export default function Browse() {
    const [tracks, setTracks] = useState([]);
    const [popularAlbums, setPopularAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const { play, currentIdx, isPlaying } = usePlayer();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trackRes, albumRes] = await Promise.all([
                    api.get("/music"),
                    api.get("/albums/popular")
                ]);
                setTracks(trackRes.data.music || []);
                setPopularAlbums(albumRes.data.albums || []);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className={styles.spinner} />;

    return (
        <div className={styles.browseContainer}>
            {/* Popular Albums */}
            {popularAlbums.length > 0 && (
                <section className={styles.section} style={{ marginBottom: "40px" }}>
                    <h2 className={styles.heading}><span className={styles.bar} /> Popular Albums</h2>
                    <div className={styles.albumGrid}>
                        {popularAlbums.map((album) => (
                            <div key={album._id} className={styles.albumCard} onClick={() => setSelectedAlbum(album)}>
                                <div className={styles.albumArt}>💿</div>
                                <div className={styles.albumInfo}>
                                    <div className={styles.albumTitle}>{album.title}</div>
                                    <div className={styles.albumMeta}>
                                        {album.artist?.username} · {album.totalPlays || 0} plays
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* All Tracks */}
            <section className={styles.section}>
                <h2 className={styles.heading}><span className={styles.bar} /> All Tracks</h2>
                {!tracks.length ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>🎵</div>
                        <p>No tracks yet — be the first to upload!</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {tracks.map((t, i) => {
                            const active = currentIdx === i && isPlaying;
                            return (
                                <div
                                    key={t._id}
                                    className={`${styles.card} ${active ? styles.active : ""}`}
                                    onClick={() => play(tracks, i)}
                                >
                                    <div className={styles.art}>
                                        <span>{EMOJIS[i % EMOJIS.length]}</span>
                                        <div className={styles.playOverlay}>
                                            <div className={styles.playCircle}>
                                                {active ? (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#a855f7">
                                                        <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                                                    </svg>
                                                ) : (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#a855f7">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.cardTitle}>{t.title}</div>
                                    <div className={styles.cardArtist}>🎤 {t.artist?.username || "Unknown"}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {selectedAlbum && (
                <AlbumModal
                    album={selectedAlbum}
                    onClose={() => setSelectedAlbum(null)}
                />
            )}
        </div>
    );
}
