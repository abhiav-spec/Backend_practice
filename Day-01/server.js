const express = require('express');
const app = express();   // ← You forgot this line

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/About', (req, res) => {
  res.send('Hello About!');
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
