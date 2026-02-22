const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/create", (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // Token is valid — you can use decodedToken.id for the user
        res.json({ message: "Post created successfully", userId: decodedToken.id });
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
});

module.exports = router;
