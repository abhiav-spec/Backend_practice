import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./AuthModal.module.css";

export default function AuthModal({ mode: initMode, onClose }) {
    const { login, register } = useAuth();
    const [mode, setMode] = useState(initMode || "login");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        username: "", email: "", password: "", role: "user",
    });

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === "login") {
                const isEmail = form.email.includes("@");
                await login(
                    isEmail
                        ? { email: form.email, password: form.password }
                        : { username: form.email, password: form.password }
                );
            } else {
                await register(form);
            }
            onClose();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.logo}>🎵</div>
                    <h2>{mode === "login" ? "Welcome back" : "Join SoundWave"}</h2>
                    <p>{mode === "login" ? "Sign in to your account" : "Create your free account"}</p>
                </div>

                <form onSubmit={submit} className={styles.form}>
                    {mode === "register" && (
                        <>
                            <div className={styles.row}>
                                <div className={styles.group}>
                                    <label>Username</label>
                                    <input className={styles.input} value={form.username} onChange={set("username")}
                                        placeholder="coolartist" required />
                                </div>
                                <div className={styles.group}>
                                    <label>Role</label>
                                    <select className={styles.input} value={form.role} onChange={set("role")}>
                                        <option value="user">Listener</option>
                                        <option value="artist">Artist</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <div className={styles.group}>
                        <label>{mode === "login" ? "Email or Username" : "Email"}</label>
                        <input className={styles.input} value={form.email} onChange={set("email")}
                            placeholder="your@email.com" required />
                    </div>

                    <div className={styles.group}>
                        <label>Password</label>
                        <input className={styles.input} type="password" value={form.password} onChange={set("password")}
                            placeholder="••••••••" required />
                    </div>

                    <button className={styles.submitBtn} type="submit" disabled={loading}>
                        {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
                    </button>
                </form>

                <p className={styles.switch}>
                    {mode === "login" ? "Don't have an account?" : "Already registered?"}{" "}
                    <span onClick={() => setMode(mode === "login" ? "register" : "login")}>
                        {mode === "login" ? "Create one" : "Sign in"}
                    </span>
                </p>

                <button className={styles.closeBtn} onClick={onClose}>✕ Close</button>
            </div>
        </div>
    );
}
