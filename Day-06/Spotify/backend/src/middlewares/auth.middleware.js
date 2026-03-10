import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

/**
 * verifyToken
 * Reads the JWT from req.cookies.token, verifies it,
 * fetches the full user doc and attaches it to req.user.
 * Call this on any route that needs the user to be logged in.
 */
const verifyToken = async (req, res, next) => {
    try {
        // 1. Check Authorization: Bearer <token> header first (works cross-origin always)
        // 2. Fall back to httpOnly cookie (works same-origin or when cookies are sent)
        let token = null;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else {
            token = req.cookies?.token;
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user; // attach to request for downstream handlers
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Token has expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        return res.status(500).json({ message: error.message });
    }
};

/**
 * requireRole(...roles)
 * Factory that returns a middleware allowing only users whose role
 * is in the provided list. Must be used AFTER verifyToken.
 *
 * Example:
 *   router.post("/upload", verifyToken, requireRole("artist", "admin"), uploadMusic);
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: Requires one of these roles: ${roles.join(", ")}`,
            });
        }
        next();
    };
};

export { verifyToken, requireRole };
