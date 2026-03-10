import { createContext, useContext, useRef, useState, useEffect } from "react";
import api from "../api/axios";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const audioRef = useRef(new Audio());
    const [tracks, setTracks] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const track = currentIdx >= 0 ? tracks[currentIdx] : null;

    useEffect(() => {
        const a = audioRef.current;

        const onTimeUpdate = () => {
            setCurrentTime(a.currentTime);
            setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
        };
        const onLoadedMeta = () => setDuration(a.duration);
        const onEnded = () => next();

        a.addEventListener("timeupdate", onTimeUpdate);
        a.addEventListener("loadedmetadata", onLoadedMeta);
        a.addEventListener("ended", onEnded);
        return () => {
            a.removeEventListener("timeupdate", onTimeUpdate);
            a.removeEventListener("loadedmetadata", onLoadedMeta);
            a.removeEventListener("ended", onEnded);
        };
    }, [currentIdx, tracks]); // eslint-disable-line

    const play = (trackList, idx) => {
        setTracks(trackList);
        setCurrentIdx(idx);
        const selectedTrack = trackList[idx];
        audioRef.current.src = selectedTrack.uri;
        audioRef.current.play();
        setIsPlaying(true);

        // Increment play count in backend
        if (selectedTrack && selectedTrack._id) {
            api.post(`/music/${selectedTrack._id}/play`).catch(() => { });
        }
    };

    const togglePlay = () => {
        if (!track) return;
        if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
        else { audioRef.current.play(); setIsPlaying(true); }
    };

    const next = () => {
        if (!tracks.length) return;
        const idx = (currentIdx + 1) % tracks.length;
        play(tracks, idx);
    };

    const prev = () => {
        if (!tracks.length) return;
        const idx = (currentIdx - 1 + tracks.length) % tracks.length;
        play(tracks, idx);
    };

    const seek = (pct) => {
        if (!audioRef.current.duration) return;
        audioRef.current.currentTime = (pct / 100) * audioRef.current.duration;
    };

    const fmt = (s) => {
        if (!s || isNaN(s)) return "0:00";
        return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
    };

    return (
        <PlayerContext.Provider
            value={{
                track, tracks, currentIdx, isPlaying, progress, duration, currentTime,
                play, togglePlay, next, prev, seek, fmt
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => useContext(PlayerContext);
