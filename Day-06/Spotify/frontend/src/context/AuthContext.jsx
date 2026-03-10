import { createContext, useContext, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("sw_user")) || null;
        } catch {
            return null;
        }
    });

    // Saves user + token to localStorage so the app stays logged in after a refresh
    const saveUser = (u, token = null) => {
        setUser(u);
        if (u) {
            localStorage.setItem("sw_user", JSON.stringify(u));
        } else {
            localStorage.removeItem("sw_user");
        }

        if (token) {
            localStorage.setItem("sw_token", token); // used by axios interceptor
        } else if (!u) {
            localStorage.removeItem("sw_token");      // clear on logout
        }
    };

    const register = async (data) => {
        const res = await api.post("/auth/register", data);
        saveUser(res.data.user, res.data.token);
        toast.success(`Welcome, ${res.data.user.username}! 🎶`);
        return res.data;
    };

    const login = async (data) => {
        const res = await api.post("/auth/login", data);
        saveUser(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.username}! 🎵`);
        return res.data;
    };

    const logout = async () => {
        await api.post("/auth/logout").catch(() => { }); // best-effort
        saveUser(null, null);
        toast("Logged out. See you soon!");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
