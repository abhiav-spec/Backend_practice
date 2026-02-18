const express = require('express');
const app = express();

// Serve static frontend files from the public directory
app.use(express.static('public'));

module.exports = app;