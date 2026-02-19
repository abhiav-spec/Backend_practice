const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(
            "mongodb+srv://yt-backend:s4zwZPzsVH8OQOAh@cluster0.44glwqd.mongodb.net/try"
        );
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
