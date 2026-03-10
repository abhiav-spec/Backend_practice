import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true, // still send cookies for same-origin fallback
});

// Attach JWT from localStorage as Authorization: Bearer header on every request.
// This fixes cross-origin cookie issues (e.g. different ports on localhost).
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("sw_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
