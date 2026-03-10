import { usePlayer } from "../context/PlayerContext";
import styles from "./PlayerBar.module.css";

const EMOJIS = ["🎵", "🎶", "🎸", "🎹", "🥁", "🎺", "🎻", "🎷", "🎤", "🎧"];

export default function PlayerBar() {
    const { track, tracks, currentIdx, isPlaying, progress, currentTime, duration,
        togglePlay, next, prev, seek, fmt } = usePlayer();

    if (!track) return null;

    const emoji = EMOJIS[currentIdx % EMOJIS.length];

    return (
        <div className={styles.bar}>
            {/* Track Info */}
            <div className={styles.info}>
                <div className={styles.art}>{emoji}</div>
                <div className={styles.meta}>
                    <div className={styles.title}>{track.title}</div>
                    <div className={styles.artist}>{track.artist?.username || "Unknown"}</div>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <button className={styles.ctrl} onClick={prev} title="Previous">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 6h2v12H6zm3.5 6L18 6v12z" />
                    </svg>
                </button>
                <button className={styles.playBtn} onClick={togglePlay}>
                    {isPlaying ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>
                <button className={styles.ctrl} onClick={next} title="Next">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18L14.5 12 6 6v12zm2.5-6l8.5 6V6z" />
                        <rect x="16" y="6" width="2" height="12" />
                    </svg>
                </button>
            </div>

            {/* Progress */}
            <div className={styles.progress}>
                <span className={styles.time}>{fmt(currentTime)}</span>
                <div className={styles.bar2}
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        seek(((e.clientX - rect.left) / rect.width) * 100);
                    }}>
                    <div className={styles.fill} style={{ width: `${progress}%` }} />
                </div>
                <span className={styles.time}>{fmt(duration)}</span>
            </div>
        </div>
    );
}
