const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.send('ZiiOZ backend is live! 🔥');
});

// API test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from ZiiOZ backend 👋' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
