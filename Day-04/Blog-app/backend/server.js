const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}).catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
});
