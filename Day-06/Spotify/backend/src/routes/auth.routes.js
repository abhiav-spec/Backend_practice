import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);

export default router;