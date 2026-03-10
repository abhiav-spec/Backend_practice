import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [modal, setModal] = useState(null); // "login" | "register" | null

    return (
        <>
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="11" stroke="url(#ng)" strokeWidth="2" />
                        <path d="M8 8.5C10.5 7 15 7.5 16 11C17 14.5 14 16.5 10 15.5" stroke="url(#ng)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M8 12C10 11 13 11.5 14 13.5" stroke="url(#ng)" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="9" cy="15.5" r="1.5" fill="url(#ng)" />
                        <defs>
                            <linearGradient id="ng" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#a855f7" /><stop offset="1" stopColor="#ec4899" />
                            </linearGradient>
                        </defs>
                    </svg>
                    SoundWave
                </div>

                <div className={styles.actions}>
                    {user ? (
                        <>
                            <div className={styles.chip}>
                                <div className={styles.avatar}>{user.username[0].toUpperCase()}</div>
                                <span>{user.username}</span>
                                <span className={styles.role}>{user.role}</span>
                            </div>
                            <button className={styles.dangerBtn} onClick={logout}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <button className={styles.ghostBtn} onClick={() => setModal("login")}>Sign In</button>
                            <button className={styles.primaryBtn} onClick={() => setModal("register")}>Get Started</button>
                        </>
                    )}
                </div>
            </nav>

            {modal && <AuthModal mode={modal} onClose={() => setModal(null)} />}
        </>
    );
}
