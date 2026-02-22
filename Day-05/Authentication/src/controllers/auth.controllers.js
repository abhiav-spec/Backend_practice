const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function registeruser(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "username, email, and password are required" });
        }

        // Check if user already exists with same email or username
        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({ error: "User with this email or username already exists" });
        }

        const user = new userModel({ username, email, password });
        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,  // set to true in production (HTTPS)
            sameSite: "strict",
            maxAge: 3600000,
        });

        res.status(201).json({ message: "User registered successfully", token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}


module.exports = { registeruser };


