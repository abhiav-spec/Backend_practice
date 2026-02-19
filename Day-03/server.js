const app = require('./src/app');
const connectDB = require('./src/db/db');

async function startServer() {
    try {
        await connectDB();
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();