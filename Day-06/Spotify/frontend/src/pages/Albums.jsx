import { useState } from "react";
import api from "../api/axios";
import AlbumModal from "../components/AlbumModal";
import styles from "./Albums.module.css";

export default function Albums() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    const search = async () => {
        if (!query.trim()) return;
        setSearching(true); setSearched(true); setResults([]);
        try {
            const r = await api.get(`/albums/search?name=${encodeURIComponent(query)}`);
            setResults(r.data.albums || []);
        } catch {
            setResults([]);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div>
            <h2 className={styles.heading}><span className={styles.bar} /> Find Albums</h2>
            <div className={styles.searchBar}>
                <input
                    className={styles.input}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && search()}
                    placeholder="Search albums by name…"
                />
                <button className={styles.searchBtn} onClick={search}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    Search
                </button>
            </div>

            {searching && <div className={styles.spinner} />}

            {!searching && searched && results.length === 0 && (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>🔍</div>
                    <p>No albums found for "<strong>{query}</strong>"</p>
                </div>
            )}

            <div className={styles.list}>
                {results.map((a) => (
                    <div key={a._id} className={styles.card} onClick={() => setSelectedAlbum(a)}>
                        <div className={styles.art}>💿</div>
                        <div className={styles.info}>
                            <div className={styles.name}>{a.title}</div>
                            <div className={styles.meta}>by {a.artist?.username || "Unknown"} · {a.songs?.length || 0} tracks</div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedAlbum && (
                <AlbumModal
                    album={selectedAlbum}
                    onClose={() => setSelectedAlbum(null)}
                />
            )}
        </div>
    );
}
