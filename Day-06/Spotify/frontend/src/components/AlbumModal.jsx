import styles from "./AlbumModal.module.css";
import { usePlayer } from "../context/PlayerContext";

export default function AlbumModal({ album, onClose }) {
    const { play, track, isPlaying } = usePlayer();

    if (!album) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>✕</button>

                <div className={styles.header}>
                    <div className={styles.art}>💿</div>
                    <div className={styles.info}>
                        <h2 className={styles.title}>{album.title}</h2>
                        <p className={styles.artist}>Album by {album.artist?.username || "Unknown"}</p>
                        <p className={styles.stats}>{album.songs?.length || 0} tracks · {album.totalPlays || 0} total plays</p>
                    </div>
                </div>

                <div className={styles.songList}>
                    {!album.songs || album.songs.length === 0 ? (
                        <div className={styles.empty}>This album has no songs yet.</div>
                    ) : (
                        album.songs.map((s, i) => {
                            const isCurrent = track?._id === s._id && isPlaying;
                            return (
                                <div
                                    key={s._id}
                                    className={`${styles.songItem} ${isCurrent ? styles.active : ""}`}
                                    onClick={() => play(album.songs, i)}
                                >
                                    <div className={styles.number}>{i + 1}</div>
                                    <div className={styles.songTitle}>{s.title}</div>
                                    <div className={styles.playIcon}>
                                        {isCurrent ? "⏸️" : "▶️"}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
