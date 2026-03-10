import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";
import Navbar from "./components/Navbar";
import PlayerBar from "./components/PlayerBar";
import Browse from "./pages/Browse";
import Albums from "./pages/Albums";
import Upload from "./pages/Upload";
import "./App.css";

const TABS = [
    { id: "browse", label: "🎵 Browse" },
    { id: "albums", label: "💿 Albums" },
    { id: "upload", label: "🛠️ Manage" },
];

function App() {
    const [tab, setTab] = useState("browse");

    return (
        <AuthProvider>
            <PlayerProvider>
                <div className="app-shell">
                    {/* Glow orbs */}
                    <div className="glow glow1" />
                    <div className="glow glow2" />
                    <div className="glow glow3" />

                    <Navbar />

                    <main className="main-content">
                        {/* Tabs */}
                        <div className="tabs">
                            {TABS.map((t) => (
                                <button
                                    key={t.id}
                                    className={`tab-btn ${tab === t.id ? "active" : ""}`}
                                    onClick={() => setTab(t.id)}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Pages */}
                        <div className="page">
                            {tab === "browse" && <Browse />}
                            {tab === "albums" && <Albums />}
                            {tab === "upload" && <Upload />}
                        </div>
                    </main>

                    <PlayerBar />

                    <Toaster
                        position="top-right"
                        toastOptions={{
                            style: {
                                background: "rgba(20,15,40,0.95)",
                                color: "#f1f5f9",
                                border: "1px solid rgba(255,255,255,0.12)",
                                backdropFilter: "blur(20px)",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "0.875rem",
                            },
                        }}
                    />
                </div>
            </PlayerProvider>
        </AuthProvider>
    );
}

export default App;
